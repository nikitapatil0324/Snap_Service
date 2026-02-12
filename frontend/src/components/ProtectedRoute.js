import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {

  const user = JSON.parse(localStorage.getItem("snapserviceUser"));

  // not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // role not allowed
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
