using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using SleepyKoala.Api.Data;
using SleepyKoala.Api.DTOs;
using SleepyKoala.Api.Models;
using SleepyKoala.Api.Services;
using System;
using System.Threading.Tasks;
using Xunit;

namespace SleepyKoala.Tests
{
    public class CheckInServiceTests : IDisposable
    {
        private readonly SqliteConnection _connection;
        private readonly ApplicationDbContext _context;
        private readonly CheckInService _service;

        public CheckInServiceTests()
        {
            _connection = new SqliteConnection("DataSource=:memory:");
            _connection.Open();

            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseSqlite(_connection)
                .Options;

            _context = new ApplicationDbContext(options);
            _context.Database.EnsureCreated();

            _service = new CheckInService(_context);
        }

        public void Dispose()
        {
            _context.Dispose();
            _connection.Close();
            _connection.Dispose();
        }

        [Fact]
        public async Task CheckInAsync_OnTime_IncrementsStreak()
        {
            // Arrange
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "test@example.com",
                Nickname = "Test",
                PasswordHash = "hash",
                CurrentStreak = 0,
                LongestStreak = 0
            };
            var settings = new UserSettings
            {
                UserId = user.Id,
                CutoffTime = "22:00"
            };
            user.Settings = settings;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var request = new CheckInRequest
            {
                LocalDate = "2026-07-13",
                LocalTime = "21:30"
            };

            // Act
            var result = await _service.CheckInAsync(user.Id, request);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("onTime", result.Status);
            Assert.Equal("2026-07-13", result.LocalCheckInDate);
            Assert.Equal(1, result.CurrentStreak);

            var updatedUser = await _context.Users.FindAsync(user.Id);
            Assert.Equal(1, updatedUser!.CurrentStreak);
            Assert.Equal(1, updatedUser.LongestStreak);
        }

        [Fact]
        public async Task CheckInAsync_Late_ResetsStreak()
        {
            // Arrange
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "test@example.com",
                Nickname = "Test",
                PasswordHash = "hash",
                CurrentStreak = 5,
                LongestStreak = 5
            };
            var settings = new UserSettings
            {
                UserId = user.Id,
                CutoffTime = "22:00"
            };
            user.Settings = settings;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var request = new CheckInRequest
            {
                LocalDate = "2026-07-13",
                LocalTime = "22:15"
            };

            // Act
            var result = await _service.CheckInAsync(user.Id, request);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("late", result.Status);
            Assert.Equal(0, result.CurrentStreak);

