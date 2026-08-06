using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SleepyKoala.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddUserAvatar : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var avatarType = ActiveProvider == "Microsoft.EntityFrameworkCore.SqlServer"
                ? "nvarchar(max)"
                : "TEXT";

            migrationBuilder.AddColumn<string>(
                name: "AvatarDataUrl",
                table: "Users",
                type: avatarType,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvatarDataUrl",
                table: "Users");
        }
    }
}
