# Frontend to Backend API Connection Guide

**Status:** Ready to Connect
**Date:** July 7, 2026
**Frontend:** Modern UI (11 pages, 14 components)
**Backend:** 135+ API endpoints ready

---

## 🎯 CONNECTION STRATEGY

### Phase 1: Update API Base URL
Update `streetqr/src/services/api.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
```

Add to `.env`:
```
REACT_APP_API_URL=http://localhost:5001/api
```

### Phase 2: Update Each Service File

Update imports in all service files to use correct endpoints:

**analyticsService.js**
- Replace mock data with API calls
- Use: GET `/analytics/metrics/:shopId`
- Use: GET `/analytics/revenue-chart/:shopId`

**settingsService.js**
- Replace mock data with API calls
- Use: GET `/settings/:shopId/all`
- Use: PUT `/settings/:shopId/profile`

**inventoryService.js**
- Replace mock data with API calls
- Use: GET `/inventory/:shopId`
- Use: POST `/inventory/:shopId/items`

**menuService.js**
- Use: GET `/menu/items/:shopId`
- Use: GET `/menu/categories/:shopId`
- Use: GET `/menu/search/:shopId`

**cartService.js**
- Use: GET `/cart/:userId`
- Use: POST `/cart/:userId/items`
- Use: POST `/cart/:userId/coupon`

**orderService.js**
- Use: POST `/orders/:shopId`
- Use: GET `/orders/:shopId/:orderId`
- Use: PUT `/orders/:shopId/:orderId/status`

**paymentService.js**
- Use: POST `/payments/create-order`
- Use: POST `/payments/verify`
- Use: GET `/payments/history/:userId`

**authService.js**
- Use: POST `/auth/register`
- Use: POST `/auth/login`
- Use: GET `/auth/me`

### Phase 3: Connect Pages

1. **AnalyticsPage**
   - Replace mock metrics with API data
   - Add real revenue chart
   - Show real top dishes

2. **SettingsPage**
   - Load actual settings from backend
   - Save changes to backend
   - Show success/error notifications

3. **InventoryPage**
   - Load inventory from backend
   - Real-time stock updates
   - Add/remove items from backend

4. **MenuBrowsePage**
   - Load categories from API
   - Load menu items from API
   - Real search functionality

5. **CartPage**
   - Load cart from backend
   - Update quantities in backend
   - Real coupon validation

6. **CheckoutPage**
   - Get real delivery options
   - Process real payment
   - Create real order

7. **OrderTrackingPage**
   - Get real order status
   - Real-time updates via WebSocket
   - Show actual times

---

## ⚠️ ERROR HANDLING

Add to all API calls:
```javascript
try {
  const response = await api.get('/endpoint');
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  return response.data.data;
} catch (error) {
  console.error('API Error:', error);
  throw error;
}
```

---

## 🧪 TESTING EACH CONNECTION

```bash
# 1. Start backend
cd streetqr/backend
npm start

# 2. Start frontend
cd streetqr
npm start

# 3. Test each page:
# - Check browser console for errors
# - Verify network calls in DevTools
# - Check backend logs for requests
```

---

## 📊 CONNECTION PRIORITY

**Priority 1 (This Week)**
- [ ] Auth (login/register)
- [ ] Menu loading
- [ ] Cart functionality
- [ ] Order creation

**Priority 2 (Next Week)**
- [ ] Analytics dashboard
- [ ] Settings management
- [ ] Inventory management
- [ ] Payment processing

**Priority 3 (Polish)**
- [ ] Real-time updates
- [ ] Offline support
- [ ] Caching strategy
- [ ] Performance optimization

---

**Created:** July 7, 2026
**Status:** READY TO EXECUTE
**Next:** Begin connecting frontend pages to backend APIs

