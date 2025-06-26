const express = require('express');
const router = express.Router();
const { Pay } = require('../controller/paymentcontroller');

router.post('/create-checkout-session', Pay);

module.exports = router;