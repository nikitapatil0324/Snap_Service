package com.snap_service.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

//import com.snap_service.Entity.Service;
import com.snap_service.Entity.ServiceEntity;
import com.snap_service.Service.ServiceService;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceController {

    @Autowired
    private ServiceService serviceService;

    // ✅ CREATE SERVICE
    @PostMapping("/{adminId}")
    public ResponseEntity<ServiceEntity> createService(
            @PathVariable int adminId,
            @RequestBody ServiceEntity service) {

        return ResponseEntity.ok(
                serviceService.addService(service, adminId));
    }

    // ✅ GET ALL SERVICES
    @GetMapping
    public ResponseEntity<List<ServiceEntity>> getAllServices() {
        return ResponseEntity.ok(serviceService.getAllServices());
    }

    // ✅ GET SERVICE BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ServiceEntity> getServiceById(@PathVariable int id) {
        return ResponseEntity.ok(serviceService.getServiceById(id));
    }

    // ✅ UPDATE SERVICE
    @PutMapping("/{id}")
    public ResponseEntity<ServiceEntity> updateService(
            @PathVariable int id,
            @RequestBody ServiceEntity service) {

        return ResponseEntity.ok(
                serviceService.updateService(id, service));
    }

    // ✅ DELETE SERVICE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteService(@PathVariable int id) {
        serviceService.deleteService(id);
        return ResponseEntity.ok("Service deleted successfully");
    }
}
