namespace SimpleERP.Shared.DTOs;

public class AssetDTO
{
    public string AssetId { get; set; } = string.Empty;
    public string AssetName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public string Unit { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public string DepartmentName { get; set; } = string.Empty;
    public string DepartmentId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime PurchaseDate { get; set; }
    public string? Description { get; set; }
}

public class AssetInputDTO
{
    public string AssetId { get; set; } = string.Empty;
    public string AssetName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public string Unit { get; set; } = "cái";
    public decimal UnitPrice { get; set; }
    public string DepartmentId { get; set; } = string.Empty;
    public string Status { get; set; } = "Đang sử dụng";
    public DateTime PurchaseDate { get; set; }
    public string? Description { get; set; }
}
