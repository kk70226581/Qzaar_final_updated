const path = require('path');
const dotenv = require('dotenv');

// Always load the server configuration from this folder. This keeps email and
// database settings available whether the server is started from `backend/`
// or with `node backend/index.js` from the project root.
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const { OAuth2Client } = require('google-auth-library');
const { createServer } = require('http');
const { Server } = require('socket.io');
const sendEmail = require('./sendmail');

// ✅ Import all route modules
const authRoutes = require('./routes-auth');
const analyticsRoutes = require('./routes-analytics');
const menuRoutes = require('./routes-menu');
const ordersRoutes = require('./routes-orders');
const cartRoutes = require('./routes-cart');
const inventoryRoutes = require('./routes-inventory');
const settingsRoutes = require('./routes-settings');
const paymentsRoutes = require('./routes-payments');

const app = express();
const httpServer = createServer(app);
app.set('trust proxy', 1);
app.disable('x-powered-by');
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  FRONTEND_URL,
  'https://www.qzaar.store',
  'https://updated-ver.vercel.app',
  'https://updated-ver.onrender.com',
  'https://streetqr-backend.onrender.com',
  ...String(process.env.CORS_ORIGINS || '').split(',').map((origin) => origin.trim()).filter(Boolean)
];
const isAllowedOrigin = (origin) => !origin || allowedOrigins.includes(origin);
const corsOptions = {
  origin: (origin, callback) => callback(null, isAllowedOrigin(origin)),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 204
};
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => callback(null, isAllowedOrigin(origin)),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
  }
});

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;
const RESET_OTP_TTL_MS = 10 * 60 * 1000;
const RESET_GRANT_TTL_MS = 10 * 60 * 1000;
const MAX_RESET_OTP_ATTEMPTS = 5;

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const hashSecret = (value) => crypto.createHash('sha256').update(value).digest('hex');
const passwordProblem = (password) => {
  if (typeof password !== 'string' || password.length < 10) return 'Use at least 10 characters.';
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    return 'Use upper and lowercase letters plus a number.';
  }
  return '';
};

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many sign-in attempts. Please try again in 15 minutes.' }
});
const resetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many reset requests. Please try again later.' }
});

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express.json({ limit: '5mb' }));
app.use('/api/login', authLimiter);
app.use('/api/signup', authLimiter);
app.use('/api/auth/google', authLimiter);
app.use('/api/forgot-password', resetLimiter);

// ✅ Razorpay Initialization
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});
const hasRazorpayCredentials = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

// ✅ MongoDB Connection
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not set in environment variables.');
}

mongoose.connect(process.env.MONGO_URI || '', { maxPoolSize: 10 })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error?.message || error));

// ✅ Import Models from models.js
const { Shopkeeper, Order, Coupon } = require('./models');

const menuCache = {};
const connectedUsers = new Map();

// ✅ Helper Functions
const flattenMenu = (menu = {}) =>
  Object.entries(menu).flatMap(([category, items]) =>
    (items || []).map((item) => ({ ...item, category }))
  );

const buildDashboardMetrics = (shop, orders) => {
  const allMenuItems = flattenMenu(shop?.menu);
  const topItemMap = {};

  let grossRevenue = 0;
  let completedRevenue = 0;
  let cancelledRevenue = 0;

  orders.forEach((order) => {
    const orderTotal = Number(order.total) || 0;

    if (order.status === 'cancelled') {
      cancelledRevenue += Number(order.refundAmount) || 0;
    } else {
      grossRevenue += orderTotal;
      if (order.status === 'completed') {
        completedRevenue += orderTotal;
      }
    }

    (order.items || []).forEach((item) => {
      if (order.status !== 'cancelled') {
        const itemName = item?.name || 'Unnamed item';
        const quantity = Number(item?.quantity) || 1;
        const revenue = (Number(item?.price) || 0) * quantity;

        if (!topItemMap[itemName]) {
          topItemMap[itemName] = { name: itemName, orders: 0, quantity: 0, revenue: 0 };
        }

        topItemMap[itemName].orders += 1;
        topItemMap[itemName].quantity += quantity;
        topItemMap[itemName].revenue += revenue;
      }
    });
  });

  const pendingOrders = orders.filter((order) => order.status === 'pending').length;
  const preparingOrders = orders.filter((order) => order.status === 'preparing').length;
  const completedOrders = orders.filter((order) => order.status === 'completed').length;
  const cancelledOrders = orders.filter((order) => order.status === 'cancelled').length;
  const availableItems = allMenuItems.filter((item) => item.available !== false).length;
  const featuredItems = allMenuItems.filter((item) => item.featured).length;
  const averageOrderValue = orders.filter(o => o.status !== 'cancelled').length ? grossRevenue / orders.filter(o => o.status !== 'cancelled').length : 0;

  return {
    shopName: shop?.shopName || '',
    totalOrders: orders.filter(o => o.status !== 'cancelled').length,
    pendingOrders,
    preparingOrders,
    completedOrders,
    cancelledOrders,
    grossRevenue,
    completedRevenue,
    cancelledRevenue,
    averageOrderValue,
    menuStats: {
      totalItems: allMenuItems.length,
      featuredItems,
      availableItems,
      categoryCount: Object.keys(shop?.menu || {}).length
    },
    topItems: Object.values(topItemMap)
      .sort((left, right) => right.quantity - left.quantity)
      .slice(0, 5)
  };
};

