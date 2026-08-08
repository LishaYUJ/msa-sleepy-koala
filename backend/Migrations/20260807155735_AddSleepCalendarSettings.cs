using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SleepyKoala.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddSleepCalendarSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var timeZoneType = ActiveProvider == "Microsoft.EntityFrameworkCore.SqlServer"
                ? "nvarchar(100)"
                : "TEXT";
            var dateType = ActiveProvider == "Microsoft.EntityFrameworkCore.SqlServer"
                ? "nvarchar(10)"
                : "TEXT";

            migrationBuilder.AddColumn<string>(
                name: "TimeZoneId",
                table: "UserSettings",
                type: timeZoneType,
                maxLength: 100,
                nullable: false,
                defaultValue: "Pacific/Auckland");

            migrationBuilder.AddColumn<string>(
                name: "TrackingStartSleepDate",
                table: "UserSettings",
                type: dateType,
                maxLength: 10,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TimeZoneId",
                table: "UserSettings");

            migrationBuilder.DropColumn(
                name: "TrackingStartSleepDate",
                table: "UserSettings");
        }
    }
}
