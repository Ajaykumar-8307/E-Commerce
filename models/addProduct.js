const mongoose = require('mongoose');
const User = require('./User');

const ProductSchema = new mongoose.Schema({
  name: {type: String, required: true},
  category: { type: String, required: true },
  price: {type: Number, required: true},
  stocks: {type: Number, required: true},
  location: { type: String, required: true },
  description: { type: String, required: false },
  imageUrl: { type: String, required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);