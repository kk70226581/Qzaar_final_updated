# Modern StreetQR UI - Quick Links & Access Guide

## 🚀 Quick Start

All modern UI pages are available at routes prefixed with `/modern/`. Start a development server and navigate to any of the URLs below.

---

## 👥 CUSTOMER PAGES

### 1. Landing Page
**Route:** `/modern/landing`
**File:** `streetqr/src/components/pages/LandingPage.jsx`

Features:
- Full-width hero with gradient
- 4 feature showcase cards
- How-it-works guide (4 steps)
- Statistics section
- Call-to-action button

---

### 2. Menu Browse Page
**Route:** `/modern/menu`
**File:** `streetqr/src/components/pages/MenuBrowsePage.jsx`

Features:
- Category tabs navigation
- Real-time search
- Advanced filters (price, rating, prep time)
- Food grid with animations
- Loading skeletons
- Empty state handling

---

### 3. Food Detail Page
**Route:** `/modern/food/:id`
**File:** `streetqr/src/components/pages/FoodDetailPage.jsx`

Features:
- Image gallery carousel
- Product details & pricing
- Customization system (size, spice, add-ons)
- Real-time price calculation
- Nutrition facts
- Customer reviews
- Related items carousel
- Order summary sidebar

---

### 4. Cart Page
**Route:** `/modern/cart`
**File:** `streetqr/src/components/pages/CartPage.jsx`

Features:
- Item management
- Quantity control
- Customization tags
- Coupon/promo system
- Order summary
- Tax & delivery fee calculation

---

### 5. Checkout Page
**Route:** `/modern/checkout`
**File:** `streetqr/src/components/pages/CheckoutPage.jsx`

Features:
- Delivery address form
- 4 payment methods (card, UPI, wallet, cash)
- Order notes
- Order summary sidebar
- Confirmation screen with success animation
- Order ID display
- Estimated delivery time

---

### 6. Order Tracking Page
**Route:** `/modern/order-tracking/:orderId`
**File:** `streetqr/src/components/pages/OrderTrackingPage.jsx`

Features:
- Real-time order timeline (4 steps)
- Estimated delivery countdown
- Restaurant contact info
- Quick actions (chat/call)
- Order summary with total

---

## 🍳 ADMIN PAGES

### 1. Admin Dashboard
**Route:** `/modern/admin`
**File:** `streetqr/src/components/pages/AdminDashboard.jsx`

Features:
- 4 metric cards (revenue, orders, active, customers)
- Active orders list with status badges
- Quick stats sidebar
- Quick action buttons
- Notifications feed

---

### 2. Kitchen Display System (KDS)
**Route:** `/modern/admin/kitchen`
**File:** `streetqr/src/components/pages/KitchenDisplaySystem.jsx`

Features:
- 3-column Kanban layout (Pending/Preparing/Ready)
- Order cards with item lists
- Timers for each order
- Priority levels
- Sound alerts
- Mark ready/completed buttons
- Fullscreen mode

---

### 3. Analytics Page
**Route:** `/modern/admin/analytics`
**File:** `streetqr/src/components/pages/AnalyticsPage.jsx`

Features:
- Metrics dashboard (revenue, orders, AOV, customers)
- Revenue trend chart (7-day)
- Top dishes list
- Peak hours analysis
- Date range selector
- Export report button

---

### 4. Settings Page
**Route:** `/modern/admin/settings`
**File:** `streetqr/src/components/pages/SettingsPage.jsx`

Features:
- 5 tab sections:
  1. Profile settings (restaurant info)
  2. Operating hours (7-day schedule)
  3. Payment methods toggle
  4. Notification preferences
  5. Delivery settings (min order, charges, radius)

---

### 5. Inventory Page
**Route:** `/modern/admin/inventory`
**File:** `streetqr/src/components/pages/InventoryPage.jsx`

Features:
- Inventory dashboard (6 sample items)
- Stats cards (total items, low stock, stock value)
- Item cards with:
  - Stock level progress bars
  - +/- quantity buttons
  - Category & cost info
  - Expiry date tracking
- Search & filter
- Add item modal
- Status indicators (Critical/Low/Optimal)

---

## 📊 COMPONENT STRUCTURE

### Shared UI Components (All pages use)
- `ModernButton` - Buttons with 5 variants, 5 sizes
- `ModernCard` - Cards with 4 variants
- `ModernInput` - Text inputs with validation
- `ModernBadge` - Status badges
- `ModernModal` - Modal dialogs
- `ModernToast` - Notifications
- `ModernEmpty` - Empty states
- `ModernError` - Error states

### Layout Components
- `ResponsiveLayout` - Desktop/tablet/mobile layouts

### Animations
- Framer Motion for smooth transitions
- Spring physics animations
- Staggered children animations
- Hover effects and interactions

---

