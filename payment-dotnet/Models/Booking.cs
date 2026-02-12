using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PaymentDotnet.Models;

[Table("bookings")]
public class Booking
{
    [Key]
    [Column("booking_id")]
    public int BookingId { get; set; }

    [Column("status")]
    public string? Status { get; set; }
}
