const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  addProduct,
  getProducts,
  deleteProducts,
  getAdminProducts,
  updateProduct,
  getOneProduct
} = require('../controller/productcontroller');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  '/addproducts',
  upload.fields([
    { name: 'productImage', maxCount: 1 },
    { name: 'companyLogo', maxCount: 1 },
  ]),
  addProduct
);
router.post('/deleteproduct', deleteProducts);

router.post(
  '/updateproduct',
  upload.fields([
    { name: 'productImage', maxCount: 1 },
    { name: 'companyLogo', maxCount: 1 },
  ]),
  updateProduct
);

router.get('/pro-details', getOneProduct);
router.get('/getproducts', getProducts);
router.get('/adminproducts', getAdminProducts);

module.exports = router;