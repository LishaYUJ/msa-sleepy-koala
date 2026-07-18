using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace SleepyKoala.Api.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static Guid? GetUserId(this ClaimsPrincipal user)
        {
            var userIdStr = user.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? user.FindFirstValue(JwtRegisteredClaimNames.Sub);

            return Guid.TryParse(userIdStr, out var userId) ? userId : null;
        }
    }
}
