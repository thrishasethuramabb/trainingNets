using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace trainingnets.Models
{
    public class tblEmployee
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public long intEmployeeId { get; set; }

        [Required]
        public string strEmployeeFirstName { get; set; } = String.Empty;

        [Required]
        public string strEmployeeLastName { get; set; } = String.Empty;

        public long? intEmployeeBarcode { get; set; }

        [Required]
        public bool bitIsActive { get; set; }

        [ForeignKey("Manager")]
        public long? intEmployeeManagerId { get; set; }
        public virtual tblEmployee? Manager { get; set; }

        [Required]
        [ForeignKey("tblClassification")]
        public int intClassificationId { get; set; }
        public virtual tblClassification? tblClassification { get; set; }

        public DateTime? dtOrientationDate { get; set; }

        [Required]
        [ForeignKey("tblDepartment")]
        public int intDepartmentId { get; set; }
        public virtual tblDepartment? tblDepartment { get; set; }


        public virtual tblUserAccount? tblUserAccount { get; set; }





    }
}