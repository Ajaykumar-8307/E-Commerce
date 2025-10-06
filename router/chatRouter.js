const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const aiController = require('../controller/ajai'); // make sure path matches

router.use(fileUpload());

// Route: text input
router.post('/', aiController.textToDescription);

module.exports = router;
