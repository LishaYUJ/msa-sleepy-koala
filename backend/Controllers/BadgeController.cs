using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SleepyKoala.Api.Data;
using SleepyKoala.Api.DTOs;
using SleepyKoala.Api.Extensions;

namespace SleepyKoala.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/badges/me")]
    public class BadgeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BadgeController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetBadges()
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            var allBadges = await _context.Badges.ToListAsync();
            var userBadges = await _context.UserBadges
                .Where(ub => ub.UserId == userId.Value)
                .ToListAsync();

            var unlockedIds = userBadges.Select(ub => ub.BadgeId).ToHashSet();

            var summary = new BadgesSummaryDto
            {
                Unlocked = userBadges.Select(ub => 
                {
                    var badge = allBadges.First(b => b.Id == ub.BadgeId);
                    return new BadgeDto
                    {
                        Name = badge.Name,
                        Description = badge.Description,
                        UnlockedAt = ub.UnlockedAtUtc.ToString("O")
                    };
                }).ToList(),
                Locked = allBadges.Where(b => !unlockedIds.Contains(b.Id)).Select(b => new BadgeDto
                {
                    Name = b.Name,
                    Description = b.Description
                }).ToList()
            };

            return Ok(summary);
        }
    }
}
