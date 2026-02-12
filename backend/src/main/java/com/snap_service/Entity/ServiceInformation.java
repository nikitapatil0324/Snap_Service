package com.snap_service.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "service_information")
public class ServiceInformation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer infoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceEntity service;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subcategory_id", nullable = false)
    private ServiceSubcategory subcategory;

    private String description;
    private Float basePrice;
    private String avgTimeRequired;
    private String serviceImage;
    private Boolean isAvailable;

    // ================= GETTERS & SETTERS =================

    public Integer getInfoId() {
        return infoId;
    }

    public void setInfoId(Integer infoId) {
        this.infoId = infoId;
    }

    public ServiceEntity getService() {
        return service;
    }

    public void setService(ServiceEntity service) {
        this.service = service;
    }

    public ServiceSubcategory getSubcategory() {
        return subcategory;
    }

    public void setSubcategory(ServiceSubcategory subcategory) {
        this.subcategory = subcategory;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Float getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(Float basePrice) {
        this.basePrice = basePrice;
    }

    public String getAvgTimeRequired() {
        return avgTimeRequired;
    }

    public void setAvgTimeRequired(String avgTimeRequired) {
        this.avgTimeRequired = avgTimeRequired;
    }

    public String getServiceImage() {
        return serviceImage;
    }

    public void setServiceImage(String serviceImage) {
        this.serviceImage = serviceImage;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }
}
