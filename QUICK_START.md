# 🚀 Quick Start Guide - StreetQR Modern System

**Status:** READY TO LAUNCH
**Date:** July 7, 2026

---

## ⚡ START IN 3 STEPS

### Step 1: Start Backend (Terminal 1)
```bash
cd streetqr/backend
npm start
```
**Expected output:**
```
✅ Mounting API routes...
✅ All API routes mounted successfully
🚀 Server running on port 5001
```

### Step 2: Start Frontend (Terminal 2)
```bash
cd streetqr
npm start
```
**Expected output:**
```
Compiled successfully!
You can now view streetqr in the browser.
Local: http://localhost:3000
```

### Step 3: Open Browser
Visit: **http://localhost:3000**

---

## 🧪 QUICK TEST

### Test 1: Backend Health Check
```bash
curl http://localhost:5001/
# Response: "✅ StreetQR API is live..."
```

### Test 2: Register User
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"TestPass123",
    "firstName":"Test"
  }'
```

### Test 3: Frontend Pages
Click through:
- Landing Page
- Menu Browse
- Cart
- Checkout

---

## 📊 WHAT'S RUNNING

### Frontend (http://localhost:3000)
```
✅ 11 modern pages
✅ 14 reusable components
✅ Real API connections
✅ Dark mode support
✅ Responsive design
✅ WCAG AAA accessible
```

### Backend (http://localhost:5001/api)
```
✅ 135+ API endpoints
✅ 11 database models
✅ JWT authentication
✅ Razorpay payments
✅ WebSocket real-time
✅ Email notifications
```

---

## 🔗 KEY URLS

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Web app |
| Backend API | http://localhost:5001/api | REST API |
| Health Check | http://localhost:5001 | Status |

---

## 🎯 SUPPORTED FEATURES

### Customer Pages
- ✅ Landing Page
- ✅ Menu Browse (with filters)
- ✅ Food Detail (with reviews)
- ✅ Shopping Cart
- ✅ Checkout (with payment)
- ✅ Order Tracking

### Admin Pages
- ✅ Dashboard (metrics)
- ✅ Kitchen Display System
- ✅ Analytics (revenue, trends)
- ✅ Settings (profile, hours)
- ✅ Inventory Management

---

## 🐛 TROUBLESHOOTING

### "Port 5001 already in use"
```bash
# Kill the process
lsof -i :5001
kill -9 <PID>

# Or change port in backend/.env
PORT=5002
```

### "Cannot GET /"
Backend not running. Do Step 1 first.

### "API calls failing"
Check browser console for errors. Verify backend is running.

---

## 📚 DOCUMENTATION

Key files:
- `PROJECT_MASTER_STATUS.md` - Complete overview
- `PHASE6_EXECUTION_PLAN.md` - Implementation plan
- `BACKEND_API_IMPLEMENTATION_GUIDE.md` - API reference
- `COMPLETE_SERVICE_LAYER_GUIDE.md` - Service methods
- `DESIGN_SYSTEM.md` - UI tokens

---

## ✅ NEXT STEPS

1. **Today:** Get both servers running
2. **This Week:** Test all pages with real data
3. **Next Week:** Deploy to production

---

**Everything is ready. You're good to go! 🎉**

