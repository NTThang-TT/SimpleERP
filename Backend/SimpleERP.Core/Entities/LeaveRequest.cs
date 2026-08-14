using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SimpleERP.Core.Entities;

/// <summary>
/// Entity Đơn Xin Nghỉ Phép — Map với bảng LeaveRequests trong SQL Server
/// Khóa ngoại: EmployeeId → Employees
/// </summary>
[Table("LeaveRequests")]
public class LeaveRequest
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int LeaveRequestId { get; set; }

    [Required]
    [Column("EmployeeId", TypeName = "VARCHAR(20)")]
    [MaxLength(20)]
    public string EmployeeId { get; set; } = string.Empty;

    [Required]
    [Column("LeaveType", TypeName = "NVARCHAR(50)")]
    [MaxLength(50)]
    public string LeaveType { get; set; } = "Nghỉ phép năm";

    [Required]
    [Column("StartDate", TypeName = "DATE")]
    public DateTime StartDate { get; set; }

    [Required]
    [Column("EndDate", TypeName = "DATE")]
    public DateTime EndDate { get; set; }

    [Required]
    [Column("Reason", TypeName = "NVARCHAR(500)")]
    [MaxLength(500)]
    public string Reason { get; set; } = string.Empty;

    [Column("Status", TypeName = "NVARCHAR(30)")]
    [MaxLength(30)]
    public string Status { get; set; } = "Chờ duyệt";

    [Column("ApprovedBy", TypeName = "VARCHAR(20)")]
    [MaxLength(20)]
    public string? ApprovedBy { get; set; }

    [Column("CreatedAt", TypeName = "DATETIME")]
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    // ===== NAVIGATION PROPERTIES =====
    [ForeignKey("EmployeeId")]
    public Employee? Employee { get; set; }
}
