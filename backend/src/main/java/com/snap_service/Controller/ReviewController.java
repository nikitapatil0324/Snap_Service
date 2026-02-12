package com.snap_service.Controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.snap_service.Entity.Review;
import com.snap_service.Service.ReviewService;

import com.snap_service.dto.ReviewRequestDTO;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService service;

    @CrossOrigin(origins = "*")
    @PostMapping("/review/add")
    public ResponseEntity<?> addReview(@RequestBody ReviewRequestDTO dto) {
        System.out.println("Received addReview request:");
        System.out.println("BookingId: " + dto.getBookingId());
        System.out.println("UserId: " + dto.getUserId());
        System.out.println("Rating: " + dto.getRating());
        System.out.println("Feedback: " + dto.getFeedback());

        try {
            Review r = new Review();
            r.setFeedback(dto.getFeedback());
            r.setRating(dto.getRating());
            r.setTitle(dto.getTitle());
            Review saved = service.create(dto.getBookingId(), dto.getUserId(), r);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error adding review: " + e.getMessage());
            return ResponseEntity.badRequest().body(new java.util.HashMap<String, String>() {{
                put("message", e.getMessage());
            }});
        }
    }

    @PostMapping("/reviews/{bookingId}/{userId}")
    public ResponseEntity<Review> create(
            @PathVariable Integer bookingId,
            @PathVariable Integer userId,
            @RequestBody Review r) {
        return ResponseEntity.ok(service.create(bookingId, userId, r));
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/reviews")
    public ResponseEntity<List<Review>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/reviews/user/{userId}")
    public ResponseEntity<List<Review>> getByUserId(@PathVariable Integer userId) {
        return ResponseEntity.ok(service.getByUserId(userId));
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/reviews/provider/{providerId}/rating")
    public ResponseEntity<com.snap_service.dto.ProviderRatingDTO> getProviderRating(@PathVariable Integer providerId) {
        return ResponseEntity.ok(service.getProviderRatingStats(providerId));
    }

    @GetMapping("/reviews/{id}")
    public ResponseEntity<Review> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/reviews/{id}")
    public ResponseEntity<Review> update(
            @PathVariable Integer id,
            @RequestBody Review r) {
        return ResponseEntity.ok(service.update(id, r));
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<String> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.ok("Review deleted");
    }
}
