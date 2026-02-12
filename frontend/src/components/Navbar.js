// // src/Navbar.jsx
// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsOpen((prev) => !prev);
//   };

//   const closeMenu = () => {
//     setIsOpen(false);
//   };

//   return (
//     <nav className="navbar">
//       <h2 className="logo">SnapService</h2>

//       {/* Hamburger icon (visible on small screens) */}
//       <button className="hamburger" onClick={toggleMenu}>
//         ☰
//       </button>

//       {/* Nav links */}
//       <ul className={`nav-links ${isOpen ? "open" : ""}`}>
//         <li>
//           <Link to="/" onClick={closeMenu}>
//             Home
//           </Link>
//         </li>
//         <li>
//           <Link to="/about" onClick={closeMenu}>
//             About
//           </Link>
//         </li>
//         <li>
//           <Link to="/services" onClick={closeMenu}>
//             Services
//           </Link>
//         </li>
//         <li>
//           <Link to="/contact" onClick={closeMenu}>
//             Contact
//           </Link>
//         </li>
//       </ul>
//     </nav>
//   );
// }

// export default Navbar;

// src/Navbar.jsx
// src/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../logo/SnapServiceLogo.png" // put your logo here
// import "./App.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("snapserviceUser"));

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("snapserviceUser");
    closeMenu();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Left: logo + brand */}
      <div className="nav-left">
        <img src={logo} alt="SnapService logo" className="nav-logo" />
        <h2 className="logo-text">
          Snap<span>Service</span>
        </h2>
      </div>

      {/* Hamburger (mobile) */}
      <button
        className="hamburger"
        onClick={toggleMenu}
        aria-label="Toggle navigation"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Links */}
      <ul className={`nav-links ${isOpen ? "open" : ""}`}>
        {/* Show login for not logged in users (removed registration from navbar) */}
        {!user && (
          <li>
            <Link to="/login" onClick={closeMenu}>
              Login
            </Link>
          </li>
        )}

        {/* Public pages for all users */}
        <li>
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/about" onClick={closeMenu}>
            About
          </Link>
        </li>
        <li>
          <Link to="/services" onClick={closeMenu}>
            Services
          </Link>
        </li>
        <li>
          <Link to="/contact" onClick={closeMenu}>
            Contact
          </Link>
        </li>

        {/* Role-specific dashboard links */}
        {user && user.role === "USER" && (
          <>
            <li>
              <Link to="/services" onClick={closeMenu} style={{ color: "#ffe082", fontWeight: "bold" }}>
                ✨ Book Now
              </Link>
            </li>
            <li>
              <Link to="/user/dashboard" onClick={closeMenu}>
                My Dashboard
              </Link>
            </li>
          </>
        )}

        {user && user.role === "PROVIDER" && (
          <li>
            <Link to="/provider/dashboard" onClick={closeMenu}>
              Provider Dashboard
            </Link>
          </li>
        )}

        {user && user.role === "ADMIN" && (
          <li>
            <Link to="/admin/dashboard" onClick={closeMenu}>
              Admin Dashboard
            </Link>
          </li>
        )}
      </ul>

      {/* User Profile Section */}
      {user && (
        <div className="user-profile">
          <span className="user-name">{user.name}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
