using System;
using System.ComponentModel.DataAnnotations;

namespace SleepyKoala.Api.DTOs
{
    public class RegisterRequest
    {
        [Required, EmailAddress]
        public required string Email { get; set; }
        
        [Required, MinLength(6)]
        public required string Password { get; set; }
        
        [Required]
        public required string Nickname { get; set; }
    }

    public class LoginRequest
    {
        [Required, EmailAddress]
        public required string Email { get; set; }
        
        [Required]
        public required string Password { get; set; }
    }

    public class AuthResponse
    {
        public Guid UserId { get; set; }
        public required string Email { get; set; }
        public required string Nickname { get; set; }
        public required string Token { get; set; }
    }
}