// ✅ Socket.io Events for Real-time Updates
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_shop', (shopId) => {
    socket.join(`shop_${shopId}`);
    connectedUsers.set(socket.id, shopId);
    console.log(`Socket ${socket.id} joined shop ${shopId}`);
  });

  socket.on('join_order_tracking', (orderId) => {
    socket.join(`order_${orderId}`);
    console.log(`Socket ${socket.id} joined order tracking for ${orderId}`);
  });

  socket.on('disconnect', () => {
    connectedUsers.delete(socket.id);
    console.log('User disconnected:', socket.id);
  });
});

// ✅ Authentication Routes
app.post('/api/signup', async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    if (!isValidEmail(email) || !password) {
      return res.status(400).json({ success: false, message: 'Enter a valid email address and password.' });
    }
    const invalidPasswordMessage = passwordProblem(password);
    if (invalidPasswordMessage) {
      return res.status(400).json({ success: false, message: invalidPasswordMessage });
    }

    const existing = await Shopkeeper.findOne({ email }).select('_id').lean();
    if (existing) {
      return res.json({ success: false, message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await Shopkeeper.create({ email, passwordHash });

    return res.json({ success: true, userId: newUser._id });
  } catch (error) {
    console.error('Signup error:', error?.message || error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    if (!isValidEmail(email) || !password) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = await Shopkeeper.findOne({ email }).select('_id passwordHash menu').lean();
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    return res.json({ success: true, userId: user._id, menu: user.menu });
  } catch (error) {
    console.error('Login error:', error?.message || error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Google Identity Services sends a signed ID token. The token is verified on
// the server before a workspace is created or opened; the browser never gets
// to choose an email address on its own.
app.post('/api/auth/google', async (req, res) => {
  try {
    if (!googleClient) {
      return res.status(503).json({ success: false, message: 'Google sign-in is not configured yet.' });
    }

    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential is required.' });
    }

    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID });
    const profile = ticket.getPayload();
    if (!profile?.email || !profile.email_verified) {
      return res.status(401).json({ success: false, message: 'Please use a verified Google email address.' });
    }

    let user = await Shopkeeper.findOne({ email: profile.email.toLowerCase() });
    if (!user) {
      user = await Shopkeeper.create({
        email: profile.email.toLowerCase(),
        ownerName: profile.name || '',
        passwordHash: await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 12)
      });
    }

    return res.json({ success: true, userId: user._id, email: user.email, menu: user.menu || {} });
  } catch (error) {
    console.error('Google sign-in error:', error?.message || error);
    return res.status(401).json({ success: false, message: 'Google sign-in could not be verified.' });
  }
});

app.post('/api/forgot-password', async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const genericMessage = 'If an account exists for that email, a verification code has been sent.';

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Enter a valid email address.' });
    }

    if (!sendEmail.isConfigured()) {
      console.error('Password reset email is not configured. Set EMAIL_USER and EMAIL_PASS.');
      return res.status(503).json({ success: false, message: 'Password reset email is temporarily unavailable. Please try again later.' });
    }

    // Keep the response identical for existing and unknown addresses to avoid
    // exposing which restaurant accounts are registered.
    const user = await Shopkeeper.findOne({ email }).select('_id email').lean();
    if (!user) return res.json({ success: true, message: genericMessage });

    const otp = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = new Date(Date.now() + RESET_OTP_TTL_MS);
    await Shopkeeper.updateOne(
      { _id: user._id },
      {
        passwordResetOtpHash: hashSecret(otp),
        passwordResetOtpExpiresAt: expiresAt,
        passwordResetOtpAttempts: 0,
        passwordResetGrantHash: '',
        passwordResetGrantExpiresAt: null
      }
    );

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 560px; color: #0f172a;">
        <h2 style="margin-bottom: 8px;">Reset your Qzaar password</h2>
        <p>Use this one-time verification code to continue. It expires in 10 minutes.</p>
        <div style="margin: 24px 0; padding: 18px; border-radius: 10px; background: #eff6ff; color: #1d4ed8; font-size: 28px; font-weight: 700; letter-spacing: 8px; text-align: center;">${otp}</div>
        <p style="font-size: 14px; color: #475569;">For your security, do not share this code. Qzaar will never ask for it by phone or chat.</p>
        <p style="font-size: 12px; color: #64748b;">If you did not request a password reset, you can safely ignore this email.</p>
      </div>
    `;

    const emailResult = await sendEmail(user.email, 'Your Qzaar password reset code', html);
    if (!emailResult.success) {
      console.error('Password reset email failed:', emailResult.error);

      await Shopkeeper.updateOne(
        { _id: user._id, passwordResetOtpHash: hashSecret(otp) },
        {
          passwordResetOtpHash: '',
          passwordResetOtpExpiresAt: null,
          passwordResetOtpAttempts: 0
        }
      );
      return res.status(503).json({ success: false, message: 'We could not deliver the verification code. Please try again later.' });
    }

    return res.json({ success: true, message: genericMessage });
  } catch (error) {
    console.error('Forgot password error:', error?.message || error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/forgot-password/verify-otp', async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = String(req.body.otp || '').replace(/\s/g, '');
    if (!isValidEmail(email) || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({ success: false, message: 'Enter the 6-digit verification code.' });
    }

    const user = await Shopkeeper.findOne({ email }).select('_id passwordResetOtpHash passwordResetOtpExpiresAt passwordResetOtpAttempts');
    const isExpired = !user?.passwordResetOtpExpiresAt || user.passwordResetOtpExpiresAt.getTime() <= Date.now();
    const isLocked = (user?.passwordResetOtpAttempts || 0) >= MAX_RESET_OTP_ATTEMPTS;
    if (!user || isExpired || isLocked || !user.passwordResetOtpHash || hashSecret(otp) !== user.passwordResetOtpHash) {
      if (user && !isExpired && !isLocked) {
        await Shopkeeper.updateOne({ _id: user._id }, { $inc: { passwordResetOtpAttempts: 1 } });
      }
      return res.status(400).json({ success: false, message: 'That code is invalid or has expired. Request a new code and try again.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    await Shopkeeper.updateOne(
      { _id: user._id },
      {
        passwordResetOtpHash: '',
        passwordResetOtpExpiresAt: null,
        passwordResetOtpAttempts: 0,
        passwordResetGrantHash: hashSecret(resetToken),
        passwordResetGrantExpiresAt: new Date(Date.now() + RESET_GRANT_TTL_MS)
      }
    );
    return res.json({ success: true, resetToken, message: 'Code confirmed. Create a new password.' });
  } catch (error) {
    console.error('Password reset OTP verification error:', error?.message || error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/reset-password', async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const resetToken = String(req.body.resetToken || '');
    const { password } = req.body;

    const invalidPasswordMessage = passwordProblem(password);
    if (!isValidEmail(email) || !resetToken || invalidPasswordMessage) {
      return res.status(400).json({ success: false, message: invalidPasswordMessage || 'Your reset session is invalid. Start again.' });
    }

    const user = await Shopkeeper.findOne({
      email,
      passwordResetGrantHash: hashSecret(resetToken),
      passwordResetGrantExpiresAt: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Your reset session has expired. Start again.' });
    }

    user.passwordHash = await bcrypt.hash(password, 12);
    user.passwordResetGrantHash = '';
    user.passwordResetGrantExpiresAt = null;
    user.passwordChangedAt = new Date();
    await user.save();

    return res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error?.message || error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});


// ✅ Menu Routes
app.post('/api/menu/:userId',  async (req, res) => {
  try {
    const user = await Shopkeeper.findById(req.params.userId);
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    user.menu = req.body.menu || {};
    user.shopName = req.body.shopName || '';
    user.ownerName = req.body.ownerName || '';
    user.tagline = req.body.tagline || '';
    user.heroHeadline = req.body.heroHeadline || '';
    user.qualityPromise = req.body.qualityPromise || '';
    user.cuisineType = req.body.cuisineType || '';
    user.contactPhone = req.body.contactPhone || '';
    user.openHours = req.body.openHours || '';
    user.address = req.body.address || '';
    user.logo = req.body.logo || '';
    user.brandColor = req.body.brandColor || '#ff7a18';

    await user.save();
    menuCache[req.params.userId] = null;

    return res.json({ success: true, menu: user.menu, _id: user._id });
  } catch (error) {
    console.error('Menu save error:', error?.message || error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/menu/:id', async (req, res) => {
  try {
    if (menuCache[req.params.id]) {
      return res.json({ success: true, ...menuCache[req.params.id] });
    }

    const user = await Shopkeeper.findById(req.params.id)
      .select('menu logo shopName ownerName tagline heroHeadline qualityPromise cuisineType contactPhone openHours address brandColor')
      .lean();

    if (!user) {
      return res.json({ success: false, message: 'Shopkeeper not found' });
    }

    menuCache[req.params.id] = user;
    return res.json({ success: true, ...user });
  } catch (error) {
    console.error('Get menu error:', error?.message || error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ Coupon Routes
app.post('/api/coupons/:shopId', async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderValue, validFrom, validTill, maxDiscount, description } = req.body;
    const { shopId } = req.params;

    if (!code?.trim() || !['percentage', 'fixed'].includes(discountType) || Number(discountValue) <= 0 || !validFrom || !validTill) {
      return res.status(400).json({ success: false, message: 'Enter a code, valid discount, and offer dates.' });
    }
    if (new Date(validTill) < new Date(validFrom)) {
      return res.status(400).json({ success: false, message: 'The offer end date must be after its start date.' });
    }

    const coupon = await Coupon.create({
      restaurantId: shopId,
      code: code.toUpperCase(),
      discountType ,
      discountValue,
      minOrderValue: minOrderValue || 0,
      maxDiscount,
      validFrom: new Date(validFrom),
      validTill: new Date(validTill),
      description: description || ''
    });

    return res.json({ success: true, coupon });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ success: false, message: 'This coupon code already exists for this restaurant.' });
    }
    console.error('Create coupon error:', error?.message || error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/coupons/:shopId', async (req, res) => {
  try {
    const coupons = await Coupon.find({ restaurantId: req.params.shopId }).lean();
    return res.json({ success: true, coupons });
  } catch (error) {
    console.error('Get coupons error:', error?.message || error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/validate-coupon', async (req, res) => {
  try {
    const { shopId, code, cartTotal } = req.body;

    const coupon = await Coupon.findOne({
      restaurantId: shopId,
      code: code.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validTill: { $gte: new Date() }
    }).lean();

    if (!coupon) {
      return res.json({ success: false, message: 'Invalid or expired coupon' });
    }

    if (cartTotal < coupon.minOrderValue) {
      return res.json({ success: false, message: `Minimum order value is ₹${coupon.minOrderValue}` });
    }

    if (coupon.totalUsageLimit && coupon.totalUsed >= coupon.totalUsageLimit) {
      return res.json({ success: false, message: 'Coupon usage limit reached' });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.discountValue;
    }

    return res.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: Math.round(discount),
        maxDiscount: coupon.maxDiscount,
        description: coupon.description
      }
    });
  } catch (error) {
    console.error('Validate coupon error:', error?.message || error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ Razorpay Payment Routes
app.post('/api/create-razorpay-order', async (req, res) => {
  try {
    if (!hasRazorpayCredentials) {
      return res.status(503).json({ success: false, message: 'Online payments are not configured for this workspace yet.' });
    }
    const { shopId, customerName, tableNumber, items, total, customerNote, couponCode, discountAmount, subTotal } = req.body;

    if (!shopId || !customerName || !tableNumber || !Array.isArray(items) || !items.length || !Number.isFinite(Number(total)) || Number(total) <= 0) {
      return res.status(400).json({ success: false, message: 'Missing required data' });
    }

    const activeTableOrder = await Order.findOne({
      shopId,
      tableNumber,
      status: { $in: ['pending', 'confirmed', 'preparing', 'ready'] }
    }).select('_id').lean();
    if (activeTableOrder) {
      return res.status(409).json({ success: false, message: 'This table already has an active order. Please ask the staff before placing another order.' });
    }

    const prepMinutes = Math.max(...items.map(item => Number(item.prepTime) || 15), 15);
    const estimatedReadyAt = new Date(Date.now() + prepMinutes * 60 * 1000);

    // Create Razorpay order
    
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100), // Amount in paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        shopId,
        customerName,
        tableNumber
      }
    });

    // Create Order in Database
    const order = await Order.create({
      shopId,
      customerName,
      tableNumber,
      customerNote: customerNote || '',
      paymentMethod: 'razorpay',
      paymentStatus: 'pending',
      razorpayOrderId: razorpayOrder.id,
      estimatedPrepMinutes: prepMinutes,
      estimatedReadyAt,
      items,
      subTotal: subTotal || total,
      discountAmount: discountAmount || 0,
      couponCode: couponCode || '',
      total: Math.round(total),
      status: 'pending'
    });

    io.to(`shop_${shopId}`).emit('new_order', {
      orderId: order._id,
      customerName,
      tableNumber,
      total,
      status: 'pending'
    });

    return res.json({
      success: true,
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      keyId: process.env.RAZORPAY_KEY_ID,
      amount: total * 100,
      currency: 'INR'
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ success: false, message: 'This table already has an active order. Please ask the staff before placing another order.' });
    }
    console.error('Create Razorpay order error:', error?.message || error);
    return res.status(500).json({ success: false, message: 'Failed to create payment order' });
  }
});

app.post('/api/verify-payment', async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    // Verify signature
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpayOrderId + '|' + razorpayPaymentId);
    const generated_signature = hmac.digest('hex');

    if (generated_signature !== razorpaySignature) {
      return res.json({ success: false, message: 'Payment verification failed' });
    }

    // Update Order
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: 'paid',
        razorpayPaymentId,
        paymentReference: `TXN-${razorpayPaymentId}`
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Update coupon usage
    if (order.couponCode) {
      await Coupon.updateOne(
        { restaurantId: order.shopId, code: order.couponCode },
        { $inc: { totalUsed: 1 } }
      );
    }

    // Emit real-time update
    io.to(`shop_${order.shopId}`).emit('payment_received', {
      orderId,
      paymentStatus: 'paid'
    });

    io.to(`order_${orderId}`).emit('payment_confirmed', {
      paymentStatus: 'paid',
      paymentReference: order.paymentReference
    });

    return res.json({
      success: true,
      message: 'Payment verified successfully',
      order
    });
  } catch (error) {
    console.error('Verify payment error:', error?.message || error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ Order Routes
app.post('/api/order', async (req, res) => {
  try {
    const {
      shopId,
      customerName,
      customerEmail,
      customerPhone,
      tableNumber,
      items,
      total,
      customerNote,
      paymentMethod,
      estimatedPrepMinutes
    } = req.body;

    if (!shopId || !customerName || !tableNumber || !Array.isArray(items) || !items.length) {
      return res.status(400).json({ success: false, message: 'Missing required order data' });
    }

    const activeTableOrder = await Order.findOne({
      shopId,
      tableNumber,
      status: { $in: ['pending', 'confirmed', 'preparing', 'ready'] }
    }).select('_id status').lean();
    if (activeTableOrder) {
      return res.status(409).json({ success: false, message: 'This table already has an active order. Please ask the staff before placing another order.' });
    }

    const prepMinutes = Number(estimatedPrepMinutes) || Math.max(...items.map(item => Number(item.prepTime) || 15));
    const estimatedReadyAt = new Date(Date.now() + prepMinutes * 60 * 1000);

    const newOrder = await Order.create({
      shopId,
      customerName,
      customerEmail: customerEmail || '',
      customerPhone: customerPhone || '',
      tableNumber,
      customerNote: customerNote || '',
      paymentMethod: paymentMethod || 'cash',
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
      estimatedPrepMinutes: prepMinutes,
      estimatedReadyAt,
      items,
      total: Number(total) || 0,
      status: 'pending'
    });

    // Real-time notification to shopkeeper
    io.to(`shop_${shopId}`).emit('new_order', {
      orderId: newOrder._id,
      customerName,
      tableNumber,
      total,
      paymentMethod,
      status: 'pending',
      items
    });

    return res.json({
      success: true,
      orderId: newOrder._id,
      estimatedReadyAt,
      estimatedPrepMinutes: prepMinutes
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ success: false, message: 'This table already has an active order. Please ask the staff before placing another order.' });
    }
    console.error('Order error:', error?.message || error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/order/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .select('shopId customerName customerEmail customerPhone tableNumber customerNote items subTotal discountAmount couponCode taxes total status paymentMethod paymentStatus paymentReference estimatedPrepMinutes estimatedReadyAt createdAt updatedAt cancelReason refundAmount')
      .lean();

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({ success: true, order });
  } catch (error) {
    console.error('Get order error:', error?.message || error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/orders/:shopId', async (req, res) => {
  try {
    const orders = await Order.find({ shopId: req.params.shopId })
      .select('customerName customerEmail tableNumber customerNote items total status paymentMethod paymentStatus estimatedPrepMinutes estimatedReadyAt createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ success: true, orders });
  } catch (error) {
    console.error('Get orders error:', error?.message || error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ Get Order History for Customer
app.get('/api/order-history/:customerEmail', async (req, res) => {
  try {
    const orders = await Order.find({ customerEmail: req.params.customerEmail })
      .select('shopId customerName tableNumber items total status paymentMethod paymentStatus createdAt estimatedReadyAt')
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return res.json({ success: true, orders });
  } catch (error) {
    console.error('Get order history error:', error?.message || error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/dashboard/:shopId', async (req, res) => {
  try {
    const [shop, orders] = await Promise.all([
      Shopkeeper.findById(req.params.shopId)
        .select('shopName menu')
        .lean(),
      Order.find({ shopId: req.params.shopId })
        .select('items total status createdAt refundAmount')
        .lean()
    ]);

    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    return res.json({
      success: true,
      dashboard: buildDashboardMetrics(shop, orders)
    });
  } catch (error) {
    console.error('Dashboard error:', error?.message || error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/order-status/:orderId', async (req, res) => {
  try {
    const { status } = req.body;
    const nextValues = { status };
    if (status === 'completed') {
      nextValues.estimatedReadyAt = new Date();
    }

    const updated = await Order.findByIdAndUpdate(req.params.orderId, nextValues, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Real-time update to all connected clients
    io.to(`shop_${updated.shopId}`).emit('order_status_changed', {
      orderId: req.params.orderId,
      status,
      updatedAt: new Date()
    });

    io.to(`order_${req.params.orderId}`).emit('order_status_changed', {
      status,
      estimatedReadyAt: updated.estimatedReadyAt,
      updatedAt: new Date()
    });

    return res.json({ success: true, order: updated });
  } catch (error) {
    console.error('Update order error:', error?.message || error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ Cancel Order & Refund
app.post('/api/cancel-order/:orderId', async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.status === 'completed') {
      return res.json({ success: false, message: 'Cannot cancel completed orders' });
    }

    const refundAmount = order.paymentStatus === 'paid' ? order.total : 0;

    // Process refund if payment was completed
    if (refundAmount > 0 && order.razorpayPaymentId) {
      try {
        await razorpay.payments.refund(order.razorpayPaymentId, {
          amount: Math.round(refundAmount * 100)
        });
        order.refundStatus = 'completed';
      } catch (refundError) {
        console.error('Refund error:', refundError);
        order.refundStatus = 'failed';
      }
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelReason = reason || 'Customer cancelled';
    order.refundAmount = refundAmount;
    await order.save();

    io.to(`shop_${order.shopId}`).emit('order_cancelled', {
      orderId: req.params.orderId,
      refundAmount
    });

    io.to(`order_${req.params.orderId}`).emit('order_cancelled', {
      status: 'cancelled',
      refundAmount
    });

    return res.json({
      success: true,
      message: 'Order cancelled successfully',
      refundAmount,
      refundStatus: order.refundStatus
    });
  } catch (error) {
    console.error('Cancel order error:', error?.message || error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('✅ StreetQR API is live with Razorpay & WebSocket support');
});

// ✅ INTEGRATE ALL ROUTE MODULES (150+ endpoints)
console.log('🔌 Mounting API routes...');
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/payments', paymentsRoutes);

console.log('✅ All API routes mounted successfully');

// Start server
const SERVER = httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📦 Razorpay Integration: ${process.env.RAZORPAY_KEY_ID ? '✅' : '❌'}`);
  console.log(`🔌 WebSocket Server: ✅ Ready at port ${PORT}`);
});

module.exports = SERVER;
