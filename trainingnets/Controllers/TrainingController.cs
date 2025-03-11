using Google.Protobuf.WellKnownTypes;
using Google.Rpc;
using Google.Type;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.WebSockets;
using TinyHelpers.Extensions;
using trainingnets.Models;
using trainingnets.Requests;

namespace trainingnets.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TrainingController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public TrainingController(DataContext dataContext)
        {
            _dataContext = dataContext;

        }

        [HttpGet("current")]
        public async Task<IActionResult> getCurrentTrainingStatus()
        {
            string empId = User?.Identity?.Name;
            if (!long.TryParse(empId, out long employeeId))
            {
                return Unauthorized("Invalid user identity.");
            }
            var employee = await _dataContext.tblEmployee.FindAsync(employeeId);
            if (employee == null)
            {
                Console.WriteLine($"Employee with id {employeeId} not found.");
                return Unauthorized("Unauthorized access!");
            }
            Console.WriteLine($"Found employee {employee.intEmployeeId} in department {employee.intDepartmentId}.");

            int month = System.DateTime.Now.Month;

            var status = await _dataContext.tblEmployeeTraining
       .Where(t => t.tblTraining.dtTrainingDate.Month == month &&
                   t.tblTraining.bitTrainingIsActive &&
                   t.tblTraining.intTrainingFrequency == 1 &&
                   t.tblEmployee.intDepartmentId == employee.intDepartmentId &&
                   t.tblEmployee.bitIsActive)
       .GroupBy(t => t.tblTraining)
       .Select(group => new {
           TrainingId = group.Key.intTrainingId,
           TrainingName = group.Key.strTrainingName,
           IsActive = group.Key.bitTrainingIsActive,
           TrainingDate = group.Key.dtTrainingDate,
           IsSpecial = group.Key.bitIsSpecial,
           Duration = group.Key.intTrainingDuration,
           Frequency = group.Key.intTrainingFrequency,
           completed = group.Where(g => g.bitIsComplete).ToList(),
           incomplete = group.Where(g => !g.bitIsComplete).ToList(),
           completedCount = group.Count(g => g.bitIsComplete),
           totalCount = group.Count(),
           status = group.ToList()
       })
       .ToListAsync();

            // If no trainings found, return an empty list rather than a BadRequest
            if (status == null || !status.Any())
            {
                Console.WriteLine("No active training found for the current month.");
                return Ok(new List<object>());
            }

            return Ok(status);
        }






        [HttpGet("upcoming")]
        public async Task<IActionResult> getUpcomingTrainings()
        {
            // Use DateTime.UtcNow if your dtTrainingDate is stored in UTC.
            var now = System.DateTime.Now;
            var trainings = await _dataContext.tblTraining
                .Where(tr => tr.bitTrainingIsActive == true &&
                             tr.intTrainingFrequency == 1 &&
                             tr.dtTrainingDate > now)
                .OrderBy(tr => tr.dtTrainingDate)
                .ToListAsync();

            if (trainings == null || !trainings.Any())
            {
                return Ok(new List<tblTraining>());
            }

            return Ok(trainings);
        }







        [HttpPost("new")]
        public async Task<IActionResult> addTraining([FromBody] addTraining training)
        {
            // Create a new training instance.
            tblTraining tr = new tblTraining();
            tr.strTrainingName = training.name;
            tr.intTrainingDuration = training.duration;
            tr.dtTrainingDate = training.date;
            tr.intTrainingFrequency = training.frequency;
            tr.bitIsSpecial = training.isSpecial;
            tr.bitTrainingIsActive = training.isActive;

            await _dataContext.tblTraining.AddAsync(tr);
            await _dataContext.SaveChangesAsync();

            // If it is a special training, add entries to the training department table.
            if (training.isSpecial == true && training.departments != null)
            {
                foreach (var dt in training.departments)
                {
                    tblTrainingDepartment td = new tblTrainingDepartment();
                    td.tblTraining = tr;
                    td.intDepartmentId = dt.intDepartmentId;
                    await _dataContext.tblTrainingDepartment.AddAsync(td);
                }
                await _dataContext.SaveChangesAsync();
            }

            // Materialize the list of active employees.
            var activeEmployees = await _dataContext.tblEmployee
                                        .Where(emp => emp.bitIsActive == true)
                                        .ToListAsync();

            // Add the training to each employee.
            foreach (var emp in activeEmployees)
            {
                tblEmployeeTraining empTr = new tblEmployeeTraining();

                if (training.isSpecial == true)
                {
                    // Materialize the list of training departments for this training and employee.
                    var td = _dataContext.tblTrainingDepartment
                                .Where(t => t.intTrainingId == tr.intTrainingId && t.intDepartmentId == emp.intDepartmentId)
                                .ToList();
                    if (td.Count > 0)
                    {
                        empTr.tblEmployee = emp;
                        empTr.tblTraining = tr;
                        empTr.bitIsComplete = false;
                        empTr.dtCompletionDate = null;
                        await _dataContext.tblEmployeeTraining.AddAsync(empTr);
                    }
                }
                else
                {
                    empTr.tblEmployee = emp;
                    empTr.tblTraining = tr;
                    empTr.bitIsComplete = false;
                    empTr.dtCompletionDate = null;
                    await _dataContext.tblEmployeeTraining.AddAsync(empTr);
                }
            }

            await _dataContext.SaveChangesAsync();

            return Ok(training);
        }

        //update employee training status
        /* [HttpPut("update")]
         public async Task<IActionResult> updateStatus( List<tblEmployeeTraining> emp)
         {
             try
             {
           await emp.ForEachAsync(async (e) =>
                 {
                      var empId = long.Parse(e.intEmployeeId.ToString());
                      var empTr = await _dataContext.tblEmployeeTraining.FindAsync(empId, e.intTrainingId);
                     if (empTr != null)
                     {
                         empTr.bitIsComplete = e.bitIsComplete;
                         // Use the user-provided completion date if bitIsComplete is true
                         if (e.bitIsComplete == true)
                         {
                              empTr.dtCompletionDate = System.DateTime.Now;

                         }
                         else
                         {
                             empTr.dtCompletionDate = null;

                         }

                         _dataContext.tblEmployeeTraining.Update(empTr);
                     }
                 });

                 await _dataContext.SaveChangesAsync();
                 return Ok(emp);

             }
             catch (Exception ex)
             {
                 return BadRequest(ex.Message);

             }


         }*/

        [HttpPut("update")]
        public async Task<IActionResult> updateStatus(List<tblEmployeeTraining> emp)
        {
            try
            {
                foreach (var e in emp)
                {
                    var empTr = await _dataContext.tblEmployeeTraining
                        .FirstOrDefaultAsync(et => et.intEmployeeId == e.intEmployeeId && et.intTrainingId == e.intTrainingId);

                    if (empTr != null)
                    {
                        empTr.bitIsComplete = e.bitIsComplete;
                        empTr.dtCompletionDate = e.bitIsComplete ? e.dtCompletionDate ?? System.DateTime.Now : null;

                        _dataContext.tblEmployeeTraining.Update(empTr);
                    }
                }

                await _dataContext.SaveChangesAsync();
                return Ok(emp);
            }
            catch (DbUpdateException dbEx)
            {
                return BadRequest($"Database Error: {dbEx.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }

        }



        [HttpPut("edit")]
        public async Task<IActionResult> editTraining(editTraining req)
        {
            var tr = await _dataContext.tblTraining.FindAsync(req.id);
            if (tr != null)
            {
                tr.strTrainingName = req.training.name;
                tr.intTrainingDuration = req.training.duration;
                tr.dtTrainingDate = req.training.date;
                tr.intTrainingFrequency = req.training.frequency;
                tr.bitTrainingIsActive = req.training.isActive;
                tr.bitIsSpecial = req.training.isSpecial;

                // Remove old departments
                var existingDepartments = _dataContext.tblTrainingDepartment.Where(td => td.intTrainingId == req.id);
                _dataContext.tblTrainingDepartment.RemoveRange(existingDepartments);

                // Add new departments
                if (req.training.isSpecial)
                {
                    var newDepartments = req.training.departmentIds.Select(id => new tblTrainingDepartment
                    {
                        intTrainingId = req.id,
                        intDepartmentId = id
                    });

                    await _dataContext.tblTrainingDepartment.AddRangeAsync(newDepartments);
                }

                _dataContext.tblTraining.Update(tr);
                await _dataContext.SaveChangesAsync();

                return Ok(req);
            }
            else
            {
                return NotFound("Training not found!");
            }
        }





        //gets active trainings for managers and all trainings for admins
        [HttpGet("active")]
        public async Task<IActionResult> getActiveTrainings()
        {
            // Get the logged-in employee ID from the token claims
            string empId = User?.Identity?.Name;
            if (!long.TryParse(empId, out long employeeId))
                return Unauthorized("Invalid user identity.");

            var employee = await _dataContext.tblEmployee.FindAsync(employeeId);
            if (employee == null)
                return Unauthorized("Unauthorized access!");

            List<object> result;

            if (User.IsInRole("manager") || User.IsInRole("leader"))
            {
                // Get trainings assigned to the manager's department via tblTrainingDepartment.
                // Then left-join to tblEmployeeTraining so that even if there are no employee records, 
                // the training is returned with an empty Status list.
                result = await _dataContext.tblTraining
                    .Where(t => t.bitTrainingIsActive == true &&
                                t.intTrainingFrequency == 1)
                    .Join(
                        _dataContext.tblTrainingDepartment.Where(td => td.intDepartmentId == employee.intDepartmentId),
                        t => t.intTrainingId,
                        td => td.intTrainingId,
                        (t, td) => t)
                    .GroupJoin(
                        _dataContext.tblEmployeeTraining,
                        t => t.intTrainingId,
                        et => et.intTrainingId,
                        (t, etGroup) => new {
                            TrainingId = t.intTrainingId,
                            TrainingName = t.strTrainingName,
                            IsActive = t.bitTrainingIsActive,
                            TrainingDate = t.dtTrainingDate,
                            IsSpecial = t.bitIsSpecial,
                            Duration = t.intTrainingDuration,
                            Frequency = t.intTrainingFrequency,
                            // Only include employee records for employees in the manager's department
                            Status = etGroup
                                .Where(g => g.tblEmployee.intDepartmentId == employee.intDepartmentId)
                                .Select(g => new {
                                    EmployeeId = g.intEmployeeId,
                                    IsComplete = g.bitIsComplete,
                                    CompletionDate = g.dtCompletionDate,
                                    tblEmployee = new
                                    {
                                        strEmployeeFirstName = g.tblEmployee.strEmployeeFirstName,
                                        strEmployeeLastName = g.tblEmployee.strEmployeeLastName,
                                        DepartmentId = g.tblEmployee.intDepartmentId
                                    }
                                }).ToList()
                        })
                    .ToListAsync<object>();
            }
            else if (User.IsInRole("admin"))
            {
                result = await _dataContext.tblTraining
                    .Include(t => t.trainingEmployee)
                        .ThenInclude(te => te.tblEmployee)
                    .Select(t => new {
                        TrainingId = t.intTrainingId,
                        TrainingName = t.strTrainingName,
                        IsActive = t.bitTrainingIsActive,
                        TrainingDate = t.dtTrainingDate,
                        IsSpecial = t.bitIsSpecial,
                        Duration = t.intTrainingDuration,
                        Frequency = t.intTrainingFrequency,
                        completedCount = t.trainingEmployee.Count(empTr => empTr.bitIsComplete),
                        totalCount = t.trainingEmployee.Count(),
                        Status = t.trainingEmployee.Select(empTr => new {
                            EmployeeId = empTr.intEmployeeId,
                            IsComplete = empTr.bitIsComplete,
                            CompletionDate = empTr.dtCompletionDate,
                            tblEmployee = new
                            {
                                strEmployeeFirstName = empTr.tblEmployee.strEmployeeFirstName,
                                strEmployeeLastName = empTr.tblEmployee.strEmployeeLastName
                            }
                        }).ToList()
                    })
                    .ToListAsync<object>();
            }
            else
            {
                // Fallback branch if needed
                int month = System.DateTime.Now.Month;
                var fallbackStatus = await _dataContext.tblEmployeeTraining
                    .Where(t => t.tblTraining.dtTrainingDate.Month == month &&
                                t.tblTraining.bitTrainingIsActive &&
                                t.tblTraining.intTrainingFrequency == 1 &&
                                t.tblEmployee.intDepartmentId == employee.intDepartmentId &&
                                t.tblEmployee.bitIsActive)
                    .GroupBy(t => t.tblTraining)
                    .Select(group => new {
                        tbltraining = group.Key,
                        completed = group.Where(g => g.bitIsComplete).ToList(),
                        incomplete = group.Where(g => !g.bitIsComplete).ToList(),
                        status = group.ToList()
                    })
                    .ToListAsync();
                result = fallbackStatus.Cast<object>().ToList();
            }

            if (result == null || !result.Any())
                return NotFound("No active training found.");

            return Ok(result);
        }



        // Inside TrainingController.cs

        [HttpGet("managers-progress")]
        [Authorize(Roles = "admin")]  // If you only want admins to call this
        public async Task<IActionResult> GetManagersProgress()
        {
          
            int totalActiveTrainings = await _dataContext.tblTraining
                .Where(t => t.bitTrainingIsActive)
                .CountAsync();

        
            var managers = await _dataContext.tblEmployee
                .Include(e => e.tblClassification)
                .Where(e =>
                    e.tblClassification.strClassificationName.ToLower() == "manager"
                    || e.tblClassification.strClassificationName.ToLower() == "leader"
                    || e.tblClassification.strClassificationName.ToLower() == "supervisor"
                )
                .ToListAsync();

            var managerProgressList = new List<object>();

            foreach (var mgr in managers)
            {

                string supervisorName = mgr.strEmployeeFirstName + " " + mgr.strEmployeeLastName;

                int managerDeptId = mgr.intDepartmentId;

                var employeesInDept = await _dataContext.tblEmployee
                    .Where(emp => emp.intDepartmentId == managerDeptId && emp.bitIsActive)
                    .Select(emp => emp.intEmployeeId)
                    .ToListAsync();

                int totalEmployees = employeesInDept.Count;

                int sumCompleted = await _dataContext.tblEmployeeTraining
                    .Include(et => et.tblTraining)
                    .Where(et =>
                        employeesInDept.Contains(et.intEmployeeId) &&
                        et.tblTraining.bitTrainingIsActive &&
                        et.bitIsComplete == true
                    )
                    .CountAsync();

                double denominator = totalEmployees * totalActiveTrainings;
                double percentCompleted = 0.0;
                if (denominator > 0)
                {
                    percentCompleted = (sumCompleted / denominator) * 100.0;
                }

                percentCompleted = Math.Round(percentCompleted, 2);

                managerProgressList.Add(new
                {
                    supervisorName,
                    percentCompleted
                });
            }

            return Ok(managerProgressList);
        }






        [HttpPut("reset")]
        public async Task<IActionResult> resetTrainingStatus(int id)
        {
            var stats = _dataContext.tblEmployeeTraining.Where(t => t.intTrainingId == id).ToList();

            if (!stats.Any())
            {
                return NotFound("No training statuses found for the given ID.");
            }

            foreach (var st in stats)
            {
                st.bitIsComplete = false;
                st.dtCompletionDate = null;  // Clear the completion date
                _dataContext.tblEmployeeTraining.Update(st);
            }

            await _dataContext.SaveChangesAsync();

            return Ok("Training status has been reset.");
        }





        //deactivates the training
        [HttpPut("deactivate/{id}")]
        public async Task<IActionResult> deactivate([FromRoute] int id)
        {
            var training = await _dataContext.tblTraining.FindAsync(id);
            if (training == null)
            {
                return NotFound("Training not found!");
            }

            training.bitTrainingIsActive = false;
            _dataContext.tblTraining.Update(training);
            await _dataContext.SaveChangesAsync();

            return Ok("Training successfully deactivated.");
        }




        //gets training by its id
        [HttpGet("byId/{id}")]
        public async Task<IActionResult> getTrainingByID(int id)
        {
            var training = await _dataContext.tblTraining
                .Include(t => t.trainingEmployee) // Include employees related to this training
                    .ThenInclude(te => te.tblEmployee)
                        .ThenInclude(emp => emp.tblDepartment) // Include department details
                .FirstOrDefaultAsync(t => t.intTrainingId == id);

            if (training == null)
            {
                return NotFound("Training not found!");
            }

            var trainingDetails = new
            {
                training.intTrainingId,
                training.strTrainingName,
                training.bitTrainingIsActive,
                training.dtTrainingDate,
                training.intTrainingDuration,
                training.intTrainingFrequency,
                training.bitIsSpecial,
                employees = training.trainingEmployee.Select(empTr => new
                {
                    employeeId = empTr.intEmployeeId,
                    trainingId = empTr.intTrainingId,
                    employeeName = empTr.tblEmployee.strEmployeeFirstName + " " + empTr.tblEmployee.strEmployeeLastName,
                    department = empTr.tblEmployee.tblDepartment.strDepartmentName,
                    isComplete = empTr.bitIsComplete,
                    completionDate = empTr.dtCompletionDate
                }).ToList()
            };

            return Ok(trainingDetails);
        }



    }
}