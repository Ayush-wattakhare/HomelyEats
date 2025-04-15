import React, { useState } from "react";
import API from "../api";
import { setToken } from "../auth";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", formData);
      setToken(res.data.token);
      const role = res.data.user.role;
      localStorage.setItem("userRole", role);

      // Redirect based on role
      if (role === "vendor") {
        navigate("/vendor/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Login to LunchBox</h2>
      <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
          value={formData.email}
          className="auth-input"
          autoComplete="off"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
          value={formData.password}
          className="auth-input"
          autoComplete="new-password"
        />
        
        <button type="submit" className="cta-button">Login</button>
      </form><br></br>
       {/* Forgot Password Link */}
       <div className="auth-forgot-password">
         if forgot password  ?<Link to="/forgot-password">Forgot Password?</Link>
      </div>
      <p className="auth-footer">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
