using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SleepyKoala.Api.Data;
using SleepyKoala.Api.DTOs;
using SleepyKoala.Api.Extensions;
using SleepyKoala.Api.Services;

namespace SleepyKoala.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class CheckInsController : ControllerBase
    {
        private readonly ICheckInService _checkInService;
        private readonly ApplicationDbContext _context;

        public CheckInsController(ICheckInService checkInService, ApplicationDbContext context)
        {
            _checkInService = checkInService;
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateCheckIn(CheckInRequest request)
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            try
            {
                var response = await _checkInService.CheckInAsync(userId.Value, request);
                if (response == null) return NotFound();
                return Ok(response);
            }
            catch (InvalidOperationException ex) when (ex.Message == "DuplicateCheckIn")
            {
                return BadRequest(new { error = "DuplicateCheckIn", message = "You have already checked in today." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = "InvalidArgument", message = ex.Message });
            }
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMyCheckIns()
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            var checkIns = await _context.CheckIns
                .Where(c => c.UserId == userId.Value)
                .OrderByDescending(c => c.LocalCheckInDate)
                .Select(c => new CheckInHistoryDto
                {
                    Id = c.Id,
                    LocalCheckInDate = c.LocalCheckInDate,
                    Status = c.Status
                })
                .ToListAsync();

            return Ok(checkIns);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCheckIn(Guid id)
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            var checkIn = await _context.CheckIns.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId.Value);
            if (checkIn == null) return NotFound();

            _context.CheckIns.Remove(checkIn);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
