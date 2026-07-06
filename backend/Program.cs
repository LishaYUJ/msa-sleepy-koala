using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SleepyKoala.Api.Data;
using SleepyKoala.Api.Services;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// 1. Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Authentication (JWT)
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "super_secret_default_key"))
    };
});

// 3. Application Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICheckInService, CheckInService>();

// 4. Controllers & Features
builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // Use the native OpenAPI and Scalar
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseCors(policy => policy
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
