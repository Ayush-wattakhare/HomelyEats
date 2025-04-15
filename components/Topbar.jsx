import React, { useState } from "react";
import "./Topbar.css";
import { removeToken } from "../auth"; // Handles token removal
import { useNavigate } from "react-router-dom";

const Topbar = ({ user }) => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    removeToken(); // Clears token from storage
    localStorage.removeItem("userRole");
    localStorage.removeItem("user"); // If you store user info
    navigate("/login");
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <h2>LunchBox</h2>
      </div>

      <div className="topbar-right">
        <span className="welcome-text">Welcome, {user?.name}</span>
        <span className="role-badge">{user?.role}</span>

        <div className="profile-image">
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
            alt="Profile"
          />
        </div>

        <button className="theme-toggle" onClick={toggleTheme}>
          {darkMode ? "☀️" : "🌙"}
        </button>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;
