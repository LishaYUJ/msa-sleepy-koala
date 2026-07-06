using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using SleepyKoala.Api.Data;
using SleepyKoala.Api.Models;

var ctx = new ApplicationDbContext(new DbContextOptionsBuilder<ApplicationDbContext>()
    .UseSqlite("Data Source=sleepykoala.db")
    .EnableSensitiveDataLogging()
    .Options);

var user = ctx.Users.Include(u => u.UserBadges).Include(u => u.Settings).OrderByDescending(u=>u.CreatedAtUtc).First();

var checkIn = new CheckIn
{
    UserId = user.Id,
    LocalCheckInDate = "2026-07-04",
    Status = "onTime",
    CreatedAtUtc = DateTime.UtcNow
};
ctx.CheckIns.Add(checkIn);

user.CurrentStreak++;
try { ctx.SaveChanges(); Console.WriteLine("OK"); }
catch (Exception ex) { Console.WriteLine("ERROR: " + ex.Message); }
