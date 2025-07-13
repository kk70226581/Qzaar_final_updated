// backend/sendmail.js
const nodemailer = require("nodemailer");

async function sendEmail(to, subject, html) {
  console.log("📤 Attempting to send email to:", to); // <-- add this

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Qzaar" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📧 Email sent successfully:", info.response);
    return { success: true };
  } catch (err) {
    console.error("❌ Email sending failed");
    console.error("🔎 Full error:", err); // <== key line
    return { success: false, error: err.message };
  }
}

module.exports = sendEmail;
