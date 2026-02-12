package com.snap_service.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.snap_service.Entity.*;
import com.snap_service.Repository.*;
import com.snap_service.dto.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

        @Autowired
        private UserRepository userRepo;

        @Autowired
        private ServiceProviderRepository providerRepo;

        @Autowired
        private AdminRepository adminRepo;

        @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody LoginRequest request) {

                System.out.println("LOGIN ATTEMPT → " + request.getEmail());

                // Check Admin first
                Admin admin = adminRepo.findByEmailAndPassword(
                                request.getEmail(),
                                request.getPassword());

                if (admin != null) {
                        return ResponseEntity.ok(
                                        new LoginResponse(
                                                        admin.getAdminId(),
                                                        admin.getName(),
                                                        admin.getEmail(),
                                                        "ADMIN"));
                } else if ("admin@snapservice.com".equalsIgnoreCase(request.getEmail())
                                && "Admin@123".equals(request.getPassword())) {
                        // Auto-bootstrap default admin for dev/testing if not found
                        Admin newAdmin = new Admin();
                        newAdmin.setName("Super Admin");
                        newAdmin.setEmail("admin@snapservice.com");
                        newAdmin.setPassword("Admin@123");
                        newAdmin.setRole("ADMIN");
                        newAdmin = adminRepo.save(newAdmin);

                        return ResponseEntity.ok(
                                        new LoginResponse(
                                                        newAdmin.getAdminId(),
                                                        newAdmin.getName(),
                                                        newAdmin.getEmail(),
                                                        "ADMIN"));
                }

                // Check User
                User user = userRepo.findByEmailAndPassword(
                                request.getEmail(),
                                request.getPassword());

                if (user != null) {
                        return ResponseEntity.ok(
                                        new LoginResponse(
                                                        user.getUserId(),
                                                        user.getName(),
                                                        user.getEmail(),
                                                        "USER"));
                }

                // Check Provider
                ServiceProvider provider = providerRepo.findByEmailAndPassword(
                                request.getEmail(),
                                request.getPassword());

                if (provider != null) {
                        return ResponseEntity.ok(
                                        new LoginResponse(
                                                        provider.getProviderId(),
                                                        provider.getName(),
                                                        provider.getEmail(),
                                                        "PROVIDER"));
                }

                return ResponseEntity
                                .status(401)
                                .body("Invalid credentials");
        }
}
