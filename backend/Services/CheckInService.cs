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

            var userTz = TimeZoneInfo.FindSystemTimeZoneById(user.Settings.Timezone);
            var nowUtc = DateTime.UtcNow;
            var localTime = TimeZoneInfo.ConvertTimeFromUtc(nowUtc, userTz);
            var localDateStr = localTime.ToString("yyyy-MM-dd");

            // Prevent duplicate check-in
            var alreadyCheckedIn = await _context.CheckIns
                .AnyAsync(c => c.UserId == userId && c.LocalCheckInDate == localDateStr);
            if (alreadyCheckedIn)
            {
                throw new InvalidOperationException("DuplicateCheckIn");
            }

            // Determine if onTime or late
            var cutoffParts = user.Settings.CutoffTime.Split(':');
            var cutoffHour = int.Parse(cutoffParts[0]);
            var cutoffMin = int.Parse(cutoffParts[1]);

            var cutoffTimeLocal = new DateTime(localTime.Year, localTime.Month, localTime.Day, cutoffHour, cutoffMin, 0);
            
            // Allow checking in early (e.g. up to 12 hours before)
            // But we simply check if localTime is <= cutoff time
            string status = localTime <= cutoffTimeLocal ? "onTime" : "late";

            if (status == "onTime")
            {
                user.CurrentStreak++;
                if (user.CurrentStreak > user.LongestStreak)
                {
                    user.LongestStreak = user.CurrentStreak;
                }
            }
            else
            {
                user.CurrentStreak = 0;
            }

            var checkIn = new CheckIn
            {
                UserId = userId,
                LocalCheckInDate = localDateStr,
                Status = status,
                CreatedAtUtc = nowUtc
            };

            _context.CheckIns.Add(checkIn);

            var unlockedBadges = await CheckBadgesAsync(user, nowUtc);
            var mood = CalculateKoalaMood(user, status);

            await _context.SaveChangesAsync();

            return new CheckInResponse
            {
                CheckInId = checkIn.Id,
                Status = status,
                LocalCheckInDate = localDateStr,
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
    }
}
