using System.ComponentModel.DataAnnotations;

namespace SimpleERP.Shared.DTOs;

public class LoginDTO
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}
