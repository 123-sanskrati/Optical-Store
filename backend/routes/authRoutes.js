const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Register request received:', req.body);
    
    const { name, email, password, phone, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
       name, 
       email,
        password,
         phone,
        role: role || 'user'});
    await user.save();
    console.log('✅ User created:', email);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role || 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send response
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user'
      }
    });
  } catch (err) {
    console.error('❌ Register error:', err);
    res.status(500).json({ 
      success: false,
      message: err.message || 'Server error' 
    });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Login request received:', req.body.email);
    
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('❌ Wrong password for:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role || 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Login successful:', email);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user'
      }
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ 
      success: false,
      message: err.message || 'Server error' 
    });
  }
});
// CHANGE PASSWORD (user must be logged in)
router.put('/change-password', auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully!' });
  } catch (err) {
    console.error('❌ Change password error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});
// FORGOT PASSWORD (verify email + phone, then reset)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email, phone, newPassword } = req.body;

    const user = await User.findOne({ email, phone });
    if (!user) {
      return res.status(400).json({ message: 'Email and phone do not match our records' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully! Please login.' });
  } catch (err) {
    console.error('❌ Forgot password error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});
module.exports = router;