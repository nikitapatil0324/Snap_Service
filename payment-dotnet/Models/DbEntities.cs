using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PaymentDotnet.Models;

[Table("payments")]
public class Payment
{
    [Key]
    [Column("payment_id")]
    public int PaymentId { get; set; }

    [Column("booking_booking_id")]
    public int BookingBookingId { get; set; }

    [Column("amount")]
    public decimal Amount { get; set; }

    [Column("transaction_id")]
    public string TransactionId { get; set; } = string.Empty;

    [Column("payment_method")]
    public string PaymentMethod { get; set; } = "Razorpay";

    [Column("payment_status")]
    public string PaymentStatus { get; set; } = "SUCCESS";

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
