using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace trainingnets.Migrations
{
    /// <inheritdoc />
    public partial class _7thMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "bitisActive",
                table: "tblDepartment",
                type: "bit",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "bitisActive",
                table: "tblDepartment");
        }
    }
}
