package com.snap_service.Service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.snap_service.Entity.Payment;
import com.snap_service.Repository.*;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository repo;

    @Autowired
    private BookingRepository bookingRepo;

    public Payment create(int bookingId, Payment p) {
        if (p == null)
            throw new IllegalArgumentException("Payment cannot be null");
        p.setBooking(bookingRepo.findById(bookingId).orElseThrow());
        p.setPaymentStatus("SUCCESS");
        return repo.save(p);
    }

    public List<Payment> getAll() {
        return repo.findAll();
    }

    public Payment getById(int id) {
        return repo.findById(id).orElseThrow();
    }

    public Payment update(int id, Payment req) {
        Payment p = getById(id);
        p.setAmount(req.getAmount());
        p.setPaymentMethod(req.getPaymentMethod());
        p.setPaymentStatus(req.getPaymentStatus());
        p.setTransactionId(req.getTransactionId());
        return repo.save(p);
    }

    public void delete(int id) {
        repo.deleteById(id);
    }
}
