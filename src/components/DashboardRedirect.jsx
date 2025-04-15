// src/components/DashboardRedirect.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DashboardRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole"); // Make sure you're storing this in login

    if (role === "vendor") {
      navigate("/vendor/dashboard");
    } else if (role === "customer") {
      navigate("/customer/dashboard");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <p>Redirecting...</p>; // You can replace this with a loader/spinner
};

export default DashboardRedirect;
