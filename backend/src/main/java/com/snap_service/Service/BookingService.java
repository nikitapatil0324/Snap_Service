package com.snap_service.Service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.snap_service.Entity.Booking;
import com.snap_service.Repository.*;

@Service
public class BookingService {

    @Autowired
    private BookingRepository repo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private ServiceRepository serviceRepo;
    @Autowired
    private ServiceProviderRepository providerRepo;

    // Original method with path variables
    public Booking create(int userId,
            int serviceId,
            int providerId,
            Booking b) {
        if (b == null)
            throw new IllegalArgumentException("Booking cannot be null");
        b.setUser(userRepo.findById(userId).orElseThrow());
        b.setService(serviceRepo.findById(serviceId).orElseThrow());
        b.setProvider(providerRepo.findById(providerId).orElseThrow());
        b.setStatus("PENDING");
        return repo.save(b);
    }

    // New simplified method for frontend
    public Booking createSimpleBooking(Booking booking) {
        if (booking == null)
            throw new IllegalArgumentException("Booking cannot be null");
        // Try to find user if customerId is provided
        if (booking.getCustomerId() != null) {
            Integer customerId = booking.getCustomerId();
            if (customerId != null) {
                userRepo.findById(customerId).ifPresent(booking::setUser);
            }
        }

        // Try to find service by name if serviceName is provided
        if (booking.getServiceName() != null) {
            serviceRepo.findByServiceName(booking.getServiceName()).ifPresent(booking::setService);
        }

        // Set status to Pending if not already set
        if (booking.getStatus() == null || booking.getStatus().isEmpty()) {
            booking.setStatus("Pending");
        }

        return repo.save(booking);
    }

    public List<Booking> getAll() {
        return repo.findAll();
    }

    public List<Booking> getByUserId(Integer userId) {
        return repo.findAll().stream()
                .filter(b -> (b.getUser() != null && b.getUser().getUserId().equals(userId))
                        || (b.getCustomerId() != null && b.getCustomerId().equals(userId)))
                .toList();
    }

    public List<Booking> getByProviderId(Integer providerId) {
        return repo.findAll().stream()
                .filter(b -> (b.getProvider() != null && b.getProvider().getProviderId().equals(providerId)))
                .toList();
    }

    public Booking getById(int id) {
        return repo.findById(id).orElseThrow();
    }

    public Booking updateStatus(int id, String status) {
        Booking b = getById(id);
        if (b == null)
            throw new RuntimeException("Booking not found");
        b.setStatus(status);
        return repo.save(b);
    }

    public Booking acceptBooking(int id, Double amount) {
        Booking b = getById(id);
        if (b == null)
            throw new RuntimeException("Booking not found");
        b.setStatus("Accepted");
        b.setProviderAcceptedAmount(amount);
        return repo.save(b);
    }

    public Booking assignProvider(int bookingId, int providerId) {
        Booking b = getById(bookingId);
        providerRepo.findById(providerId).ifPresent(p -> {
            b.setProvider(p);
            b.setStatus("Assigned");
        });
        if (b == null)
            throw new RuntimeException("Booking not found");
        return repo.save(b);
    }

    public void delete(int id) {
        repo.deleteById(id);
    }

    public List<com.snap_service.Entity.ServiceProvider> getRecommendedProviders(int bookingId) {
        Booking b = getById(bookingId);
        if (b == null)
            throw new RuntimeException("Booking not found");

        String area = b.getArea();
        String serviceName = b.getServiceName();

        if (area != null && serviceName != null) {
            return providerRepo.findByAreaAndServiceName(area, serviceName);
        } else if (area != null) {
            return providerRepo.findByArea(area);
        }

        return providerRepo.findAll();
    }
}
