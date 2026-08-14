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
public class AssetController : ControllerBase
{
    private readonly AppDbContext _context;

    public AssetController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<AssetDTO>>> GetAssets([FromQuery] string? departmentId = null)
    {
        var query = _context.Assets.Include(a => a.Department).AsQueryable();

        if (!string.IsNullOrEmpty(departmentId) && departmentId != "all")
        {
            query = query.Where(a => a.DepartmentId == departmentId);
        }

        var assets = await query
            .OrderByDescending(a => a.AssetId.Length)
            .ThenByDescending(a => a.AssetId)
            .Select(a => new AssetDTO
            {
                AssetId = a.AssetId,
                AssetName = a.AssetName,
                Category = a.Category,
                Quantity = a.Quantity,
                Unit = a.Unit,
                UnitPrice = a.UnitPrice,
                DepartmentId = a.DepartmentId,
                DepartmentName = a.Department!.DepartmentName,
                Status = a.Status,
                PurchaseDate = a.PurchaseDate,
                Description = a.Description
            })
            .ToListAsync();
            
        return Ok(assets);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AssetDTO>> GetAsset(string id)
    {
        var a = await _context.Assets.Include(a => a.Department).FirstOrDefaultAsync(a => a.AssetId == id);
        if (a == null) return NotFound();

        return Ok(new AssetDTO
        {
            AssetId = a.AssetId,
            AssetName = a.AssetName,
            Category = a.Category,
            Quantity = a.Quantity,
            Unit = a.Unit,
            UnitPrice = a.UnitPrice,
            DepartmentId = a.DepartmentId,
            DepartmentName = a.Department!.DepartmentName,
            Status = a.Status,
            PurchaseDate = a.PurchaseDate,
            Description = a.Description
        });
    }

    [HttpPost]
    [Authorize(Roles = "HR, Admin")]
    public async Task<ActionResult<AssetDTO>> CreateAsset(AssetInputDTO dto)
    {
        if (await _context.Assets.AnyAsync(a => a.AssetId == dto.AssetId))
        {
            return Conflict(new { message = $"Mã vật tư '{dto.AssetId}' đã tồn tại." });
        }

        var asset = new Asset
        {
            AssetId = dto.AssetId,
            AssetName = dto.AssetName,
            Category = dto.Category,
            Quantity = dto.Quantity,
            Unit = dto.Unit,
            UnitPrice = dto.UnitPrice,
            DepartmentId = dto.DepartmentId,
            Status = dto.Status,
            PurchaseDate = dto.PurchaseDate,
            Description = dto.Description
        };

        _context.Assets.Add(asset);
        await _context.SaveChangesAsync();
        
        // Load department name for return
        var dept = await _context.Departments.FindAsync(dto.DepartmentId);

        return CreatedAtAction(nameof(GetAsset), new { id = asset.AssetId }, new AssetDTO
        {
            AssetId = asset.AssetId,
            AssetName = asset.AssetName,
            Category = asset.Category,
            Quantity = asset.Quantity,
            Unit = asset.Unit,
            UnitPrice = asset.UnitPrice,
            DepartmentId = asset.DepartmentId,
            DepartmentName = dept?.DepartmentName ?? "",
            Status = asset.Status,
            PurchaseDate = asset.PurchaseDate,
            Description = asset.Description
        });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "HR, Admin")]
    public async Task<IActionResult> UpdateAsset(string id, AssetInputDTO dto)
    {
        if (id != dto.AssetId) return BadRequest(new { message = "Mã vật tư không khớp." });

        var asset = await _context.Assets.FindAsync(id);
        if (asset == null) return NotFound(new { message = "Không tìm thấy vật tư." });

        asset.AssetName = dto.AssetName;
        asset.Category = dto.Category;
        asset.Quantity = dto.Quantity;
        asset.Unit = dto.Unit;
        asset.UnitPrice = dto.UnitPrice;
        asset.DepartmentId = dto.DepartmentId;
        asset.Status = dto.Status;
        asset.PurchaseDate = dto.PurchaseDate;
        asset.Description = dto.Description;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "HR, Admin")]
    public async Task<IActionResult> DeleteAsset(string id)
    {
        var asset = await _context.Assets.FindAsync(id);
        if (asset == null) return NotFound(new { message = "Không tìm thấy vật tư." });

        _context.Assets.Remove(asset);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
