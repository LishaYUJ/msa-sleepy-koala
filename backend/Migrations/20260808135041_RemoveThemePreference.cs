using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SleepyKoala.Api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveThemePreference : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ThemePreference",
                table: "UserSettings");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            var themePreferenceType = ActiveProvider == "Microsoft.EntityFrameworkCore.SqlServer"
                ? "nvarchar(16)"
                : "TEXT";

            migrationBuilder.AddColumn<string>(
                name: "ThemePreference",
                table: "UserSettings",
                type: themePreferenceType,
                maxLength: 16,
                nullable: false,
                defaultValue: "system");
        }
    }
}
