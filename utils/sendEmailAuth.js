require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kjajaykumar8307@gmail.com',
    pass: 'ihaorirdmchwzzma'
  }
});

const sendVerificationEmail = async (email, otp) => {
  try {
    const templatePath = path.join(__dirname, 'otpverify-email-template.html');
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

const verifySuccessEmail = async (email) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verification Successful',
      html: `<p>You have successfully verified your account in <b>AJ E-Commerce</b>. Enjoy it!</p>`
    };

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending success email:', error);
    throw error;
  }
};

module.exports = { sendVerificationEmail, verifySuccessEmail };
