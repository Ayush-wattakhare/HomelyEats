// lunchbox-backend/controllers/adminController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // using User model for admin
const Vendor = require('../models/Vendor');
const Order = require('../models/Order');

const adminLoginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await User.findOne({ email, role: 'admin' });  // ✅ only find user with role admin
    if (!admin) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: admin._id, role: 'admin' }, 'your_jwt_secret', { expiresIn: '1d' });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    res.json({ totalUsers });
  } catch (err) {
    console.error('Error fetching user stats:', err);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
};

const getVendorStats = async (req, res) => {
  try {
    const totalVendors = await Vendor.countDocuments();
    res.json({ totalVendors });
  } catch (err) {
    console.error('Error fetching vendor stats:', err);
    res.status(500).json({ message: 'Failed to get vendor stats' });
  }
};

const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenueData = await Order.aggregate([
      { $group: { _id: null, revenue: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = totalRevenueData[0]?.revenue || 0;

    res.json({ totalOrders, totalRevenue });
  } catch (err) {
    console.error('Error fetching order stats:', err);
    res.status(500).json({ message: 'Failed to get order stats' });
  }
};

module.exports = { getUserStats, getVendorStats, getOrderStats, adminLoginController };
