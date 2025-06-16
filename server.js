const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./router/userrouter'); // Import user router 
const productRouter = require('./router/productrouter') ;
const session = require('express-session');

const app = express();
const PORT = 3000;
const cors = require('cors');

app.use(cors());
app.use(express.json());

const URL = 'mongodb+srv://kjajaykumar8307:password8307@cluster0.jhhdre3.mongodb.net/Users?retryWrites=true&w=majority';

// MongoDB connection
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
