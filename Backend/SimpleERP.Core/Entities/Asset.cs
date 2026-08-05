using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SimpleERP.Core.Entities;

/// <summary>
/// Entity Vật tư / Thiết bị — Map với bảng Assets trong SQL Server
/// Khóa ngoại: DepartmentId → Departments (Phòng ban đang sử dụng)
/// </summary>
[Table("Assets")]
public class Asset
{
    [Key]
    [Column("AssetId", TypeName = "VARCHAR(20)")]
    [MaxLength(20)]
    public string AssetId { get; set; } = string.Empty;

    [Required]
    [Column("AssetName", TypeName = "NVARCHAR(150)")]
    [MaxLength(150)]
    public string AssetName { get; set; } = string.Empty;

    [Required]
    [Column("Category", TypeName = "NVARCHAR(50)")]
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty;

    [Required]
    [Column("Quantity")]
    public int Quantity { get; set; }

    [Required]
    [Column("Unit", TypeName = "NVARCHAR(20)")]
    [MaxLength(20)]
    public string Unit { get; set; } = "cái";

    [Required]
    [Column("UnitPrice", TypeName = "DECIMAL(18, 2)")]
    public decimal UnitPrice { get; set; }

    // ===== KHÓA NGOẠI =====

    [Required]
    [Column("DepartmentId", TypeName = "VARCHAR(10)")]
    [MaxLength(10)]
    public string DepartmentId { get; set; } = string.Empty;

    [Column("Status", TypeName = "NVARCHAR(50)")]
    [MaxLength(50)]
    public string Status { get; set; } = "Đang sử dụng";

    [Column("PurchaseDate", TypeName = "DATE")]
    public DateTime PurchaseDate { get; set; }

    [Column("Description", TypeName = "NVARCHAR(500)")]
    [MaxLength(500)]
    public string? Description { get; set; }

    // ===== NAVIGATION PROPERTY =====

    [ForeignKey("DepartmentId")]
    public Department? Department { get; set; }
}
