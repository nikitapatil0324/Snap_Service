package com.snap_service.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "service_subcategories")
public class ServiceSubcategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer subcategoryId;

    private String subcategoryName;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private ServiceEntity service;

    public ServiceSubcategory() {}

    public Integer getSubcategoryId() { return subcategoryId; }
    public void setSubcategoryId(Integer subcategoryId) { this.subcategoryId = subcategoryId; }

    public String getSubcategoryName() { return subcategoryName; }
    public void setSubcategoryName(String subcategoryName) {
        this.subcategoryName = subcategoryName;
    }

    public ServiceEntity getService() { return service; }
    public void setService(ServiceEntity service) { this.service = service; }
}
