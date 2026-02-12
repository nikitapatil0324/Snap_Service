package com.snap_service.Controller;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.snap_service.Entity.Booking;
import com.snap_service.Service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService service;

    @Autowired
    private com.snap_service.Service.ReviewService reviewService;

    // New simple POST endpoint for frontend
    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<Booking> createSimple(@RequestBody Booking booking) {
        // Ensure status is set
        if (booking.getStatus() == null || booking.getStatus().isEmpty()) {
            booking.setStatus("Pending");
        }

        // Save and return the booking
        return ResponseEntity.ok(service.createSimpleBooking(booking));
    }

    // Original POST with path variables
    @PostMapping("/{userId}/{serviceId}/{providerId}")
    public ResponseEntity<Booking> create(
            @PathVariable int userId,
            @PathVariable int serviceId,
            @PathVariable int providerId,
            @RequestBody Booking b) {
        return ResponseEntity.ok(service.create(userId, serviceId, providerId, b));
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAll(
            @RequestParam(required = false) Integer userId,
            @RequestParam(required = false) Integer providerId) {
        List<Booking> bookings;
        if (userId != null) {
            bookings = service.getByUserId(userId);
        } else if (providerId != null) {
            bookings = service.getByProviderId(providerId);
        } else {
            bookings = service.getAll();
        }

        // Enrich with provider rating
        bookings.forEach(b -> {
            if (b.getProvider() != null) {
                com.snap_service.dto.ProviderRatingDTO stats = reviewService
                        .getProviderRatingStats(b.getProvider().getProviderId());
                b.setRatingValue(stats.getAverageRating());
            } else if (b.getBookingProviderId() != null) {
                com.snap_service.dto.ProviderRatingDTO stats = reviewService
                        .getProviderRatingStats(b.getBookingProviderId());
                b.setRatingValue(stats.getAverageRating());
            }
        });

        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getById(@PathVariable int id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateStatus(
            @PathVariable int id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(service.updateStatus(id, status));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<Booking> assignProvider(
            @PathVariable int id,
            @RequestBody Map<String, Integer> body) {
        Integer providerId = body.get("providerId");
        return ResponseEntity.ok(service.assignProvider(id, providerId));
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<Booking> acceptBooking(
            @PathVariable int id,
            @RequestBody Map<String, Object> body) {
        Double amount = Double.valueOf(body.get("amount").toString());
        return ResponseEntity.ok(service.acceptBooking(id, amount));
    }

    @PutMapping("/{id}/{status}")
    public ResponseEntity<Booking> updateStatusPath(
            @PathVariable int id,
            @PathVariable String status) {
        return ResponseEntity.ok(service.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable int id) {
        service.delete(id);
        return ResponseEntity.ok("Booking deleted");
    }

    @GetMapping("/{id}/recommended-providers")
    public ResponseEntity<List<com.snap_service.Entity.ServiceProvider>> getRecommendedProviders(@PathVariable int id) {
        return ResponseEntity.ok(service.getRecommendedProviders(id));
    }
}
