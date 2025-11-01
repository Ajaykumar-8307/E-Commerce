require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kjajaykumar8307@gmail.com',
    pass: 'ejgaaangxjrjuzqt'
  }
});

const sendVerificationEmail = async (email, otp) => {
  try {
    const templatePath = path.join(__dirname, '../html-files/otpverify-email-template.html');
    let htmlContent = await fs.readFile(templatePath, 'utf8');
    htmlContent = htmlContent
      .replace(/{otp}/g, otp)
      .replace(/{email}/g, email);

    
    const mailOptions = {
      from: 'kjajaykumar8307@gmail.com',
      to: email,
      subject: 'Email Verification Code',
      html: htmlContent
    };

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

const verifySuccessEmail = async (email, name) => {
  try {
    const templatePath = path.join(__dirname, '../html-files/verifySuccess.html');
    let htmlContent = await fs.readFile(templatePath, 'utf8');
    htmlContent = htmlContent.replace(/{email}/g, name);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verification Successful',
      html: htmlContent
    };

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending success email:', error);
    throw error;
  }
};

const PaymentSuccess = async (email, name, productName, productPrice) => {
  try {
    const templatePath = path.join(__dirname, '../html-files/PaymentSuccess.html');
    let htmlContent = await fs.readFile(templatePath, 'utf8');
    htmlContent = htmlContent
      .replace(/{email}/g, email)
      .replace(/{name}/g, name)
      .replace(/{productName}/g, productName)
      .replace(/{productPrice}/g, productPrice);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Payment Successful',
      html: htmlContent
    };

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending success email:', error);
    throw error;
  }
};

module.exports = { sendVerificationEmail, verifySuccessEmail, PaymentSuccess };
