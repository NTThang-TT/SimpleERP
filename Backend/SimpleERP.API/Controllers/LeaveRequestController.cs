using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleERP.Core.Entities;
using SimpleERP.Infrastructure.Data;
using SimpleERP.Shared.DTOs;

namespace SimpleERP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LeaveRequestController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<LeaveRequestController> _logger;

    public LeaveRequestController(AppDbContext context, ILogger<LeaveRequestController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Lấy danh sách đơn nghỉ phép — có Search, Filter, Pagination
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PagedResultDTO<LeaveRequestDTO>>> GetLeaveRequests(
        [FromQuery] string? search = null,
        [FromQuery] string? status = null,
        [FromQuery] string? leaveType = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        _logger.LogInformation("📋 GET /api/leave-request — search={Search}, status={Status}, type={Type}, page={Page}",
            search, status, leaveType, page);

        var query = _context.LeaveRequests
            .Include(lr => lr.Employee!)
                .ThenInclude(e => e.Department)
            .AsQueryable();

        // Filter theo trạng thái
        if (!string.IsNullOrEmpty(status) && status != "all")
            query = query.Where(lr => lr.Status == status);

        // Filter theo loại nghỉ
        if (!string.IsNullOrEmpty(leaveType) && leaveType != "all")
            query = query.Where(lr => lr.LeaveType == leaveType);

        // Search theo tên nhân viên
        if (!string.IsNullOrEmpty(search))
            query = query.Where(lr => lr.Employee!.FullName.Contains(search));

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(lr => lr.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(lr => new LeaveRequestDTO
            {
                LeaveRequestId = lr.LeaveRequestId,
                EmployeeId = lr.EmployeeId,
                EmployeeFullName = lr.Employee!.FullName,
                DepartmentName = lr.Employee.Department!.DepartmentName,
                LeaveType = lr.LeaveType,
                StartDate = lr.StartDate,
                EndDate = lr.EndDate,
                Reason = lr.Reason,
                Status = lr.Status,
                ApprovedBy = lr.ApprovedBy,
                CreatedAt = lr.CreatedAt
            })
            .ToListAsync();

        return Ok(new PagedResultDTO<LeaveRequestDTO>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = page,
            PageSize = pageSize
        });
    }

    /// <summary>
    /// Lấy chi tiết 1 đơn nghỉ phép
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<LeaveRequestDTO>> GetLeaveRequest(int id)
    {
        var lr = await _context.LeaveRequests
            .Include(x => x.Employee!).ThenInclude(e => e.Department)
            .FirstOrDefaultAsync(x => x.LeaveRequestId == id);

        if (lr == null) return NotFound(new { message = "Không tìm thấy đơn nghỉ phép." });

        return Ok(new LeaveRequestDTO
        {
            LeaveRequestId = lr.LeaveRequestId,
            EmployeeId = lr.EmployeeId,
            EmployeeFullName = lr.Employee!.FullName,
            DepartmentName = lr.Employee.Department!.DepartmentName,
            LeaveType = lr.LeaveType,
            StartDate = lr.StartDate,
            EndDate = lr.EndDate,
            Reason = lr.Reason,
            Status = lr.Status,
            ApprovedBy = lr.ApprovedBy,
            CreatedAt = lr.CreatedAt
        });
    }

    /// <summary>
    /// Tạo đơn xin nghỉ phép mới
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<LeaveRequestDTO>> CreateLeaveRequest(LeaveRequestInputDTO dto)
    {
        // Validation: EmployeeId phải tồn tại
        var employee = await _context.Employees.Include(e => e.Department).FirstOrDefaultAsync(e => e.EmployeeId == dto.EmployeeId);
        if (employee == null)
            return BadRequest(new { message = $"Nhân viên '{dto.EmployeeId}' không tồn tại." });

        // Validation: EndDate >= StartDate
        if (dto.EndDate < dto.StartDate)
            return BadRequest(new { message = "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu." });

        // Validation: Reason không rỗng
        if (string.IsNullOrWhiteSpace(dto.Reason))
            return BadRequest(new { message = "Lý do nghỉ phép không được để trống." });

        var leaveRequest = new LeaveRequest
        {
            EmployeeId = dto.EmployeeId,
            LeaveType = dto.LeaveType,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Reason = dto.Reason,
            Status = "Chờ duyệt",
            CreatedAt = DateTime.Now
        };

        _context.LeaveRequests.Add(leaveRequest);
        await _context.SaveChangesAsync();

        _logger.LogInformation("✅ Đã tạo đơn nghỉ phép: ID={Id}, NV={Emp}, Loại={Type}, Từ={Start} Đến={End}",
            leaveRequest.LeaveRequestId, dto.EmployeeId, dto.LeaveType,
            dto.StartDate.ToString("dd/MM/yyyy"), dto.EndDate.ToString("dd/MM/yyyy"));

        return CreatedAtAction(nameof(GetLeaveRequest), new { id = leaveRequest.LeaveRequestId }, new LeaveRequestDTO
        {
            LeaveRequestId = leaveRequest.LeaveRequestId,
            EmployeeId = leaveRequest.EmployeeId,
            EmployeeFullName = employee.FullName,
            DepartmentName = employee.Department?.DepartmentName ?? "",
            LeaveType = leaveRequest.LeaveType,
            StartDate = leaveRequest.StartDate,
            EndDate = leaveRequest.EndDate,
            Reason = leaveRequest.Reason,
            Status = leaveRequest.Status,
            ApprovedBy = leaveRequest.ApprovedBy,
            CreatedAt = leaveRequest.CreatedAt
        });
    }

    /// <summary>
    /// Duyệt hoặc Từ chối đơn nghỉ phép (HR/Admin)
    /// </summary>
    [HttpPut("{id}/approve")]
    [Authorize(Roles = "HR, Admin")]
    public async Task<IActionResult> ApproveLeaveRequest(int id, LeaveApprovalDTO dto)
    {
        var lr = await _context.LeaveRequests.FindAsync(id);
        if (lr == null) return NotFound(new { message = "Không tìm thấy đơn nghỉ phép." });

        // Validation: Chỉ được duyệt/từ chối khi đang "Chờ duyệt"
        if (lr.Status != "Chờ duyệt")
            return BadRequest(new { message = $"Đơn này đã được xử lý với trạng thái '{lr.Status}'. Không thể thay đổi." });

        // Validation: Trạng thái hợp lệ
        if (dto.Status != "Đã duyệt" && dto.Status != "Từ chối")
            return BadRequest(new { message = "Trạng thái chỉ có thể là 'Đã duyệt' hoặc 'Từ chối'." });

        lr.Status = dto.Status;
        lr.ApprovedBy = dto.ApprovedBy;

        await _context.SaveChangesAsync();

        _logger.LogInformation("📝 Đơn nghỉ phép ID={Id} đã được {Status} bởi {By}",
            id, dto.Status, dto.ApprovedBy);

        return NoContent();
    }

    /// <summary>
    /// Xóa đơn nghỉ phép (chỉ khi còn "Chờ duyệt")
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLeaveRequest(int id)
    {
        var lr = await _context.LeaveRequests.FindAsync(id);
        if (lr == null) return NotFound(new { message = "Không tìm thấy đơn nghỉ phép." });

        if (lr.Status != "Chờ duyệt")
            return BadRequest(new { message = "Chỉ có thể xóa đơn đang ở trạng thái 'Chờ duyệt'." });

        _context.LeaveRequests.Remove(lr);
        await _context.SaveChangesAsync();

        _logger.LogWarning("🗑️ Đã xóa đơn nghỉ phép: ID={Id}", id);
        return NoContent();
    }
}
