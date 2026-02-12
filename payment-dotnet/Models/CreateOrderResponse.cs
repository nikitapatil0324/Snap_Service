namespace PaymentDotnet.Models;

public class CreateOrderResponse
{
    public string OrderId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "INR";
    public string Key { get; set; } = string.Empty;
}
