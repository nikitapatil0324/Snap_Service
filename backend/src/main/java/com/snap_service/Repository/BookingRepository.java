package com.snap_service.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.snap_service.Entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
}
