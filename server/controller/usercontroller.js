const User = require('../models/User');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authentication');

const SECRET_KEY = 'my_simple_secret';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, userName: user.name, isAdmin: user.isAdmin },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
};

exports.registerUser = async (req, res) => {
    const {name, email, password, isAdmin} = req.body;
    try {
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: "There is already an account with this Email."});
        }
        const user = await User.create({name,email,password, isAdmin});
        const token = generateToken(user);
        return res.status(200).json({message: "User Registered successfully!", token});
    } catch (error) {
        return res.status(500).json({message: "Error Registering User. Try again later."});
    }
}

exports.LoginUser = async (req,res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email, password});
        if(!user){
            return res.status(400).json({message: "Invalid Credentials"});
        }
        if(user.isAdmin){
            const token = generateToken(user);
            return res.status(200).json({message: `Welcome Back Admin ${user.name}`, token});
        }
        const token = generateToken(user);
        return res.status(200).json({message: `Welcome Back ${user.name}`, token});
    } catch (error) {
        return res.status(500).json({message: "Error to Login User. Try Again Later."});
    }
}

exports.getUser = (req, res) => {
    res.status(200).json({ message: 'Welcome to your profile', user: req.user });
}