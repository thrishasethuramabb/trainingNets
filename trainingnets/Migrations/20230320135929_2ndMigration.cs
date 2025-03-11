using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace trainingnets.Migrations
{
    /// <inheritdoc />
    public partial class _2ndMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "dtTrainingDate",
                table: "tblTraining");

            migrationBuilder.AlterColumn<TimeOnly>(
                name: "dtTrainingDuration",
                table: "tblTraining",
                type: "time",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<DateOnly>(
                name: "trainingDate",
                table: "tblTraining",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AlterColumn<DateOnly>(
                name: "dtCompletionDate",
                table: "tblEmployeeTraining",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "trainingDate",
                table: "tblTraining");

            migrationBuilder.AlterColumn<DateTime>(
                name: "dtTrainingDuration",
                table: "tblTraining",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(TimeOnly),
                oldType: "time");

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
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date");
        }
    }
}
