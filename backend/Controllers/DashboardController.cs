using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SleepyKoala.Api.Data;
using SleepyKoala.Api.DTOs;
using SleepyKoala.Api.Extensions;
using SleepyKoala.Api.Services;

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
        public async Task<IActionResult> GetSummary([FromQuery] string? localDate, [FromQuery] string? localTime)
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            var user = await _context.Users
                .Include(u => u.Settings)
                .Include(u => u.UserBadges)
                .ThenInclude(ub => ub.Badge)
                .FirstOrDefaultAsync(u => u.Id == userId.Value);

            if (user == null || user.Settings == null) return NotFound();

            string localDateStr;
            if (!string.IsNullOrEmpty(localDate) && DateTime.TryParseExact(localDate, "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out _))
            {
                localDateStr = localDate;
            }
            else
            {
                // Fallback: use UTC date when no localDate is provided
                localDateStr = DateTime.UtcNow.ToString("yyyy-MM-dd");
            }

            TimeSpan? localTimeSpan = null;
            if (!string.IsNullOrEmpty(localTime) &&
                TimeSpan.TryParse(localTime, out var parsedLocalTime) &&
                parsedLocalTime >= TimeSpan.Zero &&
                parsedLocalTime < TimeSpan.FromDays(1))
            {
                localTimeSpan = parsedLocalTime;
            }

            var todayCheckIn = await _context.CheckIns
                .FirstOrDefaultAsync(c => c.UserId == userId.Value && c.LocalCheckInDate == localDateStr);

            var lastCheckIn = await _context.CheckIns
                .Where(c => c.UserId == userId.Value)
                .OrderByDescending(c => c.LocalCheckInDate)
                .FirstOrDefaultAsync();

            int displayStreak = user.CurrentStreak;
            if (lastCheckIn != null &&
                DateOnly.TryParse(localDateStr, out var currentD) &&
                DateOnly.TryParse(lastCheckIn.LocalCheckInDate, out var lastD))
            {
                if (currentD.DayNumber - lastD.DayNumber > 1)
                {
                    displayStreak = 0;
                }
            }
            else if (lastCheckIn == null)
            {
                displayStreak = 0;
            }

            int consecutiveBadDays = 0;
            int fatigueScore = 0;
            string? inferredTodayStatus = todayCheckIn?.Status;
            if (DateOnly.TryParse(localDateStr, out var todayDate))
            {
                var checkInMap = await _context.CheckIns
                    .Where(c => c.UserId == userId.Value)
                    .ToDictionaryAsync(c => c.LocalCheckInDate, c => c.Status);

                if (todayCheckIn == null &&
                    localTimeSpan.HasValue &&
                    localTimeSpan.Value > new TimeSpan(2, 0, 0) &&
                    localTimeSpan.Value < new TimeSpan(21, 0, 0))
                {
                    inferredTodayStatus = "missing";
                    fatigueScore += 2;
                }

                var dateToCheck = todayDate.AddDays(-1);
                var registerDate = DateOnly.FromDateTime(user.CreatedAtUtc);

                for (int i = 0; i < 30; i++)
                {
                    if (dateToCheck < registerDate)
                    {
                        break;
                    }

                    var dateStr = dateToCheck.ToString("yyyy-MM-dd");
                    if (checkInMap.TryGetValue(dateStr, out var checkStatus))
                    {
                        if (checkStatus == "onTime")
                        {
                            break;
                        }
                        else if (checkStatus == "late")
                        {
                            consecutiveBadDays++;
                            fatigueScore += 1;
                        }
                    }
                    else
                    {
                        consecutiveBadDays++;
                        fatigueScore += 2;
                    }
                    dateToCheck = dateToCheck.AddDays(-1);
                }
            }

            var mood = _checkInService.CalculateKoalaMood(user, lastCheckIn?.Status ?? "onTime");
            var fatigueState = fatigueScore >= 6 ? "veryWeak" : fatigueScore >= 3 ? "weak" : "healthy";
            if (inferredTodayStatus == "missing")
            {
                displayStreak = 0;
            }

            var summary = new DashboardSummaryDto
            {
                TodayCheckedIn = todayCheckIn != null,
                TodayStatus = inferredTodayStatus,
                CurrentStreak = displayStreak,
                LongestStreak = user.LongestStreak,
                KoalaMood = mood,
                CutoffTime = user.Settings.CutoffTime,
                ConsecutiveBadDays = consecutiveBadDays,
                FatigueScore = fatigueScore,
                FatigueState = fatigueState,
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
