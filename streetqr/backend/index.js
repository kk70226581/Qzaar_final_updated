// backend/index.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('./sendmail'); // ensure sendmail.js is in same folder

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * CORS configuration
 * - allow requests from your frontend domain(s)
 * - allow preflight OPTIONS requests
 */
const allowedOrigins = [
  'http://localhost:3000',
  'https://www.qzaar.shop',
  'https://updated-ver.onrender.com',
  'https://streetqr-backend.onrender.com'
];

app.use(cors({
  origin: (origin, callback) => {
    // allow server-to-server or tools without an origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error(`CORS blocked for origin: ${origin}`), false);
    }
    return callback(null, true);
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','Accept'],
  credentials: true,
  optionsSuccessStatus: 204
}));

// Ensure preflight requests are handled
app.options('*', cors());

app.use(helmet());
app.use(express.json({ limit: '5mb' }));

// ---------------- MongoDB ----------------
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI not set. Set it in environment variables.');
}
mongoose.connect(process.env.MONGO_URI || '', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err && err.message ? err.message : err));

// ---------------- Schemas & Models ----------------
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
orderSchema.index({ shopId: 1, createdAt: -1 });
const Order = mongoose.model('Order', orderSchema);

// Simple in-memory cache for menus (optional)
const menuCache = {};

// ---------------- Routes ----------------

// Health check
app.get('/', (req, res) => {
  res.send('API is live on Render!');
});

// Signup
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.json({ success: false, message: 'Email and password required' });

    const existing = await Shopkeeper.findOne({ email }).select('_id').lean();
    if (existing) return res.json({ success: false, message: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    const newUser = await Shopkeeper.create({ email, passwordHash: hash });
    res.json({ success: true, userId: newUser._id });
  } catch (err) {
    console.error('❌ Signup Error:', err && err.message ? err.message : err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.json({ success: false, message: 'Email and password required' });

    const user = await Shopkeeper.findOne({ email }).select('_id passwordHash menu').lean();
    if (!user) return res.json({ success: false, message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.json({ success: false, message: 'Wrong password' });

    res.json({ success: true, userId: user._id, menu: user.menu });
  } catch (err) {
    console.error('❌ Login Error:', err && err.message ? err.message : err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Forgot password - send reset email
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('📥 Forgot password request received for:', email);

    if (!email) return res.json({ success: false, message: 'Email is required' });

    const user = await Shopkeeper.findOne({ email }).select('_id').lean();
    if (!user) return res.json({ success: false, message: 'No user found with this email' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 3600000; // 1 hour

    await Shopkeeper.updateOne({ _id: user._id }, { resetToken, resetTokenExpiry: expiry });
    console.log('🔐 Token saved to DB');

    const resetLink = `https://www.qzaar.shop/reset-password/${resetToken}`;
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h3>Password Reset Request</h3>
        <p>You requested a password reset for your Qzaar account.</p>
        <p>
          <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Your Password
          </a>
        </p>
        <p style="font-size: 14px; color: #555;">If the button above doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; font-size: 13px; color: #333;">${resetLink}</p>
        <p>This link is valid for 1 hour.</p>
        <br/>
        <p style="font-size: 12px; color: gray;">— Qzaar Support Team</p>
      </div>
    `;

    console.log('✉️ Sending email to:', email);
    const emailResult = await sendEmail(email, 'Qzaar Password Reset', html);

    if (!emailResult.success) {
      console.error('❌ Email failed:', emailResult.error);
      return res.status(500).json({ success: false, message: `Email failed: ${emailResult.error}` });
    }

    console.log('✅ Email sent');
    res.json({ success: true, message: 'Reset link sent to your email' });
  } catch (err) {
    console.error('❌ Forgot Password Error:', err);
    res.status(500).json({ success: false, message: 'Server error. Check logs.' });
  }
});

// Reset password (via token)
app.post('/api/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) return res.status(400).json({ success: false, message: 'Token and password required' });

    const user = await Shopkeeper.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

    const hash = await bcrypt.hash(password, 10);
    user.passwordHash = hash;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    console.error('❌ Reset Password Error:', err && err.message ? err.message : err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Save menu
app.post('/api/menu/:userId', async (req, res) => {
  try {
    const user = await Shopkeeper.findById(req.params.userId);
    if (!user) return res.json({ success: false, message: 'User not found' });

    user.menu = req.body.menu || {};
    user.shopName = req.body.shopName || '';
    user.openHours = req.body.openHours || '';
    user.address = req.body.address || '';
    user.logo = req.body.logo || '';

    await user.save();
    menuCache[req.params.userId] = null;
    res.json({ success: true, menu: user.menu, _id: user._id });
  } catch (err) {
    console.error('❌ Menu Save Error:', err && err.message ? err.message : err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get menu (with caching)
app.get('/api/menu/:id', async (req, res) => {
  try {
    if (menuCache[req.params.id]) {
      return res.json({ success: true, ...menuCache[req.params.id] });
    }

    const user = await Shopkeeper.findById(req.params.id).select('menu logo shopName openHours address').lean();
    if (!user) return res.json({ success: false, message: 'Shopkeeper not found' });

    menuCache[req.params.id] = user;
    res.json({ success: true, ...user });
  } catch (err) {
    console.error('❌ Get Menu Error:', err && err.message ? err.message : err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Orders
app.post('/api/order', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.json({ success: true, orderId: newOrder._id });
  } catch (err) {
    console.error('❌ Order Error:', err && err.message ? err.message : err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/orders/:shopId', async (req, res) => {
  try {
    const orders = await Order.find({ shopId: req.params.shopId })
      .select('customerName tableNumber items total status createdAt')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, orders });
  } catch (err) {
    console.error('❌ Get Orders Error:', err && err.message ? err.message : err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/order-status/:orderId', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Order.findByIdAndUpdate(req.params.orderId, { status }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order: updated });
  } catch (err) {
    console.error('❌ Update Order Error:', err && err.message ? err.message : err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});