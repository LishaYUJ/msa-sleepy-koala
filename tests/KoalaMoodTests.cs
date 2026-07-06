using System;
using SleepyKoala.Api.Models;
using SleepyKoala.Api.Services;
using Xunit;

namespace SleepyKoala.Tests
{
    public class KoalaMoodTests
    {
        private readonly CheckInService _checkInService;

        public KoalaMoodTests()
        {
            // We can pass null or mock for ApplicationDbContext since CalculateKoalaMood is pure logic
            _checkInService = new CheckInService(null!); 
        }

        [Fact]
        public void CalculateKoalaMood_Champion_WhenOnTimeAndStreakGreaterThan7()
        {
            // Arrange
            var user = new User { Email = "test@test.com", PasswordHash = "hash", Nickname = "test", CurrentStreak = 7 };

            // Act
            var mood = _checkInService.CalculateKoalaMood(user, "onTime");

            // Assert
            Assert.Equal("champion", mood);
        }

        [Fact]
        public void CalculateKoalaMood_Calm_WhenOnTimeAndStreakLessThan7()
        {
            // Arrange
            var user = new User { Email = "test@test.com", PasswordHash = "hash", Nickname = "test", CurrentStreak = 4 };

            // Act
            var mood = _checkInService.CalculateKoalaMood(user, "onTime");

            // Assert
            Assert.Equal("calm", mood);
        }

        [Fact]
        public void CalculateKoalaMood_PandaEye_WhenLateAndStreakNotZero()
        {
            // Arrange
            var user = new User { Email = "test@test.com", PasswordHash = "hash", Nickname = "test", CurrentStreak = 2 };

            // Act
            var mood = _checkInService.CalculateKoalaMood(user, "late");

            // Assert
            Assert.Equal("panda-eye", mood);
        }

        [Fact]
        public void CalculateKoalaMood_Exhausted_WhenLateAndStreakZero()
        {
            // Arrange
            var user = new User { Email = "test@test.com", PasswordHash = "hash", Nickname = "test", CurrentStreak = 0 };

            // Act
            var mood = _checkInService.CalculateKoalaMood(user, "late");

            // Assert
            Assert.Equal("exhausted", mood);
        }
    }
}
