const express = require('express');
const router = express.Router();
const { addToCart } = require('../controller/cartcontroller');

router.post('/add', addToCart);

module.exports = router;