using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;

namespace trainingnets.Models
{
    public class tblTraining
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int intTrainingId { get; set; }
        [Required]
        public string strTrainingName { get; set; } = String.Empty;
        [Required]
        public DateTime dtTrainingDate { get; set; }

        [Required]
        public int intTrainingDuration { get; set; }

        [Required]
        public int intTrainingFrequency { get; set; }

        [Required]
        public bool bitTrainingIsActive { get; set; }

        [Required]
        public bool bitIsSpecial { get; set; }

        public virtual ICollection<tblTrainingDepartment>? trainingDepartment { get; set; }

        public virtual ICollection<tblEmployeeTraining>? trainingEmployee { get; set; }


    }
}
