const express = require('express');
const router = express.Router();
const gemAIController = require('../controller/geminiAI');
const productDescController = require('../controller/AI/productDescriptionAI');


router.post('/product-description', productDescController.generateDescription);
router.post('/', gemAIController.generateText);

module.exports = router;