            var updatedUser = await _context.Users.FindAsync(user.Id);
            Assert.Equal(0, updatedUser!.CurrentStreak);
            Assert.Equal(5, updatedUser.LongestStreak); // Longest streak preserved
        }

        [Fact]
        public async Task CheckInAsync_AfterMidnight_StoresPreviousSleepDateAndMarksLate()
        {
            // Arrange
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "test@example.com",
                Nickname = "Test",
                PasswordHash = "hash",
                CurrentStreak = 4,
                LongestStreak = 4
            };
            var settings = new UserSettings
            {
                UserId = user.Id,
                CutoffTime = "22:00"
            };
            user.Settings = settings;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var request = new CheckInRequest
            {
                LocalDate = "2026-07-29",
                LocalTime = "00:10"
            };

            // Act
            var result = await _service.CheckInAsync(user.Id, request);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("late", result.Status);
            Assert.Equal("2026-07-28", result.LocalCheckInDate);
            Assert.Equal(0, result.CurrentStreak);
        }

        [Fact]
        public async Task CheckInAsync_AtTwoAm_StillAllowsLatePreviousSleepDate()
        {
            // Arrange
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "test@example.com",
                Nickname = "Test",
                PasswordHash = "hash",
                CurrentStreak = 1,
                LongestStreak = 1
            };
            var settings = new UserSettings
            {
                UserId = user.Id,
                CutoffTime = "22:00"
            };
            user.Settings = settings;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var request = new CheckInRequest
            {
                LocalDate = "2026-07-29",
                LocalTime = "02:00"
            };

            // Act
            var result = await _service.CheckInAsync(user.Id, request);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("late", result.Status);
            Assert.Equal("2026-07-28", result.LocalCheckInDate);
        }

        [Fact]
        public async Task CheckInAsync_AfterTwoAm_RejectsCheckIn()
        {
            // Arrange
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "test@example.com",
                Nickname = "Test",
                PasswordHash = "hash",
                CurrentStreak = 1
            };
            var settings = new UserSettings
            {
                UserId = user.Id,
                CutoffTime = "22:00"
            };
            user.Settings = settings;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var request = new CheckInRequest
            {
                LocalDate = "2026-07-29",
                LocalTime = "02:01"
            };

            // Act & Assert
            var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _service.CheckInAsync(user.Id, request));
            Assert.Equal("CheckInWindowClosed", ex.Message);
        }

        [Fact]
        public async Task CheckInAsync_BeforeNinePm_RejectsCheckIn()
        {
            // Arrange
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "test@example.com",
                Nickname = "Test",
                PasswordHash = "hash",
                CurrentStreak = 1
            };
            var settings = new UserSettings
            {
                UserId = user.Id,
                CutoffTime = "22:00"
            };
            user.Settings = settings;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var request = new CheckInRequest
            {
                LocalDate = "2026-07-28",
                LocalTime = "20:59"
            };

            // Act & Assert
            var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _service.CheckInAsync(user.Id, request));
            Assert.Equal("CheckInWindowClosed", ex.Message);
        }

        [Fact]
        public async Task CheckInAsync_MidnightCutoff_AllowsMidnightAsOnTime()
        {
            // Arrange
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "test@example.com",
                Nickname = "Test",
                PasswordHash = "hash",
                CurrentStreak = 0,
                LongestStreak = 0
            };
            var settings = new UserSettings
            {
                UserId = user.Id,
                CutoffTime = "00:00"
            };
            user.Settings = settings;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var request = new CheckInRequest
            {
                LocalDate = "2026-07-29",
                LocalTime = "00:00"
            };

            // Act
            var result = await _service.CheckInAsync(user.Id, request);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("onTime", result.Status);
            Assert.Equal("2026-07-28", result.LocalCheckInDate);
            Assert.Equal(1, result.CurrentStreak);
        }

        [Fact]
        public async Task CheckInAsync_AfterMidnightDuplicate_UsesPreviousSleepDate()
        {
            // Arrange
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "test@example.com",
                Nickname = "Test",
                PasswordHash = "hash",
                CurrentStreak = 1
            };
            var settings = new UserSettings
            {
                UserId = user.Id,
                CutoffTime = "22:00"
            };
            user.Settings = settings;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            await _service.CheckInAsync(user.Id, new CheckInRequest
            {
                LocalDate = "2026-07-28",
                LocalTime = "21:30"
            });

            var afterMidnightRequest = new CheckInRequest
            {
                LocalDate = "2026-07-29",
                LocalTime = "00:30"
            };

            // Act & Assert
            var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _service.CheckInAsync(user.Id, afterMidnightRequest));
            Assert.Equal("DuplicateCheckIn", ex.Message);
        }

        [Fact]
        public async Task CheckInAsync_DuplicateDate_ThrowsException()
        {
            // Arrange
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "test@example.com",
                Nickname = "Test",
                PasswordHash = "hash",
                CurrentStreak = 0
            };
            var settings = new UserSettings
            {
                UserId = user.Id,
                CutoffTime = "22:00"
            };
            user.Settings = settings;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var request = new CheckInRequest
            {
                LocalDate = "2026-07-13",
                LocalTime = "21:30"
            };

            // First checkin
            await _service.CheckInAsync(user.Id, request);

            // Act & Assert (duplicate check)
            await Assert.ThrowsAsync<InvalidOperationException>(() => _service.CheckInAsync(user.Id, request));
        }

        [Fact]
        public async Task CheckInAsync_ConsecutiveDays_IncreasesStreak()
        {
            // Arrange
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "test@example.com",
                Nickname = "Test",
                PasswordHash = "hash",
                CurrentStreak = 2,
                LongestStreak = 2
            };
            var settings = new UserSettings
            {
                UserId = user.Id,
                CutoffTime = "22:00"
            };
            user.Settings = settings;

            _context.Users.Add(user);

            // Add checkin from yesterday
            var lastCheckIn = new CheckIn
            {
                UserId = user.Id,
                LocalCheckInDate = "2026-07-12",
                Status = "onTime"
            };
            _context.CheckIns.Add(lastCheckIn);
            await _context.SaveChangesAsync();

            var request = new CheckInRequest
            {
                LocalDate = "2026-07-13",
                LocalTime = "21:00"
            };

            // Act
            var result = await _service.CheckInAsync(user.Id, request);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(3, result.CurrentStreak);
        }

        [Fact]
        public async Task CheckInAsync_NonConsecutiveDays_ResetsStreakCorrectly()
        {
            // Arrange
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "test@example.com",
                Nickname = "Test",
                PasswordHash = "hash",
                CurrentStreak = 3,
                LongestStreak = 3
            };
            var settings = new UserSettings
            {
                UserId = user.Id,
                CutoffTime = "22:00"
            };
            user.Settings = settings;

            _context.Users.Add(user);

            // Last check-in was 3 days ago (gap in check-in)
            var lastCheckIn = new CheckIn
            {
                UserId = user.Id,
                LocalCheckInDate = "2026-07-10",
                Status = "onTime"
            };
            _context.CheckIns.Add(lastCheckIn);
            await _context.SaveChangesAsync();

            var request = new CheckInRequest
            {
                LocalDate = "2026-07-13",
                LocalTime = "21:00"
            };

            // Act
            var result = await _service.CheckInAsync(user.Id, request);

            // Assert starts fresh at 1 since they checked in on-time today after missing/breaking their streak.
            Assert.NotNull(result);
            Assert.Equal(1, result.CurrentStreak);
        }
    }
}
