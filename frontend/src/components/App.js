import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./Navbar";
import Home from "./Home";
import About from "./About";
import Services from "./Services";
import Contact from "./Contact";
import ServiceDetails from "./ServiceDetails";
import Login from "./Login";
import Register from "./Register";
import Forgot from "./Forgot";

import AdminDashboard from "../pages/admin/AdminDashboard";
import UserDashboard from "../pages/user/UserDashboard";
import ProviderDashboard from "../pages/provider/ProviderDashboard";



import ProtectedRoute from "../components/ProtectedRoute";

function App() {

  const location = useLocation();

  const hideNavbar =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/user") ||
    location.pathname.startsWith("/provider");

  return (
    <div className="App">

      {!hideNavbar && <Navbar />}

      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />

        {/* ADMIN ONLY */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* USER ONLY */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* PROVIDER ONLY */}
        <Route
          path="/provider/dashboard"
          element={
            <ProtectedRoute allowedRoles={["PROVIDER"]}>
              <ProviderDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </div>
  );
}

export default App;
