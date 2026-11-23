const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 }, // in ₹ (INR)
    category: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    stock: { type: Number, default: 50, min: 0 },
    rating: { type: Number, default: 4.0, min: 0, max: 5 },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
