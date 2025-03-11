using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace trainingnets.Migrations
{
    /// <inheritdoc />
    public partial class _19thMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tblEmployeeTraining_tblUserAccount_tblUserAccountstrUsername",
                table: "tblEmployeeTraining");

            migrationBuilder.DropIndex(
                name: "IX_tblUserAccount_intEmployeeId",
                table: "tblUserAccount");

            migrationBuilder.DropIndex(
                name: "IX_tblEmployeeTraining_tblUserAccountstrUsername",
                table: "tblEmployeeTraining");

            migrationBuilder.DropColumn(
                name: "tblUserAccountstrUsername",
                table: "tblEmployeeTraining");

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

            migrationBuilder.AddColumn<string>(
                name: "tblUserAccountstrUsername",
                table: "tblEmployeeTraining",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_tblUserAccount_intEmployeeId",
                table: "tblUserAccount",
                column: "intEmployeeId");

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
    }
}
