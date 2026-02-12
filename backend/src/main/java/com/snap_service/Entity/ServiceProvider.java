package com.snap_service.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "service_providers")
public class ServiceProvider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "provider_id")
    private Integer providerId;

    @Column(nullable = false)
    private String name;

    // ✅ REQUIRED FOR LOGIN
    @Column(unique = true, nullable = false)
    private String email;

    // ✅ REQUIRED FOR LOGIN
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String verificationStatus;

    // service offered
    @Column(name = "service_name", nullable = false)
    private String serviceName;

    // provider area
    @Column(nullable = false)
    private String area = "Nashik";

    private String city = "Nashik";

    public ServiceProvider() {
    }

    // =======================
    // GETTERS & SETTERS
    // =======================

    public Integer getProviderId() {
        return providerId;
    }

    public void setProviderId(Integer providerId) {
        this.providerId = providerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }
}
