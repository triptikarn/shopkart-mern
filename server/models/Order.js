const mongoose = require('mongoose');

// Items snapshot name/price at purchase time so later product edits
// never rewrite a customer's order history.
const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: { type: [orderItemSchema], required: true },
    total: { type: Number, required: true, min: 0 },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    paymentMethod: { type: String, enum: ['COD', 'Card', 'UPI'], default: 'COD' },
    status: {
      type: String,
      enum: ['Placed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Placed',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
