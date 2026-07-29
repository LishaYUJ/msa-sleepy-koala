using System;
using SleepyKoala.Api.Data;
using SleepyKoala.Api.DTOs;
using SleepyKoala.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace SleepyKoala.Api.Services
{
    public interface ICheckInService
    {
        Task<CheckInResponse?> CheckInAsync(Guid userId, CheckInRequest request);
        string CalculateKoalaMood(User user, string lastStatus);
    }

    public class CheckInService : ICheckInService
    {
        private readonly ApplicationDbContext _context;

        public CheckInService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<CheckInResponse?> CheckInAsync(Guid userId, CheckInRequest request)
        {
            var user = await _context.Users
                .Include(u => u.Settings)
                .Include(u => u.UserBadges)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null || user.Settings == null) return null;

            // Validate LocalDate format (yyyy-MM-dd)
            if (!DateOnly.TryParseExact(request.LocalDate, "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out var localDate))
            {
                throw new ArgumentException("LocalDate must be in 'yyyy-MM-dd' format.");
            }

            // Validate LocalTime format (HH:mm or HH:mm:ss)
            if (!TimeSpan.TryParse(request.LocalTime, out var localTimeSpan) ||
                localTimeSpan < TimeSpan.Zero || localTimeSpan >= TimeSpan.FromDays(1))
            {
                throw new ArgumentException("LocalTime must be a valid time of day in 'HH:mm' or 'HH:mm:ss' format.");
            }

            if (!TimeSpan.TryParse(user.Settings.CutoffTime, out var cutoffTimeSpan))
            {
                cutoffTimeSpan = new TimeSpan(22, 0, 0); // Fallback to 22:00
            }

            var checkInWindow = ResolveCheckInWindow(localDate, localTimeSpan, cutoffTimeSpan);
            if (checkInWindow.Status == null)
            {
                throw new InvalidOperationException("CheckInWindowClosed");
            }

            var sleepDate = checkInWindow.SleepDate.ToString("yyyy-MM-dd");
            var status = checkInWindow.Status;

            // Prevent duplicate check-in for the sleep date, not the click date.
            var alreadyCheckedIn = await _context.CheckIns
                .AnyAsync(c => c.UserId == userId && c.LocalCheckInDate == sleepDate);
            if (alreadyCheckedIn)
            {
                throw new InvalidOperationException("DuplicateCheckIn");
            }

            // Determine streak using submitted local date
            var lastCheckIn = await _context.CheckIns
                .Where(c => c.UserId == userId)
                .OrderByDescending(c => c.LocalCheckInDate)
                .FirstOrDefaultAsync();

            int calculatedStreak = user.CurrentStreak;

            if (lastCheckIn == null)
            {
                // First check in
                calculatedStreak = (status == "onTime") ? 1 : 0;
            }
            else
            {
                if (DateOnly.TryParse(sleepDate, out var currentLocalDate) &&
                    DateOnly.TryParse(lastCheckIn.LocalCheckInDate, out var lastLocalDate))
                {
                    int dayDifference = currentLocalDate.DayNumber - lastLocalDate.DayNumber;
                    if (dayDifference == 1)
                    {
                        // Consecutive day check-in
                        if (status == "onTime")
                        {
                            calculatedStreak++;
                        }
                        else
                        {
                            calculatedStreak = 0;
                        }
                    }
                    else if (dayDifference > 1)
                    {
                        // Missed check-in
                        if (status == "onTime")
                        {
                            calculatedStreak = 1;
                        }
                        else
                        {
                            calculatedStreak = 0;
                        }
                    }
                    else
                    {
                        // dayDifference <= 0 (same day check-in was already caught by duplicate check, this is fallback)
                        if (status == "onTime")
                        {
                            calculatedStreak++;
                        }
                        else
                        {
                            calculatedStreak = 0;
                        }
                    }
                }
                else
                {
                    if (status == "onTime")
                    {
                        calculatedStreak++;
                    }
                    else
                    {
                        calculatedStreak = 0;
                    }
                }
            }

            user.CurrentStreak = calculatedStreak;
            if (user.CurrentStreak > user.LongestStreak)
            {
                user.LongestStreak = user.CurrentStreak;
            }

            var checkIn = new CheckIn
            {
                UserId = userId,
                LocalCheckInDate = sleepDate,
                Status = status,
                CreatedAtUtc = DateTime.UtcNow
            };

            _context.CheckIns.Add(checkIn);

            var unlockedBadges = await CheckBadgesAsync(user, DateTime.UtcNow);
            var mood = CalculateKoalaMood(user, status);

            await _context.SaveChangesAsync();

            return new CheckInResponse
            {
                CheckInId = checkIn.Id,
                Status = status,
                LocalCheckInDate = sleepDate,
                CurrentStreak = user.CurrentStreak,
                KoalaMood = mood,
                UnlockedBadges = unlockedBadges
            };
        }

        public string CalculateKoalaMood(User user, string lastStatus)
        {
            if (lastStatus == "onTime")
            {
                return user.CurrentStreak >= 7 ? "champion" : "calm";
            }
            else
            {
                return user.CurrentStreak == 0 ? "exhausted" : "panda-eye";
            }
        }

        private async Task<List<string>> CheckBadgesAsync(User user, DateTime nowUtc)
        {
            var newBadges = new List<string>();
            var allBadges = await _context.Badges.ToListAsync();
            
            var userBadgeIds = user.UserBadges.Select(b => b.BadgeId).ToHashSet();

            foreach (var badge in allBadges)
            {
                if (!userBadgeIds.Contains(badge.Id) && user.CurrentStreak >= badge.RequiredStreak)
                {
                    var newUb = new UserBadge
                    {
                        UserId = user.Id,
                        BadgeId = badge.Id,
                        UnlockedAtUtc = nowUtc
                    };
                    _context.UserBadges.Add(newUb);
                    user.UserBadges.Add(newUb);
                    newBadges.Add(badge.Name);
                }
            }
            return newBadges;
        }

        private static (DateOnly SleepDate, string? Status) ResolveCheckInWindow(DateOnly localDate, TimeSpan localTime, TimeSpan cutoffTime)
        {
            var windowStart = new TimeSpan(21, 0, 0);
            var windowEnd = new TimeSpan(2, 0, 0);

            var isEveningWindow = localTime >= windowStart;
            var isAfterMidnightWindow = localTime <= windowEnd;

            if (!isEveningWindow && !isAfterMidnightWindow)
            {
                return (localDate, null);
            }

            var sleepDate = isAfterMidnightWindow ? localDate.AddDays(-1) : localDate;
            var isMidnightCutoff = cutoffTime == TimeSpan.Zero;
            var isOnTime = isMidnightCutoff
                ? isEveningWindow || localTime == TimeSpan.Zero
                : isEveningWindow && localTime <= cutoffTime;

            return (sleepDate, isOnTime ? "onTime" : "late");
        }
    }
}
