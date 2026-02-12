using System.Text.Json.Serialization;

namespace PaymentDotnet.Models;

public class VerifyPaymentRequest
{
    [JsonPropertyName("razorpay_order_id")]
    public string RazorpayOrderId { get; set; } = string.Empty;

    [JsonPropertyName("razorpay_payment_id")]
    public string RazorpayPaymentId { get; set; } = string.Empty;

    [JsonPropertyName("razorpay_signature")]
    public string RazorpaySignature { get; set; } = string.Empty;

    // Added fields to support saving to DB
    [JsonPropertyName("booking_id")]
    public int BookingId { get; set; }

    [JsonPropertyName("amount")]
    public decimal Amount { get; set; }

    [JsonPropertyName("customer_id")]
    public int CustomerId { get; set; }
    
    [JsonPropertyName("provider_id")]
    public int? ProviderId { get; set; }
}
