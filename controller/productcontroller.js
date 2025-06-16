const Product = require('../models/addProduct');
const User = require('../models/User');

exports.addProduct = async (req, res) => {
    const { name, price, stocks, location, description, image, adminId } = req.body;
    try {
        const user = await User.findById(adminId);
        if(!user){
            return res.status(500).json({message: "User Not Founded"});
        }
        if(!user.isAdmin){
            return res.status(401).json({message: "Your Not A Admin. Create a admin account to sell your Products"});;
        }
        const product = await Product.create({ name, price, stocks, location, description, image, adminId });
        return res.status(200).json({ message: "Product Added Successfully", product });
    } catch (error) {
        return res.status(400).json({ message: "Error to Add your Product" });
    }
}

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json(products);
    } catch (error) {
        return res.status(400).json({message: "error to fetch all products"});
    }
}

exports.getAdminProducts = async (req, res) => {
    const { adminId } = req.body;
    try{
        const products = await Product.find({adminId});
        return res.status(200).json(products);
    } catch (error) {
        return res.status(400).json({message: "Error to fetch your Products"});
    }
}

exports.deleteProducts = async (req, res) => {
    const { id } = req.body;
    try {
        const products = await Product.findByIdAndDelete({_id: id});
        if(!products){
            return res.status(500).json({message: "Product not founded"});
        }
        return res.status(200).json({message: "Product Deleted Successfully", products});
    } catch (error) {
        return res.status(400).json({message: "Error to Delete Product"});
    }
}