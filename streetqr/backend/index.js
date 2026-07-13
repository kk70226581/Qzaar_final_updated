require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Razorpay = require('razorpay');
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
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'https://www.qzaar.shop'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');

const allowedOrigins = [
  'http://localhost:3000',
  'https://www.qzaar.shop',
  'https://updated-ver.onrender.com',
  'https://streetqr-backend.onrender.com'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (!allowedOrigins.includes(origin)) {
      return callback(new Error(`Origin not allowed by CORS: ${origin}`), false);
    }

    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 204
}));

app.options(/.*/, cors());
app.use(helmet());
app.use(express.json({ limit: '5mb' }));

// ✅ Razorpay Initialization
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'test_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_secret'
});

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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: 'Email and password required' });
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: 'Email and password required' });
    }

    const user = await Shopkeeper.findOne({ email }).select('_id passwordHash menu').lean();
    if (!user) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.json({ success: false, message: 'Wrong password' });
    }

    return res.json({ success: true, userId: user._id, menu: user.menu });
  } catch (error) {
    console.error('Login error:', error?.message || error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: 'Email is required' });
    }

    const user = await Shopkeeper.findOne({ email }).select('_id').lean();
    if (!user) {
      return res.json({ success: false, message: 'No user found with this email' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 60 * 60 * 1000;

    await Shopkeeper.updateOne(
      { _id: user._id },
      { resetToken, resetTokenExpiry }
    );

    const resetLink = `${FRONTEND_URL}/reset-password/${resetToken}`;
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h3>Password Reset Request</h3>
        <p>You requested a password reset for your Qzaar account.</p>
        <p>
          <a
            href="${resetLink}"
            style="background-color: #0f172a; color: white; padding: 10px 16px; text-decoration: none; border-radius: 999px; display: inline-block;"
          >
            Reset Your Password
          </a>
        </p>
        <p style="font-size: 14px; color: #555;">If the button above does not work, paste this link into your browser:</p>
        <p style="word-break: break-all; font-size: 13px; color: #111827;">${resetLink}</p>
        <p>This link is valid for 1 hour.</p>
        <p style="font-size: 12px; color: #6b7280;">Qzaar Support Team</p>
      </div>
    `;

    const emailResult = await sendEmail(email, 'Qzaar Password Reset', html);
    if (!emailResult.success) {
      return res.status(500).json({ success: false, message: `Email failed: ${emailResult.error}` });
    }

    return res.json({ success: true, message: 'Reset link sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error?.message || error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and password required' });
    }

    const user = await Shopkeeper.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error?.message || error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ Menu Routes
app.post('/api/menu/:userId', async (req, res) => {
  try {
    const user = await Shopkeeper.findById(req.params.userId);
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    user.menu = req.body.menu || {};
    user.shopName = req.body.shopName || '';
    user.ownerName = req.body.ownerName || '';
    user.tagline = req.body.tagline || '';
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
      .select('menu logo shopName ownerName tagline cuisineType contactPhone openHours address brandColor')
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

    const coupon = await Coupon.create({
      shopId,
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minOrderValue: minOrderValue || 0,
      maxDiscount,
      validFrom: new Date(validFrom),
      validTill: new Date(validTill),
      description: description || ''
    });

    return res.json({ success: true, coupon });
  } catch (error) {
    console.error('Create coupon error:', error?.message || error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/coupons/:shopId', async (req, res) => {
  try {
    const coupons = await Coupon.find({ shopId: req.params.shopId }).lean();
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
      shopId,
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
    const { shopId, customerName, tableNumber, items, total, customerNote, couponCode, discountAmount, subTotal } = req.body;

    if (!shopId || !customerName || !tableNumber || !items.length || !total) {
      return res.status(400).json({ success: false, message: 'Missing required data' });
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
        { code: order.couponCode },
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
