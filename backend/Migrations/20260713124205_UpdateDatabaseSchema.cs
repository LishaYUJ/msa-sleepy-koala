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
            migrationBuilder.AddColumn<string>(
                name: "Timezone",
                table: "UserSettings",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
