import React from 'react';
import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import HomePage from './components/HomePage';
import LoginSignup from './components/LoginSignup';
import MenuBuilder from './components/MenuBuilder';
import DashboardHub from './components/DashboardHub';
import AboutPage from './components/AboutPage';
import QRCodePage from './components/QRCodePage';
import ModernMenuView from './components/ModernMenuView';
import OrderSummary from './components/OrderSummary';import OrdersPage from './components/OrdersPage';import ScrollToTop from './components/ScrollToTop';
import LegalPage from './components/LegalPage';
import HowItWorksPage from './components/HowItWorksPage';
import ProductsPage from './components/ProductsPage';
import ContactPage from './components/ContactPage';
import DemoPage from './components/DemoPage';

// Modern Redesign Pages
import {
  LandingPage,
  MenuBrowsePage,
  FoodDetailPage,
  CartPage,
  CheckoutPage,
  OrderTrackingPage,
  AdminDashboard,
  KitchenDisplaySystem,
  AnalyticsPage,
  SettingsPage,
  InventoryPage,
} from './components/pages';

function AppRoutes() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className="app-route-transition"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
        transition={{ duration: reduceMotion ? 0 : 0.24, ease: 'easeOut' }}
      >
        <Routes location={location}>
          {/* Legacy Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/landing" element={<HomePage />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/signup" element={<LoginSignup initialMode="signup" />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/vendor" element={<Navigate to="/dashboard" replace />} />
          <Route path="/signin" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<Navigate to="/signup" replace />} />
          <Route path="/book-demo" element={<Navigate to="/demo" replace />} />
          <Route path="/features" element={<Navigate to="/products" replace />} />
          <Route path="/pricing" element={<Navigate to="/products" replace />} />
          <Route path="/support" element={<Navigate to="/contact" replace />} />
          <Route path="/help" element={<Navigate to="/contact" replace />} />
          <Route path="/faq" element={<Navigate to="/how-it-works" replace />} />
          <Route path="/dashboard" element={<DashboardHub />} />
          <Route path="/menu" element={<MenuBuilder />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/terms" element={<LegalPage type="terms" />} />
          <Route path="/privacy" element={<LegalPage type="privacy" />} />
          <Route path="/qrcode" element={<QRCodePage />} />
          <Route path="/menu/:restaurantId" element={<MenuBrowsePage />} />
          <Route path="/classic-menu/:id" element={<ModernMenuView />} />
          <Route path="/order-summary" element={<OrderSummary />} />
          <Route path="/track-order/:orderId" element={<OrderSummary />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/reset-password/:token" element={<Navigate to="/login" replace />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Modern Redesign - Customer Pages */}
          <Route path="/modern/landing" element={<LandingPage />} />
          <Route path="/modern/menu" element={<MenuBrowsePage />} />
          <Route path="/modern/menu/:restaurantId" element={<MenuBrowsePage />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/modern/food/:id" element={<FoodDetailPage />} />
          <Route path="/modern/cart" element={<CartPage />} />
          <Route path="/modern/checkout" element={<CheckoutPage />} />
          <Route path="/modern/order-tracking/:orderId" element={<OrderTrackingPage />} />

          {/* Modern Redesign - Admin Pages */}
          <Route path="/modern/admin" element={<AdminDashboard />} />
          <Route path="/modern/admin/kitchen" element={<KitchenDisplaySystem />} />
          <Route path="/modern/admin/analytics" element={<AnalyticsPage />} />
          <Route path="/modern/admin/settings" element={<SettingsPage />} />
          <Route path="/modern/admin/inventory" element={<InventoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3200,
          style: {
            borderRadius: '8px',
            background: '#0f172a',
            color: '#f8fafc',
          },
        }}
      />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
