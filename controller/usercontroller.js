const User = require('../models/User');
const Otp = require('../models/otp');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authentication');
const otpGen = require('otp-generator');
const { sendVerificationEmail, verifySuccessEmail } = require('../utils/sendEmailAuth');

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
        const user = await User.create({name,email,password, isAdmin, verified: false});

        const otp = otpGen.generate(6, { upperCase: false, specialChars: false, alphabets: false });
        const otpData = await Otp.create({email, otp});
        await sendVerificationEmail(email, otp);
        return res.status(200).json({message: "User Registered successfully!"});
    } catch (error) {
        return res.status(500).json({message: "Error Registering User. Try again later."});
    }
}

exports.verifyOtp = async (req, res) => {
    const {email, otp} = req.body;
    try{
        const otpData = await Otp.findOne({email, otp});
        if(!otpData){
            return res.status(400).json({message: "Invalid OTP"});
        }
        const user = await User.findOne({email});
        await User.updateOne({ email }, { $set: { verified: true } });
        await Otp.deleteMany({ email });
        // Generate a new token for the user after verification
        const userT = await User.findOne({ email });
        const token = generateToken(userT);
        await verifySuccessEmail(email);
        return res.status(200).json({message: "OTP Verified Successfully!", token, email});
    }catch (error) {
        return res.status(500).json({message: "Error Verifying OTP. Try Again Later."});
    }
}

exports.resendOtp = async (req, res) => {
    const { email } = req.body;
    try{
        const user = await User.findOne({ email });
        if(user.verified) {
            return res.status(400).json({message: "User is already verified."});
        }

        const otp = otpGen.generate(6, { upperCase: false, specialChars: false, alphabets: false });
        const otpData = await Otp.findOneAndUpdate(
            { email },
            { otp },
            { new: true, upsert: true }
        );
        await sendVerificationEmail(email, otp);
        return res.status(200).json({message: "OTP Resent Successfully!"});
    } catch (error) {
        return res.status(500).json({message: "Error Resending OTP. Try Again Later."});
    }
}

exports.LoginUser = async (req,res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email, password});
        if(!user){
            return res.status(400).json({message: "Invalid Credentials"});
        }
        const isVerified = user.verified;
        if(!isVerified){
            return res.status(400).json({message: "Please verify your account first."});
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