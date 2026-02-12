import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../dashboard.css";
import { createBooking, getUserBookings, getServices, getLocations, addReview, getReviewsByUser, updateUser } from "../../api/api";

const UserDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("snapserviceUser"));

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({ name: "", email: "", phone: "" });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Hooks MUST be at the top level
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableServices, setAvailableServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    serviceType: "",
    description: "",
    preferredDate: "",
    address: "",
    area: "",
    phone: user?.phone || "",
  });

  // Load Razorpay SDK
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle Payment
  const handlePayment = async (booking) => {
    const res = await loadRazorpay();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const amountToPay = booking.providerAcceptedAmount || booking.amount;
      const cleanAmount = String(amountToPay).replace(/[₹,]/g, "");

      const response = await fetch(`http://localhost:5000/api/payment/create-order?amount=${cleanAmount}`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Backend failed to create order");

      const orderData = await response.json();

      const options = {
        key: orderData.key,
        amount: orderData.amount * 100,
        currency: orderData.currency,
        name: "SnapService",
        description: `Payment for ${booking.serviceName || "Service"}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await fetch("http://localhost:5000/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                booking_id: booking.bookingId || booking.id,
                amount: parseFloat(cleanAmount),
                customer_id: user.userId || user.id,
                provider_id: booking.bookingProviderId || booking.provider?.providerId || booking.providerId || null,
              }),
            });

            if (verifyRes.ok) {
              alert("Payment Successful! Reference: " + response.razorpay_payment_id);
              window.location.reload();
            } else {
              const errorData = await verifyRes.json();
              alert("Payment failed: " + (errorData.error || "Verification failed via backend."));
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Payment verification error.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error("Payment Error:", err);
      alert("Failed to initiate payment. Ensure .NET backend is running on port 5000.");
    }
  };

  useEffect(() => {
    if (!user || user.role !== "USER") return;

    async function load() {
      try {
        const data = await getUserBookings(user.userId || user.id);
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load bookings", err);
      }

      try {
        const backendServices = await getServices();
        setAllServices(Array.isArray(backendServices) ? backendServices : []);
        const localServices = JSON.parse(localStorage.getItem("snapserviceServices")) || [];

        const combined = [
          ...(Array.isArray(backendServices) ? backendServices.map(s => s.serviceName) : []),
          ...localServices.map(s => s.serviceName),
          "Plumbing", "Electrical", "AC Service", "Repair Work", "Cleaning", "Mechanic Service", "Carpentry"
        ];
        setAvailableServices([...new Set(combined.filter(Boolean))]);
      } catch (err) {
        console.error("Failed to load services", err);
        setAvailableServices(["Plumbing", "Electrical", "AC Service", "Repair Work", "Cleaning", "Mechanic Service", "Carpentry", "Other"]);
      }

      try {
        const locs = await getLocations();
        setLocations(Array.isArray(locs) ? locs : []);
      } catch (err) {
        console.error("Failed to load areas", err);
      }

      try {
        const userReviews = await getReviewsByUser(user.userId || user.id);
        setReviews(Array.isArray(userReviews) ? userReviews : []);
      } catch (err) {
        console.error("Failed to load reviews", err);
      }
    }
    load();
  }, [user?.userId || user?.id]);

  // Auth check AFTER hooks but BEFORE event handlers/returns
  if (!user || user.role !== "USER") {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("snapserviceUser");
    navigate("/login");
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      service: formData.serviceType,
      serviceName: formData.serviceType,
      description: formData.description,
      preferredDate: formData.preferredDate,
      address: formData.address,
      phone: formData.phone,
      customer: user.name,
      customerName: user.name,
      customerEmail: user.email,
      customerId: user.userId || user.id,
      area: formData.area,
      status: "Pending"
    };

    try {
      console.log("Submitting booking:", payload);
      const created = await createBooking(payload);
      setBookings(prev => [...prev, created]);
      setFormData({ serviceType: "", description: "", preferredDate: "", address: "", area: "", phone: user?.phone || "" });
      setShowBookingForm(false);
      alert("✓ Booking submitted! Admin will assign a provider soon.");
    } catch (err) {
      console.error("Booking submission failed:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Unknown error";
      alert(`Failed to submit booking: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBookingForReview) return;

    // Validation: Rating must be 1-5 and Feedback description must not be empty
    if (!rating || rating < 1 || rating > 5) {
      alert("Please select a star rating between 1 and 5.");
      return;
    }
    if (!feedbackText || feedbackText.trim().length < 5) {
      alert("Please provide a detailed description (at least 5 characters).");
      return;
    }

    const payload = {
      feedback: feedbackText,
      title: feedbackTitle,
      rating: rating,
      bookingId: selectedBookingForReview.bookingId || selectedBookingForReview.id,
      userId: user.userId || user.id
    };

    console.log("Submitting review with payload:", payload);

    try {
      setIsSubmitting(true);
      const created = await addReview(payload);
      console.log("Review created successfully:", created);
      setReviews(prev => [...prev, created]);
      setShowReviewModal(false);
      setFeedbackText("");
      setFeedbackTitle("");
      setRating(0);
      setHoverRating(0);
      alert("⭐ Thank you for your feedback!");
    } catch (err) {
      console.error("Review submisson failed:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Internal Server Error";
      alert(`Failed to submit review: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openProfileModal = () => {
    setProfileData({
      name: user.name,
      email: user.email,
      phone: user.phone
    });
    setIsEditingProfile(false);
    setShowProfileModal(true);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updatedUser = await updateUser(user.userId || user.id, {
        ...user,
        name: profileData.name
      });
      // Update local storage
      const newUserData = { ...user, name: updatedUser.name };
      localStorage.setItem("snapserviceUser", JSON.stringify(newUserData));

      alert("Profile updated successfully! standard");
      setShowProfileModal(false);
      window.location.reload(); // Reload to reflect name in header etc
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBookingReviewed = (bookingId) => {
    return reviews.some(r => (r.booking?.bookingId || r.bookingId) === bookingId);
  };


  const activeBookings = bookings.filter(b => b.status !== "Completed").length;
  const totalSpent = bookings
    .filter(b => (b.status === "Completed" || b.status === "Paid" || b.paymentStatus === "DONE"))
    .reduce((sum, b) => {
      // Robust amount calculation: checks backend 'amount' field, then 'providerAcceptedAmount', then 'service.price'
      let rawAmount = b.amount || b.providerAcceptedAmount;
      if (!rawAmount && b.service && typeof b.service === 'object') {
        rawAmount = b.service.price;
      }

      const amountStr = String(rawAmount || "0").replace(/[₹,]/g, "");
      return sum + (parseInt(amountStr) || 0);
    }, 0);

  return (
    <main className="dashboard user-dashboard">
      <section className="dashboard-header">
        <div className="dashboard-header-content">
          <h1>Welcome back, <span>{user.name}</span>!</h1>
          <p className="dashboard-subtitle">Manage your bookings and services</p>
        </div>
        <div className="header-buttons">
          <button onClick={() => navigate("/")} className="header-home-btn">🏠 Home</button>
          <button onClick={handleLogout} className="header-logout-btn">🚪 Logout</button>
        </div>
      </section>

      <section className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>Active Bookings</h3>
            <p className="stat-value">{activeBookings}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Total Spent</h3>
            <p className="stat-value">₹{totalSpent}</p>
          </div>
        </div>
      </section>

      <section className="dashboard-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-card" onClick={() => {
            setFormData(prev => ({ ...prev, preferredDate: new Date().toISOString().split('T')[0] }));
            setShowBookingForm(true);
          }} style={{ border: "none", width: "100%", background: "#fff" }}>
            <div className="action-icon">🔧</div>
            <h3>Book New Service</h3>
            <p>Click to book a service instantly</p>
          </button>
          <div className="action-card">
            <div className="action-icon">📋</div>
            <h3>My Bookings</h3>
            <p>View and manage your service bookings</p>
          </div>
          <div className="action-card" onClick={openProfileModal} style={{ cursor: "pointer" }}>
            <div className="action-icon">👤</div>
            <h3>My Profile</h3>
            <p>Update your personal information</p>
          </div>
          <div className="action-card">
            <div className="action-icon">💬</div>
            <h3>Feedback</h3>
            <p>Share your experience with providers</p>
          </div>
        </div>
      </section>

      <section className="dashboard-recent">
        <h2>Recent Bookings</h2>
        <div className="bookings-list">
          {bookings.length === 0 ? (
            <p style={{ textAlign: "center", color: "#888" }}>No bookings yet. Book a service to get started!</p>
          ) : (
            bookings.map(booking => (
              <div key={booking.bookingId || booking.id} className="booking-item">
                <div className="booking-service">
                  <h4>{booking.serviceName || booking.service || "Service"}</h4>
                  <p>
                    {booking.provider?.name || booking.providerName || "Awaiting provider"}
                    {booking.providerRating ? ` (${booking.providerRating.toFixed(1)} ⭐)` : ""}
                    • {booking.preferredDate || booking.date || "Date TBD"}
                  </p>
                </div>
                <div className={`booking-status ${(booking.status || "pending").toLowerCase().replace(" ", "-")}`}>
                  {booking.status || "Pending"}
                </div>
                <div className="booking-amount" style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <span style={{ fontWeight: "600" }}>{booking.providerAcceptedAmount ? `₹${booking.providerAcceptedAmount}` : booking.amount || "₹--"}</span>

                  {(booking.status === "Paid" || booking.paymentStatus === "DONE" || booking.paymentStatus === "Paid") ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "green", fontWeight: "bold", border: "1px solid green", padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem" }}>✔ DONE</span>
                      {isBookingReviewed(booking.bookingId || booking.id) ? (
                        <span className="reviewed-tag" style={{ color: "#4caf50", fontWeight: "600", fontSize: "0.85rem" }}>✓ Reviewed</span>
                      ) : (
                        <button
                          className="btn-give-feedback"
                          onClick={() => { setSelectedBookingForReview(booking); setShowReviewModal(true); setRating(0); }}
                          style={{ padding: "6px 12px", background: "#ff9800", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "0.85rem" }}
                        >
                          Give Feedback
                        </button>
                      )}
                    </div>
                  ) : (
                    booking.status === "Accepted" && (booking.providerAcceptedAmount || (booking.amount && booking.amount !== "₹--")) ? (
                      <button className="btn-pay-now" onClick={() => handlePayment(booking)} style={{ padding: "6px 12px", background: "#4caf50", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "0.85rem" }}>Pay Now</button>
                    ) : null
                  )}

                  {/* Case: Status is Completed - show feedback if not reviewed */}
                  {booking.status === "Completed" && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {isBookingReviewed(booking.bookingId || booking.id) ? (
                        <span className="reviewed-tag" style={{ color: "#4caf50", fontWeight: "600", fontSize: "0.85rem" }}>✓ Reviewed</span>
                      ) : (
                        <button
                          className="btn-give-feedback"
                          onClick={() => { setSelectedBookingForReview(booking); setShowReviewModal(true); setRating(0); }}
                          style={{ padding: "6px 12px", background: "#ff9800", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "0.85rem" }}
                        >
                          Give Feedback
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {showBookingForm && (
        <div className="modal-overlay" onClick={() => setShowBookingForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book a Service</h2>
              <button className="modal-close" onClick={() => setShowBookingForm(false)}>✕</button>
            </div>
            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label>Service Type *</label>
                <select required value={formData.serviceType} onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}>
                  <option value="">Select a service</option>
                  {availableServices.map(s => (<option key={s} value={s}>{s}</option>))}
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea required placeholder="Describe the service you need..." rows="4" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Preferred Date *</label>
                <input type="date" required value={formData.preferredDate} onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Address *</label>
                <textarea required placeholder="Enter your service address..." rows="2" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Area *</label>
                <select required value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })}>
                  <option value="">Select Area</option>
                  {(() => {
                    const selectedService = allServices.find(s => s.serviceName === formData.serviceType);
                    const serviceAreas = selectedService?.areas || [];
                    return serviceAreas.length > 0 ? serviceAreas.map((loc, idx) => (<option key={idx} value={loc.area || loc}>{loc.area || loc}</option>)) : <option disabled>No areas/select service first</option>;
                  })()}
                </select>
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel-form" onClick={() => setShowBookingForm(false)}>Cancel</button>
                <button type="submit" className="btn-submit-form" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit Booking"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReviewModal && (
        <div className="modal-overlay" onClick={() => { setShowReviewModal(false); setHoverRating(0); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "450px" }}>
            <div className="modal-header">
              <h2>Rate Your Experience</h2>
              <button className="modal-close" onClick={() => { setShowReviewModal(false); setHoverRating(0); }}>✕</button>
            </div>
            <p style={{ marginBottom: "1rem", color: "#666" }}>
              How was your service for <strong>{selectedBookingForReview?.serviceName || selectedBookingForReview?.service}</strong>?
            </p>

            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label>Rating *</label>
                <div
                  className="star-rating"
                  style={{ display: "flex", gap: "10px", fontSize: "2.5rem", color: "#ffc107", cursor: "pointer", margin: "10px 0" }}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map(star => (
                    <span
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onClick={() => setRating(star)}
                      style={{ transition: "0.2s transform", transform: (hoverRating || rating) >= star ? "scale(1.2)" : "scale(1)" }}
                    >
                      {(hoverRating || rating) >= star ? "★" : "☆"}
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label>Feedback Title (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Excellent service, On time..."
                  value={feedbackTitle}
                  onChange={(e) => setFeedbackTitle(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "0.9rem" }}
                />
              </div>

              <div className="form-group">
                <label>Detailed Description *</label>
                <textarea
                  required
                  placeholder="Tell us what you liked or how we can improve..."
                  rows="4"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
                />
              </div>

              <div className="form-actions" style={{ marginTop: "20px" }}>
                <button type="button" className="btn-cancel-form" onClick={() => { setShowReviewModal(false); setHoverRating(0); }} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit-form" disabled={isSubmitting} style={{ background: "#4caf50" }}>
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "400px" }}>
            <div className="modal-header">
              <h2>My Profile</h2>
              <button className="modal-close" onClick={() => setShowProfileModal(false)}>✕</button>
            </div>

            <div className="profile-details">
              {!isEditingProfile ? (
                <>
                  <div className="detail-row">
                    <strong>Name:</strong>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: "1" }}>
                      <span>{profileData.name}</span>
                      <button onClick={() => setIsEditingProfile(true)} style={{ fontSize: "0.8rem", padding: "2px 8px", cursor: "pointer" }}>✏ Edit</button>
                    </div>
                  </div>
                  <div className="detail-row"><strong>Email:</strong> <span>{profileData.email}</span></div>
                  <div className="detail-row"><strong>Phone:</strong> <span>{profileData.phone}</span></div>
                  <div className="detail-row"><strong>Role:</strong> <span>USER</span></div>
                </>
              ) : (
                <form onSubmit={handleProfileUpdate}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={profileData.email} disabled style={{ background: "#f5f5f5" }} />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="text" value={profileData.phone} disabled style={{ background: "#f5f5f5" }} />
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn-cancel-form" onClick={() => setIsEditingProfile(false)}>Cancel</button>
                    <button type="submit" className="btn-submit-form" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Changes"}</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default UserDashboard;
