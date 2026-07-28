const nodemailer = require('nodemailer');

function isConfigured() {
  return Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);
}

async function sendEmail(to, subject, html) {
  if (!isConfigured()) {
    console.warn('Email delivery is not configured; message was not sent.');
    return { success: false, error: 'Email delivery is not configured.' };
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });

  try {
    const info = await transporter.sendMail({
      from: `"Qzaar" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log('Email accepted by the mail provider:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error?.message || error);
    return { success: false, error: 'Email provider rejected the message.' };
  }
}

module.exports = sendEmail;
module.exports.isConfigured = isConfigured;
