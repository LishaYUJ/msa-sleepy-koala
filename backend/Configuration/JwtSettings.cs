using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace SleepyKoala.Api.Configuration
{
    public sealed class JwtSettings
    {
        public const string SectionName = "Jwt";

        public required string Key { get; init; }
        public required string Issuer { get; init; }
        public required string Audience { get; init; }

        public static JwtSettings FromConfiguration(IConfiguration configuration)
        {
            var section = configuration.GetSection(SectionName);
            var settings = new JwtSettings
            {
                Key = section["Key"] ?? string.Empty,
                Issuer = section["Issuer"] ?? string.Empty,
                Audience = section["Audience"] ?? string.Empty
            };

            if (string.IsNullOrWhiteSpace(settings.Key) ||
                string.IsNullOrWhiteSpace(settings.Issuer) ||
                string.IsNullOrWhiteSpace(settings.Audience))
            {
                throw new InvalidOperationException("JWT configuration is incomplete. Set Jwt:Key, Jwt:Issuer, and Jwt:Audience.");
            }

            if (Encoding.UTF8.GetByteCount(settings.Key) < 32)
            {
                throw new InvalidOperationException("Jwt:Key must be at least 32 bytes for HMAC SHA-256 signing.");
            }

            return settings;
        }

        public SymmetricSecurityKey CreateSecurityKey()
        {
            return new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Key));
        }
    }
}
