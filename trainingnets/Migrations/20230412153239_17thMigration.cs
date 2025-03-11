using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace trainingnets.Migrations
{
    /// <inheritdoc />
    public partial class _17thMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_tblUserAccount_intEmployeeId",
                table: "tblUserAccount");

            migrationBuilder.CreateIndex(
                name: "IX_tblUserAccount_intEmployeeId",
                table: "tblUserAccount",
                column: "intEmployeeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_tblUserAccount_intEmployeeId",
                table: "tblUserAccount");

            migrationBuilder.CreateIndex(
                name: "IX_tblUserAccount_intEmployeeId",
                table: "tblUserAccount",
                column: "intEmployeeId",
                unique: true);
        }
    }
}
