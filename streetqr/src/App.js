import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import HomePage from './components/HomePage';
import LoginSignup from './components/LoginSignup';
import MenuBuilder from './components/MenuBuilder';
import DashboardHub from './components/DashboardHub';
import AboutPage from './components/AboutPage';
import QRCodePage from './components/QRCodePage';
import ModernMenuView from './components/ModernMenuView';
import OrderSummary from './components/OrderSummary';
import OrdersPage from './components/OrdersPage';
import ResetPassword from './components/ResetPassword';
import ScrollToTop from './components/ScrollToTop';
import NotFoundPage from './components/NotFoundPage';

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
      <Routes>
        {/* Legacy Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/dashboard" element={<DashboardHub />} />
        <Route path="/menu" element={<MenuBuilder />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/qrcode" element={<QRCodePage />} />
        <Route path="/menu/:id" element={<ModernMenuView />} />
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/track-order/:orderId" element={<OrderSummary />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Modern Redesign - Customer Pages */}
        <Route path="/modern/landing" element={<LandingPage />} />
        <Route path="/modern/menu" element={<MenuBrowsePage />} />
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
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
