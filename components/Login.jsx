import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { saveToken } from "../auth";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", formData);
      const { token } = res.data;

      // ✅ Save token using helper and also directly in localStorage
      saveToken(token);
      localStorage.setItem("token", token); // Store token
     
      // ✅ Decode token to extract role
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedToken = JSON.parse(window.atob(base64));
      const role = decodedToken.role;

      // ✅ Store role in localStorage for later usage
      localStorage.setItem("role", role);

      // ✅ Redirect based on role
      if (role === "vendor") {
        navigate("/vendor-dashboard");
      } else {
        navigate("/customer-dashboard");
      }

    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        name="password"
        value={formData.password}
        onChange={handleChange}
        type="password"
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
