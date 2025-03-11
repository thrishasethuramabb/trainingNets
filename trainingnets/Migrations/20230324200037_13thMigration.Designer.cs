﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using trainingnets.Data;

#nullable disable

namespace trainingnets.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20230324200037_13thMigration")]
    partial class _13thMigration
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("trainingnets.Models.tblClassification", b =>
                {
                    b.Property<int>("intClassificationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("intClassificationId"));

                    b.Property<string>("strClassificationName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("intClassificationId");

                    b.ToTable("tblClassification");
                });

            modelBuilder.Entity("trainingnets.Models.tblDepartment", b =>
                {
                    b.Property<int>("intDepartmentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("intDepartmentId"));

                    b.Property<bool>("bitIsActive")
                        .HasColumnType("bit");

                    b.Property<string>("strDepartmentName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("intDepartmentId");

                    b.ToTable("tblDepartment");
                });

            modelBuilder.Entity("trainingnets.Models.tblEmployee", b =>
                {
                    b.Property<long>("intEmployeeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("intEmployeeId"));

                    b.Property<bool>("bitIsActive")
                        .HasColumnType("bit");

                    b.Property<DateTime?>("dtOrientationDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("intClassificationId")
                        .HasColumnType("int");

                    b.Property<int>("intDepartmentId")
                        .HasColumnType("int");

                    b.Property<long?>("intEmployeeManagerId")
                        .HasColumnType("bigint");

                    b.Property<string>("strEmployeeFirstName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("strEmployeeLastName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("intEmployeeId");

                    b.HasIndex("intClassificationId");

                    b.HasIndex("intDepartmentId");

                    b.HasIndex("intEmployeeManagerId");

                    b.ToTable("tblEmployee");
                });

            modelBuilder.Entity("trainingnets.Models.tblEmployeeTraining", b =>
                {
                    b.Property<int>("intTrainingId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("intTrainingId"));

                    b.Property<bool>("bitIsComplete")
                        .HasColumnType("bit");

                    b.Property<DateTime>("dtCompletionDate")
                        .HasColumnType("datetime2");

                    b.Property<long?>("tblEmployeeintEmployeeId")
                        .HasColumnType("bigint");

                    b.Property<int>("tblTrainingintTrainingId")
                        .HasColumnType("int");

                    b.HasKey("intTrainingId");

                    b.HasIndex("tblEmployeeintEmployeeId");

                    b.HasIndex("tblTrainingintTrainingId");

                    b.ToTable("tblEmployeeTraining");
                });

            modelBuilder.Entity("trainingnets.Models.tblTraining", b =>
                {
                    b.Property<int>("intTrainingId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("intTrainingId"));

                    b.Property<bool>("bitIsSpecial")
                        .HasColumnType("bit");

                    b.Property<bool>("bitTrainingIsActive")
                        .HasColumnType("bit");

                    b.Property<DateTime>("dtTrainingDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("intTrainingDuration")
                        .HasColumnType("int");

                    b.Property<int>("intTrainingFrequency")
                        .HasColumnType("int");

                    b.Property<string>("strTrainingName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("intTrainingId");

                    b.ToTable("tblTraining");
                });

            modelBuilder.Entity("trainingnets.Models.tblTrainingDepartment", b =>
                {
                    b.Property<int>("intTrainingId")
                        .HasColumnType("int");

                    b.Property<int>("intDepartmentId")
                        .HasColumnType("int");

                    b.HasKey("intTrainingId", "intDepartmentId");

                    b.HasIndex("intDepartmentId");

                    b.ToTable("tblTrainingDepartment");
                });

            modelBuilder.Entity("trainingnets.Models.tblTrainingLog", b =>
                {
                    b.Property<int>("intTrainingLog")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("intTrainingLog"));

                    b.Property<DateTime>("dtTimeAccessed")
                        .HasColumnType("datetime2");

                    b.Property<long>("intEmployeeId")
                        .HasColumnType("bigint");

                    b.Property<int>("intTrainingId")
                        .HasColumnType("int");

                    b.Property<string>("strAction")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("strDeviceAddress")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("intTrainingLog");

                    b.HasIndex("intEmployeeId");

                    b.HasIndex("intTrainingId");

                    b.ToTable("tblTrainingLog");
                });

            modelBuilder.Entity("trainingnets.Models.tblUserAccount", b =>
                {
                    b.Property<string>("sttUsername")
                        .HasColumnType("nvarchar(450)");

                    b.Property<bool>("bitIsActive")
                        .HasColumnType("bit");

                    b.Property<long>("intEmployeeId")
                        .HasColumnType("bigint");

                    b.Property<string>("strPassword")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("sttUsername");

                    b.HasIndex("intEmployeeId");

                    b.ToTable("tblUserAccount");
                });

            modelBuilder.Entity("trainingnets.Models.tblUserLog", b =>
                {
                    b.Property<int>("intUserLogId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("intUserLogId"));

                    b.Property<DateTime>("dtTimeAccessed")
                        .HasColumnType("datetime2");

                    b.Property<long>("intEmployeeId")
                        .HasColumnType("bigint");

                    b.Property<string>("strDeviceAddress")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("intUserLogId");

                    b.HasIndex("intEmployeeId");

                    b.ToTable("tblUserLog");
                });

            modelBuilder.Entity("trainingnets.Models.tblEmployee", b =>
                {
                    b.HasOne("trainingnets.Models.tblClassification", "tblClassification")
                        .WithMany("tblEmployee")
                        .HasForeignKey("intClassificationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("trainingnets.Models.tblDepartment", "tblDepartment")
                        .WithMany("tblEmployee")
                        .HasForeignKey("intDepartmentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("trainingnets.Models.tblEmployee", "Manager")
                        .WithMany("Employee")
                        .HasForeignKey("intEmployeeManagerId");

                    b.Navigation("Manager");

                    b.Navigation("tblClassification");

                    b.Navigation("tblDepartment");
                });

            modelBuilder.Entity("trainingnets.Models.tblEmployeeTraining", b =>
                {
                    b.HasOne("trainingnets.Models.tblEmployee", null)
                        .WithMany("tblEmployeeTraining")
                        .HasForeignKey("tblEmployeeintEmployeeId");

                    b.HasOne("trainingnets.Models.tblTraining", "tblTraining")
                        .WithMany("tblEmployeeTraining")
                        .HasForeignKey("tblTrainingintTrainingId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("tblTraining");
                });

            modelBuilder.Entity("trainingnets.Models.tblTrainingDepartment", b =>
                {
                    b.HasOne("trainingnets.Models.tblDepartment", "tblDepartment")
                        .WithMany()
                        .HasForeignKey("intDepartmentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("trainingnets.Models.tblTraining", "tblTraining")
                        .WithMany("tblTrainingDepartment")
                        .HasForeignKey("intTrainingId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("tblDepartment");

                    b.Navigation("tblTraining");
                });

            modelBuilder.Entity("trainingnets.Models.tblTrainingLog", b =>
                {
                    b.HasOne("trainingnets.Models.tblEmployee", "tblEmployee")
                        .WithMany()
                        .HasForeignKey("intEmployeeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("trainingnets.Models.tblTraining", "tblTraining")
                        .WithMany("tblTrainingLog")
                        .HasForeignKey("intTrainingId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("tblEmployee");

                    b.Navigation("tblTraining");
                });

            modelBuilder.Entity("trainingnets.Models.tblUserAccount", b =>
                {
                    b.HasOne("trainingnets.Models.tblEmployee", "tblEmployee")
                        .WithMany("tblUserAccount")
                        .HasForeignKey("intEmployeeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("tblEmployee");
                });

            modelBuilder.Entity("trainingnets.Models.tblUserLog", b =>
                {
                    b.HasOne("trainingnets.Models.tblEmployee", "tblEmployee")
                        .WithMany("tblUserLog")
                        .HasForeignKey("intEmployeeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("tblEmployee");
                });

            modelBuilder.Entity("trainingnets.Models.tblClassification", b =>
                {
                    b.Navigation("tblEmployee");
                });

            modelBuilder.Entity("trainingnets.Models.tblDepartment", b =>
                {
                    b.Navigation("tblEmployee");
                });

            modelBuilder.Entity("trainingnets.Models.tblEmployee", b =>
                {
                    b.Navigation("Employee");

                    b.Navigation("tblEmployeeTraining");

                    b.Navigation("tblUserAccount");

                    b.Navigation("tblUserLog");
                });

            modelBuilder.Entity("trainingnets.Models.tblTraining", b =>
                {
                    b.Navigation("tblEmployeeTraining");

                    b.Navigation("tblTrainingDepartment");

                    b.Navigation("tblTrainingLog");
                });
#pragma warning restore 612, 618
        }
    }
}
