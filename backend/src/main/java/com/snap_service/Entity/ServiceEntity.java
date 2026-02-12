package com.snap_service.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "services")
public class ServiceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer serviceId;

    private String serviceName;

    @Column(length = 1000)
    private String description;

    private String price;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    @JsonIgnore
    private Admin admin;

    @ManyToMany
    @JoinTable(name = "service_areas", joinColumns = @JoinColumn(name = "service_id"), inverseJoinColumns = @JoinColumn(name = "location_id"))
    private java.util.Set<Location> areas = new java.util.HashSet<>();

    // ================= GETTERS & SETTERS =================

    public Integer getServiceId() {
        return serviceId;
    }

    public void setServiceId(Integer serviceId) {
        this.serviceId = serviceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    // 🔥 THIS WAS MISSING
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public Admin getAdmin() {
        return admin;
    }

    public void setAdmin(Admin admin) {
        this.admin = admin;
    }

    public java.util.Set<Location> getAreas() {
        return areas;
    }

    public void setAreas(java.util.Set<Location> areas) {
        this.areas = areas;
    }
}
