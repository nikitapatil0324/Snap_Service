package com.snap_service.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.snap_service.Entity.ServiceProvider;
import com.snap_service.Repository.ServiceProviderRepository;

@Service
public class ServiceProviderService {

    @Autowired
    private ServiceProviderRepository repo;

    // ==============================
    // REGISTER PROVIDER
    // ==============================
    public ServiceProvider register(ServiceProvider provider) {
        if (provider == null)
            throw new IllegalArgumentException("Provider cannot be null");
        provider.setVerificationStatus("PENDING");
        return repo.save(provider);
    }

    // ==============================
    // GET ALL PROVIDERS
    // ==============================
    public List<ServiceProvider> getAll() {
        return repo.findAll();
    }

    // ==============================
    // GET PROVIDER BY ID
    // ==============================
    public ServiceProvider getById(int id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
    }

    // ==============================
    // UPDATE PROVIDER
    // ==============================
    public ServiceProvider update(int id, ServiceProvider req) {

        ServiceProvider provider = getById(id);

        provider.setName(req.getName());
        provider.setVerificationStatus(req.getVerificationStatus());
        provider.setServiceName(req.getServiceName());
        provider.setArea(req.getArea());
        provider.setCity(req.getCity());

        return repo.save(provider);
    }

    // ==============================
    // DELETE PROVIDER
    // ==============================
    public void delete(int id) {
        repo.deleteById(id);
    }
}
