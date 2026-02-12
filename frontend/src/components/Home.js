// src/components/Home.jsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Home.css";

function Home() {
  const navigate = useNavigate();

  const handleBookService = () => {
    navigate("/services");
  };
  // Scroll reveal for sections
  useEffect(() => {
    const sections = document.querySelectorAll(".scroll-reveal");

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    sections.forEach((sec) => observer.observe(sec));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="home">
      {/* HERO SECTION */}
      <section className="hero scroll-reveal">
        <div className="hero-inner">
          {/* Left: text content */}
          <div className="hero-text slide-up">
            <p className="hero-tag">⚡ On-demand home & vehicle services</p>
            <h1>
              Fix your <span>home & vehicle</span> with one tap.
            </h1>
            <p className="hero-desc">
              SnapService connects you to verified mechanics, electricians and
              plumbers nearby. Book in seconds, track live, and pay securely.
            </p>

            <div className="hero-actions">
              <button onClick={handleBookService} className="btn btn-primary">
                Book a service
              </button>
              <Link to="/about" className="btn btn-ghost">
                How it works
              </Link>
            </div>

            <div className="hero-stats">
              <div>
                <span className="stat-number">10K+</span>
                <span className="stat-label">Jobs completed</span>
              </div>
              <div>
                <span className="stat-number">4.9★</span>
                <span className="stat-label">Customer rating</span>
              </div>
              <div>
                <span className="stat-number">24/7</span>
                <span className="stat-label">Emergency support</span>
              </div>
            </div>
          </div>

          {/* Right: hero image with effects */}
          <div className="hero-visual fade-in">
            <div className="hero-image-wrapper float">
              {/* Plumber service image */}
              <img
                className="hero-image"
                src="https://www.housecallpro.com/wp-content/uploads/2024/04/home-service-business-ideas.webp"
                alt="Plumber fixing pipes - leakage, pipe fitting, tap replacement"
              />

              {/* Service badges */}
              <div className="hero-services-badges">
                <div className="service-badge mechanic-badge">
                  <span className="service-icon">🔧</span>
                  <span className="service-name">Mechanic</span>
                </div>
                <div className="service-badge electrician-badge">
                  <span className="service-icon">⚡</span>
                  <span className="service-name">Electrician</span>
                </div>
                <div className="service-badge plumber-badge">
                  <span className="service-icon">🚿</span>
                  <span className="service-name">Plumber</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* IMAGE CARDS SECTION */}
      <section className="section image-strip scroll-reveal">
        <div className="section-header">
          <h2>Experts for every urgent issue</h2>
          <p>Mechanic, electrician or plumber – we’ve got the right pro for you.</p>
        </div>

        <div className="image-card-grid">
          {/* Mechanic card */}
          <div className="image-card mechanic hover-zoom hover-lift-strong">
            <div className="image-card-inner">
              <img
                src="https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=900"
                alt="Mechanic working"
              />
              <div className="image-card-overlay" />
              <div className="image-card-content">
                <h3>Mechanic</h3>
                <p>Breakdowns, servicing, jump-start, tyre issues & more.</p>
              </div>
            </div>
          </div>

          {/* Electrician card */}
          <div className="image-card electrician hover-zoom hover-lift-strong">
            <div className="image-card-inner">
              <img
                src="https://images.pexels.com/photos/4254168/pexels-photo-4254168.jpeg?auto=compress&cs=tinysrgb&w=900"
                alt="Electrician working"
              />
              <div className="image-card-overlay" />
              <div className="image-card-content">
                <h3>Electrician</h3>
                <p>Short circuits, wiring, fans, lights, inverter setup.</p>
              </div>
            </div>
          </div>

          {/* Plumber card */}
          <div className="image-card plumber hover-zoom hover-lift-strong">
            <div className="image-card-inner">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdYIZPTCacLzMwUabCzDWIq4LmTH8UaXlCTg&s"
                alt="Plumber fixing pipe"
              />
              <div className="image-card-overlay" />
              <div className="image-card-content">
                <h3>Plumber</h3>
                <p>Leakage, pipe fitting, tap replacement, motor issues.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STEPS SECTION WITH IMAGES */}
      <section className="section steps scroll-reveal">
        <div className="section-header">
          <h2>Book in 3 simple steps</h2>
          <p>From “problem” to “fixed” in just a few taps.</p>
        </div>

        <div className="steps-grid">
          {/* Step 1 */}
          <div className="step-card zoom-in step-hover">
            <div className="step-image">
              <img
                src="https://images.pexels.com/photos/6078124/pexels-photo-6078124.jpeg?auto=compress&cs=tinysrgb&w=900"
                alt="Customer booking service on mobile"
              />
            </div>
            <div className="step-number">1</div>
            <h3>Describe your problem</h3>
            <p>
              Choose mechanic, electrician or plumber and quickly describe what
              went wrong – no technical terms needed.
            </p>
          </div>

          {/* Step 2 */}
          <div
            className="step-card zoom-in step-hover"
            style={{ animationDelay: "0.12s" }}
          >
            <div className="step-image">
              <img
                src="https://images.pexels.com/photos/8867433/pexels-photo-8867433.jpeg?auto=compress&cs=tinysrgb&w=900"
                alt="Technician getting assigned job"
              />
            </div>
            <div className="step-number">2</div>
            <h3>We match the best pro</h3>
            <p>
              Instantly get a verified nearby technician based on rating,
              distance and skills.
            </p>
          </div>

          {/* Step 3 */}
          <div
            className="step-card zoom-in step-hover"
            style={{ animationDelay: "0.24s" }}
          >
            <div className="step-image">
              <img
                src="https://images.pexels.com/photos/3822843/pexels-photo-3822843.jpeg?auto=compress&cs=tinysrgb&w=900"
                alt="Technician fixing issue at home"
              />
            </div>
            <div className="step-number">3</div>
            <h3>relax & pay securely</h3>
            <p>
              pay only when the job is completed.
            </p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="section cta scroll-reveal">
        <div className="cta-inner">
          <div>
            <h2>Need help right now?</h2>
            <p>Book a SnapService technician in less than 60 seconds.</p>
          </div>
          <div className="cta-buttons">
            <Link to="/services" className="btn btn-light">
              Book a service
            </Link>
            <Link to="/contact" className="btn btn-outline-light">
              Contact support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
