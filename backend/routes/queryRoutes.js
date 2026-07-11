const express = require('express');
const Query = require('../models/Query');
const auth = require('../middleware/auth');
const router = express.Router();

// POST - Submit a query (no login required)
router.post('/', async (req, res) => {
  try {
    const query = new Query(req.body);
    await query.save();
    res.status(201).json({ success: true, message: 'Your query has been submitted!' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET - All queries (Admin only)
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const queries = await Query.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT - Update query status (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const query = await Query.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(query);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;