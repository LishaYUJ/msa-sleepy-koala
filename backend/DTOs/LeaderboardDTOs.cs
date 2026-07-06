namespace SleepyKoala.Api.DTOs
{
    public class LeaderboardDto
    {
        public int Rank { get; set; }
        public required string Nickname { get; set; }
        public int CurrentStreak { get; set; }
    }
}
