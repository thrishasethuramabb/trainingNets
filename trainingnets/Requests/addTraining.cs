using trainingnets.Models;

namespace trainingnets.Requests
{
    public class addTraining
    {
        public string name { get; set; }
        public int duration { get; set; }
        public int frequency { get; set; }
        public bool isActive { get; set; }
        public bool isSpecial { get; set; }
        public List<tblDepartment>? departments { get; set; }

        public List<int>? departmentIds { get; set; }

        public DateTime date { get; set; }


    }
}
