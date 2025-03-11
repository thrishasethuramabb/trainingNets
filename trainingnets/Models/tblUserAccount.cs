using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace trainingnets.Models
{
    public class tblUserAccount
    {
        [Key]
        public string strUsername { get; set; }

        [Required]
        [ForeignKey("tblEmployee")]
        public long intEmployeeId { get; set; }
        public virtual tblEmployee? tblEmployee { get; set; }

        [Required]
        public string strPassword { get; set; }

        [Required]
        public bool bitIsActive { get; set; }

        

    }

}
