const express = require('express');
const router = express.Router();
const { addProduct, getProducts, deleteProducts, getAdminProducts } = require('../controller/productcontroller');

router.post('/addproducts', addProduct);
router.post('/deleteproduct', deleteProducts);

router.get('/getproducts', getProducts);
router.get('/adminproducts', getAdminProducts);

module.exports = router;