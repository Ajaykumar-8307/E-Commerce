const Product = require('../models/addProduct');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

exports.addProduct = async (req, res) => {
  const {
    name,
    category,
    price,
    stocks,
    location,
    description,
    adminId,
    productImageUrl,
    companyLogoUrl
  } = req.body;

  try {
    const user = await User.findById(adminId);
    if (!user) {
      return res.status(404).json({ message: 'User Not Found' });
    }
    if (!user.isAdmin) {
      return res.status(401).json({ message: 'You are not an admin. Create an admin account to sell products.' });
    }

    let productImageUpload = null;
    let logoImageUpload = null;

    // Handle product image upload
    if (req.files?.['productImage']) {
      const buffer = req.files['productImage'][0].buffer;
      productImageUpload = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${buffer.toString('base64')}`,
        {
          folder: 'products',
          transformation: [{ width: 800, quality: 70, crop: 'scale' }],
        }
      );
    } else if (productImageUrl) {
      productImageUpload = await cloudinary.uploader.upload(productImageUrl, {
        folder: 'products',
        transformation: [{ width: 800, quality: 70, crop: 'scale' }],
      });
    }

    // Handle company logo upload
    if (req.files?.['companyLogo']) {
      const buffer = req.files['companyLogo'][0].buffer;
      logoImageUpload = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${buffer.toString('base64')}`,
        {
          folder: 'logos',
          transformation: [{ width: 400, quality: 70, crop: 'scale' }],
        }
      );
    } else if (companyLogoUrl) {
      logoImageUpload = await cloudinary.uploader.upload(companyLogoUrl, {
        folder: 'logos',
        transformation: [{ width: 400, quality: 70, crop: 'scale' }],
      });
    }

    const product = await Product.create({
      name,
      category,
      price,
      stocks,
      location,
      description,
      image: productImageUpload?.secure_url,
      com_logo: logoImageUpload?.secure_url,
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
    return res.status(400).json({ message: 'Error fetching all products' });
  }
};

exports.getOneProduct = async (req, res) => {
  const { id } = req.query;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const admin = await User.findById(product.adminId);
    return res.status(200).json({ product, admin });
  } catch (error) {
    return res.status(400).json({ message: 'Error getting product details' });
  }
};

exports.updateProduct = async (req, res) => {
  const { id, name, category, price, stocks, location, description, productImageUrl, companyLogoUrl } = req.body;

  try {
    const updateData = {
      name,
      category,
      price,
      stocks,
      location,
      description,
    };

    // Optional updated product image
    if (req.files?.['productImage']) {
      const buffer = req.files['productImage'][0].buffer;
      const upload = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${buffer.toString('base64')}`,
        {
          folder: 'products',
          transformation: [{ width: 800, quality: 70, crop: 'scale' }],
        }
      );
      updateData.image = upload.secure_url;
    } else if (productImageUrl) {
      const upload = await cloudinary.uploader.upload(productImageUrl, {
        folder: 'products',
        transformation: [{ width: 800, quality: 70, crop: 'scale' }],
      });
      updateData.image = upload.secure_url;
    }

    // Optional updated logo
    if (req.files?.['companyLogo']) {
      const buffer = req.files['companyLogo'][0].buffer;
      const upload = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${buffer.toString('base64')}`,
        {
          folder: 'logos',
          transformation: [{ width: 400, quality: 70, crop: 'scale' }],
        }
      );
      updateData.com_logo = upload.secure_url;
    } else if (companyLogoUrl) {
      const upload = await cloudinary.uploader.upload(companyLogoUrl, {
        folder: 'logos',
        transformation: [{ width: 400, quality: 70, crop: 'scale' }],
      });
      updateData.com_logo = upload.secure_url;
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
    return res.status(400).json({ message: 'Error fetching your products' });
  }
};

exports.deleteProducts = async (req, res) => {
  const { id } = req.body;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Extract public ID from Cloudinary URLs
    const getPublicId = (url) => {
      const parts = url.split('/');
      const filename = parts.pop();
      const folder = parts.pop();
      return `${folder}/${filename.split('.')[0]}`;
    };

    if (product.image) {
      await cloudinary.uploader.destroy(getPublicId(product.image));
    }
    if (product.com_logo) {
      await cloudinary.uploader.destroy(getPublicId(product.com_logo));
    }

    return res.status(200).json({ message: 'Product deleted successfully', product });
  } catch (error) {
    return res.status(400).json({ message: 'Error deleting product' });
  }
};