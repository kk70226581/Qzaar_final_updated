require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('./sendmail');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://updated-ver-git-main-karans-projects-c2579268.vercel.app',
    'https://www.qzaar.shop'
  ],
  credentials: true
}));
app.use(helmet());
app.use(express.json({ limit: '5mb' }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10
}).then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err.message));

// Schemas
const shopkeeperSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  menu: { type: Object, default: {} },
  logo: { type: String, default: "" },
  shopName: { type: String, default: "" },
  openHours: { type: String, default: "" },
  address: { type: String, default: "" },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date }
});

shopkeeperSchema.index({ email: 1 });
const Shopkeeper = mongoose.model('Shopkeeper', shopkeeperSchema);

const orderSchema = new mongoose.Schema({
  shopId: String,
  customerName: String,
  tableNumber: String,
  items: Array,
  total: Number,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
orderSchema.index({ shopId: 1, createdAt: -1 }); // ✅ Add this line

const Order = mongoose.model("Order", orderSchema);

// Cache
const menuCache = {};

// Routes
app.post("/api/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existing = await Shopkeeper.findOne({ email }).select('_id').lean();
    if (existing) return res.json({ success: false, message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    const newUser = await Shopkeeper.create({ email, passwordHash: hash });
    res.json({ success: true, userId: newUser._id });
  } catch (err) {
    console.error("❌ Signup Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Shopkeeper.findOne({ email }).select('_id passwordHash menu').lean();
    if (!user) return res.json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.json({ success: false, message: "Wrong password" });

    res.json({ success: true, userId: user._id, menu: user.menu });
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("📥 Forgot password request received for:", email); // Step 1

    if (!email) return res.json({ success: false, message: "Email is required" });

    const user = await Shopkeeper.findOne({ email }).select("_id").lean();
    console.log("👤 User found:", user); // Step 2

    if (!user) return res.json({ success: false, message: "No user found with this email" });

    const resetToken = crypto.randomBytes(32).toString("hex");

    await Shopkeeper.updateOne(
      { _id: user._id },
      {
        resetToken,
        resetTokenExpiry: Date.now() + 3600000,
      }
    );
    console.log("🔐 Token saved to DB"); // Step 3

    const resetLink = `https://www.qzaar.shop/reset-password/${resetToken}`;
    const html = `
      <h3>Password Reset Request</h3>
      <p>You requested a password reset for your Qzaar account.</p>
      <p><a href="${resetLink}">Click here to reset your password</a></p>
      <p>This link is valid for 1 hour.</p>
    `;

    console.log("✉️ Sending email to:", email); // Step 4
    const emailResult = await sendEmail(email, "Qzaar Password Reset", html);

    if (!emailResult.success) {
      console.error("❌ Email failed:", emailResult.error);
      return res.status(500).json({ success: false, message: `Email failed: ${emailResult.error}` });
    }

    console.log("✅ Email sent");
    res.json({ success: true, message: "Reset link sent to your email" });

  } catch (err) {
    console.error("❌ Forgot Password Error:", err); // Full error
    res.status(500).json({ success: false, message: "Server error. Check logs." });
  }
});


app.post("/api/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await Shopkeeper.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ success: false, message: "Invalid or expired token" });

    const hash = await bcrypt.hash(password, 10);
    user.passwordHash = hash;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("❌ Reset Password Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



app.post("/api/menu/:userId", async (req, res) => {
  try {
    const user = await Shopkeeper.findById(req.params.userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    user.menu = req.body.menu || {};
    user.shopName = req.body.shopName || "";
    user.openHours = req.body.openHours || "";
    user.address = req.body.address || "";
    user.logo = req.body.logo || "";

    await user.save();
    menuCache[req.params.userId] = null;
    res.json({ success: true, menu: user.menu, _id: user._id });
  } catch (err) {
    console.error("❌ Menu Save Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/menu/:id", async (req, res) => {
  try {
    if (menuCache[req.params.id]) {
      return res.json({ success: true, ...menuCache[req.params.id] });
    }

    const user = await Shopkeeper.findById(req.params.id).select('menu logo shopName openHours address').lean();
    if (!user) return res.json({ success: false, message: "Shopkeeper not found" });

    menuCache[req.params.id] = user;
    res.json({ success: true, ...user });
  } catch (err) {
    console.error("❌ Get Menu Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/order", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.json({ success: true, orderId: newOrder._id });
  } catch (err) {
    console.error("❌ Order Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/orders/:shopId", async (req, res) => {
  try {
    const orders = await Order.find({ shopId: req.params.shopId })
      .select('customerName tableNumber items total status createdAt')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, orders });
  } catch (err) {
    console.error("❌ Get Orders Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.put("/api/order-status/:orderId", async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Order.findByIdAndUpdate(req.params.orderId, { status }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, order: updated });
  } catch (err) {
    console.error("❌ Update Order Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get('/', (req, res) => {
  res.send('API is live on Render!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
