const { PaymentSuccess } = require('../utils/sendEmailAuth');
const User = require('../models/User');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_RRiSSksVIhxJRm',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'VkwvNvJ1V3HgFAgHZ5gq8Y44'
});

exports.Pay = async (req, res) => {
    const { product, email } = req.body;

    try {
        // Log incoming request for debugging
        console.log('Received /pay/buynow request:', { product, email });

        // Validate input
        if (!product?.name || typeof product.name !== 'string' || product.name.trim() === '') {
            console.error('Missing or invalid product name:', product?.name);
            return res.status(400).json({ message: 'Missing or invalid product name' });
        }
        if (!product?.price || typeof product.price !== 'number' || product.price < 1) {
            console.error('Missing or invalid product price:', product?.price);
            return res.status(400).json({ message: 'Product price must be a number and at least ₹1' });
        }
        if (!email || typeof email !== 'string' || email.trim() === '') {
            console.error('Missing or invalid email:', email);
            return res.status(400).json({ message: 'Missing or invalid email' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            console.error('User not found for email:', email);
            return res.status(404).json({ message: 'User not found' });
        }

        // Create Razorpay order
        const options = {
            amount: Math.round(product.price * 100), // Convert to paise, ensure integer
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1
        };

        console.log('Creating Razorpay order with options:', options);
        const order = await razorpay.orders.create(options);
        if (!order?.id) {
            console.error('Razorpay order creation failed: No order ID returned');
            throw new Error('Failed to create Razorpay order');
        }

        console.log('Razorpay order created:', order);

        // Send email (handle errors separately)
        try {
            await PaymentSuccess(email, user.name, product.name, product.price);
            console.log('PaymentSuccess email sent for:', email);
        } catch (emailError) {
            console.error('PaymentSuccess email error:', emailError);
            // Don't fail the request due to email error
        }

        return res.status(200).json({
            message: 'Order Created Successfully',
            order_id: order.id,
            key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_RRiSSksVIhxJRm',
            product_name: product.name,
            amount: product.price,
            currency: 'INR',
            contact: user.contact || '',
            name: user.name || '',
            email: email
        });
    } catch (error) {
        console.error('Razorpay order creation error:', {
            message: error.message,
            stack: error.stack,
            requestBody: req.body
        });
        return res.status(500).json({
            message: 'Razorpay error',
            error: error.message || 'Unknown error'
        });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Log verification request
        console.log('Received /pay/verify request:', req.body);

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            console.error('Missing payment verification details:', req.body);
            return res.status(400).json({ message: 'Missing payment details' });
        }

        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'VkwvNvJ1V3HgFAgHZ5gq8Y44')
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            console.log('Payment verified successfully:', { razorpay_payment_id });
            return res.status(200).json({ message: 'Payment verified successfully' });
        } else {
            console.error('Invalid payment signature:', { razorpay_order_id, razorpay_payment_id });
            return res.status(400).json({ message: 'Invalid payment signature' });
        }
    } catch (error) {
        console.error('Payment verification error:', {
            message: error.message,
            stack: error.stack,
            requestBody: req.body
        });
        return res.status(500).json({
            message: 'Payment verification error',
            error: error.message || 'Unknown error'
        });
    }
};