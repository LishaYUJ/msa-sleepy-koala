using System;

namespace SleepyKoala.Api.Models
{
    public class UserBadge
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public Guid UserId { get; set; }
        public User? User { get; set; }

        public Guid BadgeId { get; set; }
        public Badge? Badge { get; set; }
        
        public DateTime UnlockedAtUtc { get; set; } = DateTime.UtcNow;
    }
}
