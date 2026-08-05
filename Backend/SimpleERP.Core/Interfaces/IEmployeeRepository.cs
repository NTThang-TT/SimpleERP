using SimpleERP.Shared.DTOs;
using SimpleERP.Core.Entities;

namespace SimpleERP.Core.Interfaces;

public interface IEmployeeRepository
{
    Task<PagedResultDTO<EmployeeDTO>> GetPagedEmployeesAsync(int pageNumber, int pageSize, string? searchTerm, string? departmentId);
    Task<Employee?> GetEmployeeByIdAsync(string id);
    Task<Employee> CreateEmployeeAsync(EmployeeInputDTO dto);
    Task<bool> UpdateEmployeeAsync(string id, EmployeeInputDTO dto);
    Task<bool> DeleteEmployeeAsync(string id);
    Task<EmployeeStatisticsDTO> GetEmployeeStatisticsAsync();
    Task<bool> EmailExistsAsync(string email, string? excludeId = null);
    Task<bool> PhoneExistsAsync(string phone, string? excludeId = null);
}
