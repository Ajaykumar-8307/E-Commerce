const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kjajaykumar8307@gmail.com',
    pass: 'ihaorirdmchwzzma'
  }
});

const sendVerificationEmail = (email, otp) => {
  const mailOptions = {
    from: 'kjajaykumar8307@gmail.com',
    to: email,
    subject: 'Email Verification Code',
    html: `<p>Your verification code is <b>${otp}</b></p>`
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
