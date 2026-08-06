using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SleepyKoala.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var isSqlServer = ActiveProvider == "Microsoft.EntityFrameworkCore.SqlServer";
            var guidType = isSqlServer ? "uniqueidentifier" : "TEXT";
            var dateTimeType = isSqlServer ? "datetime2" : "TEXT";
            var intType = isSqlServer ? "int" : "INTEGER";
            var nameType = isSqlServer ? "nvarchar(100)" : "TEXT";
            var descriptionType = isSqlServer ? "nvarchar(500)" : "TEXT";
            var emailType = isSqlServer ? "nvarchar(320)" : "TEXT";
            var passwordHashType = isSqlServer ? "nvarchar(100)" : "TEXT";
            var nicknameType = isSqlServer ? "nvarchar(50)" : "TEXT";
            var shortTextType = isSqlServer ? "nvarchar(16)" : "TEXT";
            var dateTextType = isSqlServer ? "nvarchar(10)" : "TEXT";
            var timeTextType = isSqlServer ? "nvarchar(5)" : "TEXT";
            var timezoneType = isSqlServer ? "nvarchar(100)" : "TEXT";

            migrationBuilder.CreateTable(
                name: "Badges",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: guidType, nullable: false),
                    Name = table.Column<string>(type: nameType, maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: descriptionType, maxLength: 500, nullable: false),
                    RequiredStreak = table.Column<int>(type: intType, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Badges", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: guidType, nullable: false),
                    Email = table.Column<string>(type: emailType, maxLength: 320, nullable: false),
                    PasswordHash = table.Column<string>(type: passwordHashType, maxLength: 100, nullable: false),
                    Nickname = table.Column<string>(type: nicknameType, maxLength: 50, nullable: false),
                    CurrentStreak = table.Column<int>(type: intType, nullable: false),
                    LongestStreak = table.Column<int>(type: intType, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: dateTimeType, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CheckIns",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: guidType, nullable: false),
                    UserId = table.Column<Guid>(type: guidType, nullable: false),
                    LocalCheckInDate = table.Column<string>(type: dateTextType, maxLength: 10, nullable: false),
                    Status = table.Column<string>(type: shortTextType, maxLength: 16, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: dateTimeType, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CheckIns", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CheckIns_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserBadges",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: guidType, nullable: false),
                    UserId = table.Column<Guid>(type: guidType, nullable: false),
                    BadgeId = table.Column<Guid>(type: guidType, nullable: false),
                    UnlockedAtUtc = table.Column<DateTime>(type: dateTimeType, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserBadges", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserBadges_Badges_BadgeId",
                        column: x => x.BadgeId,
                        principalTable: "Badges",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserBadges_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserSettings",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: guidType, nullable: false),
                    CutoffTime = table.Column<string>(type: timeTextType, maxLength: 5, nullable: false),
                    Timezone = table.Column<string>(type: timezoneType, maxLength: 100, nullable: false),
                    ThemePreference = table.Column<string>(type: shortTextType, maxLength: 16, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSettings", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_UserSettings_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Badges",
                columns: new[] { "Id", "Description", "Name", "RequiredStreak" },
                columnTypes: new[] { guidType, descriptionType, nameType, intType },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), "Completed your first on-time bedtime check-in", "First Sleep", 1 },
                    { new Guid("22222222-2222-2222-2222-222222222222"), "Complete 3 consecutive on-time bedtime check-ins", "3-Day Koala Care", 3 },
                    { new Guid("33333333-3333-3333-3333-333333333333"), "Complete 7 consecutive on-time bedtime check-ins", "One Week Calm", 7 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_CheckIns_UserId_LocalCheckInDate",
                table: "CheckIns",
                columns: new[] { "UserId", "LocalCheckInDate" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserBadges_BadgeId",
                table: "UserBadges",
                column: "BadgeId");

            migrationBuilder.CreateIndex(
                name: "IX_UserBadges_UserId",
                table: "UserBadges",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CheckIns");

            migrationBuilder.DropTable(
                name: "UserBadges");

            migrationBuilder.DropTable(
                name: "UserSettings");

            migrationBuilder.DropTable(
                name: "Badges");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
