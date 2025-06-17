const Product = require('../models/addProduct');
const User = require('../models/User');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

exports.addProduct = async (req, res) => {
    const { name, category, price, stocks, location, description, adminId } = req.body;

    try {
        const user = await User.findById(adminId);
        if (!user) {
            return res.status(500).json({ message: "User Not Found" });
        }
        if (!user.isAdmin) {
            return res.status(401).json({ message: "You are not an admin. Create an admin account to sell products." });
        }

        // Compress and save images
        const productImageBuffer = req.files['productImage'][0].buffer;
        const productImageName = `product_${Date.now()}.jpeg`;
        const productImagePath = path.join(__dirname, '../uploads', productImageName);
        await sharp(productImageBuffer)
            .resize({ width: 800 }) // optional
            .jpeg({ quality: 70 })
            .toFile(productImagePath);

        const logoBuffer = req.files['companyLogo'][0].buffer;
        const logoImageName = `logo_${Date.now()}.jpeg`;
        const logoImagePath = path.join(__dirname, '../uploads', logoImageName);
        await sharp(logoBuffer)
            .resize({ width: 400 }) // optional
            .jpeg({ quality: 70 })
            .toFile(logoImagePath);

        const imageURL = `https://e-commerce-bmp5.onrender.com/uploads/${productImageName}`;
        const logoURL = `https://e-commerce-bmp5.onrender.com/uploads/${logoImageName}`;

        const product = await Product.create({
            name,
            category,
            price,
            stocks,
            location,
            description,
            image: imageURL,
            com_logo: logoURL,
            adminId,
        });

        return res.status(200).json({ message: "Product Added Successfully", product });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Error while adding your product" });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json(products);
    } catch (error) {
        return res.status(400).json({ message: "error to fetch all products" });
    }
}

exports.getAdminProducts = async (req, res) => {
    const { adminId } = req.query;
    try {
        const products = await Product.find({ adminId });
        return res.status(200).json(products);
    } catch (error) {
        return res.status(400).json({ message: "Error to fetch your Products" });
    }
}

exports.deleteProducts = async (req, res) => {
    const { id } = req.body;
    try {
        const products = await Product.findByIdAndDelete({ _id: id });
        if (!products) {
            return res.status(500).json({ message: "Product not founded" });
        }
        return res.status(200).json({ message: "Product Deleted Successfully", products });
    } catch (error) {
        return res.status(400).json({ message: "Error to Delete Product" });
    }
}