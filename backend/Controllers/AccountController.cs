using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SleepyKoala.Api.Data;
using SleepyKoala.Api.Extensions;

namespace SleepyKoala.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/account")]
    public class AccountController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AccountController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpDelete("me")]
        public async Task<IActionResult> DeleteMyAccount()
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            var user = await _context.Users.SingleOrDefaultAsync(item => item.Id == userId.Value);
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
