using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace trainingnets.Models
{
    public class tblClassification
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        public int intClassificationId { get; set; }
        [Required]
        public string strClassificationName { get; set; } = String.Empty;

        

    }
}
