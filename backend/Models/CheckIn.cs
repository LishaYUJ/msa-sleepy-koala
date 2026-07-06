using System;

namespace SleepyKoala.Api.Models
{
    public class CheckIn
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }
        public User? User { get; set; }
        
        // This date corresponds to the local check-in date 
        // string format like "2026-07-03" helps ensure user cannot check in twice on their local day
        public required string LocalCheckInDate { get; set; } 
        
        // "onTime" or "late"
        public required string Status { get; set; } 
        
        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    }
}
