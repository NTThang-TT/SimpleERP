using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SimpleERP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAttendanceAndLeaveRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Attendances",
                columns: table => new
                {
                    AttendanceId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeId = table.Column<string>(type: "VARCHAR(20)", maxLength: 20, nullable: false),
                    Date = table.Column<DateTime>(type: "DATE", nullable: false),
                    CheckIn = table.Column<DateTime>(type: "DATETIME", nullable: true),
                    CheckOut = table.Column<DateTime>(type: "DATETIME", nullable: true),
                    Status = table.Column<string>(type: "NVARCHAR(30)", maxLength: 30, nullable: false),
                    Note = table.Column<string>(type: "NVARCHAR(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Attendances", x => x.AttendanceId);
                    table.ForeignKey(
                        name: "FK_Attendances_Employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employees",
                        principalColumn: "EmployeeId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "LeaveRequests",
                columns: table => new
                {
                    LeaveRequestId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeId = table.Column<string>(type: "VARCHAR(20)", maxLength: 20, nullable: false),
                    LeaveType = table.Column<string>(type: "NVARCHAR(50)", maxLength: 50, nullable: false),
                    StartDate = table.Column<DateTime>(type: "DATE", nullable: false),
                    EndDate = table.Column<DateTime>(type: "DATE", nullable: false),
                    Reason = table.Column<string>(type: "NVARCHAR(500)", maxLength: 500, nullable: false),
                    Status = table.Column<string>(type: "NVARCHAR(30)", maxLength: 30, nullable: false),
                    ApprovedBy = table.Column<string>(type: "VARCHAR(20)", maxLength: 20, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "DATETIME", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LeaveRequests", x => x.LeaveRequestId);
                    table.ForeignKey(
                        name: "FK_LeaveRequests_Employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employees",
                        principalColumn: "EmployeeId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Attendances_EmployeeId",
                table: "Attendances",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_LeaveRequests_EmployeeId",
                table: "LeaveRequests",
                column: "EmployeeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Attendances");

            migrationBuilder.DropTable(
                name: "LeaveRequests");
        }
    }
}
