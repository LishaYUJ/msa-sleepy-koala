using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SleepyKoala.Api.Data;
using SleepyKoala.Api.DTOs;
using SleepyKoala.Api.Services;
using System.Security.Claims;

namespace SleepyKoala.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/me/summary")]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ICheckInService _checkInService;

        public DashboardController(ApplicationDbContext context, ICheckInService checkInService)
        {
            _context = context;
            _checkInService = checkInService;
        }

        [HttpGet]
        public async Task<IActionResult> GetSummary()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdStr == null) return Unauthorized();
            var userId = Guid.Parse(userIdStr);

            var user = await _context.Users
                .Include(u => u.Settings)
                .Include(u => u.UserBadges)
                .ThenInclude(ub => ub.Badge)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null || user.Settings == null) return NotFound();

            var userTz = TimeZoneInfo.FindSystemTimeZoneById(user.Settings.Timezone);
            var nowUtc = DateTime.UtcNow;
            var localTime = TimeZoneInfo.ConvertTimeFromUtc(nowUtc, userTz);
            var localDateStr = localTime.ToString("yyyy-MM-dd");

            var todayCheckIn = await _context.CheckIns
                .FirstOrDefaultAsync(c => c.UserId == userId && c.LocalCheckInDate == localDateStr);

            var lastCheckIn = await _context.CheckIns
                .Where(c => c.UserId == userId)
                .OrderByDescending(c => c.LocalCheckInDate)
                .FirstOrDefaultAsync();

            var mood = _checkInService.CalculateKoalaMood(user, lastCheckIn?.Status ?? "onTime");

            var summary = new DashboardSummaryDto
            {
                TodayCheckedIn = todayCheckIn != null,
                TodayStatus = todayCheckIn?.Status,
                CurrentStreak = user.CurrentStreak,
                LongestStreak = user.LongestStreak,
                KoalaMood = mood,
                CutoffTime = user.Settings.CutoffTime,
                Timezone = user.Settings.Timezone,
                Badges = user.UserBadges.Select(ub => new BadgeDto
                {
                    Name = ub.Badge!.Name,
                    Description = ub.Badge.Description,
                    UnlockedAt = ub.UnlockedAtUtc.ToString("O")
                }).ToList()
            };

            return Ok(summary);
        }
    }
}
