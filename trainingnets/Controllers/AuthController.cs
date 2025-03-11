using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text;
using System.Security.Cryptography;
using trainingnets.Models;
using trainingnets.Requests;
using trainingnets.Services;
using StackExchange.Redis;

namespace trainingnets.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly DataContext _dataContext;
        private readonly JwtAuthenticationManager jwtAuthenticationManager;

        public AuthController(DataContext dataContext, JwtAuthenticationManager jwtAuthenticationManager)
        {
            _dataContext = dataContext;
            this.jwtAuthenticationManager = jwtAuthenticationManager;
        }


        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Login user)
        {
            //hashing the password with Hash method
            string hashed = Hash(user.password);

            //getting the user with specified username and hashed password
            var dbUser = _dataContext.tblUserAccount.Where(u=>u.strUsername == user.username && u.strPassword==hashed).FirstOrDefault();
            if (dbUser == null)
            {
                return Unauthorized("Invalid Credentials!");

            }

            if (dbUser.bitIsActive == false)
            {
                return Unauthorized("This account is not active");
            }

            //if the user does not exist in employee table
            var employee =  await _dataContext.tblEmployee.FindAsync(dbUser.intEmployeeId);
            if(employee == null) {
                return NotFound("Employee is not registered, Add Employee information first!");
            }

            //getting the role and department of the user
            var role = await _dataContext.tblClassification.FindAsync(employee.intClassificationId);
            var dept = await _dataContext.tblDepartment.FindAsync(employee.intDepartmentId);


            //adding the user's employeeID and role to the jwt token claim
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, employee.intEmployeeId.ToString()),
                new Claim(ClaimTypes.Role, role.strClassificationName),
            };

            //generating the token with given claims
            var token = jwtAuthenticationManager.generateToken(authClaims);
            
            //if token could not be generated
            if (token == null)
            {
                return BadRequest();

            }

            //sending back the token and employee info
            return Ok(new { token, emp = new { id = employee.intEmployeeId, name = employee.strEmployeeFirstName +" "+ employee.strEmployeeLastName, role = role?.strClassificationName } } );
        }

       

        [AllowAnonymous]
        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] Signup req)
        {
            //hashing the pw and passing it to the object
            var hashedPw = Hash(req.password);
            req.password = hashedPw;

            var registeredUser = await _dataContext.tblUserAccount.FindAsync(req.username);
            if(registeredUser != null)
            {
                return BadRequest("The username already exists!");
            }

            //getting the employee info 
            var employee = await _dataContext.tblEmployee.FindAsync(req.empId);
            if(employee== null)
            {
                return NotFound("Employee is not registered, Add Employee information first");
            }
            if (employee.bitIsActive == false)
            {
                return BadRequest("The employee is not active!");
            }

            var classification =  _dataContext.tblClassification.FirstOrDefault(c => c.strClassificationName == req.role);
            if (classification == null)
            {
                return BadRequest("The specified role does not exist!");
            }

            if(employee.tblClassification != classification)
            {
                employee.tblClassification = classification;
            }

            

            //creating a new user
            tblUserAccount user = new tblUserAccount
            {
                tblEmployee = employee,
                strPassword = req.password,
                strUsername = req.username,
                bitIsActive = true
            };

            

            //adding the user and saving the changes
            await _dataContext.tblUserAccount.AddAsync(user);
            await _dataContext.SaveChangesAsync();
    
            return Ok();
        }

        [HttpPut("deactivate"), Authorize]
        public async Task<IActionResult> deactivateLeader(tblEmployee employee)
        {
            if (employee.bitIsActive == false)
            {
                return BadRequest("The employee is not active");
            }
            var user = _dataContext.tblUserAccount.FirstOrDefault(u => u.tblEmployee == employee);
            user.tblEmployee
               .intClassificationId = 3;
            _dataContext.tblUserAccount.Update(user);
            await _dataContext.SaveChangesAsync();
           
            if (user== null)
            {
                return BadRequest("Employee account does not exist!");
            }
            
            if(user.bitIsActive == false)
            {
                return BadRequest("The account is not active anymore");
            }

            user.bitIsActive = false;
            return Ok();


        }

        [AllowAnonymous]
        [HttpPost("loginWithBarcode")]
        public async Task<IActionResult> LoginWithBarcode([FromBody] BarcodeLoginRequest request)
        {
            // Convert barcode to long (if necessary) or compare as string
            if (!long.TryParse(request.Barcode, out long barcodeValue))
            {
                return BadRequest("Invalid barcode format.");
            }

            // Find the employee by barcode
            var employee = _dataContext.tblEmployee.FirstOrDefault(e => e.intEmployeeBarcode == barcodeValue);
            if (employee == null)
            {
                return Unauthorized("Invalid barcode");
            }

            if (!employee.bitIsActive)
            {
                return Unauthorized("Employee is not active");
            }

            // Get the employee's role info
            var role = await _dataContext.tblClassification.FindAsync(employee.intClassificationId);

            // Create claims for JWT
            var authClaims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, employee.intEmployeeId.ToString()),
        new Claim(ClaimTypes.Role, role?.strClassificationName ?? "")
    };

            // Generate token
            var token = jwtAuthenticationManager.generateToken(authClaims);
            if (token == null)
            {
                return BadRequest("Token generation failed.");
            }

            return Ok(new
            {
                token,
                emp = new
                {
                    id = employee.intEmployeeId,
                    name = $"{employee.strEmployeeFirstName} {employee.strEmployeeLastName}",
                    role = role?.strClassificationName
                }
            });
        }

        [HttpPut("activate"), Authorize]
        public async Task<IActionResult> activateLeader(tblEmployee employee)
        {
            if (employee.bitIsActive == false)
            {
                return BadRequest("The employee is not active");
            }
            var user = _dataContext.tblUserAccount.FirstOrDefault(u => u.tblEmployee == employee);
            if (user == null)
            {
                return BadRequest("Employee account does not exist!");
            }

            user.bitIsActive = true;
            user.tblEmployee.intClassificationId = 19;
            _dataContext.tblUserAccount.Update(user);
            await _dataContext.SaveChangesAsync();
            return Ok();

        }






        [HttpGet("me"), Authorize]
        public async Task<IActionResult> getMe()
        {
            // Getting the logged in user's Id
            string id = User?.Identity?.Name;

            // Getting the employee info
            var employee = await _dataContext.tblEmployee.FindAsync(long.Parse(id));
            if (employee == null)
            {
                return NotFound("Employee not found");
            }

            // Get the role info
            var role = await _dataContext.tblClassification.FindAsync(employee.intClassificationId);

            // Optionally get department info if needed
            // var dept = await _dataContext.tblDepartment.FindAsync(employee.intDepartmentId);

            // Return the employee info including the departmentId
            return Ok(new
            {
                id = employee.intEmployeeId,
                name = employee.strEmployeeFirstName + " " + employee.strEmployeeLastName,
                role = role?.strClassificationName,
                departmentId = employee.intDepartmentId  // Added departmentId
            });
        }



        //hashes the given string
        static string Hash(string input)
        {
            var hash = new SHA1Managed().ComputeHash(Encoding.UTF8.GetBytes(input));
            return string.Concat(hash.Select(b => b.ToString("x2")));
        }



    }
}
