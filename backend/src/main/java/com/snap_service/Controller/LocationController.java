package com.snap_service.Controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.snap_service.Entity.Location;
import com.snap_service.Service.LocationService;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = "*")
public class LocationController {

    @Autowired
    private LocationService service;

    @PostMapping
    public ResponseEntity<Location> create(@RequestBody Location l) {
        return ResponseEntity.ok(service.create(l));
    }

    @GetMapping
    public ResponseEntity<List<Location>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Location> getById(@PathVariable int id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Location> update(@PathVariable int id,
            @RequestBody Location l) {
        return ResponseEntity.ok(service.update(id, l));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable int id) {
        service.delete(id);
        return ResponseEntity.ok("Location deleted");
    }
}
