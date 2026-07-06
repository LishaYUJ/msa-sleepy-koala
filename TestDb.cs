using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using SleepyKoala.Api.Data;
using SleepyKoala.Api.Models;

var options = new DbContextOptionsBuilder<ApplicationDbContext>()
    .UseSqlite("Data Source=sleepykoala.db")
    .Options;

using var context = new ApplicationDbContext(options);
var user = context.Users.Include(u => u.UserBadges).First();
Console.WriteLine($"User Current Streak: {user.CurrentStreak}");
user.CurrentStreak++;

var badge = context.Badges.First(b => b.RequiredStreak == 1);
user.UserBadges.Add(new UserBadge
{
    UserId = user.Id,
    BadgeId = badge.Id,
    UnlockedAtUtc = DateTime.UtcNow
});

try
{
    context.SaveChanges();
    Console.WriteLine("Success!");
}
catch (Exception ex)
{
    Console.WriteLine(ex.ToString());
}
