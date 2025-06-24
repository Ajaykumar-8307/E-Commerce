const Cart = require('../models/Cart');

exports.addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [{ productId, quantity }] });
        } else {
            const index = cart.items.findIndex(i => i.productId.toString() === productId);
            if (index > -1) {
                cart.items[index].quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }
        }
        await cart.save();
        return res.status(200).json({message: "Product Added Successfully"});
    } catch (error) {
        return res.status(400).json({message: "Error to Add the Product. Try Again Later"});
    }
}