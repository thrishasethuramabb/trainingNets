using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace trainingnets.Migrations
{
    /// <inheritdoc />
    public partial class _10thMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_tblEmployeeTraining",
                table: "tblEmployeeTraining");

            migrationBuilder.DropColumn(
                name: "strTrainingDate",
                table: "tblTraining");

            migrationBuilder.DropColumn(
                name: "strTrainingInfo",
                table: "tblTraining");

            migrationBuilder.DropColumn(
                name: "intYearId",
                table: "tblEmployeeTraining");

            migrationBuilder.AddColumn<DateTime>(
                name: "dtTrainingDate",
                table: "tblTraining",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<DateTime>(
                name: "dtCompletionDate",
                table: "tblEmployeeTraining",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "dtOrientationDate",
                table: "tblEmployee",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_tblEmployeeTraining",
                table: "tblEmployeeTraining",
                columns: new[] { "intEmployeeId", "intTrainingId" });

            migrationBuilder.CreateTable(
                name: "tblTrainingTag",
                columns: table => new
                {
                    intTrainingId = table.Column<int>(type: "int", nullable: false),
                    strTag = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblTrainingTag", x => new { x.intTrainingId, x.strTag });
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tblTrainingTag");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tblEmployeeTraining",
                table: "tblEmployeeTraining");

            migrationBuilder.DropColumn(
                name: "dtTrainingDate",
                table: "tblTraining");

            migrationBuilder.AddColumn<string>(
                name: "strTrainingDate",
                table: "tblTraining",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "strTrainingInfo",
                table: "tblTraining",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "dtCompletionDate",
                table: "tblEmployeeTraining",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<int>(
                name: "intYearId",
                table: "tblEmployeeTraining",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<DateTime>(
                name: "dtOrientationDate",
                table: "tblEmployee",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_tblEmployeeTraining",
                table: "tblEmployeeTraining",
                columns: new[] { "intEmployeeId", "intTrainingId", "intYearId" });
        }
    }
}
