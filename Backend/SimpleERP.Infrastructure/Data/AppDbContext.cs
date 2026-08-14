using Microsoft.EntityFrameworkCore;
using SimpleERP.Core.Entities;

namespace SimpleERP.Infrastructure.Data;

/// <summary>
/// AppDbContext — Kết nối Entity Framework Core với SQL Server
/// 6 DbSet tương ứng 6 bảng: Departments, Positions, Employees, Assets, Attendances, LeaveRequests
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<Department> Departments { get; set; } = null!;
    public DbSet<Position> Positions { get; set; } = null!;
    public DbSet<Employee> Employees { get; set; } = null!;
    public DbSet<Asset> Assets { get; set; } = null!;
    public DbSet<Attendance> Attendances { get; set; } = null!;
    public DbSet<LeaveRequest> LeaveRequests { get; set; } = null!;
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // Ràng buộc UNIQUE cho DepartmentName
        modelBuilder.Entity<Department>()
            .HasIndex(d => d.DepartmentName)
            .IsUnique();
        // Ràng buộc UNIQUE cho Email nhân viên
        modelBuilder.Entity<Employee>()
            .HasIndex(e => e.Email)
            .IsUnique();
        // Cấu hình quan hệ Employee → Department
        modelBuilder.Entity<Employee>()
            .HasOne(e => e.Department)
            .WithMany(d => d.Employees)
            .HasForeignKey(e => e.DepartmentId)
            .OnDelete(DeleteBehavior.Restrict);
        // Cấu hình quan hệ Employee → Position
        modelBuilder.Entity<Employee>()
            .HasOne(e => e.Position)
            .WithMany(p => p.Employees)
            .HasForeignKey(e => e.PositionId)
            .OnDelete(DeleteBehavior.Restrict);

        // Cấu hình quan hệ Asset → Department
        modelBuilder.Entity<Asset>()
            .HasOne(a => a.Department)
            .WithMany(d => d.Assets)
            .HasForeignKey(a => a.DepartmentId)
            .OnDelete(DeleteBehavior.Restrict);

        // Cấu hình quan hệ Attendance → Employee
        modelBuilder.Entity<Attendance>()
            .HasOne(a => a.Employee)
            .WithMany()
            .HasForeignKey(a => a.EmployeeId)
            .OnDelete(DeleteBehavior.Restrict);

        // Cấu hình quan hệ LeaveRequest → Employee
        modelBuilder.Entity<LeaveRequest>()
            .HasOne(lr => lr.Employee)
            .WithMany()
            .HasForeignKey(lr => lr.EmployeeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

