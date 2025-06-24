const express = require('express');
const router = express.Router();
const { addToCart, getCart, removeFromCart } = require('../controller/cartcontroller');

router.post('/add', addToCart);
router.post('/remove', removeFromCart);
router.get('/:userId', getCart);

module.exports = router;