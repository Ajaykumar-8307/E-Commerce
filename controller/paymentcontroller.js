const { PaymentSuccess } = require('../utils/sendEmailAuth');
const User = require('../models/User');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: 'rzp_test_RRiSSksVIhxJRm',
    key_secret: 'VkwvNvJ1V3HgFAgHZ5gq8Y44'
});

exports.Pay = async (req, res) => {
    const { product, email } = req.body;

    try {
        const user = await User.findOne({ email });

        const options = {
            amount: product.price * 100, // Razorpay accepts amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1
        };

        const order = await razorpay.orders.create(options);

        await PaymentSuccess(email, user.name, product.name, product.price);

        return res.status(200).json({
            message: "Order Created Successfully",
            order_id: order.id,
            key_id: 'rzp_test_RRiSSksVIhxJRm',
            product_name: product.name,
            amount: product.price,
            currency: 'INR',
            contact: user.contact || '', // Add user's contact if available
            name: user.name,
            email: email
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Razorpay error');
    }
};

// Add new endpoint to verify payment
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', 'VkwvNvJ1V3HgFAgHZ5gq8Y44')
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Payment is verified
            return res.status(200).json({ message: 'Payment verified successfully' });
        } else {
            return res.status(400).json({ message: 'Invalid payment signature' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Payment verification error');
    }
};