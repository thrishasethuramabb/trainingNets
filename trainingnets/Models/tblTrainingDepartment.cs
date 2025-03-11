using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace trainingnets.Models
{
    public class tblTrainingDepartment
    {
        [Key]
        [Required]
        [Column(Order = 1)]
        public int intTrainingId { get; set; }

        [Key]
        [Required]
        [Column(Order = 2)]
        public int intDepartmentId { get; set; }

        [ForeignKey("intTrainingId")]
        public virtual tblTraining? tblTraining { get; set; }

        [ForeignKey("intDepartmentId")]
        public virtual tblDepartment? tblDepartment { get; set; }
    }
}
