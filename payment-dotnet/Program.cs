using Microsoft.EntityFrameworkCore;
using PaymentDotnet.Data;
using PaymentDotnet.Services;

var builder = WebApplication.CreateBuilder(args);

// -------------------- SERVICES --------------------

// Controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Razorpay Service
builder.Services.AddScoped<RazorpayService>();

// ✅ Database Context (CRITICAL)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
Console.WriteLine($"DB Connection: {connectionString}");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString)
    )
);

// CORS (React)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// -------------------- APP --------------------

var app = builder.Build();

// Swagger UI
app.UseSwagger();
app.UseSwaggerUI();

// CORS must be BEFORE controllers
app.UseCors("AllowFrontend");

// ❌ HTTPS disabled intentionally for local dev
// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// ✅ FORCE PORT 5000
app.Run("http://localhost:5000");
