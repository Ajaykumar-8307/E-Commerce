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
  const templatePath = path.join(__dirname, 'templates', 'otpverify-email-template.html');
  let htmlContent = await fs.readFile(templatePath, 'utf8');
  htmlContent = htmlContent.replace('{{otp}}', otp);
  const mailOptions = {
    from: 'kjajaykumar8307@gmail.com',
    to: email,
    subject: 'Email Verification Code',
    html: htmlContent
  };

  return transporter.sendMail(mailOptions);
};

const verifySuccesEmail = (email) => {
  const mailOptions = {
    from: 'kjajaykumar8307@gmail.com',
    to: email,
    subject: 'Verification SuccessFull',
    html: `<p>You Have Successfully Verified Your Account in<b> AJ E-Commerce</b>, Enjoy It</p>`
  };
  return transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail, verifySuccesEmail };
