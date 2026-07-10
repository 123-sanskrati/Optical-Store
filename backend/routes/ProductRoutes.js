const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// GET - All products (with filters)
router.get('/', async (req, res) => {
  try {
    const { category, brand, shape, minPrice, maxPrice, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (shape) query.shape = shape;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET - Single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;