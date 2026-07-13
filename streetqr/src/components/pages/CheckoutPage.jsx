import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Wallet,
  Smartphone,
  DollarSign,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import {
  ModernButton,
  ModernInput,
  ModernCard,
  ModernBadge,
} from '../ui';
import ResponsiveLayout from '../layout/ResponsiveLayout';
import '../../styles/pages/CheckoutPage.css';

/**
 * CheckoutPage - Complete checkout flow
 * 
 * Features:
 * - Delivery address form
 * - Contact information
 * - Payment method selection
 * - Order notes
 * - Estimated delivery time
 * - Order confirmation
 * - Mobile optimized
 */

const CheckoutPage = () => {
  const navigate = useNavigate();

  // State
  const [step, setStep] = useState('details'); // details, payment, confirm
  const [loading, setLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    notes: '',
  });

  const [selectedPayment, setSelectedPayment] = useState('card');
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Order summary (from cart)
  const orderSummary = {
    subtotal: 766,
    deliveryFee: 30,
    gst: 40,
    discount: 0,
    total: 836,
    items: 3,
    estimatedTime: '25-30 mins',
    orderId: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return false;
    if (!formData.phone.match(/^[0-9]{10}$/)) return false;
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return false;
    if (!formData.address.trim()) return false;
    if (!formData.city.trim()) return false;
    if (!formData.zipCode.match(/^[0-9]{6}$/)) return false;
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      alert('Please fill all required fields correctly');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setOrderPlaced(true);
      setStep('confirm');
    } catch (error) {
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  };

  // Confirmation screen
  if (orderPlaced) {
    return (
      <ResponsiveLayout>
        <motion.main
          className="checkout__confirmation"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="checkout__success-container">
            <motion.div
              className="checkout__success-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <CheckCircle size={80} />
            </motion.div>

            <motion.h1
              className="checkout__success-title"
              variants={itemVariants}
            >
              Order Confirmed! 🎉
            </motion.h1>

            <motion.p
              className="checkout__success-subtitle"
              variants={itemVariants}
            >
              Thank you for your order
            </motion.p>

            <motion.div
              className="checkout__order-details"
              variants={itemVariants}
            >
              <div className="checkout__detail-row">
                <span className="checkout__detail-label">Order ID:</span>
                <span className="checkout__detail-value">
                  {orderSummary.orderId}
                </span>
              </div>

              <div className="checkout__detail-row">
                <span className="checkout__detail-label">
                  Estimated Delivery:
                </span>
                <span className="checkout__detail-value">
                  {orderSummary.estimatedTime}
                </span>
              </div>

              <div className="checkout__detail-row">
                <span className="checkout__detail-label">Total Amount:</span>
                <span className="checkout__detail-value">
                  ₹{orderSummary.total}
                </span>
              </div>
            </motion.div>

            <motion.div
              className="checkout__confirmation-actions"
              variants={itemVariants}
            >
              <ModernButton
                variant="primary"
                size="lg"
                onClick={() => navigate(`/modern/order-tracking/${orderSummary.orderId}`)}
              >
                Track Order
              </ModernButton>

              <ModernButton
                variant="secondary"
                size="lg"
                onClick={() => navigate('/modern/menu')}
              >
                Order More
              </ModernButton>
            </motion.div>

            <motion.div
              className="checkout__confirmation-note"
              variants={itemVariants}
            >
              <p>
                📧 A confirmation email has been sent to{' '}
                <strong>{formData.email}</strong>
              </p>
              <p>
                📱 You can also track your order from the app or website
              </p>
            </motion.div>
          </div>
        </motion.main>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout>
      <motion.main
        className="checkout"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* HEADER */}
        <header className="checkout__header">
          <button
            className="checkout__back"
            onClick={() => navigate('/modern/cart')}
            aria-label="Go back to cart"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="checkout__title">Checkout</h1>
          <div className="checkout__header-spacer" />
        </header>

        <div className="checkout__container">
          {/* MAIN CONTENT */}
          <motion.section
            className="checkout__main"
            variants={itemVariants}
          >
            {/* DELIVERY DETAILS */}
            <ModernCard variant="elevated">
              <div className="checkout__section">
                <h2 className="checkout__section-title">
                  <MapPin size={20} />
                  Delivery Address
                </h2>

                <div className="checkout__form-row">
                  <ModernInput
                    type="text"
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />

                  <ModernInput
                    type="tel"
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="9876543210"
                    required
                  />
                </div>

                <ModernInput
                  type="email"
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  required
                />

                <ModernInput
                  type="text"
                  label="Street Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main Street, Apt 4B"
                  required
                />

                <div className="checkout__form-row">
                  <ModernInput
                    type="text"
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                    required
                  />

                  <ModernInput
                    type="text"
                    label="Zip Code"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="10001"
                    maxLength="6"
                    required
                  />
                </div>
              </div>
            </ModernCard>

            {/* PAYMENT METHOD */}
            <ModernCard variant="elevated">
              <div className="checkout__section">
                <h2 className="checkout__section-title">
                  <CreditCard size={20} />
                  Payment Method
                </h2>

                <div className="checkout__payment-options">
                  {[
                    {
                      id: 'card',
                      name: 'Credit/Debit Card',
                      icon: <CreditCard size={24} />,
                      description: 'Visa, Mastercard, Amex',
                    },
                    {
                      id: 'upi',
                      name: 'UPI',
                      icon: <Smartphone size={24} />,
                      description: 'Google Pay, PhonePe, BHIM',
                    },
                    {
                      id: 'wallet',
                      name: 'Wallet',
                      icon: <Wallet size={24} />,
                      description: 'PayTM, Amazon Pay',
                    },
                    {
                      id: 'cash',
                      name: 'Cash on Delivery',
                      icon: <DollarSign size={24} />,
                      description: 'Pay when your order arrives',
                    },
                  ].map(method => (
                    <button
                      key={method.id}
                      className={`checkout__payment-option ${
                        selectedPayment === method.id ? 'active' : ''
                      }`}
                      onClick={() => setSelectedPayment(method.id)}
                    >
                      <div className="checkout__payment-icon">
                        {method.icon}
                      </div>
                      <div className="checkout__payment-info">
                        <h3 className="checkout__payment-name">
                          {method.name}
                        </h3>
                        <p className="checkout__payment-desc">
                          {method.description}
                        </p>
                      </div>
                      <div
                        className={`checkout__payment-radio ${
                          selectedPayment === method.id ? 'checked' : ''
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </ModernCard>

            {/* ORDER NOTES */}
            <ModernCard variant="elevated">
              <div className="checkout__section">
                <h2 className="checkout__section-title">
                  Special Instructions (Optional)
                </h2>

                <ModernInput
                  type="textarea"
                  label="Add any special requests"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="e.g., Extra spicy, no onions, etc."
                  rows="3"
                />
              </div>
            </ModernCard>

            {/* TERMS & CONDITIONS */}
            <div className="checkout__terms">
              <input
                type="checkbox"
                id="terms"
                defaultChecked
              />
              <label htmlFor="terms">
                I agree to the terms and conditions and privacy policy
              </label>
            </div>

            {/* PLACE ORDER BUTTON */}
            <ModernButton
              variant="primary"
              size="lg"
              className="checkout__place-order"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </ModernButton>
          </motion.section>

          {/* SIDEBAR - ORDER SUMMARY */}
          <motion.aside
            className="checkout__sidebar"
            variants={itemVariants}
          >
            <ModernCard variant="elevated">
              <div className="checkout__summary">
                <h2 className="checkout__summary-title">Order Summary</h2>

                {/* ORDER ITEMS */}
                <div className="checkout__items-preview">
                  <p className="checkout__items-count">
                    {orderSummary.items} items in your order
                  </p>
                </div>

                {/* PRICE BREAKDOWN */}
                <div className="checkout__summary-rows">
                  <div className="checkout__summary-row">
                    <span>Subtotal</span>
                    <span>₹{orderSummary.subtotal}</span>
                  </div>

                  <div className="checkout__summary-row">
                    <span>Delivery Fee</span>
                    <span>₹{orderSummary.deliveryFee}</span>
                  </div>

                  <div className="checkout__summary-row">
                    <span>GST & Taxes</span>
                    <span>₹{orderSummary.gst}</span>
                  </div>

                  <div className="checkout__summary-divider" />

                  <div className="checkout__summary-row checkout__summary-total">
                    <span>Total Amount</span>
                    <span>₹{orderSummary.total}</span>
                  </div>
                </div>

                {/* ESTIMATED TIME */}
                <div className="checkout__estimated-time">
                  <span className="checkout__estimated-icon">⏱️</span>
                  <span className="checkout__estimated-text">
                    Estimated Delivery: <strong>{orderSummary.estimatedTime}</strong>
                  </span>
                </div>

                {/* SECURE BADGE */}
                <div className="checkout__secure-badge">
                  <span>🔒 Secure Checkout</span>
                </div>
              </div>
            </ModernCard>
          </motion.aside>
        </div>
      </motion.main>
    </ResponsiveLayout>
  );
};

export default CheckoutPage;
