const express = require('express');
const router = express.Router();
const { Pay } = require('../controller/paymentcontroller');

router.post('/buynow', Pay);
router.post('/verify', Pay);

module.exports = router;