using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FoodE_Backend.Data;
using FoodE_Backend.Model;

namespace FoodE_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var secretKey = jwtSettings["SecretKey"];
            var key = Encoding.ASCII.GetBytes(secretKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim("email", user.Email), // Include email as a custom claim as well for the backend filter
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddMinutes(int.Parse(jwtSettings["ExpirationMinutes"])),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
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
                Role = "user", // Default role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                userId = user.Id,                                               
                name = user.Name,
                email = user.Email,
                role = user.Role,
                token = token
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

                var token = GenerateJwtToken(user);

                return Ok(new
                {
                    userId = user.Id,
                    name = user.Name,
                    email = user.Email,
                    role = user.Role,
                    token = token
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
