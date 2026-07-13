using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SleepyKoala.Api.Data;
using SleepyKoala.Api.DTOs;
using System.Security.Claims;

namespace SleepyKoala.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/settings/me")]
    public class SettingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SettingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetSettings()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdStr == null) return Unauthorized();
            var userId = Guid.Parse(userIdStr);

            var user = await _context.Users
                .Include(u => u.Settings)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null || user.Settings == null) return NotFound();

            return Ok(new SettingsDto
            {
                Nickname = user.Nickname,
                CutoffTime = user.Settings.CutoffTime,
                ThemePreference = user.Settings.ThemePreference
            });
        }

        [HttpPut]
        public async Task<IActionResult> UpdateSettings(SettingsDto dto)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdStr == null) return Unauthorized();
            var userId = Guid.Parse(userIdStr);

            // Validate bedtime cutoff time is between 20:00 and 23:59
            if (!TimeSpan.TryParse(dto.CutoffTime, out var cutoffSpan) ||
                cutoffSpan < new TimeSpan(20, 0, 0) ||
                cutoffSpan > new TimeSpan(23, 59, 59))
            {
                return BadRequest(new { error = "InvalidCutoffTime", message = "Bedtime (CutoffTime) must be between 20:00 and 23:59 to avoid cross-midnight ambiguity for MVP." });
            }



            var user = await _context.Users
                .Include(u => u.Settings)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null || user.Settings == null) return NotFound();

            user.Nickname = dto.Nickname;
            user.Settings.CutoffTime = dto.CutoffTime;
            user.Settings.ThemePreference = dto.ThemePreference;

            await _context.SaveChangesAsync();

            return Ok(dto);
        }
    }
}
