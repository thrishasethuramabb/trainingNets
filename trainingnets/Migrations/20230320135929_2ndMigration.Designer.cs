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
    [Migration("20230320135929_2ndMigration")]
    partial class _2ndMigration
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.0-preview.2.23128.3")
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

                    b.Property<int>("intClassificationId")
                        .HasColumnType("int");

                    b.Property<int>("intDepartmentId")
                        .HasColumnType("int");

                    b.Property<int?>("intEmployeeManagerId")
                        .HasColumnType("int");

                    b.Property<string>("strEmployeeFirstName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("strEmployeeLastName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("intEmployeeId");

                    b.ToTable("tblEmployee");
                });

            modelBuilder.Entity("trainingnets.Models.tblEmployeeTraining", b =>
                {
                    b.Property<int>("intEmployeeId")
                        .HasColumnType("int");

                    b.Property<int>("intTrainingId")
                        .HasColumnType("int");

                    b.Property<bool>("bitIsComplete")
                        .HasColumnType("bit");

                    b.Property<DateOnly>("dtCompletionDate")
                        .HasColumnType("date");

                    b.HasKey("intEmployeeId", "intTrainingId");

                    b.ToTable("tblEmployeeTraining");
                });

            modelBuilder.Entity("trainingnets.Models.tblTraining", b =>
                {
                    b.Property<int>("intTrainingId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("intTrainingId"));

                    b.Property<bool>("bitTrainingIsActive")
                        .HasColumnType("bit");

                    b.Property<TimeOnly>("dtTrainingDuration")
                        .HasColumnType("time");

                    b.Property<string>("strTrainingName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateOnly>("trainingDate")
                        .HasColumnType("date");

                    b.HasKey("intTrainingId");

                    b.ToTable("tblTraining");
                });

            modelBuilder.Entity("trainingnets.Models.tblUserAccount", b =>
                {
                    b.Property<string>("sttUsername")
                        .HasColumnType("nvarchar(450)");

                    b.Property<long>("intEmployeeId")
                        .HasColumnType("bigint");

                    b.Property<string>("strPassword")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("sttUsername");

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

                    b.ToTable("tblUserLog");
                });
#pragma warning restore 612, 618
        }
    }
}
