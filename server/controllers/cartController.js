const Cart = require('../models/Cart');
const Product = require('../models/Product');

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
}

// Returns the cart with product details populated + computed subtotal
async function populatedCart(userId) {
  const cart = await getOrCreateCart(userId);
  await cart.populate('items.product');
  const items = cart.items
    .filter((item) => item.product) // product may have been deleted
    .map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
      qty: item.qty,
      lineTotal: item.product.price * item.qty,
    }));
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  return { items, subtotal, count: items.reduce((sum, item) => sum + item.qty, 0) };
}

// GET /api/cart  (protected)
async function getCart(req, res) {
  try {
    return res.json(await populatedCart(req.user.id));
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load cart', error: err.message });
  }
}

// POST /api/cart  (protected)  body: { productId, qty }
async function addToCart(req, res) {
  try {
    const { productId, qty = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (qty < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });

    const cart = await getOrCreateCart(req.user.id);
    const line = cart.items.find((item) => item.product.toString() === productId);
    if (line) line.qty += qty;
    else cart.items.push({ product: productId, qty });
    await cart.save();
    return res.json(await populatedCart(req.user.id));
  } catch (err) {
    return res.status(400).json({ message: 'Failed to add to cart', error: err.message });
  }
}

// PUT /api/cart/:productId  (protected)  body: { qty }  — qty 0 removes the line
async function updateQty(req, res) {
  try {
    const { qty } = req.body;
    if (qty == null || qty < 0) {
      return res.status(400).json({ message: 'Quantity must be 0 or more' });
    }
    const cart = await getOrCreateCart(req.user.id);
    if (qty === 0) {
      cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);
    } else {
      const line = cart.items.find((item) => item.product.toString() === req.params.productId);
      if (!line) return res.status(404).json({ message: 'Item not in cart' });
      line.qty = qty;
    }
    await cart.save();
    return res.json(await populatedCart(req.user.id));
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update cart', error: err.message });
  }
}

// DELETE /api/cart/:productId  (protected)
async function removeFromCart(req, res) {
  try {
    const cart = await getOrCreateCart(req.user.id);
    cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);
    await cart.save();
    return res.json(await populatedCart(req.user.id));
  } catch (err) {
    return res.status(500).json({ message: 'Failed to remove item', error: err.message });
  }
}

module.exports = { getCart, addToCart, updateQty, removeFromCart };
