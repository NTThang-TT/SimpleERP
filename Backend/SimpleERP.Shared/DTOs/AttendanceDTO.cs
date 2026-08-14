namespace SimpleERP.Shared.DTOs;

/// <summary>
/// DTO trả về thông tin Chấm công (kèm tên NV, phòng ban)
/// </summary>
public class AttendanceDTO
{
    public int AttendanceId { get; set; }
    public string EmployeeId { get; set; } = string.Empty;
    public string EmployeeFullName { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public DateTime? CheckIn { get; set; }
    public DateTime? CheckOut { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Note { get; set; }
}

/// <summary>
/// DTO nhận dữ liệu khi tạo/sửa Chấm công
/// </summary>
public class AttendanceInputDTO
{
    public string EmployeeId { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public DateTime? CheckIn { get; set; }
    public DateTime? CheckOut { get; set; }
    public string Status { get; set; } = "Đúng giờ";
    public string? Note { get; set; }
}
