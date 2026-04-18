const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:     String,
    quantity: Number,
    price:    Number
  }],
  total:  { type: Number, required: true },
  status: { type: String, default: 'pending', enum: ['pending','processing','delivered','cancelled'] }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
