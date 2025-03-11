using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace trainingnets.Migrations
{
    /// <inheritdoc />
    public partial class _14thMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tblEmployeeTraining_tblEmployee_tblEmployeeintEmployeeId",
                table: "tblEmployeeTraining");

            migrationBuilder.DropForeignKey(
                name: "FK_tblEmployeeTraining_tblTraining_tblTrainingintTrainingId",
                table: "tblEmployeeTraining");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tblEmployeeTraining",
                table: "tblEmployeeTraining");

            migrationBuilder.DropIndex(
                name: "IX_tblEmployeeTraining_tblEmployeeintEmployeeId",
                table: "tblEmployeeTraining");

            migrationBuilder.DropIndex(
                name: "IX_tblEmployeeTraining_tblTrainingintTrainingId",
                table: "tblEmployeeTraining");

            migrationBuilder.DropColumn(
                name: "tblEmployeeintEmployeeId",
                table: "tblEmployeeTraining");

            migrationBuilder.DropColumn(
                name: "tblTrainingintTrainingId",
                table: "tblEmployeeTraining");

           
            migrationBuilder.AddColumn<long>(
                name: "intEmployeeId",
                table: "tblEmployeeTraining",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddPrimaryKey(
                name: "PK_tblEmployeeTraining",
                table: "tblEmployeeTraining",
                columns: new[] { "intEmployeeId", "intTrainingId" });

            migrationBuilder.CreateIndex(
                name: "IX_tblEmployeeTraining_intTrainingId",
                table: "tblEmployeeTraining",
                column: "intTrainingId");

            migrationBuilder.AddForeignKey(
                name: "FK_tblEmployeeTraining_tblEmployee_intEmployeeId",
                table: "tblEmployeeTraining",
                column: "intEmployeeId",
                principalTable: "tblEmployee",
                principalColumn: "intEmployeeId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_tblEmployeeTraining_tblTraining_intTrainingId",
                table: "tblEmployeeTraining",
                column: "intTrainingId",
                principalTable: "tblTraining",
                principalColumn: "intTrainingId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tblEmployeeTraining_tblEmployee_intEmployeeId",
                table: "tblEmployeeTraining");

            migrationBuilder.DropForeignKey(
                name: "FK_tblEmployeeTraining_tblTraining_intTrainingId",
                table: "tblEmployeeTraining");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tblEmployeeTraining",
                table: "tblEmployeeTraining");

            migrationBuilder.DropIndex(
                name: "IX_tblEmployeeTraining_intTrainingId",
                table: "tblEmployeeTraining");

            migrationBuilder.DropColumn(
                name: "intEmployeeId",
                table: "tblEmployeeTraining");

            migrationBuilder.DropColumn(
                name: "intTrainingId",
                table: "tblEmployeeTraining"
               );

            migrationBuilder.AddColumn<long>(
                name: "tblEmployeeintEmployeeId",
                table: "tblEmployeeTraining",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "tblTrainingintTrainingId",
                table: "tblEmployeeTraining",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_tblEmployeeTraining",
                table: "tblEmployeeTraining",
                column: "intTrainingId");

            migrationBuilder.CreateIndex(
                name: "IX_tblEmployeeTraining_tblEmployeeintEmployeeId",
                table: "tblEmployeeTraining",
                column: "tblEmployeeintEmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_tblEmployeeTraining_tblTrainingintTrainingId",
                table: "tblEmployeeTraining",
                column: "tblTrainingintTrainingId");

            migrationBuilder.AddForeignKey(
                name: "FK_tblEmployeeTraining_tblEmployee_tblEmployeeintEmployeeId",
                table: "tblEmployeeTraining",
                column: "tblEmployeeintEmployeeId",
                principalTable: "tblEmployee",
                principalColumn: "intEmployeeId");

            migrationBuilder.AddForeignKey(
                name: "FK_tblEmployeeTraining_tblTraining_tblTrainingintTrainingId",
                table: "tblEmployeeTraining",
                column: "tblTrainingintTrainingId",
                principalTable: "tblTraining",
                principalColumn: "intTrainingId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
