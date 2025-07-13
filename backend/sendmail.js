// backend/sendmail.js
const nodemailer = require("nodemailer");

async function sendEmail(to, subject, html) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Use from .env
      pass: process.env.EMAIL_PASS  // Use from .env
    }
  });

  await transporter.sendMail({
    from: `"Qzaar" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
}

module.exports = sendEmail;
