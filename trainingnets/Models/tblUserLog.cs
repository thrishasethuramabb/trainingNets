using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace trainingnets.Models
{
    public class tblUserLog
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int intUserLogId { get; set; }
        [Required]
        [ForeignKey("tblEmployee")]
        public long intEmployeeId { get; set; }
        public virtual tblEmployee tblEmployee { get; set; }
        [Required]
        public string strDeviceAddress { get; set; }=String.Empty;
        [Required]
        public DateTime dtTimeAccessed { get; set; }
    }
}
