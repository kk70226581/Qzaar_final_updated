# Backend API Implementation Guide - Phase 6

**Status:** Ready for Extension
**Current State:** Express.js backend with Razorpay & WebSocket
**Next:** Add 150+ modern UI endpoints
**Estimated Duration:** 1-2 weeks

---

## 🎯 CURRENT BACKEND STATE

### Existing Features ✅
```
✅ Express.js server
✅ MongoDB connection
✅ CORS configured
✅ Authentication (login/signup/forgot-password)
✅ Menu management
✅ Order management
✅ Razorpay integration
✅ WebSocket (Socket.io)
✅ Email notifications
```

### Existing Endpoints (20+)
- `POST /api/signup` - Register
- `POST /api/login` - Login
- `POST /api/forgot-password` - Password reset
- `POST /api/reset-password/:token` - Reset password
- `POST /api/menu/:userId` - Save menu
- `GET /api/menu/:id` - Get menu
- `POST /api/coupons/:shopId` - Create coupon
- `GET /api/coupons/:shopId` - Get coupons
- `POST /api/validate-coupon` - Validate coupon
- `POST /api/create-razorpay-order` - Create payment
- `POST /api/verify-payment` - Verify payment
- `POST /api/order` - Create order
- `GET /api/order/:orderId` - Get order
- `GET /api/orders/:shopId` - Get shop orders
- `GET /api/order-history/:customerEmail` - Order history
- `GET /api/dashboard/:shopId` - Dashboard metrics
- `PUT /api/order-status/:orderId` - Update order status
- `POST /api/cancel-order/:orderId` - Cancel order

### Database Models ✅
```
✅ Shopkeeper (users)
✅ Order
✅ Coupon
```

---

## 📋 NEEDED ENDPOINTS (150+)

### Phase 6 Implementation Tasks

#### Task 1: Database Models (5 models)
```
1. User (customer profile)
2. MenuItem (detailed menu items)
3. Category (menu categories)
4. Inventory (stock management)
5. PaymentTransaction (payment records)
6. UserAddress (delivery addresses)
7. Review (product reviews)
8. Analytics (analytics records)
```

