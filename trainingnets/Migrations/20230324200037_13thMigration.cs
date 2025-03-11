using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace trainingnets.Migrations
{
    /// <inheritdoc />
    public partial class _13thMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tblEmployee_tblClassification_tblClassificationintClassificationId",
                table: "tblEmployee");

            migrationBuilder.DropForeignKey(
                name: "FK_tblEmployee_tblDepartment_tblDepartmentintDepartmentId",
                table: "tblEmployee");

            migrationBuilder.DropForeignKey(
                name: "FK_tblEmployeeTraining_tblEmployee_tblEmployeeintEmployeeId",
                table: "tblEmployeeTraining");

            migrationBuilder.DropForeignKey(
                name: "FK_tblEmployeeTraining_tblTraining_intTrainingId",
                table: "tblEmployeeTraining");

            migrationBuilder.DropForeignKey(
                name: "FK_tblTrainingLog_tblEmployee_tblEmployeeintEmployeeId",
                table: "tblTrainingLog");

            migrationBuilder.DropForeignKey(
                name: "FK_tblTrainingLog_tblTraining_tblTrainingintTrainingId",
                table: "tblTrainingLog");

            migrationBuilder.DropForeignKey(
                name: "FK_tblUserAccount_tblEmployee_tblEmployeeintEmployeeId",
                table: "tblUserAccount");

            migrationBuilder.DropForeignKey(
                name: "FK_tblUserLog_tblEmployee_tblEmployeeintEmployeeId",
                table: "tblUserLog");

            migrationBuilder.DropIndex(
                name: "IX_tblUserLog_tblEmployeeintEmployeeId",
                table: "tblUserLog");

            migrationBuilder.DropIndex(
                name: "IX_tblUserAccount_tblEmployeeintEmployeeId",
                table: "tblUserAccount");

            migrationBuilder.DropIndex(
                name: "IX_tblTrainingLog_tblEmployeeintEmployeeId",
                table: "tblTrainingLog");

            migrationBuilder.DropIndex(
                name: "IX_tblTrainingLog_tblTrainingintTrainingId",
                table: "tblTrainingLog");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tblEmployeeTraining",
                table: "tblEmployeeTraining");

            migrationBuilder.DropIndex(
                name: "IX_tblEmployeeTraining_intTrainingId",
                table: "tblEmployeeTraining");

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
                name: "tblEmployeeintEmployeeId",
                table: "tblTrainingLog");

            migrationBuilder.DropColumn(
                name: "tblTrainingintTrainingId",
                table: "tblTrainingLog");

            migrationBuilder.DropColumn(
                name: "tblClassificationintClassificationId",
                table: "tblEmployee");

            migrationBuilder.DropColumn(
                name: "tblDepartmentintDepartmentId",
                table: "tblEmployee");

            migrationBuilder.RenameColumn(
                name: "intEmployeeId",
                table: "tblEmployeeTraining",
                newName: "tblTrainingintTrainingId");

            migrationBuilder.AlterColumn<long>(
                name: "tblEmployeeintEmployeeId",
                table: "tblEmployeeTraining",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

           
            migrationBuilder.AddPrimaryKey(
                name: "PK_tblEmployeeTraining",
                table: "tblEmployeeTraining",
                column: "intTrainingId");

            migrationBuilder.CreateIndex(
                name: "IX_tblUserLog_intEmployeeId",
                table: "tblUserLog",
                column: "intEmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_tblUserAccount_intEmployeeId",
                table: "tblUserAccount",
                column: "intEmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_tblTrainingLog_intEmployeeId",
                table: "tblTrainingLog",
                column: "intEmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_tblTrainingLog_intTrainingId",
                table: "tblTrainingLog",
                column: "intTrainingId");

            migrationBuilder.CreateIndex(
                name: "IX_tblEmployeeTraining_tblTrainingintTrainingId",
                table: "tblEmployeeTraining",
                column: "tblTrainingintTrainingId");

            migrationBuilder.CreateIndex(
                name: "IX_tblEmployee_intClassificationId",
                table: "tblEmployee",
                column: "intClassificationId");

            migrationBuilder.CreateIndex(
                name: "IX_tblEmployee_intDepartmentId",
                table: "tblEmployee",
                column: "intDepartmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_tblEmployee_tblClassification_intClassificationId",
                table: "tblEmployee",
                column: "intClassificationId",
                principalTable: "tblClassification",
                principalColumn: "intClassificationId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_tblEmployee_tblDepartment_intDepartmentId",
                table: "tblEmployee",
                column: "intDepartmentId",
                principalTable: "tblDepartment",
                principalColumn: "intDepartmentId",
                onDelete: ReferentialAction.Cascade);

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

            migrationBuilder.AddForeignKey(
                name: "FK_tblTrainingLog_tblEmployee_intEmployeeId",
                table: "tblTrainingLog",
                column: "intEmployeeId",
                principalTable: "tblEmployee",
                principalColumn: "intEmployeeId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_tblTrainingLog_tblTraining_intTrainingId",
                table: "tblTrainingLog",
                column: "intTrainingId",
                principalTable: "tblTraining",
                principalColumn: "intTrainingId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_tblUserAccount_tblEmployee_intEmployeeId",
                table: "tblUserAccount",
                column: "intEmployeeId",
                principalTable: "tblEmployee",
                principalColumn: "intEmployeeId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_tblUserLog_tblEmployee_intEmployeeId",
                table: "tblUserLog",
                column: "intEmployeeId",
                principalTable: "tblEmployee",
                principalColumn: "intEmployeeId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tblEmployee_tblClassification_intClassificationId",
                table: "tblEmployee");

            migrationBuilder.DropForeignKey(
                name: "FK_tblEmployee_tblDepartment_intDepartmentId",
                table: "tblEmployee");

            migrationBuilder.DropForeignKey(
                name: "FK_tblEmployeeTraining_tblEmployee_tblEmployeeintEmployeeId",
                table: "tblEmployeeTraining");

            migrationBuilder.DropForeignKey(
                name: "FK_tblEmployeeTraining_tblTraining_tblTrainingintTrainingId",
                table: "tblEmployeeTraining");

            migrationBuilder.DropForeignKey(
                name: "FK_tblTrainingLog_tblEmployee_intEmployeeId",
                table: "tblTrainingLog");

            migrationBuilder.DropForeignKey(
                name: "FK_tblTrainingLog_tblTraining_intTrainingId",
                table: "tblTrainingLog");

            migrationBuilder.DropForeignKey(
                name: "FK_tblUserAccount_tblEmployee_intEmployeeId",
                table: "tblUserAccount");

            migrationBuilder.DropForeignKey(
                name: "FK_tblUserLog_tblEmployee_intEmployeeId",
                table: "tblUserLog");

            migrationBuilder.DropIndex(
                name: "IX_tblUserLog_intEmployeeId",
                table: "tblUserLog");

            migrationBuilder.DropIndex(
                name: "IX_tblUserAccount_intEmployeeId",
                table: "tblUserAccount");

            migrationBuilder.DropIndex(
                name: "IX_tblTrainingLog_intEmployeeId",
                table: "tblTrainingLog");

            migrationBuilder.DropIndex(
                name: "IX_tblTrainingLog_intTrainingId",
                table: "tblTrainingLog");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tblEmployeeTraining",
                table: "tblEmployeeTraining");

            migrationBuilder.DropIndex(
                name: "IX_tblEmployeeTraining_tblTrainingintTrainingId",
                table: "tblEmployeeTraining");

            migrationBuilder.DropIndex(
                name: "IX_tblEmployee_intClassificationId",
                table: "tblEmployee");

            migrationBuilder.DropIndex(
                name: "IX_tblEmployee_intDepartmentId",
                table: "tblEmployee");

            migrationBuilder.RenameColumn(
                name: "tblTrainingintTrainingId",
                table: "tblEmployeeTraining",
                newName: "intEmployeeId");

            migrationBuilder.AddColumn<long>(
                name: "tblEmployeeintEmployeeId",
                table: "tblUserLog",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "tblEmployeeintEmployeeId",
                table: "tblUserAccount",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "tblEmployeeintEmployeeId",
                table: "tblTrainingLog",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<int>(
                name: "tblTrainingintTrainingId",
                table: "tblTrainingLog",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<long>(
                name: "tblEmployeeintEmployeeId",
                table: "tblEmployeeTraining",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
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

            migrationBuilder.AddPrimaryKey(
                name: "PK_tblEmployeeTraining",
                table: "tblEmployeeTraining",
                columns: new[] { "intEmployeeId", "intTrainingId" });

            migrationBuilder.CreateIndex(
                name: "IX_tblUserLog_tblEmployeeintEmployeeId",
                table: "tblUserLog",
                column: "tblEmployeeintEmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_tblUserAccount_tblEmployeeintEmployeeId",
                table: "tblUserAccount",
                column: "tblEmployeeintEmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_tblTrainingLog_tblEmployeeintEmployeeId",
                table: "tblTrainingLog",
                column: "tblEmployeeintEmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_tblTrainingLog_tblTrainingintTrainingId",
                table: "tblTrainingLog",
                column: "tblTrainingintTrainingId");

            migrationBuilder.CreateIndex(
                name: "IX_tblEmployeeTraining_intTrainingId",
                table: "tblEmployeeTraining",
                column: "intTrainingId");

            migrationBuilder.CreateIndex(
                name: "IX_tblEmployee_tblClassificationintClassificationId",
                table: "tblEmployee",
                column: "tblClassificationintClassificationId");

            migrationBuilder.CreateIndex(
                name: "IX_tblEmployee_tblDepartmentintDepartmentId",
                table: "tblEmployee",
                column: "tblDepartmentintDepartmentId");

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
                name: "FK_tblTrainingLog_tblEmployee_tblEmployeeintEmployeeId",
                table: "tblTrainingLog",
                column: "tblEmployeeintEmployeeId",
                principalTable: "tblEmployee",
                principalColumn: "intEmployeeId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_tblTrainingLog_tblTraining_tblTrainingintTrainingId",
                table: "tblTrainingLog",
                column: "tblTrainingintTrainingId",
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
    }
}
