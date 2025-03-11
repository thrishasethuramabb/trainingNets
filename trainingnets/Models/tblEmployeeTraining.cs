using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace trainingnets.Models
{
    public class tblEmployeeTraining
    {
        [Key]
        [Required]
        [Column(Order = 1)]
        public long intEmployeeId { get; set; }

        [ForeignKey("intEmployeeId")]
        public virtual tblEmployee? tblEmployee { get; set; }

        [Key]
        [Required]
        [Column(Order = 2)]
        public int intTrainingId { get; set; }

        [ForeignKey("intTrainingId")]
        public virtual tblTraining? tblTraining { get; set; }


        [Required]
        public bool bitIsComplete { get; set; }

        public DateTime? dtCompletionDate { get; set; }




    }
}