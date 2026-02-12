package com.snap_service.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.snap_service.Entity.ServiceInformation;
import com.snap_service.Repository.ServiceInformationRepository;
import com.snap_service.Repository.ServiceRepository;
import com.snap_service.Repository.ServiceSubcategoryRepository;

@Service
public class ServiceInformationService {

    @Autowired
    private ServiceInformationRepository infoRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private ServiceSubcategoryRepository subcategoryRepository;

    public ServiceInformation addInfo(ServiceInformation info,
            int serviceId,
            int subcategoryId) {
        if (info == null)
            throw new IllegalArgumentException("ServiceInformation cannot be null");

        info.setService(serviceRepository.findById(serviceId).orElseThrow());
        info.setSubcategory(subcategoryRepository.findById(subcategoryId).orElseThrow());

        return infoRepository.save(info);
    }

    public List<ServiceInformation> getByService(int serviceId) {
        return infoRepository.findByServiceServiceId(serviceId);
    }
}