#### Task 2: Authentication Endpoints (15)
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
PUT    /api/auth/profile
POST   /api/auth/change-password
POST   /api/auth/forgot-password
POST   /api/auth/reset-password/:token
POST   /api/auth/refresh-token
GET    /api/auth/verify
POST   /api/auth/2fa/setup
POST   /api/auth/2fa/confirm
POST   /api/auth/2fa/verify
GET    /api/auth/permissions
POST   /api/auth/check-permission
```

#### Task 3: Analytics Endpoints (10)
```
GET   /api/analytics/metrics?period=week
GET   /api/analytics/revenue-chart?days=7
GET   /api/analytics/popular-dishes?limit=5
GET   /api/analytics/peak-hours?limit=4
GET   /api/analytics/customer-insights
GET   /api/analytics/order-trends?period=week
POST  /api/analytics/export
GET   /api/analytics/revenue-by-category
GET   /api/analytics/retention
GET   /api/analytics/date-range?start=&end=
```

#### Task 4: Settings Endpoints (15)
```
GET   /api/restaurant/settings
POST  /api/restaurant/settings
GET   /api/restaurant/settings/profile
PUT   /api/restaurant/settings/profile
GET   /api/restaurant/settings/hours
PUT   /api/restaurant/settings/hours
GET   /api/restaurant/settings/payment
PUT   /api/restaurant/settings/payment
GET   /api/restaurant/settings/notifications
PUT   /api/restaurant/settings/notifications
GET   /api/restaurant/settings/delivery
PUT   /api/restaurant/settings/delivery
GET   /api/restaurant/settings/:section
PUT   /api/restaurant/settings/:section
```

#### Task 5: Inventory Endpoints (15)
```
GET    /api/inventory?category=&search=&sortBy=
POST   /api/inventory
GET    /api/inventory/:id
PUT    /api/inventory/:id
DELETE /api/inventory/:id
POST   /api/inventory/:id/add-stock
POST   /api/inventory/:id/remove-stock
GET    /api/inventory/low-stock
GET    /api/inventory/search?q=
POST   /api/inventory/bulk-update
POST   /api/inventory/export
GET    /api/inventory/stats
GET    /api/inventory/expiring?days=7
GET    /api/inventory/:id/history
```

#### Task 6: Menu Endpoints (20)
```
GET   /api/menu/categories
POST  /api/menu/categories
GET   /api/menu/items?category=&search=
POST  /api/menu/items
GET   /api/menu/items/:id
PUT   /api/menu/items/:id
DELETE /api/menu/items/:id
GET   /api/menu/categories/:id/items
GET   /api/menu/search?q=
GET   /api/menu/recommended
GET   /api/menu/bestsellers
GET   /api/menu/items/:id/customizations
GET   /api/menu/items/:id/add-ons
GET   /api/menu/items/:id/reviews
POST  /api/menu/items/:id/reviews
POST  /api/menu/items/:id/upload-image
POST  /api/menu/bulk-upload
POST  /api/menu/export
GET   /api/menu/statistics
PUT   /api/menu/items/:id/availability
```

#### Task 7: Orders Endpoints (20)
```
POST   /api/orders
GET    /api/orders/:id
GET    /api/orders?filters=
GET    /api/orders/user
PUT    /api/orders/:id/status
POST   /api/orders/:id/cancel
GET    /api/orders/:id/timeline
GET    /api/orders/:id/receipt
POST   /api/orders/:id/review
POST   /api/orders/:id/repeat
POST   /api/orders/:id/apply-coupon
POST   /api/orders/:id/remove-coupon
GET    /api/orders/:id/tracking
GET    /api/orders/statistics
POST   /api/orders/export
POST   /api/orders/validate
GET    /api/orders/:id/realtime (WebSocket)
```

#### Task 8: Cart Endpoints (20)
```
GET   /api/cart
POST  /api/cart/items
PUT   /api/cart/items/:id
DELETE /api/cart/items/:id
POST  /api/cart/clear
PUT   /api/cart/items/:id/quantity
GET   /api/cart/summary
POST  /api/cart/coupon
POST  /api/cart/coupon/remove
PUT   /api/cart/delivery-address
POST  /api/cart/delivery-address
GET   /api/cart/delivery-fee
POST  /api/cart/save
GET   /api/cart/saved
POST  /api/cart/saved/:id/restore
GET   /api/cart/estimate-total
POST  /api/cart/check-availability
GET   /api/cart/history
POST  /api/cart/share
POST  /api/cart/sync
```

#### Task 9: Payment Endpoints (20)
```
POST   /api/payments/process
GET    /api/payments/:id
POST   /api/payments/validate-card
POST   /api/payments/upi/initiate
GET    /api/payments/upi/verify/:id
POST   /api/payments/cards/save
GET    /api/payments/cards
DELETE /api/payments/cards/:id
POST   /api/payments/wallet/add
GET    /api/payments/wallet/balance
POST   /api/payments/wallet/use
GET    /api/payments/history
POST   /api/payments/:id/refund
GET    /api/payments/:id/refund-status
POST   /api/payments/subscription/initiate
POST   /api/payments/subscription/:id/cancel
GET    /api/payments/:id/receipt
POST   /api/payments/:id/download-receipt
GET    /api/payments/methods
GET    /api/payments/validate-gateway
POST   /api/payments/calculate-tax
POST   /api/payments/intent
```

---

## 🏗️ IMPLEMENTATION PLAN

### Week 1: Database & Models
```
Day 1-2: Create MongoDB models for all features
Day 3-4: Setup database indexes and relationships
Day 5: Create database utilities and helpers
```

### Week 2: Analytics & Settings
```
Day 1-2: Implement analytics endpoints
Day 3-4: Implement settings endpoints
Day 5: Add data aggregation pipelines
```

### Week 3: Inventory & Menu
```
Day 1-2: Implement inventory endpoints
Day 3-4: Implement menu endpoints
Day 5: Add file upload for images
```

### Week 4: Orders, Cart & Payments
```
Day 1-2: Extend order endpoints
Day 3: Implement cart endpoints
Day 4: Extend payment endpoints
Day 5: Testing & integration
```

---

## 🔧 CODE TEMPLATES

### Template 1: Standard GET Endpoint
```javascript
app.get('/api/resource/:id', async (req, res) => {
  try {
    const resource = await Model.findById(req.params.id).lean();
    
    if (!resource) {
      return res.status(404).json({ 
        success: false, 
        message: 'Resource not found' 
      });
    }

    return res.json({ 
      success: true, 
      data: resource 
    });
  } catch (error) {
    console.error('Error:', error?.message);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});
```

### Template 2: Standard POST Endpoint
```javascript
app.post('/api/resource', async (req, res) => {
  try {
    const { field1, field2 } = req.body;

    // Validation
    if (!field1 || !field2) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    const resource = await Model.create({
      field1,
      field2
    });

    return res.json({ 
      success: true, 
      data: resource 
    });
  } catch (error) {
    console.error('Error:', error?.message);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});
```

### Template 3: Standard PUT Endpoint
```javascript
app.put('/api/resource/:id', async (req, res) => {
  try {
    const { field1, field2 } = req.body;

    const updated = await Model.findByIdAndUpdate(
      req.params.id,
      { field1, field2 },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ 
        success: false, 
        message: 'Resource not found' 
      });
    }

    return res.json({ 
      success: true, 
      data: updated 
    });
  } catch (error) {
    console.error('Error:', error?.message);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});
```

### Template 4: WebSocket Real-time
```javascript
io.on('connection', (socket) => {
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
  });

  socket.on('update_event', (data) => {
    io.to(roomId).emit('data_updated', data);
  });
});

