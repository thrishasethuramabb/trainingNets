using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace trainingnets.Migrations
{
    /// <inheritdoc />
    public partial class _18thMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "tblUserAccountstrUsername",
                table: "tblEmployeeTraining",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_tblEmployeeTraining_tblUserAccountstrUsername",
                table: "tblEmployeeTraining",
                column: "tblUserAccountstrUsername");

            migrationBuilder.AddForeignKey(
                name: "FK_tblEmployeeTraining_tblUserAccount_tblUserAccountstrUsername",
                table: "tblEmployeeTraining",
                column: "tblUserAccountstrUsername",
                principalTable: "tblUserAccount",
                principalColumn: "strUsername");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tblEmployeeTraining_tblUserAccount_tblUserAccountstrUsername",
                table: "tblEmployeeTraining");

            migrationBuilder.DropIndex(
                name: "IX_tblEmployeeTraining_tblUserAccountstrUsername",
                table: "tblEmployeeTraining");

            migrationBuilder.DropColumn(
                name: "tblUserAccountstrUsername",
                table: "tblEmployeeTraining");
        }
    }
}
