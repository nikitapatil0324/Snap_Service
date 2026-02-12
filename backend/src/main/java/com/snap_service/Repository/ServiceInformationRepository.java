package com.snap_service.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.snap_service.Entity.ServiceInformation;

@Repository

public interface ServiceInformationRepository
        extends JpaRepository<ServiceInformation, Integer> {

    List<ServiceInformation> findByServiceServiceId(Integer serviceId);

    List<ServiceInformation> findBySubcategorySubcategoryId(Integer subcategoryId);
}

