package com.snap_service.Controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.snap_service.Entity.Payment;
import com.snap_service.Service.PaymentService;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService service;

    @PostMapping("/{bookingId}")
    public ResponseEntity<Payment> create(
            @PathVariable Integer bookingId,
            @RequestBody Payment p) {
        return ResponseEntity.ok(service.create(bookingId, p));
    }

    @GetMapping
    public ResponseEntity<List<Payment>> getAll() {
        System.out.println("DEBUG: Fetching all payments...");
        List<Payment> list = service.getAll();
        System.out.println("DEBUG: Found " + list.size() + " payments.");
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Payment> update(
            @PathVariable Integer id,
            @RequestBody Payment p) {
        return ResponseEntity.ok(service.update(id, p));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.ok("Payment deleted");
    }
}
	