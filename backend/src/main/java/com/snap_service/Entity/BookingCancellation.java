package com.snap_service.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "booking_cancellations")
public class BookingCancellation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cancellationId;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "provider_id")
    private ServiceProvider provider;

    public Integer getCancellationId() {
		return cancellationId;
	}
	public void setCancellationId(Integer cancellationId) {
		this.cancellationId = cancellationId;
	}
	public Booking getBooking() {
		return booking;
	}
	public void setBooking(Booking booking) {
		this.booking = booking;
	}
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public ServiceProvider getProvider() {
		return provider;
	}
	public void setProvider(ServiceProvider provider) {
		this.provider = provider;
	}
	public Admin getAdmin() {
		return admin;
	}
	public void setAdmin(Admin admin) {
		this.admin = admin;
	}
	public String getCancelledBy() {
		return cancelledBy;
	}
	public void setCancelledBy(String cancelledBy) {
		this.cancelledBy = cancelledBy;
	}
	public String getCancelReason() {
		return cancelReason;
	}
	public void setCancelReason(String cancelReason) {
		this.cancelReason = cancelReason;
	}
	public Float getCancellationCharge() {
		return cancellationCharge;
	}
	public void setCancellationCharge(Float cancellationCharge) {
		this.cancellationCharge = cancellationCharge;
	}
	public LocalDateTime getCancelledAt() {
		return cancelledAt;
	}
	public void setCancelledAt(LocalDateTime cancelledAt) {
		this.cancelledAt = cancelledAt;
	}
	@ManyToOne
    @JoinColumn(name = "admin_id")
    private Admin admin;

    private String cancelledBy;
    private String cancelReason;
    private Float cancellationCharge;
    private LocalDateTime cancelledAt;
}

