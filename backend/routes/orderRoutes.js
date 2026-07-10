const express = require('express');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const router = express.Router();

// POST - Create order
router.post('/', auth, async (req, res) => {
  try {
    console.log('📦 Creating order for user:', req.user.userId);
    
    const order = new Order({
      user: req.user.userId,
      ...req.body
    });
    
    await order.save();
    console.log('✅ Order created:', order._id);
    
    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order
    });
  } catch (err) {
    console.error('❌ Order error:', err);
    res.status(400).json({ message: err.message });
  }
});

// GET - User's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;