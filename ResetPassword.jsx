import React, { useState } from "react";
import axios from "axios";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/reset-password", { email });
      setMessage(res.data.msg || "If the email exists, a reset link has been sent.");
    } catch (err) {
      console.error("Reset error:", err);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="reset-container">
      <form onSubmit={handleReset} className="reset-form">
        <h2>Reset Password</h2>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
