require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./router/userrouter');
const productRouter = require('./router/productrouter');
const session = require('express-session');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors({
  origin: ['http://localhost:4200', 'https://your-angular-app-domain.com'],
  credentials: true,
}));
app.use(express.json());

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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});