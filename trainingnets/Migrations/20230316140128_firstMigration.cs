using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace trainingnets.Migrations
{
    /// <inheritdoc />
    public partial class firstMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "tblClassification",
                columns: table => new
                {
                    intClassificationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    strClassificationName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblClassification", x => x.intClassificationId);
                });

            migrationBuilder.CreateTable(
                name: "tblDepartment",
                columns: table => new
                {
                    intDepartmentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    strDepartmentName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblDepartment", x => x.intDepartmentId);
                });

            migrationBuilder.CreateTable(
                name: "tblEmployee",
                columns: table => new
                {
                    intEmployeeId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    strEmployeeFirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    strEmployeeLastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    bitIsActive = table.Column<bool>(type: "bit", nullable: false),
                    intEmployeeManagerId = table.Column<int>(type: "int", nullable: true),
                    intClassificationId = table.Column<int>(type: "int", nullable: false),
                    intDepartmentId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblEmployee", x => x.intEmployeeId);
                });

            migrationBuilder.CreateTable(
                name: "tblEmployeeTraining",
                columns: table => new
                {
                    intEmployeeId = table.Column<int>(type: "int", nullable: false),
                    intTrainingId = table.Column<int>(type: "int", nullable: false),
                    bitIsComplete = table.Column<bool>(type: "bit", nullable: false),
                    dtCompletionDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblEmployeeTraining", x => new { x.intEmployeeId, x.intTrainingId });
                });

            migrationBuilder.CreateTable(
                name: "tblTraining",
                columns: table => new
                {
                    intTrainingId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    strTrainingName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    dtTrainingDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    dtTrainingDuration = table.Column<DateTime>(type: "datetime2", nullable: false),
                    bitTrainingIsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblTraining", x => x.intTrainingId);
                });

            migrationBuilder.CreateTable(
                name: "tblUserAccount",
                columns: table => new
                {
                    sttUsername = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    intEmployeeId = table.Column<long>(type: "bigint", nullable: false),
                    strPassword = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblUserAccount", x => x.sttUsername);
                });

            migrationBuilder.CreateTable(
                name: "tblUserLog",
                columns: table => new
                {
                    intUserLogId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    intEmployeeId = table.Column<long>(type: "bigint", nullable: false),
                    strDeviceAddress = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    dtTimeAccessed = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblUserLog", x => x.intUserLogId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tblClassification");

            migrationBuilder.DropTable(
                name: "tblDepartment");

            migrationBuilder.DropTable(
                name: "tblEmployee");

            migrationBuilder.DropTable(
                name: "tblEmployeeTraining");

            migrationBuilder.DropTable(
                name: "tblTraining");

            migrationBuilder.DropTable(
                name: "tblUserAccount");

            migrationBuilder.DropTable(
                name: "tblUserLog");
        }
    }
}
