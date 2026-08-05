namespace SimpleERP.Shared.DTOs;

public class DepartmentDTO
{
    public string DepartmentId { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public string? Location { get; set; }
}

public class DepartmentInputDTO
{
    public string DepartmentId { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public string? Location { get; set; }
}
