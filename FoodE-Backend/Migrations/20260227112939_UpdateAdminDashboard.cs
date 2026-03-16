using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FoodE_Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAdminDashboard : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 9999,
                columns: new[] { "Name", "Password" },
                values: new object[] { "Admin User", "Admin@123" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 9999,
                columns: new[] { "Name", "Password" },
                values: new object[] { "Admin", "Admin123!" });
        }
    }
}
