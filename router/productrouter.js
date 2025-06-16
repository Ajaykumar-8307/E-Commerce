const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { addProduct, getProducts, deleteProducts, getAdminProducts } = require('../controller/productcontroller');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

router.post('/addproducts', upload.single('image'), addProduct);
router.post('/deleteproduct', deleteProducts);

router.get('/getproducts', getProducts);
router.get('/adminproducts', getAdminProducts);

module.exports = router;