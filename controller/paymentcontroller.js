const { PaymentSuccess } = require('../utils/sendEmailAuth');
const User = require('../models/User');
const Stripe = require("stripe");
const stripe = Stripe("sk_test_51Re964QDrlAoNSk6ADlYvhC09OxB1fnDK6HtFM6NYwPyfZf00ehqRNKwdeTTVkOT4Zol5uWZnPCSxVBGsX8rHeJu00Mx7tUFoB");

exports.Pay = async (req, res) => {
    const { product, email } = req.body;

    try {
        const user = await User.findOne({email});
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [{
            price_data: {
                currency: 'inr',
                product_data: {
                name: product.name,
                },
                unit_amount: product.price * 100,
            },
            quantity: 1,
            }],
            success_url: 'http://localhost:4200/success',
            cancel_url: 'http://localhost:4200/cancel',
        });
        await PaymentSuccess()
        return res.status(200).json({message: "Order Placed Successfully", id: session.id });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Stripe error');
    }
}
