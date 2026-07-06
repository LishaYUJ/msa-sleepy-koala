using System.Collections.Generic;

namespace SleepyKoala.Api.DTOs
{
    public class DashboardSummaryDto
    {
        public bool TodayCheckedIn { get; set; }
        public string? TodayStatus { get; set; }
        public int CurrentStreak { get; set; }
        public int LongestStreak { get; set; }
        public required string KoalaMood { get; set; }
        public required string CutoffTime { get; set; }
        public required string Timezone { get; set; }
        public List<BadgeDto> Badges { get; set; } = new List<BadgeDto>();
    }

    public class BadgeDto
    {
        public required string Name { get; set; }
        public required string Description { get; set; }
        public string? UnlockedAt { get; set; }
    }
    
    public class BadgesSummaryDto
    {
        public List<BadgeDto> Unlocked { get; set; } = new List<BadgeDto>();
        public List<BadgeDto> Locked { get; set; } = new List<BadgeDto>();
    }
}
