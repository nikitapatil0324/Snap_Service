package com.snap_service.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.snap_service.Entity.ServiceSubcategory;
import com.snap_service.Repository.ServiceRepository;
import com.snap_service.Repository.ServiceSubcategoryRepository;

@Service
public class ServiceSubcategoryService {

    @Autowired
    private ServiceSubcategoryRepository subcategoryRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    public ServiceSubcategory addSubcategory(ServiceSubcategory subcategory, int serviceId) {
        if (subcategory == null)
            throw new IllegalArgumentException("Subcategory cannot be null");

        subcategory.setService(serviceRepository.findById(serviceId).orElseThrow());
        return subcategoryRepository.save(subcategory);
    }

    public List<ServiceSubcategory> getByService(int serviceId) {
        return subcategoryRepository.findByServiceServiceId(serviceId);
    }
}
