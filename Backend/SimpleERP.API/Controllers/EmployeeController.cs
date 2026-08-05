using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SimpleERP.Shared.DTOs;
using SimpleERP.Core.Interfaces;
using SimpleERP.Core.Entities;

namespace SimpleERP.API.Controllers;

/// <summary>
/// EmployeeController — API quản lý nhân viên
/// Sử dụng Repository Pattern và JWT Authorization
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EmployeeController : ControllerBase
{
    private readonly IEmployeeRepository _repository;

    public EmployeeController(IEmployeeRepository repository)
    {
        _repository = repository;
    }

    /// <summary>
    /// GET /api/employee — Lấy danh sách nhân viên (có phân trang)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PagedResultDTO<EmployeeDTO>>> GetEmployees(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] string? departmentId = null)
    {
        var result = await _repository.GetPagedEmployeesAsync(page, pageSize, search, departmentId);
        return Ok(result);
    }

    [HttpGet("statistics")]
    public async Task<ActionResult<EmployeeStatisticsDTO>> GetStatistics()
    {
        var stats = await _repository.GetEmployeeStatisticsAsync();
        return Ok(stats);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Employee>> GetEmployee(string id)
    {
        var employee = await _repository.GetEmployeeByIdAsync(id);
        if (employee == null) return NotFound();
        return Ok(employee);
    }

    [HttpPost]
    [Authorize(Roles = "HR, Admin")]
    public async Task<ActionResult<Employee>> CreateEmployee(EmployeeInputDTO dto)
    {
        if (!string.IsNullOrWhiteSpace(dto.PhoneNumber) && await _repository.PhoneExistsAsync(dto.PhoneNumber))
        {
            return Conflict(new { message = $"Số điện thoại '{dto.PhoneNumber}' đã được sử dụng." });
        }

        var employee = await _repository.CreateEmployeeAsync(dto);
        return CreatedAtAction(nameof(GetEmployee), new { id = employee.EmployeeId }, employee);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "HR, Admin")]
    public async Task<IActionResult> UpdateEmployee(string id, EmployeeInputDTO dto)
    {
        if (id != dto.EmployeeId) return BadRequest(new { message = "Mã nhân viên không khớp." });

        if (!string.IsNullOrWhiteSpace(dto.Email) && await _repository.EmailExistsAsync(dto.Email, id))
        {
            return Conflict(new { message = $"Email '{dto.Email}' đã được sử dụng bởi người khác." });
        }

        if (!string.IsNullOrWhiteSpace(dto.PhoneNumber) && await _repository.PhoneExistsAsync(dto.PhoneNumber, id))
        {
            return Conflict(new { message = $"Số điện thoại '{dto.PhoneNumber}' đã được sử dụng bởi người khác." });
        }

        var success = await _repository.UpdateEmployeeAsync(id, dto);
        if (!success) return NotFound(new { message = "Không tìm thấy nhân viên." });

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "HR, Admin")]
    public async Task<IActionResult> DeleteEmployee(string id)
    {
        var success = await _repository.DeleteEmployeeAsync(id);
        if (!success) return NotFound("Không tìm thấy nhân viên.");

        return NoContent();
    }
}
