package com.snap_service.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

//import com.snap_service.Entity.Service;
import com.snap_service.Entity.ServiceEntity;
import com.snap_service.Repository.AdminRepository;
import com.snap_service.Repository.ServiceRepository;

@org.springframework.stereotype.Service
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private com.snap_service.Repository.LocationRepository locationRepository;

    public ServiceEntity addService(ServiceEntity service, int adminId) {
        if (service == null)
            throw new IllegalArgumentException("Service cannot be null");
        System.out.println("DEBUG: Attempting to find Admin with ID: " + adminId);
        service.setAdmin(
                adminRepository.findById(adminId)
                        .orElseThrow(() -> {
                            System.err.println("CRITICAL: Admin not found for ID: " + adminId);
                            return new RuntimeException("Admin not found");
                        }));

        // If areas are provided, handle them by NAME or ID
        if (service.getAreas() != null && !service.getAreas().isEmpty()) {
            java.util.Set<com.snap_service.Entity.Location> managedAreas = new java.util.HashSet<>();
            for (com.snap_service.Entity.Location loc : service.getAreas()) {
                String areaName = loc.getArea();
                if (areaName != null && !areaName.trim().isEmpty()) {
                    // Normalize area name (optional: trim, lowercase)
                    String normalized = areaName.trim();
                    // Find by name, or create if not exists
                    com.snap_service.Entity.Location location = locationRepository.findByArea(normalized)
                            .orElseGet(() -> {
                                com.snap_service.Entity.Location newLoc = new com.snap_service.Entity.Location();
                                newLoc.setArea(normalized);
                                return locationRepository.save(newLoc);
                            });
                    managedAreas.add(location);
                } else {
                    Integer idToFind = loc.getLocationId();
                    if (idToFind != null) {
                        locationRepository.findById(idToFind).ifPresent(managedAreas::add);
                    }
                }
            }
            service.setAreas(managedAreas);
        }

        return serviceRepository.save(service);
    }

    public List<ServiceEntity> getAllServices() {
        return serviceRepository.findAll();
    }

    public ServiceEntity getServiceById(int id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
    }

    public ServiceEntity updateService(int id, ServiceEntity request) {
        ServiceEntity service = getServiceById(id);
        service.setServiceName(request.getServiceName());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());

        // Manage areas association (by Name or ID)
        if (request.getAreas() != null) {
            java.util.Set<com.snap_service.Entity.Location> managedAreas = new java.util.HashSet<>();
            for (com.snap_service.Entity.Location loc : request.getAreas()) {
                String areaName = loc.getArea();
                if (areaName != null && !areaName.trim().isEmpty()) {
                    String normalized = areaName.trim();
                    com.snap_service.Entity.Location location = locationRepository.findByArea(normalized)
                            .orElseGet(() -> {
                                com.snap_service.Entity.Location newLoc = new com.snap_service.Entity.Location();
                                newLoc.setArea(normalized);
                                return locationRepository.save(newLoc);
                            });
                    managedAreas.add(location);
                } else {
                    Integer idToFind = loc.getLocationId();
                    if (idToFind != null) {
                        locationRepository.findById(idToFind).ifPresent(managedAreas::add);
                    }
                }
            }
            service.setAreas(managedAreas);
        } else {
            service.setAreas(new java.util.HashSet<>());
        }

        return serviceRepository.save(service);
    }

    public void deleteService(int id) {
        serviceRepository.deleteById(id);
    }
}
