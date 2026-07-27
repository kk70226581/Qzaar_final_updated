const mongoose = require('mongoose');

// ========================================
// DATABASE MODELS FOR PHASE 6
// ========================================

// ✅ User (Customer Profile)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: '' },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  passwordHash: { type: String, required: true },
  addresses: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      label: { type: String, default: 'Home' }, // 'Home', 'Work', 'Other'
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
      isDefault: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  walletBalance: { type: Number, default: 0 },
  loyaltyPoints: { type: Number, default: 0 },
  preferences: {
    notifications: { type: Boolean, default: true },
    orderReminders: { type: Boolean, default: true },
    promotions: { type: Boolean, default: true },
    dietary: { type: Array, default: [] } // vegetarian, vegan, gluten-free, etc.
  },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
userSchema.index({ email: 1 });
const User = mongoose.model('User', userSchema);

// ✅ MenuItem (Detailed Menu Items)
const menuItemSchema = new mongoose.Schema({
  restaurantId: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, default: '' },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  discountedPrice: { type: Number, default: null },
  discount: { type: Number, default: 0 }, // Discount percentage
  image: { type: String, default: '' },
  images: [{ type: String }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  reviews: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      userId: { type: String, required: true },
      userName: { type: String, default: 'Anonymous' },
      rating: { type: Number, required: true },
      comment: { type: String, default: '' },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  prepTime: { type: Number, default: 15 },
  vegetarian: { type: Boolean, default: false },
  vegan: { type: Boolean, default: false },
  glutenFree: { type: Boolean, default: false },
  spicy: { type: Number, enum: [0, 1, 2, 3], default: 0 }, // 0: none, 1: mild, 2: medium, 3: hot
  bestseller: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  available: { type: Boolean, default: true },
  stock: { type: Number, default: -1 }, // -1 = unlimited
  customizations: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      name: { type: String },
      options: [
        {
          label: { type: String },
          price: { type: Number, default: 0 }
        }
      ]
    }
  ],
  addOns: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      name: { type: String },
      price: { type: Number },
      available: { type: Boolean, default: true }
    }
  ],
  nutrition: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 }
  },
  allergens: [{ type: String }],
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
menuItemSchema.index({ restaurantId: 1, category: 1 });
menuItemSchema.index({ restaurantId: 1, name: 'text', description: 'text' });
const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// ✅ Category (Menu Categories)
const categorySchema = new mongoose.Schema({
  restaurantId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '' },
  image: { type: String, default: '' },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
categorySchema.index({ restaurantId: 1 });
const Category = mongoose.model('Category', categorySchema);

// ✅ Inventory (Stock Management)
const inventorySchema = new mongoose.Schema({
  restaurantId: { type: String, required: true },
  itemId: { type: String, required: true },
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  unit: { type: String, default: 'pieces' }, // pieces, kg, liters, etc.
  reorderLevel: { type: Number, default: 10 },
  reorderQuantity: { type: Number, default: 50 },
  costPerUnit: { type: Number, default: 0 },
  supplier: { type: String, default: '' },
  lastRestocked: { type: Date },
  expiryDate: { type: Date },
  location: { type: String, default: '' },
  batchNumber: { type: String, default: '' },
  notes: { type: String, default: '' },
  history: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      action: { type: String }, // 'added', 'used', 'discarded'
      quantity: { type: Number },
      reason: { type: String, default: '' },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
inventorySchema.index({ restaurantId: 1, itemId: 1 });
inventorySchema.index({ restaurantId: 1, expiryDate: 1 });
const Inventory = mongoose.model('Inventory', inventorySchema);

// ✅ PaymentTransaction (Payment Records)
const paymentTransactionSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  userId: { type: String },
  restaurantId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  method: { type: String, enum: ['cash', 'card', 'upi', 'wallet', 'subscription'], default: 'cash' },
  paymentGateway: { type: String, default: 'razorpay' },
  transactionId: { type: String },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  cardLast4: { type: String, default: '' },
  upiId: { type: String, default: '' },
  taxAmount: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  processingFee: { type: Number, default: 0 },
  refundAmount: { type: Number, default: 0 },
  refundStatus: { type: String, enum: ['', 'pending', 'completed', 'failed'], default: '' },
  refundId: { type: String, default: '' },
  failureReason: { type: String, default: '' },
  notes: { type: String, default: '' },
  metadata: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
paymentTransactionSchema.index({ orderId: 1 });
paymentTransactionSchema.index({ userId: 1 });
paymentTransactionSchema.index({ restaurantId: 1, createdAt: -1 });
const PaymentTransaction = mongoose.model('PaymentTransaction', paymentTransactionSchema);

// ✅ UserAddress (Delivery Addresses)
const userAddressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  label: { type: String, default: 'Home' },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, default: 'India' },
  latitude: { type: Number },
  longitude: { type: Number },
  instructions: { type: String, default: '' },
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
userAddressSchema.index({ userId: 1 });
const UserAddress = mongoose.model('UserAddress', userAddressSchema);

// ✅ Review (Product Reviews)
const reviewSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  restaurantId: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, default: 'Anonymous' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, default: '' },
  comment: { type: String, default: '' },
  images: [{ type: String }],
  helpful: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
reviewSchema.index({ itemId: 1 });
reviewSchema.index({ restaurantId: 1 });
const Review = mongoose.model('Review', reviewSchema);

// ✅ Analytics (Analytics Records)
const analyticsSchema = new mongoose.Schema({
  restaurantId: { type: String, required: true },
  date: { type: Date, required: true },
  revenue: { type: Number, default: 0 },
  orders: { type: Number, default: 0 },
  customers: { type: Number, default: 0 },
  avgOrderValue: { type: Number, default: 0 },
  topDishes: [
    {
      itemId: { type: String },
      name: { type: String },
      quantity: { type: Number },
      revenue: { type: Number }
    }
  ],
  peakHours: [
    {
      hour: { type: Number },
      orders: { type: Number },
      revenue: { type: Number }
    }
  ],
  paymentMethods: {
    cash: { type: Number, default: 0 },
    card: { type: Number, default: 0 },
    upi: { type: Number, default: 0 },
    wallet: { type: Number, default: 0 }
  },
  customerAcquisition: { type: Number, default: 0 },
  repeatedCustomers: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
analyticsSchema.index({ restaurantId: 1, date: -1 });
const Analytics = mongoose.model('Analytics', analyticsSchema);

// ✅ Coupon (Coupons & Discounts)
const couponSchema = new mongoose.Schema({
  restaurantId: { type: String, required: true },
  code: { type: String, required: true, trim: true, uppercase: true },
  description: { type: String, default: '' },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  discountValue: { type: Number, required: true },
  maxDiscount: { type: Number, default: null },
  minOrderValue: { type: Number, default: 0 },
  maxUsagePerUser: { type: Number, default: 1 },
  totalUsageLimit: { type: Number, default: null },
  totalUsed: { type: Number, default: 0 },
  validFrom: { type: Date, required: true },
  validTill: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
couponSchema.index({ restaurantId: 1, code: 1 }, { unique: true, name: 'one_coupon_code_per_restaurant' });
const Coupon = mongoose.model('Coupon', couponSchema);

// ✅ Shopkeeper (Restaurant Admin)
const shopkeeperSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  menu: { type: Object, default: {} },
  logo: { type: String, default: '' },
  shopName: { type: String, default: '' },
  ownerName: { type: String, default: '' },
  tagline: { type: String, default: '' },
  heroHeadline: { type: String, default: '' },
  qualityPromise: { type: String, default: '' },
  cuisineType: { type: String, default: '' },
  contactPhone: { type: String, default: '' },
  openHours: { type: String, default: '' },
  address: { type: String, default: '' },
  brandColor: { type: String, default: '#ff7a18' },
  razorpayContactId: { type: String, default: '' },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  // Password-reset state is deliberately stored as hashes. A leaked database
  // must not be enough to redeem a live reset code or grant.
  passwordResetOtpHash: { type: String, default: '' },
  passwordResetOtpExpiresAt: { type: Date, default: null },
  passwordResetOtpAttempts: { type: Number, default: 0 },
  passwordResetGrantHash: { type: String, default: '' },
  passwordResetGrantExpiresAt: { type: Date, default: null },
  passwordChangedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
shopkeeperSchema.index({ email: 1 });
const Shopkeeper = mongoose.model('Shopkeeper', shopkeeperSchema);

// ✅ Order (Orders & Order Management)
const orderSchema = new mongoose.Schema({
  shopId: { type: String, required: true },
  restaurantId: { type: String }, // Alternative name for shopId
  customerName: { type: String, required: true },
  customerEmail: { type: String, default: '' },
  customerPhone: { type: String, default: '' },
  userId: { type: String },
  tableNumber: { type: String, required: true },
  customerNote: { type: String, default: '' },
  paymentMethod: { type: String, default: 'cash' },
  paymentStatus: { type: String, default: 'pending' },
  paymentReference: { type: String, default: '' },
  razorpayOrderId: { type: String, default: '' },
  razorpayPaymentId: { type: String, default: '' },
  estimatedPrepMinutes: { type: Number, default: 15 },
  estimatedReadyAt: { type: Date },
  items: { type: Array, default: [] },
  subTotal: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  couponCode: { type: String, default: '' },
  taxes: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  status: { type: String, default: 'pending' },
  cancelledAt: { type: Date, default: null },
  cancelReason: { type: String, default: '' },
  refundAmount: { type: Number, default: 0 },
  refundStatus: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
orderSchema.index({ shopId: 1, createdAt: -1 });
orderSchema.index({ razorpayOrderId: 1 });
orderSchema.index({ customerEmail: 1 });
// A table can only have one active dine-in order at a time. Once completed or
// cancelled, the partial index no longer applies and the table is free again.
orderSchema.index(
  { shopId: 1, tableNumber: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ['pending', 'confirmed', 'preparing', 'ready'] } },
    name: 'one_active_order_per_table'
  }
);
const Order = mongoose.model('Order', orderSchema);

module.exports = {
  User,
  MenuItem,
  Category,
  Inventory,
  PaymentTransaction,
  UserAddress,
  Review,
  Analytics,
  Coupon,
  Shopkeeper,
  Order
};
