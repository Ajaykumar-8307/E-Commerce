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
        return res.status(200).json({ message: "Product Added Successfully" });
    } catch (error) {
        return res.status(400).json({ message: "Error to Add the Product. Try Again Later" });
    }
}

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Fetch failed', error: err });
    }
};

exports.removeFromCart = async (req, res) => {
    const { userId, productId } = req.body;
    try {
        const cart = await Cart.findOne({ userId });
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();
        const populatedCart = await cart.populate('items.productId');
        return res.status(200).json({ message: 'Item Removed', cart: populatedCart });
    } catch (err) {
        return res.status(500).json({ message: 'Remove failed', error: err });
    }
};

exports.clearCart = async (req, res) => {
    const { userId } = req.body
    try {
        const cart = await Cart.findOneAndDelete({ userId });
        res.status(200).json({ message: 'Cart cleared' });
    } catch (err) {
        res.status(500).json({ message: 'Clear failed', error: err });
    }
};