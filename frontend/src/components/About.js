import React from "react";
import "../css/About.css";
import useScrollAnimation from "../hooks/useScrollAnimation";
import {
  FaUsers,
  FaTools,
  FaHandshake,
  FaShieldAlt,
  FaTrophy,
  FaClock,
  FaSmile,
  FaCheckCircle,
} from "react-icons/fa";

const About = () => {
  // Activate scroll animations
  useScrollAnimation();

  return (
    <section className="about-section">
      {/* Hero Section */}
      <div className="about-hero reveal">
        <h1>About SnapService</h1>
        <p>
          Connecting you with trusted professionals for all your household and
          vehicle service needs.
        </p>
        <div className="hero-badges">
          <div className="badge">⭐ Trusted by Millions</div>
          <div className="badge">✓ Quality Guaranteed</div>
          <div className="badge">🚀 24/7 Service</div>
        </div>
      </div>

      {/* About Content */}
      <div className="about-content reveal reveal-zoom">
        <h2>Who We Are</h2>
        <p>
          SnapService is a service-based platform designed to simplify your life
          by providing skilled professionals at your doorstep. From electrical
          work to plumbing and vehicle repair, we deliver quality, safety, and
          reliability.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="about-mv">
        <div className="mv-card reveal reveal-left">
          <FaHandshake className="mv-icon" />
          <h3>Our Mission</h3>
          <p>
            To deliver fast, reliable, and affordable services by connecting
            customers with verified professionals.
          </p>
        </div>

        <div className="mv-card reveal reveal-right">
          <FaShieldAlt className="mv-icon" />
          <h3>Our Vision</h3>
          <p>
            To become India’s most trusted on-demand service platform with
            unmatched customer satisfaction.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="about-stats">
        <div className="stat-item reveal">
          <FaTrophy className="stat-icon" />
          <h3>50K+</h3>
          <p>Happy Customers</p>
        </div>
        <div className="stat-item reveal">
          <FaClock className="stat-icon" />
          <h3>15 min</h3>
          <p>Avg Response Time</p>
        </div>
        <div className="stat-item reveal">
          <FaSmile className="stat-icon" />
          <h3>4.8★</h3>
          <p>Average Rating</p>
        </div>
        <div className="stat-item reveal">
          <FaCheckCircle className="stat-icon" />
          <h3>100K+</h3>
          <p>Services Completed</p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="about-features">
        <h2 className="reveal">Why Choose SnapService?</h2>

        <div className="features-grid">
          <div className="feature-card reveal card-1">
            <div className="feature-icon-wrapper">
              <FaUsers className="feature-icon" />
            </div>
            <h4>Verified Professionals</h4>
            <p>All service providers are background verified.</p>
            <span className="feature-number">10K+</span>
          </div>

          <div className="feature-card reveal card-2">
            <div className="feature-icon-wrapper">
              <FaTools className="feature-icon" />
            </div>
            <h4>Wide Range of Services</h4>
            <p>Multiple services available under one trusted platform.</p>
            <span className="feature-number">15+</span>
          </div>

          <div className="feature-card reveal card-3">
            <div className="feature-icon-wrapper">
              <FaHandshake className="feature-icon" />
            </div>
            <h4>Affordable Pricing</h4>
            <p>Transparent pricing with no hidden charges.</p>
            <span className="feature-number">20%</span>
          </div>

          <div className="feature-card reveal card-4">
            <div className="feature-icon-wrapper">
              <FaShieldAlt className="feature-icon" />
            </div>
            <h4>Secure & Reliable</h4>
            <p>Safety and reliability are our top priorities.</p>
            <span className="feature-number">100%</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
