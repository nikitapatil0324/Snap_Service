using Microsoft.EntityFrameworkCore;
using PaymentDotnet.Models;

namespace PaymentDotnet.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Payment> Payments { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    
}
