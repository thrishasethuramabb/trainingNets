using trainingnets.Models;

namespace trainingnets.Requests
{
    public class TrainingStatus
    {
        public List<tblEmployeeTraining> completed {get;set;}
        public List<tblEmployeeTraining> incomplete { get;set;}
        public tblTraining tbltraining { get;set;}
        public tblEmployee tblEmployee { get;set;}
        public List<tblEmployeeTraining> status { get;set;}

        public List<TrainingStatus> stats { get;set;}

        public tblDepartment tblDepartment { get;set;}



        
    }
}
