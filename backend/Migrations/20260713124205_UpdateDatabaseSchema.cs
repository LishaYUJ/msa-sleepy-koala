using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SleepyKoala.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDatabaseSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Timezone",
                table: "UserSettings");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            var timezoneType = ActiveProvider == "Microsoft.EntityFrameworkCore.SqlServer"
                ? "nvarchar(100)"
                : "TEXT";

            migrationBuilder.AddColumn<string>(
                name: "Timezone",
                table: "UserSettings",
                type: timezoneType,
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }
    }
}
