using System.Security.Claims;
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
public class AttendanceController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<AttendanceController> _logger;

    public AttendanceController(AppDbContext context, ILogger<AttendanceController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Lấy danh sách chấm công — có Search, Filter, Pagination
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PagedResultDTO<AttendanceDTO>>> GetAttendances(
        [FromQuery] string? search = null,
        [FromQuery] string? departmentId = null,
        [FromQuery] string? status = null,
        [FromQuery] string? date = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        _logger.LogInformation("📋 GET /api/attendance — search={Search}, dept={Dept}, status={Status}, date={Date}, page={Page}",
            search, departmentId, status, date, page);

        var query = _context.Attendances
            .Include(a => a.Employee!)
                .ThenInclude(e => e.Department)
            .AsQueryable();

        // Filter theo phòng ban
        if (!string.IsNullOrEmpty(departmentId) && departmentId != "all")
            query = query.Where(a => a.Employee!.DepartmentId == departmentId);

        // Filter theo trạng thái
        if (!string.IsNullOrEmpty(status) && status != "all")
            query = query.Where(a => a.Status == status);

        // Filter theo ngày
        if (!string.IsNullOrEmpty(date) && DateTime.TryParse(date, out var filterDate))
            query = query.Where(a => a.Date.Date == filterDate.Date);

        // Search theo tên nhân viên
        if (!string.IsNullOrEmpty(search))
            query = query.Where(a => a.Employee!.FullName.Contains(search));

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(a => a.Date)
            .ThenBy(a => a.Employee!.FullName)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new AttendanceDTO
            {
                AttendanceId = a.AttendanceId,
                EmployeeId = a.EmployeeId,
                EmployeeFullName = a.Employee!.FullName,
                DepartmentName = a.Employee.Department!.DepartmentName,
                Date = a.Date,
                CheckIn = a.CheckIn,
                CheckOut = a.CheckOut,
                Status = a.Status,
                Note = a.Note
            })
            .ToListAsync();

        return Ok(new PagedResultDTO<AttendanceDTO>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = page,
            PageSize = pageSize
        });
    }

    /// <summary>
    /// Lấy chi tiết 1 bản ghi chấm công
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<AttendanceDTO>> GetAttendance(int id)
    {
        var a = await _context.Attendances
            .Include(x => x.Employee!).ThenInclude(e => e.Department)
            .FirstOrDefaultAsync(x => x.AttendanceId == id);

        if (a == null) return NotFound(new { message = "Không tìm thấy bản ghi chấm công." });

        return Ok(new AttendanceDTO
        {
            AttendanceId = a.AttendanceId,
            EmployeeId = a.EmployeeId,
            EmployeeFullName = a.Employee!.FullName,
            DepartmentName = a.Employee.Department!.DepartmentName,
            Date = a.Date,
            CheckIn = a.CheckIn,
            CheckOut = a.CheckOut,
            Status = a.Status,
            Note = a.Note
        });
    }

    /// <summary>
    /// Lấy trạng thái chấm công hôm nay của nhân viên đang đăng nhập
    /// </summary>
    [HttpGet("my-today")]
    public async Task<ActionResult<AttendanceDTO>> GetMyToday()
    {
        var employeeId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("EmployeeId");
        if (string.IsNullOrEmpty(employeeId)) return Unauthorized();

        var today = DateTime.Today;
        var a = await _context.Attendances
            .Include(x => x.Employee!).ThenInclude(e => e.Department)
            .FirstOrDefaultAsync(x => x.EmployeeId == employeeId && x.Date.Date == today);

        if (a == null) return NotFound(new { message = "Hôm nay chưa chấm công." });

        return Ok(new AttendanceDTO
        {
            AttendanceId = a.AttendanceId,
            EmployeeId = a.EmployeeId,
            EmployeeFullName = a.Employee!.FullName,
            DepartmentName = a.Employee.Department!.DepartmentName,
            Date = a.Date,
            CheckIn = a.CheckIn,
            CheckOut = a.CheckOut,
            Status = a.Status,
            Note = a.Note
        });
    }

    /// <summary>
    /// Nhân viên tự Check-in
    /// </summary>
    [HttpPost("check-in")]
    public async Task<IActionResult> CheckIn()
    {
        var employeeId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("EmployeeId");
        if (string.IsNullOrEmpty(employeeId)) return Unauthorized();

        var today = DateTime.Today;
        var existing = await _context.Attendances
            .FirstOrDefaultAsync(x => x.EmployeeId == employeeId && x.Date.Date == today);

        if (existing != null)
            return BadRequest(new { message = "Bạn đã check-in ngày hôm nay rồi." });

        var now = DateTime.Now;
        // Logic: Nếu sau 8:00 sáng (cộng thêm chút thời gian du di 15 phút) thì tính là đi trễ
        var status = (now.TimeOfDay > new TimeSpan(8, 15, 0)) ? "Đi trễ" : "Đúng giờ";

        var attendance = new Attendance
        {
            EmployeeId = employeeId,
            Date = today,
            CheckIn = now,
            Status = status
        };

        _context.Attendances.Add(attendance);
        await _context.SaveChangesAsync();

        _logger.LogInformation("📍 NV {Emp} đã Check-in lúc {Time}, Trạng thái: {Status}", employeeId, now.ToString("HH:mm:ss"), status);
        return Ok(new { message = "Check-in thành công!", time = now, status });
    }

    /// <summary>
    /// Nhân viên tự Check-out
    /// </summary>
    [HttpPost("check-out")]
    public async Task<IActionResult> CheckOut()
    {
        var employeeId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("EmployeeId");
        if (string.IsNullOrEmpty(employeeId)) return Unauthorized();

        var today = DateTime.Today;
        var attendance = await _context.Attendances
            .FirstOrDefaultAsync(x => x.EmployeeId == employeeId && x.Date.Date == today);

        if (attendance == null)
            return BadRequest(new { message = "Bạn chưa check-in ngày hôm nay." });

        if (attendance.CheckOut.HasValue)
            return BadRequest(new { message = "Bạn đã check-out ngày hôm nay rồi." });

        var now = DateTime.Now;
        attendance.CheckOut = now;
        await _context.SaveChangesAsync();

        _logger.LogInformation("🏃 NV {Emp} đã Check-out lúc {Time}", employeeId, now.ToString("HH:mm:ss"));
        return Ok(new { message = "Check-out thành công!", time = now });
    }

    /// <summary>
    /// Thêm bản ghi chấm công mới (HR/Admin)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "HR, Admin")]
    public async Task<ActionResult<AttendanceDTO>> CreateAttendance(AttendanceInputDTO dto)
    {
        // Validation: EmployeeId phải tồn tại
        var employee = await _context.Employees.Include(e => e.Department).FirstOrDefaultAsync(e => e.EmployeeId == dto.EmployeeId);
        if (employee == null)
            return BadRequest(new { message = $"Nhân viên '{dto.EmployeeId}' không tồn tại." });

        // Validation: Ngày không được trong tương lai
        if (dto.Date.Date > DateTime.Today)
            return BadRequest(new { message = "Ngày chấm công không được trong tương lai." });

        // Validation: CheckOut phải sau CheckIn
        if (dto.CheckIn.HasValue && dto.CheckOut.HasValue && dto.CheckOut <= dto.CheckIn)
            return BadRequest(new { message = "Giờ ra phải sau giờ vào." });

        var attendance = new Attendance
        {
            EmployeeId = dto.EmployeeId,
            Date = dto.Date,
            CheckIn = dto.CheckIn,
            CheckOut = dto.CheckOut,
            Status = dto.Status,
            Note = dto.Note
        };

        _context.Attendances.Add(attendance);
        await _context.SaveChangesAsync();

        _logger.LogInformation("✅ Đã thêm chấm công: ID={Id}, NV={Emp}, Ngày={Date}",
            attendance.AttendanceId, dto.EmployeeId, dto.Date.ToString("dd/MM/yyyy"));

        return CreatedAtAction(nameof(GetAttendance), new { id = attendance.AttendanceId }, new AttendanceDTO
        {
            AttendanceId = attendance.AttendanceId,
            EmployeeId = attendance.EmployeeId,
            EmployeeFullName = employee.FullName,
            DepartmentName = employee.Department?.DepartmentName ?? "",
            Date = attendance.Date,
            CheckIn = attendance.CheckIn,
            CheckOut = attendance.CheckOut,
            Status = attendance.Status,
            Note = attendance.Note
        });
    }

    /// <summary>
    /// Cập nhật bản ghi chấm công (HR/Admin)
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "HR, Admin")]
    public async Task<IActionResult> UpdateAttendance(int id, AttendanceInputDTO dto)
    {
        var attendance = await _context.Attendances.FindAsync(id);
        if (attendance == null) return NotFound(new { message = "Không tìm thấy bản ghi chấm công." });

        // Validation
        if (dto.CheckIn.HasValue && dto.CheckOut.HasValue && dto.CheckOut <= dto.CheckIn)
            return BadRequest(new { message = "Giờ ra phải sau giờ vào." });

        attendance.EmployeeId = dto.EmployeeId;
        attendance.Date = dto.Date;
        attendance.CheckIn = dto.CheckIn;
        attendance.CheckOut = dto.CheckOut;
        attendance.Status = dto.Status;
        attendance.Note = dto.Note;

        await _context.SaveChangesAsync();

        _logger.LogInformation("✏️ Đã cập nhật chấm công: ID={Id}", id);
        return NoContent();
    }

    /// <summary>
    /// Xóa bản ghi chấm công (HR/Admin)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "HR, Admin")]
    public async Task<IActionResult> DeleteAttendance(int id)
    {
        var attendance = await _context.Attendances.FindAsync(id);
        if (attendance == null) return NotFound(new { message = "Không tìm thấy bản ghi chấm công." });

        _context.Attendances.Remove(attendance);
        await _context.SaveChangesAsync();

        _logger.LogWarning("🗑️ Đã xóa chấm công: ID={Id}", id);
        return NoContent();
    }
}
