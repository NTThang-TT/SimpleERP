// ==========================================
// SIMPLE ERP — .NET 8 Web API
// Clean Architecture (API / Core / Infrastructure / Shared)
// Entity Framework Core + SQL Server
// ==========================================

using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using SimpleERP.Infrastructure.Data;
using SimpleERP.Core.Interfaces;
using SimpleERP.Infrastructure.Repositories;
using SimpleERP.API.Middlewares;

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// ĐĂNG KÝ SERVICES
// ==========================================

// Entity Framework Core — Kết nối SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repository Pattern
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();

// Controller-based API
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "SimpleERP API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Nhập JWT Token vào ô dưới đây"
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
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
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? ""))
        };
    });

// CORS: Cho phép Angular (cổng 4200) gọi API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy.WithOrigins("http://localhost:4200")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

var app = builder.Build();

// ==========================================
// CẤU HÌNH MIDDLEWARE
// ==========================================

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "SimpleERP API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowAngular");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// ==========================================
// CHẠY SERVER
// ==========================================
Console.WriteLine("==================================================");
Console.WriteLine("  🚀 SimpleERP API Server đang chạy!");
Console.WriteLine("  📍 URL:   http://localhost:5000");
Console.WriteLine("  📖 Docs:  http://localhost:5000/swagger");
Console.WriteLine("  🗄️  DB:   SimpleERP (SQL Server)");
Console.WriteLine("==================================================");

app.Run("http://localhost:5000");
