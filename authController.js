// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// REGISTER CONTROLLER (optional: already handled inline in route)
const registerController = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ FORGOT PASSWORD FUNCTION (stub)
const forgotPassword = async (req, res) => {
    // Add your forgot password logic here
    res.status(200).json({ message: "Forgot password endpoint hit" });
};

// ✅ VERIFY OTP FUNCTION (stub)
const verifyOtp = async (req, res) => {
    // Add your OTP verification logic here
    res.status(200).json({ message: "Verify OTP endpoint hit" });
};

// ✅ RESET PASSWORD FUNCTION (stub)
const resetPassword = async (req, res) => {
    // Add your reset password logic here
    res.status(200).json({ message: "Reset password endpoint hit" });
};

module.exports = {
    registerController,
    forgotPassword,
    verifyOtp,
    resetPassword
};
