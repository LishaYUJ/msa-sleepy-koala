using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SleepyKoala.Api.Migrations
{
    /// <inheritdoc />
    public partial class MarkExistingUsersOnboarded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // This migration follows the column addition. Every account that existed
            // before onboarding was introduced should retain normal app access.
            migrationBuilder.Sql("UPDATE [UserSettings] SET [OnboardingCompleted] = 1 WHERE [OnboardingCompleted] = 0");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // There is no reliable way to identify the original accounts after the
            // backfill, so their completed state is intentionally preserved.
        }
    }
}
