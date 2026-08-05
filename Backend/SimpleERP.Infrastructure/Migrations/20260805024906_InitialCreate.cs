using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SimpleERP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Departments",
                columns: table => new
                {
                    DepartmentId = table.Column<string>(type: "VARCHAR(10)", maxLength: 10, nullable: false),
                    DepartmentName = table.Column<string>(type: "NVARCHAR(100)", maxLength: 100, nullable: false),
                    Location = table.Column<string>(type: "NVARCHAR(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Departments", x => x.DepartmentId);
                });

            migrationBuilder.CreateTable(
                name: "Positions",
                columns: table => new
                {
                    PositionId = table.Column<string>(type: "VARCHAR(10)", maxLength: 10, nullable: false),
                    PositionName = table.Column<string>(type: "NVARCHAR(100)", maxLength: 100, nullable: false),
                    BaseSalary = table.Column<decimal>(type: "DECIMAL(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Positions", x => x.PositionId);
                });

            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    EmployeeId = table.Column<string>(type: "VARCHAR(20)", maxLength: 20, nullable: false),
                    FullName = table.Column<string>(type: "NVARCHAR(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "VARCHAR(100)", maxLength: 100, nullable: false),
                    PhoneNumber = table.Column<string>(type: "VARCHAR(15)", maxLength: 15, nullable: true),
                    DepartmentId = table.Column<string>(type: "VARCHAR(10)", maxLength: 10, nullable: false),
                    PositionId = table.Column<string>(type: "VARCHAR(10)", maxLength: 10, nullable: false),
                    HireDate = table.Column<DateTime>(type: "DATE", nullable: false),
                    Status = table.Column<string>(type: "NVARCHAR(50)", maxLength: 50, nullable: false),
                    Username = table.Column<string>(type: "VARCHAR(50)", maxLength: 50, nullable: true),
                    PasswordHash = table.Column<string>(type: "NVARCHAR(255)", maxLength: 255, nullable: true),
                    Role = table.Column<string>(type: "VARCHAR(20)", maxLength: 20, nullable: true),
                    RefreshToken = table.Column<string>(type: "VARCHAR(255)", maxLength: 255, nullable: true),
                    RefreshTokenExpiryTime = table.Column<DateTime>(type: "DATETIME", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.EmployeeId);
                    table.ForeignKey(
                        name: "FK_Employees_Departments_DepartmentId",
                        column: x => x.DepartmentId,
                        principalTable: "Departments",
                        principalColumn: "DepartmentId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Employees_Positions_PositionId",
                        column: x => x.PositionId,
                        principalTable: "Positions",
                        principalColumn: "PositionId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Departments_DepartmentName",
                table: "Departments",
                column: "DepartmentName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Employees_DepartmentId",
                table: "Employees",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_Email",
                table: "Employees",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Employees_PositionId",
                table: "Employees",
                column: "PositionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Employees");

            migrationBuilder.DropTable(
                name: "Departments");

            migrationBuilder.DropTable(
                name: "Positions");
        }
    }
}
