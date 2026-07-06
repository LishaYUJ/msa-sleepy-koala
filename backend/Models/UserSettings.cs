using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SleepyKoala.Api.Models
{
    public class UserSettings
    {
        [Key]
        public Guid UserId { get; set; }
        
        [ForeignKey("UserId")]
        public User? User { get; set; }

        public string CutoffTime { get; set; } = "00:00"; // default midnight
        public string Timezone { get; set; } = "Pacific/Auckland";
        public string ThemePreference { get; set; } = "system"; // light, dark, system
    }
}
