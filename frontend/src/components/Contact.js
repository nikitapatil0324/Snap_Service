import React from "react";
import "../css/Contact.css";
import useScrollAnimation from "../hooks/useScrollAnimation";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  // Activate scroll animations
  useScrollAnimation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector(".contact-btn");
    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    btn.classList.add("loading");
    btn.disabled = true;

    try {
      const response = await fetch("http://localhost:9090/api/contact/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("✅ Message sent successfully!");
        e.target.reset();
      } else {
        const errorText = await response.text();
        alert("❌ Failed to send message: " + errorText);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("❌ Error sending message. Please ensure the backend is running.");
    } finally {
      btn.classList.remove("loading");
      btn.disabled = false;
    }
  };

  return (
    <section className="contact-section">
      {/* Header */}
      <div className="contact-header reveal">
        <h1>Contact Us</h1>
        <p>We’d love to hear from you. Get in touch with us today.</p>
      </div>

      <div className="contact-container">
        {/* Contact Info */}
        <div className="contact-info reveal reveal-left">
          <div className="info-card">
            <FaPhoneAlt />
            <h4>Phone</h4>
            <p>+91 98765 43210</p>
          </div>

          <div className="info-card">
            <FaEnvelope />
            <h4>Email</h4>
            <p>support@snapservice.com</p>
          </div>

          <div className="info-card">
            <FaMapMarkerAlt />
            <h4>Location</h4>
            <p>Nashik, Maharashtra, India</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form reveal reveal-right">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input type="text" name="name" required />
              <label>Your Name</label>
            </div>

            <div className="input-group">
              <input type="email" name="email" required />
              <label>Email Address</label>
            </div>

            <div className="input-group">
              <textarea name="message" rows="4" required></textarea>
              <label>Your Message</label>
            </div>

            <button type="submit" className="contact-btn">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
