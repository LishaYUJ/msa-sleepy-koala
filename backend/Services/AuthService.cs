using System;
using System.Security.Claims;
using System.Text;
using SleepyKoala.Api.Data;
using SleepyKoala.Api.DTOs;
using SleepyKoala.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

namespace SleepyKoala.Api.Services
{
    public interface IAuthService
    {
        Task<AuthResponse?> RegisterAsync(RegisterRequest request);
        Task<AuthResponse?> LoginAsync(LoginRequest request);
    }

    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<AuthResponse?> RegisterAsync(RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return null;
            }

            var user = new User
            {
                Email = request.Email,
                Nickname = request.Nickname,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
            };
            
            var settings = new UserSettings
            {
                UserId = user.Id
            };
            user.Settings = settings;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);
            return new AuthResponse
            {
                UserId = user.Id,
                Email = user.Email,
                Nickname = user.Nickname,
                Token = token
            };
        }

        public async Task<AuthResponse?> LoginAsync(LoginRequest request)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == request.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return null;
            }

            var token = GenerateJwtToken(user);
            return new AuthResponse
            {
                UserId = user.Id,
                Email = user.Email,
                Nickname = user.Nickname,
                Token = token
            };
        }

        private string GenerateJwtToken(User user)
        {
            var keyStr = _config["Jwt:Key"] ?? "super_secret_key_that_is_long_enough_for_hmac_sha256_at_least_32_bytes";
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyStr));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("nickname", user.Nickname)
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
