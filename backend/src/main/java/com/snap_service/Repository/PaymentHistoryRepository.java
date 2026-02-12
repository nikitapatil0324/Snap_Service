package com.snap_service.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.snap_service.Entity.PaymentHistory;

@Repository
public interface PaymentHistoryRepository
        extends JpaRepository<PaymentHistory, Integer> {

    List<PaymentHistory> findByBookingBookingId(Integer bookingId);

    List<PaymentHistory> findByUserUserId(Integer userId);
}

