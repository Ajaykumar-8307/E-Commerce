const { Resend } = require('resend');

const resend = new Resend('re_cYSW16fp_3nnUdM8RPab32EpgVSi9g3t3');

exports.sendOtp = async (email, otp) => {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev', // or your verified domain
      to: email,
      subject: 'OTP Verification Code',
      html: `<p>Your OTP is <strong>${otp}</strong>. It is valid for 5 minutes.</p>`,
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send OTP email');
  }
};
