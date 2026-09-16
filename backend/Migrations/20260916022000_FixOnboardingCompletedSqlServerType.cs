using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using SleepyKoala.Api.Data;

#nullable disable

namespace SleepyKoala.Api.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260916022000_FixOnboardingCompletedSqlServerType")]
    public partial class FixOnboardingCompletedSqlServerType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            if (ActiveProvider != "Microsoft.EntityFrameworkCore.SqlServer")
            {
                return;
            }

            migrationBuilder.Sql(
                """
                IF EXISTS (
                    SELECT 1
                    FROM sys.columns AS columns
                    INNER JOIN sys.types AS types ON columns.user_type_id = types.user_type_id
                    WHERE columns.object_id = OBJECT_ID(N'[UserSettings]')
                      AND columns.name = N'OnboardingCompleted'
                      AND types.name = N'int'
                )
                BEGIN
                    ALTER TABLE [UserSettings]
                    ALTER COLUMN [OnboardingCompleted] bit NOT NULL;
                END
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            if (ActiveProvider != "Microsoft.EntityFrameworkCore.SqlServer")
            {
                return;
            }

            migrationBuilder.Sql(
                """
                IF EXISTS (
                    SELECT 1
                    FROM sys.columns AS columns
                    INNER JOIN sys.types AS types ON columns.user_type_id = types.user_type_id
                    WHERE columns.object_id = OBJECT_ID(N'[UserSettings]')
                      AND columns.name = N'OnboardingCompleted'
                      AND types.name = N'bit'
                )
                BEGIN
                    ALTER TABLE [UserSettings]
                    ALTER COLUMN [OnboardingCompleted] int NOT NULL;
                END
                """);
        }
    }
}
