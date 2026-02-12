import React, { useState, useEffect } from "react";
import { register as apiRegister, registerProvider as apiRegisterProvider, getServices, getLocations } from "../api/api";
import "../css/Register.css";

/* ---------- DROPDOWN DATA ---------- */

const Register = () => {
  const [role, setRole] = useState("user");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [serviceName, setServiceName] = useState("");
  const [city, setCity] = useState("Nashik"); // ✅ Default to Nashik

  const [availableServices, setAvailableServices] = useState([]);
  const [filteredAreas, setFilteredAreas] = useState([]);
  const [allLocations, setAllLocations] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch Services and Locations on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesData = await getServices();
        setAvailableServices(Array.isArray(servicesData) ? servicesData : []);

        const locationsData = await getLocations();
        setAllLocations(Array.isArray(locationsData) ? locationsData : []);
      } catch (err) {
        console.error("Failed to fetch services/locations:", err);
      }
    };
    fetchData();
  }, []);

  // Filter areas when service selection changes
  const handleServiceChange = (e) => {
    const selectedSrvName = e.target.value;
    setServiceName(selectedSrvName);

    const service = availableServices.find(s => s.serviceName === selectedSrvName);
    if (service && service.areas && service.areas.length > 0) {
      setFilteredAreas(service.areas);
    } else {
      // Fallback: Use all system locations if service has no specific areas
      setFilteredAreas(allLocations);
    }
  };

  /* ---------- SUBMIT ---------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {

      // =============================
      // USER REGISTRATION
      // =============================
      if (role === "user") {

        await apiRegister({
          name,
          email,
          phone,
          password,
          role: "USER",
          city: "Nashik" // ✅ Set default city for regular users
        });

        setSuccess("User registered successfully 🎉");
      }

      // =============================
      // PROVIDER REGISTRATION
      // =============================
      else {

        await apiRegisterProvider({
          name,
          email,
          password,
          serviceName,
          city
        });

        setSuccess("Service provider registered successfully ⏳");
      }

      // clear form
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setServiceName("");
      setCity("Nashik"); // Reset to default

    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">

        <h1 className="logo">SnapService</h1>
        <p className="subtitle">Create your account</p>

        {/* ROLE SELECTION */}
        <div className="role-select">
          <button
            type="button"
            className={role === "user" ? "active" : ""}
            onClick={() => setRole("user")}
          >
            User
          </button>

          <button
            type="button"
            className={role === "provider" ? "active" : ""}
            onClick={() => setRole("provider")}
          >
            Provider
          </button>
        </div>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <form onSubmit={handleSubmit}>

          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {/* PROVIDER FIELDS */}
          {role === "provider" && (
            <>
              <select
                value={serviceName}
                onChange={handleServiceChange}
                required
              >
                <option value="">Select Service</option>
                {availableServices.map((s, i) => (
                  <option key={i} value={s.serviceName}>
                    {s.serviceName}
                  </option>
                ))}
              </select>

              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              >
                <option value="">Select Area</option>
                {filteredAreas.length > 0 ? (
                  filteredAreas.map((l, i) => (
                    <option key={i} value={l.area || l.name || l}>
                      {l.area || l.name || l}
                    </option>
                  ))
                ) : (
                  allLocations.map((l, i) => (
                    <option key={i} value={l.area || l.name || l}>
                      {l.area || l.name || l}
                    </option>
                  ))
                )}
              </select>
            </>
          )}

          <button type="submit" className="register-btn">
            Register
          </button>

        </form>
      </div>
    </div>
  );
};

export default Register;
