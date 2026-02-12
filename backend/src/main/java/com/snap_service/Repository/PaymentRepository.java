package com.snap_service.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.snap_service.Entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
}
