using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PaymentDotnet.Models;
using PaymentDotnet.Services;
using PaymentDotnet.Data;

namespace PaymentDotnet.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly RazorpayService _razorpayService;
    private readonly AppDbContext _context;
    private readonly ILogger<PaymentController> _logger;

    public PaymentController(RazorpayService razorpayService, AppDbContext context, ILogger<PaymentController> logger)
    {
        _razorpayService = razorpayService;
        _context = context;
        _logger = logger;
    }

    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok(new { message = "Payment API is running!", timestamp = DateTime.Now });
    }

    [HttpPost("create-order")]
    public IActionResult CreateOrder([FromQuery] decimal? amount)
    {
        try
        {
            decimal finalAmount = amount ?? 500;
            if (finalAmount <= 0) return BadRequest("Invalid amount");

            var response = _razorpayService.CreateOrder(finalAmount);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating order");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPost("verify")]
    public IActionResult Verify([FromBody] VerifyPaymentRequest request)
    {
        _logger.LogInformation("Received Verification Request: {@Request}", request);

        if (request == null ||
            string.IsNullOrEmpty(request.RazorpayOrderId) ||
            string.IsNullOrEmpty(request.RazorpayPaymentId) ||
            string.IsNullOrEmpty(request.RazorpaySignature))
        {
            return BadRequest(new { error = "Invalid payment details sent from frontend" });
        }

        // 1️⃣ Verify Razorpay Signature
        bool isValid = _razorpayService.VerifyPayment(request);
        if (!isValid)
        {
            _logger.LogWarning("Signature Verification Failed for Order: {OrderId}", request.RazorpayOrderId);
            return BadRequest(new { error = "Payment signature verification failed. Possible tampering or wrong keys." });
        }

        try
        {
            // 2️⃣ DUPLICATE PAYMENT CHECK
            var existingPayment = _context.Payments
                .FirstOrDefault(p => p.TransactionId == request.RazorpayPaymentId);

            if (existingPayment != null)
            {
                return Ok(new { message = "Payment already processed", status = "DONE" });
            }

            // 3️⃣ SAVE PAYMENT
            var payment = new Payment
            {
                BookingBookingId = request.BookingId,
                Amount = request.Amount,
                TransactionId = request.RazorpayPaymentId,
                PaymentMethod = "Razorpay",
                PaymentStatus = "SUCCESS",
                CreatedAt = DateTime.UtcNow
            };

            _context.Payments.Add(payment);

            // 4️⃣ UPDATE BOOKING STATUS (OPTIONAL)
            try
            {
                var booking = _context.Bookings
                    .FirstOrDefault(b => b.BookingId == request.BookingId);

                if (booking != null)
                {
                    booking.Status = "Paid"; // Using 'status' column which exists in Java
                    _context.Bookings.Update(booking);
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Could not update booking status, but will try to save payment record.");
            }

            // 5️⃣ COMMIT
            try
            {
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Database SaveChanges failed. Trying to save payment only.");
                
                // Rollback booking update attempt if that was the cause
                _context.ChangeTracker.Clear(); 
                _context.Payments.Add(payment);
                _context.SaveChanges();
            }

            return Ok(new { message = "Payment successful", status = "DONE" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Critical Error in Verify: {Message}", ex.Message);
            return StatusCode(500, new { error = "Backend Error: " + ex.Message });
        }
    }
}
