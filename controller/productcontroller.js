const Product = require('../models/addProduct');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

exports.addProduct = async (req, res) => {
  const { name, category, price, stocks, location, description, adminId } = req.body;
  try {
    const user = await User.findById(adminId);
    if (!user) {
      return res.status(500).json({ message: 'User Not Found' });
    }
    if (!user.isAdmin) {
      return res.status(401).json({ message: 'You are not an admin. Create an admin account to sell products.' });
    }

    // Upload product image to Cloudinary
    const productImageBuffer = req.files['productImage'][0].buffer;
    const productImageUpload = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${productImageBuffer.toString('base64')}`,
      {
        folder: 'products',
        transformation: [{ width: 800, quality: 70, crop: 'scale' }],
      }
    );

    // Upload company logo to Cloudinary
    const logoBuffer = req.files['companyLogo'][0].buffer;
    const logoImageUpload = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${logoBuffer.toString('base64')}`,
      {
        folder: 'logos',
        transformation: [{ width: 400, quality: 70, crop: 'scale' }],
      }
    );

    const product = await Product.create({
      name,
      category,
      price,
      stocks,
      location,
      description,
      image: productImageUpload.secure_url,
      com_logo: logoImageUpload.secure_url,
      adminId,
    });
    return res.status(200).json({ message: 'Product Added Successfully', product });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Error while adding your product' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(400).json({ message: 'error to fetch all products' });
  }
};

exports.updateProduct = async (req, res) => {
  const { id, name, category, price, stocks, location, description } = req.body;
  try {
    const updateData = {
      name,
      category,
      price,
      stocks,
      location,
      description,
    };

    // Optional: handle updated images
    if (req.files && req.files['productImage']) {
      const productImageBuffer = req.files['productImage'][0].buffer;
      const productImageUpload = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${productImageBuffer.toString('base64')}`,
        {
          folder: 'products',
          transformation: [{ width: 800, quality: 70, crop: 'scale' }],
        }
      );
      updateData.image = productImageUpload.secure_url;
    }

    if (req.files && req.files['companyLogo']) {
      const logoBuffer = req.files['companyLogo'][0].buffer;
      const logoImageUpload = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${logoBuffer.toString('base64')}`,
        {
          folder: 'logos',
          transformation: [{ width: 400, quality: 70, crop: 'scale' }],
        }
      );
      updateData.com_logo = logoImageUpload.secure_url;
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating product' });
  }
};

exports.getAdminProducts = async (req, res) => {
  const { adminId } = req.query;
  try {
    const products = await Product.find({ adminId });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(400).json({ message: 'Error to fetch your Products' });
  }
};

exports.deleteProducts = async (req, res) => {
  const { id } = req.body;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(500).json({ message: 'Product not found' });
    }
    // Delete images from Cloudinary
    const publicIdProduct = product.image.split('/').pop().split('.')[0];
    const publicIdLogo = product.com_logo.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`products/${publicIdProduct}`);
    await cloudinary.uploader.destroy(`logos/${publicIdLogo}`);
    return res.status(200).json({ message: 'Product Deleted Successfully', product });
  } catch (error) {
    return res.status(400).json({ message: 'Error to Delete Product' });
  }
};