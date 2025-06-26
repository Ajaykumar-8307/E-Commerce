require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./router/userrouter');
const productRouter = require('./router/productrouter');
const cartRouter = require('./router/cartrouter');
const session = require('express-session');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {
  res.send("Server Uyiroda irukku");
});

// MongoDB connection
const URL = 'mongodb+srv://kjajaykumar8307:password8307@cluster0.jhhdre3.mongodb.net/Users?retryWrites=true&w=majority';
mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/cart', cartRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});