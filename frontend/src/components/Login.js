import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import { login as apiLogin, setToken } from "../api/api";
import { FaEnvelope, FaLock, FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Mock users for testing
    const mockUsers = [
      { admin_id: 1, adminId: 1, id: 1, name: "Super Admin", email: "admin@snapservice.com", password: "Admin@123", role: "ADMIN" },
      { id: 2, name: "John Customer", email: "user@test.com", password: "user123", role: "USER" },
      { id: 3, name: "John's Electrical", email: "provider@test.com", password: "provider123", role: "PROVIDER", providerId: 1 },
    ];

    try {
      // Try backend login first
      const res = await apiLogin({ email, password });
      const user = res.user || res;
      const token = res.token || res.accessToken || null;

      if (!user) {
        // Fallback to mock users if backend doesn't return user
        const mockUser = mockUsers.find(u => u.email === email && u.password === password);
        if (!mockUser) {
          setError("Invalid credentials");
          return;
        }
        if (token) setToken(token);
        localStorage.setItem("snapserviceUser", JSON.stringify(mockUser));
        // Redirect to home page
        navigate("/");
        return;
      }

      if (token) setToken(token);

      const userToStore = {
        ...user,
        admin_id: user.admin_id || user.adminId || user.id,
        adminId: user.admin_id || user.adminId || user.id
      };

      localStorage.setItem("snapserviceUser", JSON.stringify(userToStore));

      // Redirect based on role
      if (userToStore.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (userToStore.role === "PROVIDER") {
        navigate("/provider/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);

      // Fallback: try mock users if backend fails
      const mockUser = mockUsers.find(u => u.email === email && u.password === password);
      if (mockUser) {
        localStorage.setItem("snapserviceUser", JSON.stringify(mockUser));
        if (mockUser.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (mockUser.role === "PROVIDER") {
          navigate("/provider/dashboard");
        } else {
          navigate("/");
        }
        return;
      }

      setError(err?.response?.data?.message || "Login failed. Try test credentials below.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left side - Branding & Info */}
        <div className="login-info">
          <div className="info-content">
            <div className="brand-logo">
              <h2>SnapService</h2>
            </div>
            <h3>Welcome Back!</h3>
            <p>Sign in to access your services and bookings</p>

            <div className="info-features">
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span>Manage your bookings</span>
              </div>
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span>Track service providers</span>
              </div>
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span>Secure & reliable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="login-form-container">
          <div className="login-card">
            <h1>Sign In</h1>
            <p className="subtitle">Enter your credentials to continue</p>

            {error && <div className="error-box"><span>⚠️</span> {error}</div>}

            {/* Test credentials removed per request */}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <button type="submit" className="btn-signin">
                Sign In <FaArrowRight />
              </button>
            </form>

            {/* Register Link */}
            <div className="auth-footer">
              <p>Don't have an account?</p>
              <a href="/register" className="register-link">
                Create account
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
