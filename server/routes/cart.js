const express = require('express');
const {
  getCart,
  addToCart,
  updateQty,
  removeFromCart,
} = require('../controllers/cartController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth); // every cart route needs a signed-in user
router.get('/', getCart);
router.post('/', addToCart);
router.put('/:productId', updateQty);
router.delete('/:productId', removeFromCart);

module.exports = router;