// Emit from endpoint
io.to('room_name').emit('event_name', data);
```

---

## 📊 DATABASE SCHEMA EXAMPLES

### MenuItem Model
```javascript
const menuItemSchema = new mongoose.Schema({
  restaurantId: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  prepTime: { type: Number, default: 15 },
  vegetarian: { type: Boolean, default: false },
  spicy: { type: Number, enum: [0, 1, 2, 3], default: 0 },
  bestseller: { type: Boolean, default: false },
  available: { type: Boolean, default: true },
  customizations: { type: Array, default: [] },
  addOns: { type: Array, default: [] },
  nutrition: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### Analytics Model
```javascript
const analyticsSchema = new mongoose.Schema({
  restaurantId: { type: String, required: true },
  date: { type: Date, required: true },
  revenue: { type: Number, default: 0 },
  orders: { type: Number, default: 0 },
  customers: { type: Number, default: 0 },
  avgOrderValue: { type: Number, default: 0 },
  topDishes: { type: Array, default: [] },
  peakHours: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
});
```

---

## 🛠️ MIDDLEWARE SETUP

### Authentication Middleware
```javascript
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};
```

### Error Handling Middleware
```javascript
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }

  res.status(500).json({ 
    success: false, 
    message: 'Server error' 
  });
});
```

---

## 📦 DEPENDENCIES TO ADD

```json
{
  "dependencies": {
    "jsonwebtoken": "^9.0.0",
    "multer": "^1.4.5",
    "joi": "^17.9.0",
    "moment": "^2.29.0",
    "uuid": "^9.0.0"
  }
}
```

---

## ✅ TESTING CHECKLIST

- [ ] All endpoints respond with correct status codes
- [ ] All endpoints validate input data
- [ ] All endpoints handle errors gracefully
- [ ] All endpoints return consistent JSON format
- [ ] All authentication checks work
- [ ] All database operations work
- [ ] All WebSocket events emit correctly
- [ ] All file uploads work
- [ ] All calculations (taxes, discounts) are correct

---

## 🚀 DEPLOYMENT CHECKLIST

- [ ] Environment variables set
- [ ] Database indexes created
- [ ] CORS properly configured
- [ ] Error logging enabled
- [ ] Rate limiting added
- [ ] Security headers set
- [ ] API documentation complete
- [ ] Postman collection created
- [ ] Load testing passed

---

## 📝 DOCUMENTATION

### Postman Collection
- Export from running server or create manually
- Include all 150+ endpoints
- Include example requests/responses
- Document authentication flow

### API Documentation
- Use Swagger/OpenAPI
- Document each endpoint
- Include request/response schemas
- Include error codes

---

## 🎯 NEXT STEPS

1. **Review** - Understand current backend structure
2. **Plan** - Organize 150+ endpoints by feature
3. **Create** - Build database models
4. **Implement** - Add endpoints week by week
5. **Test** - Test all endpoints thoroughly
6. **Document** - Create API documentation
7. **Deploy** - Deploy to staging & production

---

## 📞 SUPPORT

### Frontend Team
- Import services
- Use API endpoints
- Test integration

### Backend Team
- Follow templates
- Maintain consistency
- Document changes

### QA Team
- Test all endpoints
- Verify error handling
- Validate data formats

---

**Ready to extend backend with Phase 6 endpoints!**

Estimated Effort: 40-50 hours
Team Size Recommended: 2-3 backend developers
Complexity: Medium
Risk Level: Low (existing infrastructure solid)
