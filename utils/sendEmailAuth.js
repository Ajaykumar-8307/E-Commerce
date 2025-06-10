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

module.exports = { sendVerificationEmail };
