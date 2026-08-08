using System.ComponentModel.DataAnnotations;

namespace SleepyKoala.Api.DTOs
{
    public class SettingsDto
    {
        [Required, StringLength(50)]
        public required string Nickname { get; set; }
        
        [Required]
        public required string CutoffTime { get; set; }
        
        [Required]
        public required string ThemePreference { get; set; }

        public bool OnboardingCompleted { get; set; }

        [Required, StringLength(100)]
        public string TimeZoneId { get; set; } = "UTC";

        [StringLength(700000)]
        public string? AvatarDataUrl { get; set; }
    }
}
