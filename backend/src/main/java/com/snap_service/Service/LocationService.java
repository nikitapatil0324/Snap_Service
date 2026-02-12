package com.snap_service.Service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.snap_service.Entity.Location;
import com.snap_service.Repository.LocationRepository;

@Service
public class LocationService {

    @Autowired
    private LocationRepository repo;

    public Location create(Location l) {
        if (l == null)
            throw new IllegalArgumentException("Location cannot be null");
        return repo.save(l);
    }

    public List<Location> getAll() {
        return repo.findAll();
    }

    public Location getById(int id) {
        return repo.findById(id).orElseThrow();
    }

    public Location update(int id, Location req) {
        Location l = getById(id);
        l.setArea(req.getArea());
        return repo.save(l);
    }

    public void delete(int id) {
        repo.deleteById(id);
    }
}
