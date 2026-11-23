const express = require('express');
const { checkout, myOrders, getOrder } = require('../controllers/orderController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth); // every order route needs a signed-in user
router.post('/', checkout);
router.get('/', myOrders);
router.get('/:id', getOrder);

module.exports = router;
