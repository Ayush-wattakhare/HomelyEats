// controllers/deliveryPartnerController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const DeliveryPartner = require('../models/DeliveryPartner');
const User = require('../models/User');

const deliveryPartnerRegister = async (req, res) => {
  try {
    console.log('Delivery Partner Registration request received:', req.body);
    
    const { name, email, password, phone, vehicleType, vehicleNumber, address, city, state, pincode } = req.body;
    
    // Check if the partner already exists in either collection
    const existingDP = await DeliveryPartner.findOne({ email });
    const existingUser = await User.findOne({ email });
    
    if (existingDP || existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    
    // Hash the password
    const hashed = await bcrypt.hash(password, 10);
    
    // Create a new delivery partner object
    const partnerData = { 
      name, 
      email, 
      password: hashed, 
      phone,
      vehicleType,
      vehicleNumber,
      address,
      city,
      state,
      pincode
    };
    
    // Add profile photo if uploaded
    const profilePhotoPath = req.file ? `/uploads/${req.file.filename}` : null;
    if (profilePhotoPath) {
      partnerData.profilePhoto = profilePhotoPath;
    }
    
    // 1. Create and save in DeliveryPartner collection
    const partner = new DeliveryPartner(partnerData);
    await partner.save();
    
    // 2. Also create an entry in the User collection
    const pickupAddressData = {
      street: address,
      city,
      state,
      pincode
    };
    
    const userData = {
      name,
      email,
      password: hashed,
      phone,
      role: 'delivery',
      profilePhoto: profilePhotoPath,
      vehicleDetails: `${vehicleType} ${vehicleNumber}`,
      pickupAddress: pickupAddressData
    };
    
    const userPartner = new User(userData);
    await userPartner.save();
    
    console.log('Delivery partner registered successfully in both collections');
    res.status(201).json({ message: 'Delivery partner registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
};

const deliveryPartnerLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const partner = await DeliveryPartner.findOne({ email });
    if (!partner) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, partner.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: partner._id, role: 'delivery_partner' }, 'your_jwt_secret', { expiresIn: '1d' });

    res.json({ token, message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { deliveryPartnerRegister, deliveryPartnerLogin };
