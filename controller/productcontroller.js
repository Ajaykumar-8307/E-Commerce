const Product = require('../models/addProduct');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const sharp = require('sharp');

exports.addProduct = async (req, res) => {
  const { name, category, price, stocks, location, description, adminId } = req.body;

  try {
    const user = await User.findById(adminId);
    if (!user || !user.isAdmin) {
      return res.status(401).json({ message: "You are not authorized" });
    }

    const productBuffer = await sharp(req.files['productImage'][0].buffer).resize({ width: 800 }).jpeg({ quality: 70 }).toBuffer();
    const logoBuffer = await sharp(req.files['companyLogo'][0].buffer).resize({ width: 400 }).jpeg({ quality: 70 }).toBuffer();

    const toBase64 = (buffer) => `data:image/jpeg;base64,${buffer.toString('base64')}`;

    const productUpload = await cloudinary.uploader.upload(toBase64(productBuffer), {
      folder: 'ecommerce/products',
    });

    const logoUpload = await cloudinary.uploader.upload(toBase64(logoBuffer), {
      folder: 'ecommerce/logos',
    });

    const product = await Product.create({
      name,
      category,
      price,
      stocks,
      location,
      description,
      image: productUpload.secure_url,
      com_logo: logoUpload.secure_url,
      adminId,
    });

    return res.status(200).json({ message: "Product Added Successfully", product });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Error while adding product" });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(400).json({ message: "Failed to fetch products" });
  }
};

exports.getAdminProducts = async (req, res) => {
  const { adminId } = req.query;
  try {
    const products = await Product.find({ adminId });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(400).json({ message: "Failed to fetch admin products" });
  }
};

exports.deleteProducts = async (req, res) => {
  const { id } = req.body;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await cloudinary.uploader.destroy(product.image);
    await cloudinary.uploader.destroy(product.com_logo);
    return res.status(200).json({ message: "Product deleted successfully", product });
  } catch (error) {
    return res.status(400).json({ message: "Error deleting product" });
  }
};
