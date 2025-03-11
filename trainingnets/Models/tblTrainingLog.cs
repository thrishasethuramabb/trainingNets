using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace trainingnets.Models
{
    public class tblTrainingLog
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        public int intTrainingLog { get; set; }

        [Required]
        [ForeignKey("tblTraining")]
        public int intTrainingId {  get; set; }
        public virtual tblTraining tblTraining { get; set; }
        [Required]
        [ForeignKey("tblEmployee")]
        public long intEmployeeId { get; set; }
        public virtual tblEmployee tblEmployee { get; set; }

        [Required]
        public string strAction { get; set; }

        [Required]
        public string strDeviceAddress { get; set; } = String.Empty;

        [Required]
        public DateTime dtTimeAccessed { get; set; }
    }
}
