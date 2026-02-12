package com.snap_service.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.snap_service.Entity.ServiceSubcategory;

@Repository
public interface ServiceSubcategoryRepository
        extends JpaRepository<ServiceSubcategory, Integer> {

    List<ServiceSubcategory> findByServiceServiceId(Integer serviceId);
}

