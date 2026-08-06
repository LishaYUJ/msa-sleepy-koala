using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace SleepyKoala.Api.Data;

public sealed class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var provider = Environment.GetEnvironmentVariable("Database__Provider") ?? "Sqlite";
        var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
            ?? "Data Source=sleepykoala.db";
        var options = new DbContextOptionsBuilder<ApplicationDbContext>();

        if (provider.Equals("SqlServer", StringComparison.OrdinalIgnoreCase))
        {
            options
                .UseSqlServer(connectionString)
                // The shared migration snapshot is generated with the local SQLite provider.
                // Migration operations select provider-specific SQL types at runtime.
                .ConfigureWarnings(warnings => warnings.Ignore(
                    RelationalEventId.PendingModelChangesWarning));
        }
        else if (provider.Equals("Sqlite", StringComparison.OrdinalIgnoreCase))
        {
            options.UseSqlite(connectionString);
        }
        else
        {
            throw new InvalidOperationException(
                $"Unsupported database provider '{provider}'. Use 'Sqlite' or 'SqlServer'.");
        }

        return new ApplicationDbContext(options.Options);
    }
}
