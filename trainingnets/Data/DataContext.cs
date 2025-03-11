using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System.Reflection.Emit;
using trainingnets.Models;
using trainingnets.Services;
using TinyHelpers.EntityFrameworkCore.Extensions;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;

namespace trainingnets.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {



        }



        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<tblEmployeeTraining>().HasKey(table => new
            {
                table.intEmployeeId,
                table.intTrainingId,
            });



            builder.Entity<tblTrainingDepartment>().HasKey(table => new
            {
                table.intTrainingId,
                table.intDepartmentId,
            });


        }

        public DbSet<tblEmployee> tblEmployee { get; set; }
        public DbSet<tblClassification> tblClassification { get; set; }
        public DbSet<tblDepartment> tblDepartment { get; set; }
        public DbSet<tblEmployeeTraining> tblEmployeeTraining { get; set; }
        public DbSet<tblTraining> tblTraining { get; set; }
        public DbSet<tblUserAccount> tblUserAccount { get; set; }
        public DbSet<tblUserLog> tblUserLog { get; set; }
        public DbSet<tblTrainingDepartment> tblTrainingDepartment { get; set; }
        public DbSet<tblTrainingLog> tblTrainingLog { get; set; }



    }
}