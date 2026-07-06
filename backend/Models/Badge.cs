using System;
using System.Collections.Generic;

namespace SleepyKoala.Api.Models
{
    public class Badge
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public required string Name { get; set; }
        public required string Description { get; set; }
        
        // Used to match internal logic (e.g. required streak count)
        public int RequiredStreak { get; set; } = 0;
        
        public ICollection<UserBadge> UserBadges { get; set; } = new List<UserBadge>();
    }
}
