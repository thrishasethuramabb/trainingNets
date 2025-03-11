using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace trainingnets.Migrations
{
    /// <inheritdoc />
    public partial class _4thMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_tblEmployeeTraining",
                table: "tblEmployeeTraining");

            migrationBuilder.DropColumn(
                name: "dtTrainingDate",
                table: "tblTraining");

            migrationBuilder.DropColumn(
                name: "dtTrainingDuration",
                table: "tblTraining");

            migrationBuilder.AddColumn<string>(
                name: "strTrainingDate",
                table: "tblTraining",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "strTrainingDuration",
                table: "tblTraining",
                type: "nvarchar(max)",
                nullable: true);

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
                oldType: "date");

            migrationBuilder.AddColumn<int>(
                name: "intYearId",
                table: "tblEmployeeTraining",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_tblEmployeeTraining",
                table: "tblEmployeeTraining",
                columns: new[] { "intEmployeeId", "intTrainingId", "intYearId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_tblEmployeeTraining",
                table: "tblEmployeeTraining");

            migrationBuilder.DropColumn(
                name: "strTrainingDate",
                table: "tblTraining");

            migrationBuilder.DropColumn(
                name: "strTrainingDuration",
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
                type: "date",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<TimeSpan>(
                name: "dtTrainingDuration",
                table: "tblTraining",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.AlterColumn<DateTime>(
                name: "dtCompletionDate",
                table: "tblEmployeeTraining",
                type: "date",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_tblEmployeeTraining",
                table: "tblEmployeeTraining",
                columns: new[] { "intEmployeeId", "intTrainingId" });
        }
    }
}
