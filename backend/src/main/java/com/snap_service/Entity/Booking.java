package com.snap_service.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer bookingId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private ServiceEntity service;

    @ManyToOne
    @JoinColumn(name = "provider_id")
    private ServiceProvider provider;

    private String status;

    // New fields to match frontend payload
    @Column(length = 1000)
    private String description;

    private String preferredDate;

    @Column(length = 500)
    private String address;

    private String phone;

    private String serviceName;

    private String customerName;

    private String customerEmail;

    private Integer customerId;

    private String area;

    @Column(name = "provider_accepted_amount")
    private Double providerAcceptedAmount;

    // Transient field to handle frontend "service" field (not persisted to DB)
    @Transient
    @com.fasterxml.jackson.annotation.JsonProperty("service")
    private String serviceField;

    public Booking() {
    }

    // Getters and Setters
    public Integer getBookingId() {
        return bookingId;
    }

    public void setBookingId(Integer bookingId) {
        this.bookingId = bookingId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("serviceEntity")
    public ServiceEntity getService() {
        return service;
    }

    public void setService(ServiceEntity service) {
        this.service = service;
    }

    public ServiceProvider getProvider() {
        return provider;
    }

    public void setProvider(ServiceProvider provider) {
        this.provider = provider;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPreferredDate() {
        return preferredDate;
    }

    public void setPreferredDate(String preferredDate) {
        this.preferredDate = preferredDate;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getCustomerName() {
        if (customerName != null && !customerName.isEmpty()) return customerName;
        return user != null ? user.getName() : "Unknown Customer";
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("providerName")
    public String getProviderName() {
        if (provider != null) return provider.getName();
        return "Not Assigned";
    }

    @com.fasterxml.jackson.annotation.JsonProperty("bookingProviderId")
    public Integer getBookingProviderId() {
        return provider != null ? provider.getProviderId() : null;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("providerRating")
    public void setProviderRating(Double providerRating) {
        // Transient field for frontend
    }

    // We also need a field to actually hold the value if we want to return it
    // since the getter above returns null.
    @Transient
    private Double ratingValue;

    @com.fasterxml.jackson.annotation.JsonProperty("providerRating")
    public Double getProviderRating() {
        return ratingValue;
    }

    public void setRatingValue(Double ratingValue) {
        this.ratingValue = ratingValue;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public Double getProviderAcceptedAmount() {
        return providerAcceptedAmount;
    }

    public void setProviderAcceptedAmount(Double providerAcceptedAmount) {
        this.providerAcceptedAmount = providerAcceptedAmount;
    }

    // Getter and setter for transient serviceField
    @com.fasterxml.jackson.annotation.JsonProperty("service")
    public String getServiceField() {
        return serviceField;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("service")
    public void setServiceField(String serviceField) {
        this.serviceField = serviceField;
        // Also set serviceName when service field is set from frontend
        if (this.serviceName == null && serviceField != null) {
            this.serviceName = serviceField;
        }
    }

    // New field for frontend "amount" consistent access
    @Transient
    @com.fasterxml.jackson.annotation.JsonProperty("amount")
    public String getAmount() {
        if (this.providerAcceptedAmount != null) {
            return String.valueOf(this.providerAcceptedAmount);
        }
        return this.service != null ? this.service.getPrice() : "0";
    }
}
