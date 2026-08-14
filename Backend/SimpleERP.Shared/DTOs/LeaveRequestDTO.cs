namespace SimpleERP.Shared.DTOs;

/// <summary>
/// DTO trả về thông tin Đơn xin Nghỉ phép (kèm tên NV, phòng ban)
/// </summary>
public class LeaveRequestDTO
{
    public int LeaveRequestId { get; set; }
    public string EmployeeId { get; set; } = string.Empty;
    public string EmployeeFullName { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public string LeaveType { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? ApprovedBy { get; set; }
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// DTO nhận dữ liệu khi tạo Đơn nghỉ phép
/// </summary>
public class LeaveRequestInputDTO
{
    public string EmployeeId { get; set; } = string.Empty;
    public string LeaveType { get; set; } = "Nghỉ phép năm";
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Reason { get; set; } = string.Empty;
}

/// <summary>
/// DTO duyệt/từ chối đơn nghỉ phép
/// </summary>
public class LeaveApprovalDTO
{
    public string Status { get; set; } = string.Empty; // "Đã duyệt" hoặc "Từ chối"
    public string ApprovedBy { get; set; } = string.Empty;
}
