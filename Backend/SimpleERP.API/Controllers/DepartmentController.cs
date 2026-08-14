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
public class DepartmentController : ControllerBase
{
    private readonly AppDbContext _context;

    public DepartmentController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<DepartmentDTO>>> GetDepartments()
    {
        var departments = await _context.Departments
            .OrderByDescending(d => d.DepartmentId.Length)
            .ThenByDescending(d => d.DepartmentId)
            .Select(d => new DepartmentDTO
            {
                DepartmentId = d.DepartmentId,
                DepartmentName = d.DepartmentName,
                Location = d.Location
            })
            .ToListAsync();
        return Ok(departments);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<DepartmentDTO>> GetDepartment(string id)
    {
        var department = await _context.Departments.FindAsync(id);
        if (department == null) return NotFound();

        return Ok(new DepartmentDTO
        {
            DepartmentId = department.DepartmentId,
            DepartmentName = department.DepartmentName,
            Location = department.Location
        });
    }

    [HttpPost]
    [Authorize(Roles = "HR, Admin")]
    public async Task<ActionResult<DepartmentDTO>> CreateDepartment(DepartmentInputDTO dto)
    {
        if (await _context.Departments.AnyAsync(d => d.DepartmentId == dto.DepartmentId))
        {
            return Conflict(new { message = $"Mã phòng ban '{dto.DepartmentId}' đã tồn tại." });
        }
        if (await _context.Departments.AnyAsync(d => d.DepartmentName == dto.DepartmentName))
        {
            return Conflict(new { message = $"Tên phòng ban '{dto.DepartmentName}' đã tồn tại." });
        }

        var department = new Department
        {
            DepartmentId = dto.DepartmentId,
            DepartmentName = dto.DepartmentName,
            Location = dto.Location
        };

        _context.Departments.Add(department);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetDepartment), new { id = department.DepartmentId }, new DepartmentDTO
        {
            DepartmentId = department.DepartmentId,
            DepartmentName = department.DepartmentName,
            Location = department.Location
        });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "HR, Admin")]
    public async Task<IActionResult> UpdateDepartment(string id, DepartmentInputDTO dto)
    {
        if (id != dto.DepartmentId) return BadRequest(new { message = "Mã phòng ban không khớp." });

        var department = await _context.Departments.FindAsync(id);
        if (department == null) return NotFound(new { message = "Không tìm thấy phòng ban." });

        if (await _context.Departments.AnyAsync(d => d.DepartmentName == dto.DepartmentName && d.DepartmentId != id))
        {
            return Conflict(new { message = $"Tên phòng ban '{dto.DepartmentName}' đã được sử dụng." });
        }

        department.DepartmentName = dto.DepartmentName;
        department.Location = dto.Location;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "HR, Admin")]
    public async Task<IActionResult> DeleteDepartment(string id)
    {
        var department = await _context.Departments.FindAsync(id);
        if (department == null) return NotFound(new { message = "Không tìm thấy phòng ban." });

        // Check if there are employees or assets in this department
        if (await _context.Employees.AnyAsync(e => e.DepartmentId == id))
        {
            return BadRequest(new { message = "Không thể xóa phòng ban đang có nhân viên." });
        }

        if (await _context.Assets.AnyAsync(a => a.DepartmentId == id))
        {
            return BadRequest(new { message = "Không thể xóa phòng ban đang quản lý vật tư." });
        }

        _context.Departments.Remove(department);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
