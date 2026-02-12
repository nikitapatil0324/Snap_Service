package com.snap_service.Service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.snap_service.Entity.Review;
import com.snap_service.Repository.*;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository repo;

    @Autowired
    private BookingRepository bookingRepo;

    @Autowired
    private UserRepository userRepo;

    public Review create(Integer bookingId, Integer userId, Review r) {
        if (r == null)
            throw new IllegalArgumentException("Review cannot be null");
        
        if (bookingId == null || userId == null) {
            throw new IllegalArgumentException("Booking ID and User ID are required");
        }

        // Validation
        if (r.getRating() == null || r.getRating() < 1 || r.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        if (r.getFeedback() == null || r.getFeedback().trim().isEmpty()) {
            throw new IllegalArgumentException("Feedback cannot be empty");
        }

        // Prevent multiple reviews for the same booking
        if (repo.existsByBookingBookingId(bookingId)) {
            throw new RuntimeException("This booking already has a review");
        }

        r.setBooking(bookingRepo.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking not found")));
        r.setUser(userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found")));
        return repo.save(r);
    }

    public List<Review> getAll() {
        return repo.findAll();
    }

    public Review getById(int id) {
        return repo.findById(id).orElseThrow();
    }

    public Review update(int id, Review req) {
        Review r = getById(id);
        r.setRating(req.getRating());
        r.setFeedback(req.getFeedback());
        return repo.save(r);
    }

    public List<Review> getByUserId(int userId) {
        return repo.findByUserUserId(userId);
    }

    public com.snap_service.dto.ProviderRatingDTO getProviderRatingStats(int providerId) {
        List<Review> reviews = repo.findByBookingProviderProviderId(providerId);
        if (reviews.isEmpty()) {
            return new com.snap_service.dto.ProviderRatingDTO(0.0, 0L);
        }
        double sum = reviews.stream().mapToInt(Review::getRating).sum();
        double avg = sum / reviews.size();
        return new com.snap_service.dto.ProviderRatingDTO(avg, (long) reviews.size());
    }

    public void delete(int id) {
        repo.deleteById(id);
    }
}
