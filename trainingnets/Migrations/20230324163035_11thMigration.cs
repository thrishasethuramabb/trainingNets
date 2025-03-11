using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace trainingnets.Migrations
{
    /// <inheritdoc />
    public partial class _11thMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tblTrainingTag");

            migrationBuilder.DropColumn(
                name: "strTrainingDuration",
                table: "tblTraining");

            migrationBuilder.AddColumn<long>(
                name: "tblEmployeeintEmployeeId",
                table: "tblUserLog",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AlterColumn<bool>(
                name: "bitIsActive",
                table: "tblUserAccount",
                type: "bit",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<long>(
                name: "tblEmployeeintEmployeeId",
                table: "tblUserAccount",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<bool>(
                name: "bitIsSpecial",
                table: "tblTraining",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "intTrainingDuration",
                table: "tblTraining",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "intTrainingFrequency",
                table: "tblTraining",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<long>(
                name: "tblEmployeeintEmployeeId",
                table: "tblEmployeeTraining",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AlterColumn<long>(
                name: "intEmployeeManagerId",
                table: "tblEmployee",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "tblClassificationintClassificationId",
                table: "tblEmployee",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "tblDepartmentintDepartmentId",
                table: "tblEmployee",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "tblTrainingDepartment",
                columns: table => new
                {
                    intTrainingId = table.Column<int>(type: "int", nullable: false),
                    intDepartmentId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblTrainingDepartment", x => new { x.intTrainingId, x.intDepartmentId });
                    table.ForeignKey(
                        name: "FK_tblTrainingDepartment_tblDepartment_intDepartmentId",
                        column: x => x.intDepartmentId,
                        principalTable: "tblDepartment",
                        principalColumn: "intDepartmentId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblTrainingDepartment_tblTraining_intTrainingId",
                        column: x => x.intTrainingId,
                        principalTable: "tblTraining",
                        principalColumn: "intTrainingId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tblTrainingLog",
                columns: table => new
                {
                    intTrainingLog = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    intTrainingId = table.Column<int>(type: "int", nullable: false),
                    tblTrainingintTrainingId = table.Column<int>(type: "int", nullable: false),
                    intEmployeeId = table.Column<long>(type: "bigint", nullable: false),
                    tblEmployeeintEmployeeId = table.Column<long>(type: "bigint", nullable: false),
                    strDeviceAddress = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    dtTimeAccessed = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblTrainingLog", x => x.intTrainingLog);
                    table.ForeignKey(
                        name: "FK_tblTrainingLog_tblEmployee_tblEmployeeintEmployeeId",
                        column: x => x.tblEmployeeintEmployeeId,
                        principalTable: "tblEmployee",
                        principalColumn: "intEmployeeId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblTrainingLog_tblTraining_tblTrainingintTrainingId",
                        column: x => x.tblTrainingintTrainingId,
                        principalTable: "tblTraining",
                        principalColumn: "intTrainingId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tblUserLog_tblEmployeeintEmployeeId",
                table: "tblUserLog",
                column: "tblEmployeeintEmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_tblUserAccount_tblEmployeeintEmployeeId",
                table: "tblUserAccount",
                column: "tblEmployeeintEmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_tblEmployeeTraining_intTrainingId",
                table: "tblEmployeeTraining",
                column: "intTrainingId");

            migrationBuilder.CreateIndex(
                name: "IX_tblEmployeeTraining_tblEmployeeintEmployeeId",
                table: "tblEmployeeTraining",
                column: "tblEmployeeintEmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_tblEmployee_intEmployeeManagerId",
                table: "tblEmployee",
                column: "intEmployeeManagerId");

            migrationBuilder.CreateIndex(
                name: "IX_tblEmployee_tblClassificationintClassificationId",
                table: "tblEmployee",
                column: "tblClassificationintClassificationId");

            migrationBuilder.CreateIndex(
                name: "IX_tblEmployee_tblDepartmentintDepartmentId",
                table: "tblEmployee",
                column: "tblDepartmentintDepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_tblTrainingDepartment_intDepartmentId",
                table: "tblTrainingDepartment",
                column: "intDepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_tblTrainingLog_tblEmployeeintEmployeeId",
                table: "tblTrainingLog",
                column: "tblEmployeeintEmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_tblTrainingLog_tblTrainingintTrainingId",
                table: "tblTrainingLog",
                column: "tblTrainingintTrainingId");

            migrationBuilder.AddForeignKey(
                name: "FK_tblEmployee_tblClassification_tblClassificationintClassificationId",
                table: "tblEmployee",
                column: "tblClassificationintClassificationId",
                principalTable: "tblClassification",
                principalColumn: "intClassificationId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_tblEmployee_tblDepartment_tblDepartmentintDepartmentId",
                table: "tblEmployee",
                column: "tblDepartmentintDepartmentId",
                principalTable: "tblDepartment",
                principalColumn: "intDepartmentId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_tblEmployee_tblEmployee_intEmployeeManagerId",
                table: "tblEmployee",
                column: "intEmployeeManagerId",
                principalTable: "tblEmployee",
                principalColumn: "intEmployeeId");

            migrationBuilder.AddForeignKey(
                name: "FK_tblEmployeeTraining_tblEmployee_tblEmployeeintEmployeeId",
                table: "tblEmployeeTraining",
                column: "tblEmployeeintEmployeeId",
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

            migrationBuilder.AddForeignKey(
                name: "FK_tblUserAccount_tblEmployee_tblEmployeeintEmployeeId",
                table: "tblUserAccount",
                column: "tblEmployeeintEmployeeId",
                principalTable: "tblEmployee",
                principalColumn: "intEmployeeId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_tblUserLog_tblEmployee_tblEmployeeintEmployeeId",
                table: "tblUserLog",
                column: "tblEmployeeintEmployeeId",
                principalTable: "tblEmployee",
                principalColumn: "intEmployeeId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tblEmployee_tblClassification_tblClassificationintClassificationId",
                table: "tblEmployee");

            migrationBuilder.DropForeignKey(
                name: "FK_tblEmployee_tblDepartment_tblDepartmentintDepartmentId",
                table: "tblEmployee");

            migrationBuilder.DropForeignKey(
                name: "FK_tblEmployee_tblEmployee_intEmployeeManagerId",
                table: "tblEmployee");

            migrationBuilder.DropForeignKey(
                name: "FK_tblEmployeeTraining_tblEmployee_tblEmployeeintEmployeeId",
                table: "tblEmployeeTraining");

            migrationBuilder.DropForeignKey(
                name: "FK_tblEmployeeTraining_tblTraining_intTrainingId",
                table: "tblEmployeeTraining");

            migrationBuilder.DropForeignKey(
                name: "FK_tblUserAccount_tblEmployee_tblEmployeeintEmployeeId",
                table: "tblUserAccount");

            migrationBuilder.DropForeignKey(
                name: "FK_tblUserLog_tblEmployee_tblEmployeeintEmployeeId",
                table: "tblUserLog");

            migrationBuilder.DropTable(
                name: "tblTrainingDepartment");

            migrationBuilder.DropTable(
                name: "tblTrainingLog");

            migrationBuilder.DropIndex(
                name: "IX_tblUserLog_tblEmployeeintEmployeeId",
                table: "tblUserLog");

            migrationBuilder.DropIndex(
                name: "IX_tblUserAccount_tblEmployeeintEmployeeId",
                table: "tblUserAccount");

            migrationBuilder.DropIndex(
                name: "IX_tblEmployeeTraining_intTrainingId",
                table: "tblEmployeeTraining");

            migrationBuilder.DropIndex(
                name: "IX_tblEmployeeTraining_tblEmployeeintEmployeeId",
                table: "tblEmployeeTraining");

            migrationBuilder.DropIndex(
                name: "IX_tblEmployee_intEmployeeManagerId",
                table: "tblEmployee");

            migrationBuilder.DropIndex(
                name: "IX_tblEmployee_tblClassificationintClassificationId",
                table: "tblEmployee");

            migrationBuilder.DropIndex(
                name: "IX_tblEmployee_tblDepartmentintDepartmentId",
                table: "tblEmployee");

            migrationBuilder.DropColumn(
                name: "tblEmployeeintEmployeeId",
                table: "tblUserLog");

            migrationBuilder.DropColumn(
                name: "tblEmployeeintEmployeeId",
                table: "tblUserAccount");

            migrationBuilder.DropColumn(
                name: "bitIsSpecial",
                table: "tblTraining");

            migrationBuilder.DropColumn(
                name: "intTrainingDuration",
                table: "tblTraining");

            migrationBuilder.DropColumn(
                name: "intTrainingFrequency",
                table: "tblTraining");

            migrationBuilder.DropColumn(
                name: "tblEmployeeintEmployeeId",
                table: "tblEmployeeTraining");

            migrationBuilder.DropColumn(
                name: "tblClassificationintClassificationId",
                table: "tblEmployee");

            migrationBuilder.DropColumn(
                name: "tblDepartmentintDepartmentId",
                table: "tblEmployee");

            migrationBuilder.AlterColumn<string>(
                name: "bitIsActive",
                table: "tblUserAccount",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AddColumn<string>(
                name: "strTrainingDuration",
                table: "tblTraining",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "intEmployeeManagerId",
                table: "tblEmployee",
                type: "int",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

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
    }
}
