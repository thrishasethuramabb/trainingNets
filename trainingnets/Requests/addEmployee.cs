using trainingnets.Models;

namespace trainingnets.Requests
{
    public class addEmployee
    {
        public string fname { get; set; }
        public string lname { get; set; }

        public long empId { get; set; }

        public long intEmployeeBarcode {  get; set; }
        public string department { get; set; }
        public string role { get; set; }

        public bool isActive { get; set; }

        public DateTime orientationDate { get; set; }
        




    }
    public class editEmployee
    {
        public string strEmployeeFirstName { get; set; }
        public string strEmployeeLastName { get; set; }
        public int intEmployeeId { get; set; }
        public int intClassificationId { get; set; }
        public int intDepartmentId { get; set; }
        public bool isActive { get; set; }
        public DateTime? orientationDate { get; set; }
    }
}
