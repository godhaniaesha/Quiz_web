import React from "react";
import { Navigate } from "react-router-dom";

const Logout = () => {
  // Instead of showing the modal here, we'll redirect to the login page
  // The modal is now handled directly in the Sidebar component
  return <Navigate to="/login" replace />;
};

export default Logout;