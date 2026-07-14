import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  BadgeCheck,
  Banknote,
  CheckCircle,
  ChevronLeft,
  Clock3,
  CreditCard,
  Home,
  LockKeyhole,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  ReceiptText,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Truck,
  Wallet,
} from 'lucide-react';
import {
  ModernBadge,
  ModernButton,
  ModernCard,
  ModernInput,
} from '../ui';
import ResponsiveLayout from '../layout/ResponsiveLayout';
import '../../styles/pages/CheckoutPage.css';

const formatCurrency = (value) => `\u20b9${value}`;

const orderItems = [
  { name: 'Butter Paneer Tikka', qty: 2, price: 598, image: '/images/showcase/showcase-1.png' },
  { name: 'Garlic Naan', qty: 1, price: 79, image: '/images/showcase/showcase-3.png' },
  { name: 'Mango Lassi', qty: 1, price: 89, image: '/images/showcase/showcase-6.png' },
];

const paymentMethods = [
  {
    id: 'card',
    name: 'Credit or debit card',
    icon: CreditCard,
    description: 'Visa, Mastercard, RuPay',
    accent: 'blue',
  },
  {
    id: 'upi',
    name: 'UPI',
    icon: Smartphone,
    description: 'Google Pay, PhonePe, BHIM',
    accent: 'green',
  },
  {
    id: 'wallet',
    name: 'Wallet',
    icon: Wallet,
    description: 'Paytm, Amazon Pay',
    accent: 'orange',
  },
  {
    id: 'cash',
    name: 'Pay on delivery',
    icon: Banknote,
    description: 'Cash or counter payment',
    accent: 'slate',
  },
];

const CheckoutPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState('details');
  const [loading, setLoading] = useState(false);
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

  const orderSummary = {
    subtotal: 766,
    deliveryFee: 30,
    gst: 40,
    discount: 0,
    total: 836,
    items: 3,
    estimatedTime: '25-30 mins',
    orderId: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  };

  const selectedPaymentMethod = paymentMethods.find((method) => method.id === selectedPayment);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
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

    setStep('payment');
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
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
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 280, damping: 28 },
    },
  };

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

            <motion.h1 className="checkout__success-title" variants={itemVariants}>
              Order confirmed
            </motion.h1>

            <motion.p className="checkout__success-subtitle" variants={itemVariants}>
              Your kitchen ticket is live and payment is recorded.
            </motion.p>

            <motion.div className="checkout__order-details" variants={itemVariants}>
              <div className="checkout__detail-row">
                <span className="checkout__detail-label">Order ID</span>
                <span className="checkout__detail-value">{orderSummary.orderId}</span>
              </div>
              <div className="checkout__detail-row">
                <span className="checkout__detail-label">Estimated delivery</span>
                <span className="checkout__detail-value">{orderSummary.estimatedTime}</span>
              </div>
              <div className="checkout__detail-row">
                <span className="checkout__detail-label">Total amount</span>
                <span className="checkout__detail-value">{formatCurrency(orderSummary.total)}</span>
              </div>
            </motion.div>

            <motion.div className="checkout__confirmation-actions" variants={itemVariants}>
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

            <motion.div className="checkout__confirmation-note" variants={itemVariants}>
              <Mail size={18} />
              <p>
                A confirmation email has been sent to <strong>{formData.email}</strong>.
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
        <header className="checkout__hero">
          <button
            className="checkout__back"
            onClick={() => navigate('/modern/cart')}
            aria-label="Go back to cart"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="checkout__hero-copy">
            <ModernBadge variant="success" size="sm" icon={ShieldCheck}>
              Protected payment
            </ModernBadge>
            <h1 className="checkout__title">Checkout and payment</h1>
            <p>Confirm your details, choose a payment method, and send the order to the kitchen.</p>
          </div>

          <motion.div
            className="checkout__hero-art"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          >
            <img src="/images/ads/cart-cartoon-banner.png" alt="Cartoon payment basket" />
          </motion.div>
        </header>

        <div className="checkout__steps" aria-label="Checkout progress">
          {[
            { id: 'details', label: 'Details', icon: Home },
            { id: 'payment', label: 'Payment', icon: LockKeyhole },
            { id: 'confirm', label: 'Confirm', icon: BadgeCheck },
          ].map((progressStep) => {
            const Icon = progressStep.icon;
            const isActive =
              step === progressStep.id ||
              (step === 'payment' && progressStep.id === 'details') ||
              (step === 'confirm' && progressStep.id !== 'confirm');

            return (
              <span
                key={progressStep.id}
                className={`checkout__step ${isActive ? 'is-active' : ''}`}
              >
                <Icon size={16} />
                {progressStep.label}
              </span>
            );
          })}
        </div>

        <div className="checkout__container">
          <motion.section className="checkout__main" variants={itemVariants}>
            <ModernCard variant="elevated" className="checkout__card">
              <div className="checkout__section">
                <h2 className="checkout__section-title">
                  <MapPin size={20} />
                  Delivery address
                </h2>

                <div className="checkout__contact-strip">
                  <span>
                    <Phone size={16} />
                    10 digit phone required
                  </span>
                  <span>
                    <Mail size={16} />
                    Receipt sent by email
                  </span>
                </div>

                <div className="checkout__form-row">
                  <ModernInput
                    type="text"
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Karan Sharma"
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
                  placeholder="karan@example.com"
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
                    placeholder="New Delhi"
                    required
                  />
                  <ModernInput
                    type="text"
                    label="PIN Code"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="110001"
                    maxLength="6"
                    required
                  />
                </div>
              </div>
            </ModernCard>

            <ModernCard variant="elevated" className="checkout__card">
              <div className="checkout__section">
                <h2 className="checkout__section-title">
                  <CreditCard size={20} />
                  Payment method
                </h2>

                <div className="checkout__payment-options">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    const isSelected = selectedPayment === method.id;

                    return (
                      <button
                        key={method.id}
                        type="button"
                        className={`checkout__payment-option checkout__payment-option--${method.accent} ${isSelected ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedPayment(method.id);
                          setStep('payment');
                        }}
                      >
                        <motion.div
                          className="checkout__payment-icon"
                          animate={isSelected ? { y: [0, -2, 0] } : {}}
                          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <Icon size={24} />
                        </motion.div>
                        <div className="checkout__payment-info">
                          <h3 className="checkout__payment-name">{method.name}</h3>
                          <p className="checkout__payment-desc">{method.description}</p>
                        </div>
                        <div className={`checkout__payment-radio ${isSelected ? 'checked' : ''}`} />
                      </button>
                    );
                  })}
                </div>

                <div className="checkout__payment-note">
                  <AlertCircle size={16} />
                  <span>
                    {selectedPayment === 'cash'
                      ? 'No online charge now. Pay when your order arrives.'
                      : `${selectedPaymentMethod?.name} will be processed through a secure gateway.`}
                  </span>
                </div>
              </div>
            </ModernCard>

            <ModernCard variant="elevated" className="checkout__card">
              <div className="checkout__section">
                <h2 className="checkout__section-title">
                  <MessageSquareText size={20} />
                  Special instructions
                </h2>

                <ModernInput
                  type="textarea"
                  label="Add any special requests"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Extra spicy, no onions, ring the bell twice..."
                  rows="3"
                />
              </div>
            </ModernCard>

            <div className="checkout__terms">
              <input type="checkbox" id="terms" defaultChecked />
              <label htmlFor="terms">
                I agree to the terms and conditions and privacy policy.
              </label>
            </div>

            <ModernButton
              variant="primary"
              size="lg"
              className="checkout__place-order"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? 'Processing payment...' : `Pay ${formatCurrency(orderSummary.total)} and place order`}
            </ModernButton>
          </motion.section>

          <motion.aside className="checkout__sidebar" variants={itemVariants}>
            <ModernCard variant="elevated" className="checkout__summary-card">
              <div className="checkout__summary">
                <div className="checkout__summary-header">
                  <div>
                    <h2 className="checkout__summary-title">Order summary</h2>
                    <p>{orderSummary.items} dishes prepared fresh</p>
                  </div>
                  <span>
                    <ReceiptText size={18} />
                  </span>
                </div>

                <div className="checkout__items-preview">
                  {orderItems.map((item) => (
                    <div key={item.name} className="checkout__item-preview">
                      <img src={item.image} alt={item.name} />
                      <div>
                        <strong>{item.name}</strong>
                        <span>Qty {item.qty}</span>
                      </div>
                      <b>{formatCurrency(item.price)}</b>
                    </div>
                  ))}
                </div>

                <div className="checkout__summary-rows">
                  <div className="checkout__summary-row">
                    <span>Subtotal</span>
                    <span>{formatCurrency(orderSummary.subtotal)}</span>
                  </div>
                  <div className="checkout__summary-row">
                    <span>Delivery fee</span>
                    <span>{formatCurrency(orderSummary.deliveryFee)}</span>
                  </div>
                  <div className="checkout__summary-row">
                    <span>GST and taxes</span>
                    <span>{formatCurrency(orderSummary.gst)}</span>
                  </div>
                  <div className="checkout__summary-divider" />
                  <div className="checkout__summary-row checkout__summary-total">
                    <span>Total amount</span>
                    <span>{formatCurrency(orderSummary.total)}</span>
                  </div>
                </div>

                <div className="checkout__estimated-time">
                  <Clock3 size={18} />
                  <span>
                    Estimated delivery <strong>{orderSummary.estimatedTime}</strong>
                  </span>
                </div>

                <div className="checkout__delivery-card">
                  <Truck size={18} />
                  <span>Live order tracking after confirmation</span>
                </div>

                <div className="checkout__secure-badge">
                  <Sparkles size={16} />
                  <span>Secure checkout with encrypted payment details</span>
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
