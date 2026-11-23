const Product = require('../models/Product');

// GET /api/products?search=&category=
async function listProducts(req, res) {
  try {
    const { search = '', category = '' } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    const products = await Product.find(filter).sort({ createdAt: -1 });
    return res.json({ products, count: products.length });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to list products', error: err.message });
  }
}

// GET /api/products/categories
async function listCategories(req, res) {
  try {
    const categories = await Product.distinct('category');
    return res.json({ categories });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to list categories', error: err.message });
  }
}

// GET /api/products/:id
async function getProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json({ product });
  } catch (err) {
    return res.status(400).json({ message: 'Invalid product id' });
  }
}

module.exports = { listProducts, listCategories, getProduct };
