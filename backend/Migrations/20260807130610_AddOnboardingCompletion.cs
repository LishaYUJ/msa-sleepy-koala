using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SleepyKoala.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddOnboardingCompletion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var booleanType = ActiveProvider == "Microsoft.EntityFrameworkCore.SqlServer"
                ? "bit"
                : "INTEGER";

            migrationBuilder.AddColumn<bool>(
                name: "OnboardingCompleted",
                table: "UserSettings",
                type: booleanType,
                nullable: false,
                // Existing accounts keep their access. New registrations explicitly
                // save false until they finish the onboarding flow.
                defaultValue: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OnboardingCompleted",
                table: "UserSettings");
        }
    }
}
