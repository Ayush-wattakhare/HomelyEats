import React, { useState } from "react";
import axios from "axios";
import "../index.css";

const countries = {
  India: ["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Uttar Pradesh"],
  USA: ["California", "New York", "Texas", "Florida", "Illinois"],
  Canada: ["Ontario", "Quebec", "Alberta", "British Columbia", "Manitoba"],
  Australia: ["New South Wales", "Victoria", "Queensland", "WA", "SA"],
  UK: ["England", "Scotland", "Wales", "Northern Ireland", "Isle of Man"],
};

const Register = () => {
  const [formData, setFormData] = useState({
    role: "customer",
    name: "",
    email: "",
    password: "",
    phone: "",
    country: "India",
    state: "",
    city: "",
    pincode: "",
    location: "",
    businessName: "",
    businessAddress: "",
    termsAccepted: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handlePincodeBlur = async () => {
    if (formData.country === "India" && formData.pincode.length === 6) {
      try {
        const res = await axios.get(`https://api.postalpincode.in/pincode/${formData.pincode}`);
        const data = res.data[0];
        if (data.Status === "Success") {
          const postOffice = data.PostOffice[0];
          setFormData((prev) => ({
            ...prev,
            city: postOffice.District,
            state: postOffice.State,
          }));
        }
      } catch (error) {
        console.error("Pincode fetch error:", error.message);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.termsAccepted) {
      alert("You must agree to the Terms & Conditions to register.");
      return;
    }

    console.log("Register data:", formData);
    alert("Registration successful! Redirecting to login...");
    window.location.href = "/login";
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="customer">Customer</option>
          <option value="vendor">Vendor</option>
        </select>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          required
          value={formData.phone}
          onChange={handleChange}
        />

        {formData.role === "vendor" && (
          <>
            <input
              type="text"
              name="businessName"
              placeholder="Business Name"
              value={formData.businessName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="businessAddress"
              placeholder="Business Address"
              value={formData.businessAddress}
              onChange={handleChange}
              required
            />
          </>
        )}

        <h4>{formData.role === "customer" ? "Delivery Address" : "Pickup Address"}</h4>

        <input
          type="text"
          name="location"
          placeholder="Street / Area"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={formData.pincode}
          onChange={handleChange}
          onBlur={handlePincodeBlur}
          required
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
        />

        <select name="country" value={formData.country} onChange={handleChange}>
          {Object.keys(countries).map((ctry) => (
            <option key={ctry} value={ctry}>{ctry}</option>
          ))}
        </select>

        <select name="state" value={formData.state} onChange={handleChange} required>
          <option value="">Select State</option>
          {countries[formData.country]?.map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>

        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
          />
          I agree to the <a href="#" target="_blank">Terms & Conditions</a>
        </label>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
