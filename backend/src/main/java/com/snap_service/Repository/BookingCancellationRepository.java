package com.snap_service.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.snap_service.Entity.BookingCancellation;

@Repository
public interface BookingCancellationRepository
        extends JpaRepository<BookingCancellation, Integer> {

    List<BookingCancellation> findByBookingBookingId(Integer bookingId);
}

