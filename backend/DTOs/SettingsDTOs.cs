using System.ComponentModel.DataAnnotations;

namespace SleepyKoala.Api.DTOs
{
    public class SettingsDto
    {
        [Required]
        public required string Nickname { get; set; }
        
        [Required]
        public required string CutoffTime { get; set; }
        
        [Required]
        public required string Timezone { get; set; }
        
        [Required]
        public required string ThemePreference { get; set; }
    }
}
