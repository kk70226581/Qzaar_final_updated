import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import ErrorBoundary from './components/ErrorBoundary';
import Loading from './components/ui/Loading';
import ScrollToTop from './components/ScrollToTop';

// Core routes loaded eagerly for instant first contentful paint
import HomePage from './components/HomePage';
import LoginSignup from './components/LoginSignup';
import { MenuBrowsePage } from './components/pages';

// Route-level code splitting using React.lazy to optimize bundle size and mobile performance
const MenuBuilder = lazy(() => import('./components/MenuBuilder'));
const DashboardHub = lazy(() => import('./components/DashboardHub'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const QRCodePage = lazy(() => import('./components/QRCodePage'));
const ModernMenuView = lazy(() => import('./components/ModernMenuView'));
const OrderSummary = lazy(() => import('./components/OrderSummary'));
const OrdersPage = lazy(() => import('./components/OrdersPage'));
const LegalPage = lazy(() => import('./components/LegalPage'));
const HowItWorksPage = lazy(() => import('./components/HowItWorksPage'));
const ProductsPage = lazy(() => import('./components/ProductsPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));
const DemoPage = lazy(() => import('./components/DemoPage'));

// Modern Redesign Pages (Split into on-demand bundles)
const LandingPage = lazy(() => import('./components/pages').then(m => ({ default: m.LandingPage })));
const FoodDetailPage = lazy(() => import('./components/pages').then(m => ({ default: m.FoodDetailPage })));
const CartPage = lazy(() => import('./components/pages').then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('./components/pages').then(m => ({ default: m.CheckoutPage })));
const OrderTrackingPage = lazy(() => import('./components/pages').then(m => ({ default: m.OrderTrackingPage })));
const AdminDashboard = lazy(() => import('./components/pages').then(m => ({ default: m.AdminDashboard })));
const KitchenDisplaySystem = lazy(() => import('./components/pages').then(m => ({ default: m.KitchenDisplaySystem })));
const AnalyticsPage = lazy(() => import('./components/pages').then(m => ({ default: m.AnalyticsPage })));
const SettingsPage = lazy(() => import('./components/pages').then(m => ({ default: m.SettingsPage })));
const InventoryPage = lazy(() => import('./components/pages').then(m => ({ default: m.InventoryPage })));

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
        <Suspense fallback={<Loading fullscreen text="Loading view..." />}>
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
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;
