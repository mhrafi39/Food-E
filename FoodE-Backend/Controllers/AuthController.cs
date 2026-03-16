using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FoodE_Backend.Data;
using FoodE_Backend.Model;

namespace FoodE_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/Auth/register
        [HttpPost("register")]
        public async Task<ActionResult<object>> Register([FromBody] RegisterRequest request)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (existingUser != null)
            {
                return BadRequest(new { message = "Email already registered" });
            }

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                Password = request.Password, // Note: In production, hash this password!
                Role = "user" // Default role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                userId = user.Id,                                               
                name = user.Name,
                email = user.Email,
                role = user.Role,
                token = $"fake-jwt-token-{user.Id}" // Note: Implement real JWT in production
            });
        }

        // POST: api/Auth/login
        [HttpPost("login")]
        public async Task<ActionResult<object>> Login([FromBody] LoginRequest request)
        {
            try
            {
                if (request == null || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                {
                    return BadRequest(new { message = "Email and password are required" });
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

                if (user == null || user.Password != request.Password)
                {
                    return Unauthorized(new { message = "Invalid email or password" });
                }

                return Ok(new
                {
                    userId = user.Id,
                    name = user.Name,
                    email = user.Email,
                    role = user.Role,
                    token = $"fake-jwt-token-{user.Id}" // Note: Implement real JWT in production
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Login failed", error = ex.Message });
            }
        }
    }

    public class RegisterRequest
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
