using Razorpay.Api;
using PaymentDotnet.Models;
using System.Security.Cryptography;
using System.Text;

namespace PaymentDotnet.Services;

public class RazorpayService
{
    private readonly string _keyId;
    private readonly string _keySecret;
    private readonly RazorpayClient _client;

    public RazorpayService(IConfiguration configuration)
    {
        _keyId = configuration["Razorpay:KeyId"]!;
        _keySecret = configuration["Razorpay:KeySecret"]!;
        _client = new RazorpayClient(_keyId, _keySecret);
    }

    // ✅ ADD THIS METHOD (THIS FIXES YOUR BUILD ERROR)
    public CreateOrderResponse CreateOrder(decimal amount)
    {
        var options = new Dictionary<string, object>
        {
            { "amount", (int)(amount * 100) }, // paise
            { "currency", "INR" },
            { "payment_capture", 1 }
        };

        Order order = _client.Order.Create(options);

        return new CreateOrderResponse
        {
            OrderId = order["id"].ToString(),
            Amount = amount,
            Currency = "INR",
            Key = _keyId
        };
    }

    // ✅ KEEP YOUR VERIFY METHOD
    public bool VerifyPayment(VerifyPaymentRequest request)
    {
        string payload = $"{request.RazorpayOrderId}|{request.RazorpayPaymentId}";

        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_keySecret));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));

        string generatedSignature = Convert.ToHexString(hash).ToLower();

        return generatedSignature == request.RazorpaySignature;
    }
}
