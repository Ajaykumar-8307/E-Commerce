const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
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
        const profileDetails = await UserProfile.create({email, phone: null, Address: null});
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
        await verifySuccessEmail(userT.email,userT.name);
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

exports.changePass = async (req, res) => {
    const { email, password, newpass } = req.body;
    try{
        const user = await User.findOne({email, password});
        if(!user){
            return res.status(500).json({message: "Invalid Credentials"});
        }
        if(newpass==user.password){
            return res.status(501).json({message: "You are Entering Current Password. Use Different Password"});
        }
        user.password = newpass;
        await user.save();
        return res.status(200).json({message: "Password Changed Successfully"});
    } catch (error){
        return res.status(400).json({messsage: "Error to Change the password"});
    }
}

exports.delUser = async (req,res) => {
    const { email } = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(500).json({message: "Given User Not Exist"});
        }
        await User.deleteMany({email});
        await UserProfile.deleteMany({email});
        return res.status(200).json({message: "Account Deleted Successfully"});
    } catch (error){
        return res.status(400).json({message: "Error to deleting User"});
    }
}

exports.getUser = async (req, res) => {
    const {email} = req.body;
    try{
        const user = await User.findOne({email});
        const details = await UserProfile.findOne({email});
        if(!user){
            return res.status(500).json({message:"Given user not exist"});
        }
        res.status(200).json({ message: 'Welcome to your profile', email: user.email, name: user.name, details });
    } catch (error){
        return res.status(400).json({message:"Error to get user"});
    }
}


exports.changeDetails = async (req, res) => {
  const { name, email, phone, Address } = req.body;

  try {
    // Update profile or create new if it doesn't exist
    let userProfile = await UserProfile.findOne({ email });

    if (!userProfile) {
      // Create new profile if not found
      userProfile = await UserProfile.create({ email, phone, Address });
    } else {
      // Update existing profile
      userProfile = await UserProfile.findOneAndUpdate(
        { email },
        { phone, Address },
        { new: true, runValidators: true }
      );
    }

    // Update name in Auth collection
    const user = await User.findOneAndUpdate(
      { email },
      { name },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found in Auth collection" });
    }

    return res.status(200).json({ message: "Profile Updated Successfully!" });

  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(400).json({ message: "Error updating your profile" });
  }
};

exports.getUserProfile = async (req,res) => {
    const { email } = req.query;
    try{
        const userProfile = await UserProfile.findOne({email});
        if(!userProfile){
            return res.status(500).json({message: "User Not Found"});
        }
        return res.status(200).json({message: "User Find", userDetails: userProfile});
    } catch(error){
        return res.status(400).json({message: "Failed to load user Details"});
    }
}