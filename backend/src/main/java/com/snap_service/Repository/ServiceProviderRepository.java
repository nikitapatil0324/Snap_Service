package com.snap_service.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.snap_service.Entity.ServiceProvider;

public interface ServiceProviderRepository
		extends JpaRepository<ServiceProvider, Integer> {
	ServiceProvider findByEmailAndPassword(String email, String password);

	java.util.List<ServiceProvider> findByAreaAndServiceName(String area, String serviceName);

	java.util.List<ServiceProvider> findByArea(String area);
}
