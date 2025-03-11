using System.Diagnostics.Eventing.Reader;

namespace trainingnets.Requests
{
    public class Signup
    {
        public string username { get; set; }= String.Empty;
        public string password { get; set; } = String.Empty;
        public long empId { get; set; }

        public string role { get; set; }=String.Empty;
    }
}
