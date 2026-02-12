import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/ServiceDetails.css";
import { createBooking, getServices, getLocations } from "../api/api";
import { FaTools, FaBolt, FaWrench, FaHammer, FaArrowRight, FaTimes, FaServicestack } from "react-icons/fa";

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);

  const [formData, setFormData] = useState({
    description: "",
    preferredDate: "",
    address: "",
    phone: "",
    area: "",
  });

  const user = JSON.parse(localStorage.getItem("snapserviceUser"));

  useEffect(() => {
    async function loadService() {
      setLoading(true);
      try {
        // 1. Try backend
        const backendData = await getServices();
        const found = backendData.find(s => String(s.serviceId || s.id) === String(id));

        if (found) {
          setService({
            title: found.serviceName,
            icon: <FaServicestack />,
            description: found.description,
            fullDescription: found.description,
            price: found.price || "Starting at ₹399",
            features: ["Professional Support", "Quality Assurance"],
            areas: found.areas // ✅ Store service-specific areas
          });
          setLoading(false);
          return;
        }

        // 2. Try LocalStorage
        const localData = JSON.parse(localStorage.getItem("snapserviceServices")) || [];
        const localFound = localData.find(s => String(s.serviceId || s.service_id || s.id) === String(id));
        if (localFound) {
          setService({
            title: localFound.serviceName,
            icon: <FaServicestack />,
            description: localFound.description,
            fullDescription: localFound.description,
            price: localFound.price || "Starting at ₹399",
            features: ["Quick Response", "Verified Professional"]
          });
          setLoading(false);
          return;
        }

        // 3. Try Static defaults
        const staticData = {
          "m-1": { title: "Mechanic Service", icon: <FaTools />, description: "Doorstep vehicle servicing", fullDescription: "Certified mechanics handle all types of repairs.", price: "Starting at ₹499", features: ["24/7 Service", "Warranty"] },
          "e-2": { title: "Electrician Service", icon: <FaBolt />, description: "Home wiring and repairs", fullDescription: "Professional electrical solutions.", price: "Starting at ₹299", features: ["Safety Certified", "Expert Services"] },
          "p-3": { title: "Plumbing Service", icon: <FaWrench />, description: "Leakage repair and plumbing", fullDescription: "Complete plumbing solutions.", price: "Starting at ₹349", features: ["Quick Response", "Modern Tools"] },
          "c-4": { title: "Carpentry Service", icon: <FaHammer />, description: "Furniture repair and improvements", fullDescription: "Expert carpentry services.", price: "Starting at ₹399", features: ["Custom Design", "Quality Materials"] }
        };

        if (staticData[id]) {
          setService(staticData[id]);
        }

        // Fetch locations
        try {
          const locationData = await getLocations();
          setLocations(Array.isArray(locationData) ? locationData : []);
        } catch (err) {
          console.error("Error fetching locations:", err);
        }
      } catch (err) {
        console.error("Error loading service details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadService();
  }, [id]);

  const handleBookService = () => {
    if (!user) {
      alert("Please login to book a service.");
      navigate("/login");
      return;
    }

    if (user.role !== "USER") {
      alert(`Notice: You are logged in as ${user.role}. Booking is only available for User accounts. Please log in as a User if you want to test the booking flow.`);
      return;
    }

    setFormData(prev => ({
      ...prev,
      phone: user.phone || prev.phone || "",
      preferredDate: new Date().toISOString().split('T')[0] // Default to today
    }));
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      service: service.title,
      serviceName: service.title,
      description: formData.description,
      preferredDate: formData.preferredDate,
      address: formData.address,
      phone: formData.phone,
      customer: user.name,
      customerName: user.name,
      customerEmail: user.email,
      customerId: user.id,
      area: formData.area,
      status: "Pending"
    };

    try {
      console.log("Submitting booking:", payload);
      await createBooking(payload);
      setFormData({ description: "", preferredDate: "", address: "", phone: "", area: "" });
      setShowBookingModal(false);
      alert("✨ Booking submitted successfully! Redirecting you to your dashboard to track status.");
      navigate("/user/dashboard");
    } catch (err) {
      console.error("Booking submission failed:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Unknown error";
      alert(`Failed to submit booking: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <div className="loader" style={{ margin: "0 auto 20px" }}></div>
        <p>Fetching service details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <h2>Service Not Found</h2>
        <p>The requested service might have been removed or is temporarily unavailable.</p>
        <button className="btn-secondary" onClick={() => navigate("/services")} style={{ marginTop: "20px" }}>
          Back to Services
        </button>
      </div>
    );
  }

  return (
    <>
      <section className="service-details-section">
        <div className="details-card">
          <div className="details-icon-wrapper">
            <div className="details-icon">{service.icon}</div>
          </div>

          <h2>{service.title}</h2>
          <p className="main-description">{service.description}</p>
          <p className="full-description">{service.fullDescription}</p>

          <div className="features-list">
            {service.features.map((feature, idx) => (
              <div key={idx} className="feature-item">
                <span className="feature-check">✓</span>
                {feature}
              </div>
            ))}
          </div>

          <h4 className="price-tag">{service.price}</h4>

          <div className="details-actions">
            <button className="btn-primary" onClick={handleBookService}>
              Book Service <FaArrowRight />
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/services")}
            >
              Back to Services
            </button>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="booking-modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="booking-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="booking-modal-header">
              <div className="modal-title-group">
                <h2>Book {service.title}</h2>
                <p style={{ color: "rgba(255,255,255,0.8)", margin: 0, fontSize: "14px" }}>Please provide your preferred date and problem details</p>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setShowBookingModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="booking-form">
              <div className="form-group">
                <label>Service *</label>
                <input
                  type="text"
                  value={service.title}
                  disabled
                  className="disabled-input"
                />
              </div>

              <div className="form-group">
                <label>Preferred Date *</label>
                <input
                  type="date"
                  required
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Area *</label>
                <select
                  required
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                >
                  <option value="">Select Area</option>
                  {service?.areas && service.areas.length > 0 ? (
                    service.areas.map((loc, idx) => (
                      <option key={idx} value={loc.area || loc}>{loc.area || loc}</option>
                    ))
                  ) : (
                    locations.map((loc, idx) => (
                      <option key={idx} value={loc.area || loc.city || loc}>
                        {loc.area || loc.city || loc}
                      </option>
                    ))
                  )}
                  {((!service?.areas || service.areas.length === 0) && locations.length === 0) && (
                    <option value="Nashik">Nashik</option>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your service address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Description/Problem Details *</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Describe the issue in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel-booking"
                  onClick={() => setShowBookingModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit-booking" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceDetails;

