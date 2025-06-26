exports.Pay = async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: "Test Product",
                        },
                        unit_amount: 10000, // ₹100.00 in paise
                    },
                    quantity: 1,
                },
            ],
            success_url: "http://localhost:5000/success.html",
            cancel_url: "http://localhost:5000/cancel.html",
        });

        res.json({ url: session.url });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}