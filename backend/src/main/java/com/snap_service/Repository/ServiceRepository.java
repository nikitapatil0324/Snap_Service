package com.snap_service.Repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.snap_service.Entity.ServiceEntity;

public interface ServiceRepository extends JpaRepository<ServiceEntity, Integer> {
    Optional<ServiceEntity> findByServiceName(String serviceName);
}
