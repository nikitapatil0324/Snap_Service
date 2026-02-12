package com.snap_service.Entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Integer paymentId;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "payment_status")
    private String paymentStatus;

    @Column(name = "transaction_id")
    private String transactionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_booking_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    @org.hibernate.annotations.NotFound(action = org.hibernate.annotations.NotFoundAction.IGNORE)
    private Booking booking;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Payment() {}

    public Integer getPaymentId() { return paymentId; }
    public void setPaymentId(Integer paymentId) { this.paymentId = paymentId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    @Transient
    @com.fasterxml.jackson.annotation.JsonProperty("customerName")
    public String getCustomerName() {
        return booking != null ? booking.getCustomerName() : "Unknown Customer";
    }

    @Transient
    @com.fasterxml.jackson.annotation.JsonProperty("providerName")
    public String getProviderName() {
        return booking != null ? booking.getProviderName() : "Unknown Provider";
    }

    @Transient
    @com.fasterxml.jackson.annotation.JsonProperty("serviceName")
    public String getServiceName() {
        return booking != null ? booking.getServiceName() : "Service";
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