## 🎨 DESIGN SYSTEM

### Colors
- Primary: `#ff6b3b` (coral/orange)
- Secondary: `#6366f1` (indigo)
- Accent: `#ec4899` (pink)
- Semantic: Success, Warning, Danger, Info

### Typography
- Heading sizes: h1-h6 levels
- Body: Regular, medium, semibold, bold
- Scale: xs, sm, base, lg, xl, 2xl, 3xl, 4xl

### Spacing
- 8px baseline
- 12 size levels: xs (2px) to 8 (64px)

### Shadows
- 7-level elevation system
- From subtle (shadow-sm) to high (shadow-xl)

---

## 🔧 DEVELOPMENT NOTES

### Adding New Features
1. Create component in `components/pages/`
2. Create CSS in `styles/pages/`
3. Export in `components/pages/index.js`
4. Add route in `App.js`

### Using Design Tokens
```css
/* Use CSS variables for consistency */
color: var(--primary-600);
background: var(--bg-surface);
padding: var(--space-4);
border-radius: var(--radius-md);
```

### Component Template
```jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ModernCard, ModernButton } from '../ui';
import '../../styles/pages/YourPage.css';

const YourPage = () => {
  // Component logic
  return (
    <motion.main className="your-page">
      {/* Content */}
    </motion.main>
  );
};

export default YourPage;
```

---

## 📱 RESPONSIVE BREAKPOINTS

All pages are fully responsive:

- **Desktop:** >1024px (3-column layouts)
- **Tablet:** 641-1024px (2-column layouts)
- **Mobile:** <640px (1-column layouts)

---

## ♿ ACCESSIBILITY

All pages meet **WCAG AAA** standards:
- ✅ Color contrast 7:1+
- ✅ Focus visible outlines
- ✅ Keyboard navigation
- ✅ Semantic HTML
- ✅ Screen reader support
- ✅ Reduced motion support

---

## 🌙 DARK MODE

All pages support dark mode via `prefers-color-scheme` media query:

```css
@media (prefers-color-scheme: dark) {
  /* Dark mode styles */
}
```

---

## 🚀 PERFORMANCE OPTIMIZATIONS

- Lazy loading with React.lazy
- Memoized components with React.memo
- Optimized animations with hardware acceleration
- CSS containment for better rendering
- Efficient re-renders with proper dependency arrays

---

## 🔗 IMPORT EXAMPLES

```javascript
// Import all pages at once
import {
  LandingPage,
  MenuBrowsePage,
  AdminDashboard,
  AnalyticsPage,
  SettingsPage,
  InventoryPage,
} from './components/pages';

// Or import individually
import AnalyticsPage from './components/pages/AnalyticsPage';
import SettingsPage from './components/pages/SettingsPage';
import InventoryPage from './components/pages/InventoryPage';

// Use in routing
<Route path="/modern/admin/analytics" element={<AnalyticsPage />} />
```

---

## 📚 FILE LOCATIONS

### Components
```
streetqr/src/components/
├── pages/
│   ├── LandingPage.jsx
│   ├── MenuBrowsePage.jsx
│   ├── FoodDetailPage.jsx
│   ├── CartPage.jsx
│   ├── CheckoutPage.jsx
│   ├── OrderTrackingPage.jsx
│   ├── AdminDashboard.jsx
│   ├── KitchenDisplaySystem.jsx
│   ├── AnalyticsPage.jsx
│   ├── SettingsPage.jsx
│   ├── InventoryPage.jsx
│   └── index.js (exports)
├── ui/
│   ├── ModernButton.jsx
│   ├── ModernCard.jsx
│   ├── ModernInput.jsx
│   ├── ... (more components)
│   └── index.js (exports)
└── layout/
    └── ResponsiveLayout.jsx
```

### Styles
```
streetqr/src/styles/
├── design-system.css (80+ tokens)
├── pages/
│   ├── LandingPage.css
│   ├── MenuBrowsePage.css
│   ├── AnalyticsPage.css
│   ├── SettingsPage.css
│   ├── InventoryPage.css
│   └── ... (more pages)
├── components/
│   └── (component styles)
└── layout/
    └── (layout styles)
```

---

## 🐛 TROUBLESHOOTING

### Page not loading?
1. Check route in App.js
2. Verify component export in pages/index.js
3. Check browser console for errors

### Styling issues?
1. Clear browser cache
2. Check CSS file import path
3. Verify design tokens in design-system.css

### Responsive issues?
1. Check viewport meta tag in index.html
2. Test with DevTools responsive mode
3. Clear CSS cache

---

## 📞 SUPPORT

For issues or questions:
1. Check component documentation comments
2. Review existing similar pages for patterns
3. Verify design system tokens usage
4. Test in multiple browsers

---

**Created:** July 7, 2026
**Status:** Complete & Production Ready ✅
