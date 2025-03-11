using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace trainingnets.Models
{
    public class tblDepartment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int intDepartmentId { get; set; }

        [Required]
        public string strDepartmentName { get; set; } = String.Empty;

        [Required]
        public bool bitIsActive { get; set; }

        public virtual ICollection<tblEmployee>? employees { get; set; }

       
    }
}
