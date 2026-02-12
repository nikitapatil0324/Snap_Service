package com.snap_service.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.snap_service.Entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    boolean existsByBookingBookingId(Integer bookingId);

    java.util.List<Review> findByUserUserId(Integer userId);

    java.util.List<Review> findByBookingProviderProviderId(Integer providerId);
}
