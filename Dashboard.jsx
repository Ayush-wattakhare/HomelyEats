// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getToken } from "../auth";
import { jwtDecode } from "jwt-decode"; 
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();

    if (!token) {
      alert("Please login first.");
      return navigate("/login");
    }

    const decoded = jwtDecode(token);
    setUser(decoded);

    // Optional: Verify token with backend or fetch user data
    API.get("/user/profile")
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("Dashboard error:", err.response?.data || err.message);
        alert("Session expired. Please log in again.");
        navigate("/login");
      });
  }, [navigate]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="dashboard-layout" style={{ display: "flex" }}>
      <Sidebar role={user.role} />
      <div className="main-content" style={{ flex: 1 }}>
        <Topbar user={user} />
        <div style={{ padding: "20px" }}>
          <h2>Dashboard Home</h2>
          <p>Here you can manage your {user.role === "vendor" ? "orders" : "meals"}.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
