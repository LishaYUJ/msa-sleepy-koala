using Microsoft.AspNetCore.Mvc;
using SleepyKoala.Api.DTOs;
using SleepyKoala.Api.Services;

namespace SleepyKoala.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var result = await _authService.RegisterAsync(request);
            if (result == null) return BadRequest(new { error = "UserExists", message = "User already exists." });
            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var result = await _authService.LoginAsync(request);
            if (result == null) return Unauthorized(new { error = "InvalidCredentials", message = "Invalid email or password." });
            return Ok(result);
        }
    }
}
