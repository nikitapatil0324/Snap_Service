package com.snap_service.Controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.snap_service.Entity.User;
import com.snap_service.Service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")

public class UserController {

    @Autowired
    private UserService service;

    // @PostMapping
    // public ResponseEntity<User> create(@RequestBody User u) {
    // return ResponseEntity.ok(service.create(u));
    // }
    @PostMapping
    public ResponseEntity<String> create(@RequestBody User u) {
        service.create(u);
        return ResponseEntity.ok("Registration successful");
    }

    @GetMapping
    public ResponseEntity<List<User>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable int id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable int id, @RequestBody User u) {
        return ResponseEntity.ok(service.update(id, u));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable int id) {
        service.delete(id);
        return ResponseEntity.ok("User deleted");
    }
}
