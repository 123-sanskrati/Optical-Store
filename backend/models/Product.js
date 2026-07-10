const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: {
    type: String,
    enum: ['sunglasses', 'eyeglasses', 'computer-glasses', 'eye-drops'],
    required: true
  },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  description: { type: String },
  image: { type: String, required: true },
  shape: { type: String, enum: ['round', 'square', 'rectangle', 'oval', 'aviator'] },
  colour: { type: String },
  frameType: { type: String, enum: ['full-rim', 'semi-rim', 'rimless'] },
  inStock: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);