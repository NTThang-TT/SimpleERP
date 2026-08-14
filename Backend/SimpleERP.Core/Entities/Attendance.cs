using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SimpleERP.Core.Entities;

/// <summary>
/// Entity Chấm Công — Map với bảng Attendances trong SQL Server
/// Khóa ngoại: EmployeeId → Employees
/// </summary>
[Table("Attendances")]
public class Attendance
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int AttendanceId { get; set; }

    [Required]
    [Column("EmployeeId", TypeName = "VARCHAR(20)")]
    [MaxLength(20)]
    public string EmployeeId { get; set; } = string.Empty;

    [Required]
    [Column("Date", TypeName = "DATE")]
    public DateTime Date { get; set; }

    [Column("CheckIn", TypeName = "DATETIME")]
    public DateTime? CheckIn { get; set; }

    [Column("CheckOut", TypeName = "DATETIME")]
    public DateTime? CheckOut { get; set; }

    [Column("Status", TypeName = "NVARCHAR(30)")]
    [MaxLength(30)]
    public string Status { get; set; } = "Đúng giờ";

    [Column("Note", TypeName = "NVARCHAR(200)")]
    [MaxLength(200)]
    public string? Note { get; set; }

    // ===== NAVIGATION PROPERTIES =====
    [ForeignKey("EmployeeId")]
    public Employee? Employee { get; set; }
}
