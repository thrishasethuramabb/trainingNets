using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Transactions;
using trainingnets.Data;
using trainingnets.Models;
using trainingnets.Requests;
using OfficeOpenXml;
using System.IO;

namespace trainingnets.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EmployeeController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public EmployeeController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        //adds a new employee to the table
        [HttpPost("new")]
        public async Task<IActionResult> addEmployee([FromBody] addEmployee emp)
        {
            // Check if employee ID already exists
            var existingEmployee = await _dataContext.tblEmployee
                .FirstOrDefaultAsync(e => e.intEmployeeId == emp.empId);
            if (existingEmployee != null)
            {
                return BadRequest("Employee with this ID already exists.");
            }

            // Create a new employee instance
            tblEmployee employee = new tblEmployee
            {
                intEmployeeId = emp.empId,
                strEmployeeFirstName = emp.fname,
                strEmployeeLastName = emp.lname,
                bitIsActive = emp.isActive,
                dtOrientationDate = emp.orientationDate,
                intEmployeeBarcode = emp.intEmployeeBarcode
            };

            // Assign classification
            var classification = await _dataContext.tblClassification
                .FirstOrDefaultAsync(e => e.strClassificationName.ToLower() == emp.role.ToLower());
            if (classification == null)
            {
                return BadRequest("Classification not found!");
            }
            employee.intClassificationId = classification.intClassificationId;

            // Assign department
            var department = await _dataContext.tblDepartment
                .FirstOrDefaultAsync(e => e.strDepartmentName.ToLower() == emp.department.ToLower());
            if (department == null)
            {
                return BadRequest("Department not found!");
            }
            employee.intDepartmentId = department.intDepartmentId;

            // Add employee to database
            _dataContext.tblEmployee.Add(employee);
            await _dataContext.SaveChangesAsync(); // Ensure employee is saved

            // Ensure employee's training records are added
            var trainings = await _dataContext.tblTraining
                .Where(t => t.bitTrainingIsActive)
                .ToListAsync();

            foreach (var tr in trainings)
            {
                if (!tr.bitIsSpecial ||
                    await _dataContext.tblTrainingDepartment
                        .AnyAsync(td => td.intTrainingId == tr.intTrainingId && td.intDepartmentId == employee.intDepartmentId))
                {
                    _dataContext.tblEmployeeTraining.Add(new tblEmployeeTraining
                    {
                        intEmployeeId = employee.intEmployeeId,
                        intTrainingId = tr.intTrainingId,
                        bitIsComplete = false,
                        dtCompletionDate = null
                    });
                }
            }

            await _dataContext.SaveChangesAsync(); // Ensure training records are saved

            return Ok(employee);
        }

        //gets all the employees from tblEmployee table (filtered for manager/leader)
        [HttpGet("all")]
        public async Task<IActionResult> getAll()
        {
            string empId = User?.Identity?.Name;
            bool isManager = false;
            int managerDeptId = 0;
            if (long.TryParse(empId, out long loggedInEmpId))
            {
                var loggedInEmployee = await _dataContext.tblEmployee.FindAsync(loggedInEmpId);
                if (loggedInEmployee != null && (User.IsInRole("manager") || User.IsInRole("leader")))
                {
                    isManager = true;
                    managerDeptId = loggedInEmployee.intDepartmentId;
                }
            }

            var employeesQuery = _dataContext.tblEmployee
                .Include(e => e.tblDepartment)
                .Include(e => e.tblClassification)
                .AsQueryable();

            if (isManager)
            {
                employeesQuery = employeesQuery.Where(e => e.intDepartmentId == managerDeptId);
            }

            var employees = await employeesQuery.ToListAsync();

            var employeeTraining = await _dataContext.tblEmployeeTraining
                .Include(et => et.tblTraining)
                .Include(et => et.tblEmployee)
                .ToListAsync();

            var employeeData = employees.Select(emp => new
            {
                emp.intEmployeeId,
                emp.strEmployeeFirstName,
                emp.strEmployeeLastName,
                emp.bitIsActive,
                emp.intDepartmentId,
                emp.intClassificationId,
                tblDepartment = emp.tblDepartment,
                tblClassification = emp.tblClassification,
                Trainings = employeeTraining
                    .Where(et => et.intEmployeeId == emp.intEmployeeId)
                    .Select(et => new
                    {
                        et.intTrainingId,
                        TrainingName = et.tblTraining.strTrainingName,
                        IsComplete = et.bitIsComplete,
                        CompletionDate = et.dtCompletionDate,
                        IsSpecial = et.tblTraining.bitIsSpecial,
                       
                    }).ToList(),
                CompletedTrainings = employeeTraining
                    .Count(et => et.intEmployeeId == emp.intEmployeeId && et.bitIsComplete),
                TotalTrainings = employeeTraining
                    .Count(et => et.intEmployeeId == emp.intEmployeeId)
            }).ToList();

            return Ok(employeeData);
        }


        //gets all the classifications
        [HttpGet("roles")]
        public async Task<IActionResult> getAllClassifications()
        {
            return Ok(await _dataContext.tblClassification.ToListAsync());
        }

        //gets all the active employees (filtered for manager/leader)
        [HttpGet("active")]
        public async Task<IActionResult> getActiveEmployees()
        {
            string empId = User?.Identity?.Name;
            bool isManager = false;
            int managerDeptId = 0;
            if (long.TryParse(empId, out long loggedInEmpId))
            {
                var loggedInEmployee = await _dataContext.tblEmployee.FindAsync(loggedInEmpId);
                if (loggedInEmployee != null && (User.IsInRole("manager") || User.IsInRole("leader")))
                {
                    isManager = true;
                    managerDeptId = loggedInEmployee.intDepartmentId;
                }
            }

            var activeEmployeesQuery = _dataContext.tblEmployee
                .Where(emp => emp.bitIsActive)
                .Include(e => e.tblDepartment)
                .Include(e => e.tblClassification)
                .AsQueryable();

            if (isManager)
            {
                activeEmployeesQuery = activeEmployeesQuery.Where(e => e.intDepartmentId == managerDeptId);
            }

            var activeEmployees = await activeEmployeesQuery.ToListAsync();

            var employeeTraining = await _dataContext.tblEmployeeTraining
                .Include(et => et.tblTraining)
                .Where(et => et.tblTraining.bitTrainingIsActive)
                .ToListAsync();

            var status = activeEmployees.Select(emp => new
            {
                emp.intEmployeeId,
                emp.strEmployeeFirstName,
                emp.strEmployeeLastName,
                emp.bitIsActive,
                emp.intDepartmentId,
                emp.intClassificationId,
                Department = emp.tblDepartment?.strDepartmentName,
                Classification = emp.tblClassification?.strClassificationName,
                Trainings = employeeTraining
                    .Where(et => et.intEmployeeId == emp.intEmployeeId)
                    .Select(et => new
                    {
                        TrainingName = et.tblTraining?.strTrainingName,
                        IsComplete = et.bitIsComplete,
                        CompletionDate = et.dtCompletionDate
                    }).ToList()
            });

            return Ok(status);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> update([FromBody] editEmployee employee, [FromRoute] int id)
        {
            try
            {
                var updated = await _dataContext.tblEmployee.FirstOrDefaultAsync(e => e.intEmployeeId == id);
                if (updated == null)
                {
                    return NotFound("Employee not found!");
                }

                updated.strEmployeeFirstName = employee.strEmployeeFirstName;
                updated.strEmployeeLastName = employee.strEmployeeLastName;
                updated.bitIsActive = employee.isActive;
                updated.intClassificationId = employee.intClassificationId;
                updated.intDepartmentId = employee.intDepartmentId;

                if (employee.orientationDate.HasValue)
                {
                    updated.dtOrientationDate = employee.orientationDate.Value;
                }

                var newManager = await _dataContext.tblEmployee
                    .FirstOrDefaultAsync(e => e.intDepartmentId == employee.intDepartmentId && e.intClassificationId == 2);
                updated.intEmployeeManagerId = newManager?.intEmployeeId;

                await _dataContext.SaveChangesAsync();
                return Ok(updated);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in Update Employee: " + ex.Message);
                return StatusCode(500, "Internal Server Error: " + ex.Message);
            }
        }

        //deactivates the employee
        [HttpPut("deactivate/{id}")]
        public async Task<IActionResult> deactivate([FromRoute] int id)
        {
            var employee = await getEmployeeByID(id);
            if (employee == null)
            {
                return BadRequest("Employee not found!");
            }
            employee.bitIsActive = false;
            await _dataContext.SaveChangesAsync();
            return Ok(employee);
        }

        [HttpGet("export")]
        public IActionResult ExportData([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            var trainingLogs = (from emp in _dataContext.tblEmployee
                                join log in _dataContext.tblEmployeeTraining on emp.intEmployeeId equals log.intEmployeeId
                                join dept in _dataContext.tblDepartment on emp.intDepartmentId equals dept.intDepartmentId
                                join tr in _dataContext.tblTraining on log.intTrainingId equals tr.intTrainingId
                                where log.dtCompletionDate.HasValue &&
                                      log.dtCompletionDate.Value >= startDate &&
                                      log.dtCompletionDate.Value <= endDate
                                select new
                                {
                                    emp.strEmployeeFirstName,
                                    emp.strEmployeeLastName,
                                    emp.bitIsActive,
                                    dept.strDepartmentName,
                                    log.dtCompletionDate,
                                    tr.strTrainingName
                                }).Take(1000).ToList();

            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("Training Data");

                worksheet.Cells[1, 1].Value = "Employee First Name";
                worksheet.Cells[1, 2].Value = "Employee Last Name";
                worksheet.Cells[1, 3].Value = "Active";
                worksheet.Cells[1, 4].Value = "Department Name";
                worksheet.Cells[1, 5].Value = "Training Name";
                worksheet.Cells[1, 6].Value = "Completion Date";

                for (int i = 0; i < trainingLogs.Count; i++)
                {
                    var log = trainingLogs[i];
                    worksheet.Cells[i + 2, 1].Value = log.strEmployeeFirstName;
                    worksheet.Cells[i + 2, 2].Value = log.strEmployeeLastName;
                    worksheet.Cells[i + 2, 3].Value = log.bitIsActive ? "Active" : "Inactive";
                    worksheet.Cells[i + 2, 4].Value = log.strDepartmentName;
                    worksheet.Cells[i + 2, 5].Value = log.strTrainingName;
                    worksheet.Cells[i + 2, 6].Value = log.dtCompletionDate?.ToString("yyyy-MM-dd");
                }

                var stream = new MemoryStream();
                package.SaveAs(stream);
                stream.Position = 0;

                return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "TrainingData.xlsx");
            }
        }

        //gets employee by its id
        [HttpGet("byId")]
        public async Task<tblEmployee> getEmployeeByID(long id)
        {
            var employee = await _dataContext.tblEmployee.FindAsync(id);
            if (employee == null)
            {
                throw new Exception("Employee not found!");
            }
            return employee;
        }
    }
}
