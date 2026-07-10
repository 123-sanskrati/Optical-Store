

const express = require('express');
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');
const router = express.Router();

// ✅ TEST ROUTE - Working hai
router.get('/test', (req, res) => {
  res.json({ message: '✅ Appointment routes working!' });
});

// ✅ POST - Book appointment
router.post('/', auth, async (req, res) => {
  try {
    console.log('📅 Booking appointment...');
    const appointment = new Appointment({
      ...req.body,
      user: req.user.userId
    });
    await appointment.save();
    res.status(201).json({ success: true, appointment });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ GET - All appointments (Admin only) - YE ROUTE CHAHIYE
router.get('/all', auth, async (req, res) => {
  try {
    console.log('📅 /all route hit!');
    console.log('👤 User:', req.user);
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      console.log('❌ Not admin!');
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const appointments = await Appointment.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    console.log('✅ Found:', appointments.length);
    res.json(appointments);
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET - User's appointments
router.get('/my-appointments', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.userId });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ PUT - Update status
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;