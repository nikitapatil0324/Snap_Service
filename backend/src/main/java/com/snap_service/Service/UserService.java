package com.snap_service.Service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.snap_service.Entity.User;
import com.snap_service.Repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository repo;

    public User create(User u) {
        if (u == null)
            throw new IllegalArgumentException("User cannot be null");
        return repo.save(u);
    }

    public List<User> getAll() {
        return repo.findAll();
    }

    public User getById(int id) {
        return repo.findById(id).orElseThrow();
    }

    public User update(int id, User req) {
        User u = getById(id);
        u.setName(req.getName());
        u.setEmail(req.getEmail());
        u.setPhone(req.getPhone());
        u.setCity(req.getCity());
        return repo.save(u);
    }

    public void delete(int id) {
        repo.deleteById(id);
    }
}
