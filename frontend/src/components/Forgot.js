import React from "react";
import "../css/Forgot.css";

const ForgotPassword = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Password reset link sent to your email (Demo)");
  };

  return (
    <div className="forgot-wrapper">
      <div className="forgot-card">
        <h1 className="logo">SnapService</h1>
        <p className="subtitle">Forgot your password?</p>
        <p className="info">
          Enter your registered email address.  
          We’ll send you a reset link.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input type="email" required />
            <label>Email Address</label>
          </div>

          <button className="reset-btn">Send Reset Link</button>

          <div className="links">
            <a href="/login">Back to Login</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
