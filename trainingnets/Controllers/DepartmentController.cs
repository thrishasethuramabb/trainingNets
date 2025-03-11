using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Update;
using trainingnets.Data;
using trainingnets.Models;
using trainingnets.Requests;
using trainingnets.Services;

namespace trainingnets.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DepartmentController : ControllerBase
    {
        private readonly DataContext _dataContext;
        private readonly JwtAuthenticationManager jwtAuthenticationManager;

        public DepartmentController(DataContext dataContext, JwtAuthenticationManager jwtAuthenticationManager)
        {
            _dataContext = dataContext;
            this.jwtAuthenticationManager = jwtAuthenticationManager;
        }


        //admin
        [HttpGet("current/status")]
        public async Task<IActionResult> getCurrentStatus()
        {
            int currentMonth = System.DateTime.Now.Month;

            var status = await _dataContext.tblEmployeeTraining
                .Where(t => t.tblTraining.dtTrainingDate.Month == currentMonth &&
                            t.tblTraining.bitTrainingIsActive &&
                            t.tblEmployee.bitIsActive)
                .GroupBy(t => t.tblEmployee.tblDepartment)
                .Select(deptGroup => new
                {
                    Department = new
                    {
                        deptGroup.Key.intDepartmentId,
                        deptGroup.Key.strDepartmentName
                    },
                    Trainings = deptGroup
                        .GroupBy(t => t.tblTraining)
                        .Select(trainingGroup => new
                        {
                            Training = new
                            {
                                trainingGroup.Key.intTrainingId,
                                trainingGroup.Key.strTrainingName,
                                trainingGroup.Key.dtTrainingDate,
                                trainingGroup.Key.intTrainingDuration,
                                trainingGroup.Key.intTrainingFrequency,
                                trainingGroup.Key.bitIsSpecial,
                                trainingGroup.Key.bitTrainingIsActive
                            },
                            Completed = trainingGroup.Where(c => c.bitIsComplete)
                                .Select(c => new
                                {
                                    c.intEmployeeId,
                                    EmployeeName = c.tblEmployee.strEmployeeFirstName + " " + c.tblEmployee.strEmployeeLastName,
                                    c.dtCompletionDate
                                }).ToList(),
                            Incomplete = trainingGroup.Where(c => !c.bitIsComplete)
                                .Select(c => new
                                {
                                    c.intEmployeeId,
                                    EmployeeName = c.tblEmployee.strEmployeeFirstName + " " + c.tblEmployee.strEmployeeLastName,
                                    c.dtCompletionDate
                                }).ToList(),
                            TotalCount = trainingGroup.Count(),
                            CompletedCount = trainingGroup.Count(c => c.bitIsComplete)
                        }).ToList()
                })
                .ToListAsync();

            if (status == null || !status.Any())
            {
                return NotFound("No training data available");
            }

            return Ok(status);
        }





        //admin
        [HttpGet("all/status")]
        public async Task<IActionResult> getStatus()
        {
            //getting all the active trainings for current month with their status=>grouping them by trainings to get status associated with a specific training
            var status = await _dataContext.tblEmployeeTraining.Where(t => t.tblTraining.bitTrainingIsActive == true && t.tblEmployee.bitIsActive == true).GroupBy(t => t.tblEmployee.tblDepartment)
                .Select(group => new TrainingStatus
                {
                    tblDepartment = group.Key,
                    stats = group.GroupBy(g => g.tblTraining)
                    .Select(s => new TrainingStatus
                    {
                        tbltraining = s.Key,
                        completed = s.Where(c => c.bitIsComplete == true).ToList(),
                        incomplete = s.Where(c => c.bitIsComplete != true).ToList(),
                        status = s.ToList()
                    }).ToList()

                }).ToListAsync();
            if (status == null)
            {
                return BadRequest("Not Found");
            };
            return Ok(status);
        }


        //adds a new department to the table
        [HttpPost("new")]
        public async Task<IActionResult> AddDepartment([FromBody] tblDepartment department)
        {
            // Check if the department already exists in the database
            var existingDepartment = await _dataContext.tblDepartment
                .FirstOrDefaultAsync(d => d.strDepartmentName == department.strDepartmentName);
            if (existingDepartment != null)
            {
                // Return an error message if the department already exists
                return BadRequest("Department already exists.");
            }
            // Add the new department if it doesn't exist
            await _dataContext.tblDepartment.AddAsync(department);
            await _dataContext.SaveChangesAsync();
            return Ok(department);
        }


        //gets all the active deaprtments from tblDepartment table
        [Authorize]
        [HttpGet("all")]
        public  JsonResult getAllADepartments()
        {
            return new JsonResult( _dataContext.tblDepartment);

        }

        
        //gets all the active departments
        [HttpGet("active")]
        public async Task<IActionResult> getActiveDepartments()
        {
            var departments = _dataContext.tblDepartment.Where(t => t.bitIsActive == true);

            if (departments == null)
            {
                return BadRequest("Employee not found!");
            }

            return Ok(departments);

        }



        //gets the id of updating department and overrides the other fields
        [HttpPut("{id}")]
        public async Task<IActionResult> update(tblDepartment department, [FromRoute] int id)
        {

            var updated = await getDepartmentByID(id);
            if (updated == null)
            {
                return BadRequest("Department not found!");
            }

            updated.strDepartmentName = department.strDepartmentName;
            updated.bitIsActive = department.bitIsActive;
            await _dataContext.SaveChangesAsync();
            return Ok(updated);

        }

        

        //deactivates the training
        [HttpPut("deactivate/{id}")]
        public async Task<IActionResult> deactivate([FromRoute] int id)
        {
            var department = await getDepartmentByID(id);
            if (department == null)
            {
                return BadRequest("training not found!");
            }
            department.bitIsActive = false;
            await _dataContext.SaveChangesAsync();
            return Ok(department);
        }

        //gets department by its id
        [HttpGet("byId")]
        public async Task<tblDepartment> getDepartmentByID(int id)
        {
            var department = await _dataContext.tblDepartment.FindAsync(id);

            if (department == null)
            {
                throw new Exception("Employee not found!");
            }

            return department;
        }

    }



}
