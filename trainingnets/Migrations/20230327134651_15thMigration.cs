using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace trainingnets.Migrations
{
    /// <inheritdoc />
    public partial class _15thMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_tblUserAccount_intEmployeeId",
                table: "tblUserAccount");

            migrationBuilder.RenameColumn(
                name: "sttUsername",
                table: "tblUserAccount",
                newName: "strUsername");

            migrationBuilder.CreateIndex(
                name: "IX_tblUserAccount_intEmployeeId",
                table: "tblUserAccount",
                column: "intEmployeeId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_tblUserAccount_intEmployeeId",
                table: "tblUserAccount");

            migrationBuilder.RenameColumn(
                name: "strUsername",
                table: "tblUserAccount",
                newName: "sttUsername");

            migrationBuilder.CreateIndex(
                name: "IX_tblUserAccount_intEmployeeId",
                table: "tblUserAccount",
                column: "intEmployeeId");
        }
    }
}
