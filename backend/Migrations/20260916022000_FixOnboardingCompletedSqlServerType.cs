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
                    WHERE columns.object_id = OBJECT_ID(N'[dbo].[UserSettings]')
                      AND columns.name = N'OnboardingCompleted'
                      AND types.name = N'int'
                )
                BEGIN
                    DECLARE @defaultConstraintName sysname;

                    SELECT @defaultConstraintName = defaults.name
                    FROM sys.default_constraints AS defaults
                    INNER JOIN sys.columns AS columns
                        ON defaults.parent_object_id = columns.object_id
                       AND defaults.parent_column_id = columns.column_id
                    WHERE columns.object_id = OBJECT_ID(N'[dbo].[UserSettings]')
                      AND columns.name = N'OnboardingCompleted';

                    IF @defaultConstraintName IS NOT NULL
                    BEGIN
                        DECLARE @dropConstraintSql nvarchar(max);
                        SET @dropConstraintSql =
                            N'ALTER TABLE [dbo].[UserSettings] DROP CONSTRAINT '
                            + QUOTENAME(@defaultConstraintName);
                        EXEC sys.sp_executesql @dropConstraintSql;
                    END;

                    ALTER TABLE [dbo].[UserSettings]
                    ALTER COLUMN [OnboardingCompleted] bit NOT NULL;

                    ALTER TABLE [dbo].[UserSettings]
                    ADD CONSTRAINT [DF_UserSettings_OnboardingCompleted]
                        DEFAULT (CONVERT(bit, (1))) FOR [OnboardingCompleted];
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
                    WHERE columns.object_id = OBJECT_ID(N'[dbo].[UserSettings]')
                      AND columns.name = N'OnboardingCompleted'
                      AND types.name = N'bit'
                )
                BEGIN
                    DECLARE @defaultConstraintName sysname;

                    SELECT @defaultConstraintName = defaults.name
                    FROM sys.default_constraints AS defaults
                    INNER JOIN sys.columns AS columns
                        ON defaults.parent_object_id = columns.object_id
                       AND defaults.parent_column_id = columns.column_id
                    WHERE columns.object_id = OBJECT_ID(N'[dbo].[UserSettings]')
                      AND columns.name = N'OnboardingCompleted';

                    IF @defaultConstraintName IS NOT NULL
                    BEGIN
                        DECLARE @dropConstraintSql nvarchar(max);
                        SET @dropConstraintSql =
                            N'ALTER TABLE [dbo].[UserSettings] DROP CONSTRAINT '
                            + QUOTENAME(@defaultConstraintName);
                        EXEC sys.sp_executesql @dropConstraintSql;
                    END;

                    ALTER TABLE [dbo].[UserSettings]
                    ALTER COLUMN [OnboardingCompleted] int NOT NULL;

                    ALTER TABLE [dbo].[UserSettings]
                    ADD CONSTRAINT [DF_UserSettings_OnboardingCompleted]
                        DEFAULT (CONVERT(int, (1))) FOR [OnboardingCompleted];
                END
                """);
        }
    }
}
