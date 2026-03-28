import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './components/HomePage';
import LoginSignup from './components/LoginSignup';
import MenuBuilder from './components/MenuBuilder';
import AboutPage from './components/AboutPage';
import QRCodePage from './components/QRCodePage';
import MenuView from './components/MenuView';
import OrderSummary from './components/OrderSummary';
import OrdersPage from './components/OrdersPage';
import ResetPassword from './components/ResetPassword';
import ScrollToTop from './components/ScrollToTop'; // <-- New import

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop /> {/* <-- New component added here */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/menu" element={<MenuBuilder />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/qrcode" element={<QRCodePage />} />
        <Route path="/menu/:id" element={<MenuView />} />
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/track-order/:orderId" element={<OrderSummary />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
