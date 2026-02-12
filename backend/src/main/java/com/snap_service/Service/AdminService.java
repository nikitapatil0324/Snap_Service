package com.snap_service.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.snap_service.Entity.Admin;
import com.snap_service.Repository.AdminRepository;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    // =========================
    // CREATE ADMIN
    // =========================
    public Admin createAdmin(Admin admin) {

        // default role
        if (admin.getRole() == null) {
            admin.setRole("ADMIN");
        }

        return adminRepository.save(admin);
    }

    // =========================
    // GET ALL ADMINS
    // =========================
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    // =========================
    // GET ADMIN BY ID
    // =========================
    public Admin getAdminById(int id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
    }

    // =========================
    // UPDATE ADMIN
    // =========================
    public Admin updateAdmin(int id, Admin adminRequest) {

        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        admin.setName(adminRequest.getName());
        admin.setEmail(adminRequest.getEmail());
        admin.setPhone(adminRequest.getPhone());
        admin.setRole(adminRequest.getRole());
        admin.setCity(adminRequest.getCity());

        // update password only if provided
        if (adminRequest.getPassword() != null &&
                !adminRequest.getPassword().isEmpty()) {

            admin.setPassword(adminRequest.getPassword());
        }

        return adminRepository.save(admin);
    }

    // =========================
    // DELETE ADMIN
    // =========================
    public void deleteAdmin(int id) {

        if (!adminRepository.existsById(id)) {
            throw new RuntimeException("Admin not found");
        }

        adminRepository.deleteById(id);
    }
}
