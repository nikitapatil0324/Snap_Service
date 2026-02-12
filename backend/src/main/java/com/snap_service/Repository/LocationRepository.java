package com.snap_service.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.snap_service.Entity.Location;

public interface LocationRepository extends JpaRepository<Location, Integer> {
    java.util.Optional<Location> findByArea(String area);
}
