const express = require('express');
const {
  listProducts,
  listCategories,
  getProduct,
} = require('../controllers/productController');

const router = express.Router();

router.get('/', listProducts);
router.get('/categories', listCategories); // before /:id so "categories" isn't read as an id
router.get('/:id', getProduct);

module.exports = router;
