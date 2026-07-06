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
                Timezone = user.Settings.Timezone,
                ThemePreference = user.Settings.ThemePreference
            });
        }

        [HttpPut]
        public async Task<IActionResult> UpdateSettings(SettingsDto dto)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdStr == null) return Unauthorized();
            var userId = Guid.Parse(userIdStr);

            // Validate timezone before hitting the database
            try
            {
                TimeZoneInfo.FindSystemTimeZoneById(dto.Timezone);
            }
            catch (TimeZoneNotFoundException)
            {
                return BadRequest(new { error = "InvalidTimezone", message = $"'{dto.Timezone}' is not a recognised timezone. Use GET /api/timezones for the full list." });
            }

            var user = await _context.Users
                .Include(u => u.Settings)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null || user.Settings == null) return NotFound();

            user.Nickname = dto.Nickname;
            user.Settings.CutoffTime = dto.CutoffTime;
            user.Settings.Timezone = dto.Timezone;
            user.Settings.ThemePreference = dto.ThemePreference;

            await _context.SaveChangesAsync();

            return Ok(dto);
        }
    }
}
