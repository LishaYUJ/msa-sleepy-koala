using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SleepyKoala.Api.Data;
using SleepyKoala.Api.DTOs;

namespace SleepyKoala.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LeaderboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LeaderboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetLeaderboard()
        {
            var topUsers = await _context.Users
                .OrderByDescending(u => u.CurrentStreak)
                .Take(50)
                .Select(u => new 
                {
                    u.Nickname,
                    u.CurrentStreak
                })
                .ToListAsync();

            var leaderboard = topUsers.Select((u, index) => new LeaderboardDto
            {
                Rank = index + 1,
                Nickname = u.Nickname,
                CurrentStreak = u.CurrentStreak
            });

            return Ok(leaderboard);
        }
    }
}
