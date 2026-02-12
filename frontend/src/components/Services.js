import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Services.css";
import { FaTools, FaBolt, FaWrench, FaHammer, FaArrowRight, FaServicestack } from "react-icons/fa";
import { getServices } from "../api/api";

const staticServices = [
  {
    id: "m-1",
    title: "Mechanic",
    desc: "Professional vehicle repair and maintenance services at your doorstep.",
    icon: <FaTools />,
    gradient: "gradient-1",
    bgImage: "🔧",
  },
  {
    id: "e-2",
    title: "Electrician",
    desc: "Certified electricians for wiring, repairs, and installations.",
    icon: <FaBolt />,
    gradient: "gradient-2",
    bgImage: "⚡",
  },
  {
    id: "p-3",
    title: "Plumbing",
    desc: "Leak fixes, pipe fitting, and bathroom plumbing solutions.",
    icon: <FaWrench />,
    gradient: "gradient-3",
    bgImage: "💧",
  },
  {
    id: "c-4",
    title: "Carpentry",
    desc: "Custom furniture, repairs, and woodwork by skilled carpenters.",
    icon: <FaHammer />,
    gradient: "gradient-4",
    bgImage: "🛠️",
  },
];

const Services = () => {
  const navigate = useNavigate();
  const [dynamicServices, setDynamicServices] = useState([]);

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await getServices();
        const backendServices = Array.isArray(data) ? data.map(s => ({
          id: s.serviceId || s.id,
          title: s.serviceName,
          desc: s.description,
          icon: <FaServicestack />,
          gradient: `gradient-${((s.serviceId || s.id) % 4) + 1}`,
          bgImage: "✨",
          isDynamic: true
        })) : [];

        // Also load from localStorage for mock admin data
        const localData = JSON.parse(localStorage.getItem("snapserviceServices")) || [];
        const localServices = localData.map(s => {
          const sid = s.serviceId || s.service_id || s.id;
          return {
            id: sid,
            title: s.serviceName,
            desc: s.description,
            icon: <FaServicestack />,
            gradient: `gradient-${(sid % 4) + 1}`,
            bgImage: "💾",
            isDynamic: true
          };
        });

        setDynamicServices([...backendServices, ...localServices]);
      } catch (err) {
        console.error("Failed to fetch dynamic services", err);
        // Fallback to only local if backend fails
        const localData = JSON.parse(localStorage.getItem("snapserviceServices")) || [];
        setDynamicServices(localData.map(s => ({
          id: s.serviceId || s.id,
          title: s.serviceName,
          desc: s.description,
          icon: <FaServicestack />,
          gradient: `gradient-${((s.serviceId || s.id) % 4) + 1}`,
          bgImage: "💾",
          isDynamic: true
        })));
      }
    }
    fetchServices();
  }, []);

  useEffect(() => {
    const cards = document.querySelectorAll(".service-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [dynamicServices]);

  const allServices = [...staticServices, ...dynamicServices];

  return (
    <section className="services-section">
      <div className="services-header">
        <h2>Our Services</h2>
        <p>Trusted professionals for all your household and vehicle needs</p>
      </div>

      <div className="services-grid">
        {allServices.map((service, index) => (
          <div
            className={`service-card ${service.gradient}`}
            key={service.id}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {service.isDynamic && <div className="new-badge">New</div>}
            <div className="card-bg-emoji">{service.bgImage}</div>
            <div className="service-icon-wrapper">
              <div className="service-icon">{service.icon}</div>
            </div>
            <h3>{service.title}</h3>
            <p>{service.desc}</p>

            <button
              className="service-btn"
              onClick={() => navigate(`/services/${service.id}`)}
            >
              Book Now <FaArrowRight className="btn-icon" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
