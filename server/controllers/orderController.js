const Cart = require('../models/Cart');
const Order = require('../models/Order');

// POST /api/orders  (protected)
// body: { shippingAddress: { fullName, phone, addressLine, city, pincode }, paymentMethod }
// Creates an order from the user's current cart, then clears the cart.
async function checkout(req, res) {
  try {
    const { shippingAddress, paymentMethod = 'COD' } = req.body;
    const required = ['fullName', 'phone', 'addressLine', 'city', 'pincode'];
    if (!shippingAddress || required.some((field) => !shippingAddress[field])) {
      return res
        .status(400)
        .json({ message: `Shipping address needs: ${required.join(', ')}` });
    }

    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    const items = cart.items
      .filter((item) => item.product)
      .map((item) => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        qty: item.qty,
      }));
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    const order = await Order.create({
      user: req.user.id,
      items,
      total,
      shippingAddress,
      paymentMethod,
    });

    cart.items = [];
    await cart.save();

    return res.status(201).json({ order });
  } catch (err) {
    return res.status(500).json({ message: 'Checkout failed', error: err.message });
  }
}

// GET /api/orders  (protected) — the signed-in user's order history
async function myOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json({ orders, count: orders.length });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load orders', error: err.message });
  }
}

// GET /api/orders/:id  (protected)
async function getOrder(req, res) {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.json({ order });
  } catch (err) {
    return res.status(400).json({ message: 'Invalid order id' });
  }
}

module.exports = { checkout, myOrders, getOrder };
