
/*using Microsoft.AspNetCore.Mvc;

namespace SleepyKoala.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TimezonesController : ControllerBase
    {
        /// <summary>
        /// Returns all IANA system timezone names, grouped by region prefix.
        /// Used by the frontend scroll-picker to let the user select their timezone.
        /// </summary>
        [HttpGet]
        public IActionResult GetTimezones()
        {
            var allZones = TimeZoneInfo.GetSystemTimeZones();

            // Group by region prefix (e.g. "Pacific", "Asia", "America")
            // Timezones that have no "/" are placed in a generic "Other" group
            var grouped = allZones
                .GroupBy(tz =>
                {
                    var slashIndex = tz.Id.IndexOf('/');
                    return slashIndex > 0 ? tz.Id[..slashIndex] : "Other";
                })
                .OrderBy(g => g.Key)
                .Select(g => new
                {
                    region = g.Key,
                    timezones = g
                        .OrderBy(tz => tz.Id)
                        .Select(tz => new
                        {
                            id = tz.Id,              // e.g. "Pacific/Auckland"
                            displayName = tz.DisplayName // e.g. "(UTC+12:00) Auckland, Wellington"
                        })
                        .ToList()
                })
                .ToList();

            return Ok(grouped);
        }

        /// <summary>
        /// Validates a single timezone ID. Returns 200 if valid, 400 if not.
        /// Useful for frontend validation before saving settings.
        /// </summary>
        [HttpGet("validate")]
        public IActionResult ValidateTimezone([FromQuery] string id)
        {
            try
            {
                TimeZoneInfo.FindSystemTimeZoneById(id);
                return Ok(new { valid = true, id });
            }
            catch (TimeZoneNotFoundException)
            {
                return BadRequest(new { valid = false, error = "InvalidTimezone", message = $"'{id}' is not a recognised timezone." });
            }
        }
    }
}
*/