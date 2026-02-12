package com.snap_service.Component;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.snap_service.Entity.*;
import com.snap_service.Repository.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private AdminRepository adminRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private ServiceProviderRepository providerRepo;
    @Autowired private ServiceRepository serviceRepo; // ServiceEntity
    @Autowired private LocationRepository locationRepo;
    @Autowired private ServiceSubcategoryRepository subcategoryRepo;
    @Autowired private ServiceInformationRepository infoRepo;
    @Autowired private BookingRepository bookingRepo;
    @Autowired private PaymentRepository paymentRepo;
    @Autowired private ReviewRepository reviewRepo;
    @Autowired private BookingCancellationRepository cancellationRepo;
    // PaymentHistoryRepository might be redundant if Payment exists, but including for completeness
    @Autowired private PaymentHistoryRepository historyRepo;

    @Override
    public void run(String... args) throws Exception {
        if (adminRepo.count() > 0) {
            System.out.println("DataSeeder: Database already populated. Skipping...");
            return;
        }

        System.out.println("DataSeeder: Starting data population...");

        // 1. Locations
        Location nashik = new Location(); nashik.setArea("Nashik"); locationRepo.save(nashik);
        Location mumbai = new Location(); mumbai.setArea("Mumbai"); locationRepo.save(mumbai);

        // 2. Admins
        Admin admin = new Admin();
        admin.setName("Super Admin");
        admin.setEmail("admin@snap.com");
        admin.setPassword("admin123"); // In real app, encrypt this
        admin.setRole("SUPER_ADMIN");
        admin.setPhone("9998887777");
        admin.setCity("Nashik");
        adminRepo.save(admin);

        // 3. Services (ServiceEntity)
        ServiceEntity plumbing = createService("Plumbing", "All plumbing works", "500", admin, nashik);
        ServiceEntity electrical = createService("Electrical", "Wiring and repairs", "700", admin, nashik);
        ServiceEntity cleaning = createService("Home Cleaning", "Deep cleaning", "1200", admin, mumbai);

        // 4. Subcategories
        createSubcategory("Pipe Repair", plumbing);
        ServiceSubcategory tapSub = createSubcategory("Tap Replacement", plumbing);
        createSubcategory("Fan Installation", electrical);
        createSubcategory("Switch Repair", electrical);
        
        // 4.1 Service Information
        ServiceInformation info = new ServiceInformation();
        info.setService(plumbing);
        info.setSubcategory(tapSub);
        info.setDescription("Fix leaking taps and replacements.");
        info.setBasePrice(150.0f);
        info.setAvgTimeRequired("1 Hour");
        info.setIsAvailable(true);
        infoRepo.save(info);

        // 5. Users
        User user1 = createUser("Rahul Sharma", "rahul@gmail.com", "9876543210", "Nashik");
        User user2 = createUser("Priya Patil", "priya@gmail.com", "8765432109", "Mumbai");
        User user3 = createUser("Amit Verma", "amit@gmail.com", "7654321098", "Nashik");

        // 6. Providers
        ServiceProvider provider1 = createProvider("John's Plumbing", "john@plumbing.com", "Plumbing", "Nashik");
        ServiceProvider provider2 = createProvider("Electric Pro", "elec@pro.com", "Electrical", "Nashik");
        ServiceProvider provider3 = createProvider("Clean Master", "clean@master.com", "Home Cleaning", "Mumbai");

        // 7. Bookings
        // Booking 1: Completed & Paid (Plumbing)
        Booking b1 = createBooking(user1, provider1, plumbing, "Completed", "Pipe leaking in kitchen", "2025-10-15");
        b1.setProviderAcceptedAmount(600.0);
        bookingRepo.save(b1);
        
        // Booking 2: Pending (Electrical)
        Booking b2 = createBooking(user3, provider2, electrical, "Pending", "Fan noise", "2025-10-20");
        
        // Booking 3: Accepted (Cleaning)
        Booking b3 = createBooking(user2, provider3, cleaning, "Accepted", "Full home cleaning", "2025-10-22");
        b3.setProviderAcceptedAmount(1200.0);
        bookingRepo.save(b3);

        // 8. Payments (Only for completed/paid bookings)
        // 8. Payments (Only for completed/paid bookings)
        Payment p1 = createPayment(b1, 600.0, "SUCCESS", "pay_Trx001");
        
        // 8.1 Payment History
        PaymentHistory ph = new PaymentHistory();
        ph.setPayment(p1);
        ph.setBooking(b1);
        ph.setUser(user1);
        ph.setProvider(provider1);
        ph.setAdmin(admin);
        ph.setAmount(600.0f);
        ph.setPaymentStatus("SUCCESS");
        ph.setPaymentMethod("NetBanking");
        ph.setTransactionId("pay_Trx001");
        historyRepo.save(ph);
        
        // Add a secondary payment for a past booking (simulation)
        Payment p2 = new Payment();
        p2.setAmount(1200.0);
        p2.setPaymentMethod("UPI");
        p2.setPaymentStatus("SUCCESS");
        p2.setTransactionId("pay_Trx002");
        p2.setBooking(b3); // Pre-payment
        paymentRepo.save(p2);

        // 9. Reviews
        Review r1 = new Review();
        r1.setBooking(b1);
        r1.setRating(5);
        r1.setFeedback("Excellent service!");
        // r1.setReviewDate(LocalDateTime.now()); // Field doesn't exist in Review.java
        reviewRepo.save(r1);

        // 10. Booking Cancellation (Create a 4th booking to cancel)
        Booking b4 = createBooking(user1, provider2, electrical, "Cancelled", "Fan noise revisited", "2025-10-25");
        BookingCancellation c1 = new BookingCancellation();
        c1.setBooking(b4);
        c1.setUser(user1);
        c1.setProvider(provider2);
        c1.setCancelledBy("User");
        c1.setCancelReason("Found cheaper option");
        c1.setCancellationCharge(0.0f);
        c1.setCancelledAt(LocalDateTime.now());
        cancellationRepo.save(c1);

        System.out.println("DataSeeder: Population complete! 🚀");
    }

    private ServiceEntity createService(String name, String desc, String price, Admin admin, Location loc) {
        ServiceEntity s = new ServiceEntity();
        s.setServiceName(name);
        s.setDescription(desc);
        s.setPrice(price);
        s.setAdmin(admin);
        Set<Location> locs = new HashSet<>();
        locs.add(loc);
        s.setAreas(locs);
        return serviceRepo.save(s);
    }

    private ServiceSubcategory createSubcategory(String name, ServiceEntity s) {
        ServiceSubcategory sub = new ServiceSubcategory();
        sub.setSubcategoryName(name);
        sub.setService(s);
        return subcategoryRepo.save(sub);
    }

    private User createUser(String name, String email, String phone, String city) {
        User u = new User();
        u.setName(name);
        u.setEmail(email);
        u.setPhone(phone);
        u.setCity(city);
        u.setPassword("user123");
        u.setRole("USER");
        return userRepo.save(u);
    }

    private ServiceProvider createProvider(String name, String email, String service, String area) {
        ServiceProvider p = new ServiceProvider();
        p.setName(name);
        p.setEmail(email);
        p.setPassword("prov123");
        p.setServiceName(service);
        p.setArea(area);
        p.setCity(area); // assuming city=area for simplicity
        p.setVerificationStatus("Verified");
        return providerRepo.save(p);
    }

    private Booking createBooking(User u, ServiceProvider p, ServiceEntity s, String status, String desc, String date) {
        Booking b = new Booking();
        b.setUser(u);
        b.setProvider(p);
        b.setService(s);
        b.setStatus(status);
        b.setDescription(desc);
        b.setPreferredDate(date);
        b.setAddress(u.getCity() + ", Street 1");
        b.setPhone(u.getPhone());
        b.setCustomerName(u.getName());
        b.setCustomerEmail(u.getEmail());
        b.setServiceName(s.getServiceName());
        // Auto-set provider details
        if (p != null) {
            b.setProviderAcceptedAmount(Double.parseDouble(s.getPrice()));
        }
        return bookingRepo.save(b);
    }

    private Payment createPayment(Booking b, Double amount, String status, String txId) {
        Payment p = new Payment();
        p.setBooking(b);
        p.setAmount(amount);
        p.setPaymentMethod("NetBanking");
        p.setPaymentStatus(status);
        p.setTransactionId(txId);
        return paymentRepo.save(p);
    }
}
