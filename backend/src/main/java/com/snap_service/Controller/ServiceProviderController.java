package com.snap_service.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.snap_service.Entity.ServiceProvider;
import com.snap_service.Service.ServiceProviderService;
import com.snap_service.dto.ProviderRegisterDTO;

@RestController
@RequestMapping("/api/providers")
@CrossOrigin(origins = "*")
public class ServiceProviderController {

    @Autowired
    private ServiceProviderService service;

    @Autowired
    private com.snap_service.Service.ReviewService reviewService;

    // ===============================
    // REGISTER PROVIDER
    // ===============================
    @PostMapping("/register")
    public ResponseEntity<ServiceProvider> register(
            @RequestBody ProviderRegisterDTO dto) {

        ServiceProvider provider = new ServiceProvider();

        provider.setName(dto.getName());
        provider.setEmail(dto.getEmail()); // ✅ FIX
        provider.setPassword(dto.getPassword()); // ✅ FIX
        provider.setServiceName(dto.getServiceName());
        provider.setArea(dto.getArea());
        provider.setCity(dto.getCity() != null ? dto.getCity() : "Nashik"); // Default city

        provider.setVerificationStatus("PENDING"); // ✅ REQUIRED

        ServiceProvider saved = service.register(provider);

        return ResponseEntity.ok(saved);
    }

    // ===============================
    // OTHER APIs
    // ===============================
    @GetMapping
    public ResponseEntity<List<com.snap_service.dto.ProviderWithRatingDTO>> getAll() {
        List<ServiceProvider> providers = service.getAll();
        List<com.snap_service.dto.ProviderWithRatingDTO> dtos = providers.stream().map(p -> {
            com.snap_service.dto.ProviderRatingDTO stats = reviewService.getProviderRatingStats(p.getProviderId());
            com.snap_service.dto.ProviderWithRatingDTO dto = new com.snap_service.dto.ProviderWithRatingDTO();
            dto.setProviderId(p.getProviderId());
            dto.setName(p.getName());
            dto.setEmail(p.getEmail());
            dto.setServiceName(p.getServiceName());
            dto.setArea(p.getArea());
            dto.setCity(p.getCity());
            dto.setVerificationStatus(p.getVerificationStatus());
            dto.setRating(stats.getAverageRating());
            dto.setReviewCount(stats.getReviewCount());
            return dto;
        }).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<com.snap_service.dto.ProviderWithRatingDTO> getById(
            @PathVariable Integer id) {
        ServiceProvider p = service.getById(id);
        com.snap_service.dto.ProviderRatingDTO stats = reviewService.getProviderRatingStats(p.getProviderId());
        com.snap_service.dto.ProviderWithRatingDTO dto = new com.snap_service.dto.ProviderWithRatingDTO();
        dto.setProviderId(p.getProviderId());
        dto.setName(p.getName());
        dto.setEmail(p.getEmail());
        dto.setServiceName(p.getServiceName());
        dto.setArea(p.getArea());
        dto.setCity(p.getCity());
        dto.setVerificationStatus(p.getVerificationStatus());
        dto.setRating(stats.getAverageRating());
        dto.setReviewCount(stats.getReviewCount());
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceProvider> update(
            @PathVariable int id,
            @RequestBody ServiceProvider provider) {
        return ResponseEntity.ok(service.update(id, provider));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(
            @PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.ok("Deleted successfully");
    }
}
