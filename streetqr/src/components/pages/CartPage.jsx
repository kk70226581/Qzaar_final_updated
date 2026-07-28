import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  TicketPercent, 
  ArrowLeft,
  Clock,
  BadgeCheck,
  X,
  CreditCard,
  Utensils,
  ShoppingBag as TakeawayBag
} from 'lucide-react';
import { ModernButton, ModernCard, ModernEmpty, ModernInput } from '../ui';
import ResponsiveLayout from '../layout/ResponsiveLayout';
import '../../styles/pages/CartPage.css';

const formatCurrency = (v) => `₹${v.toFixed(2)}`;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const DUMMY_CART_ITEMS = [
  {
    id: 1,
    name: 'Butter Chicken',
    price: 320,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82bea3f02?auto=format&fit=crop&w=200&q=80',
    customization: ['Spicy', 'Extra Butter'],
    itemTotal: 320
  },
  {
    id: 2,
    name: 'Garlic Naan',
    price: 65,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?auto=format&fit=crop&w=200&q=80',
    customization: [],
    itemTotal: 130
  }
];

const SUGGESTIONS = [
  { id: 101, name: 'Mango Lassi', price: 90 },
  { id: 102, name: 'Gulab Jamun', price: 100 },
  { id: 103, name: 'Papadum', price: 40 }
];

const CartPage = () => {
  const navigate = useNavigate();
  
  const [items, setItems] = useState(DUMMY_CART_ITEMS);
  const [orderType, setOrderType] = useState('dine-in'); // 'dine-in' | 'takeaway'
  const [tableNumber, setTableNumber] = useState('');
  const [instructions, setInstructions] = useState({});
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, quantity: newQuantity, itemTotal: item.price * newQuantity } 
        : item
    ));
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleAddSuggestion = (suggestion) => {
    const existing = items.find(item => item.id === suggestion.id);
    if (existing) {
      updateQuantity(suggestion.id, existing.quantity + 1);
    } else {
      setItems([...items, {
        ...suggestion,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80', // placeholder
        customization: [],
        itemTotal: suggestion.price
      }]);
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim().toLowerCase() === 'save10') {
      setAppliedCoupon('SAVE10');
    } else if (couponCode.trim()) {
      setAppliedCoupon(couponCode.toUpperCase());
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const handleInstructionChange = (id, value) => {
    setInstructions(prev => ({ ...prev, [id]: value }));
  };

  const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
  
  const FREE_DELIVERY_THRESHOLD = 499;
  const progressPercent = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);
  const awayFromFree = Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0);

  const deliveryFee = orderType === 'takeaway' || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : 30;
  const gst = subtotal * 0.05;
  const discount = appliedCoupon ? subtotal * 0.10 : 0; // 10% discount for any applied coupon
  const total = subtotal + deliveryFee + gst - discount;

  if (items.length === 0) {
    return (
      <ResponsiveLayout>
        <div className="cart__empty-container">
          <ModernEmpty 
            icon={<ShoppingBag size={64} className="cart__empty-icon" />}
            title="Your cart is empty"
            description="Browse our delicious menu and discover your next favorite meal."
            action={
              <ModernButton 
                variant="primary" 
                onClick={() => navigate('/')}
                className="cart__empty-btn"
              >
                Browse Menu
              </ModernButton>
            }
          />
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout>
      <motion.div 
        className="cart__container"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="cart__header">
          <button className="cart__back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
          <div className="cart__header-title-area">
            <h1 className="cart__title">Your Cart</h1>
            <div className="cart__time-badge">
              <span className="cart__pulse-dot"></span>
              24-30 mins
            </div>
          </div>
        </div>

        <div className="cart__layout">
          <div className="cart__main">
            {/* Order Type Toggle */}
            <motion.div className="cart__order-type-card" variants={fadeUp}>
              <div className="cart__order-toggle">
                <button 
                  className={`cart__toggle-btn ${orderType === 'dine-in' ? 'cart__toggle-btn--active' : ''}`}
                  onClick={() => setOrderType('dine-in')}
                >
                  <Utensils size={18} />
                  Dine In
                </button>
                <button 
                  className={`cart__toggle-btn ${orderType === 'takeaway' ? 'cart__toggle-btn--active' : ''}`}
                  onClick={() => setOrderType('takeaway')}
                >
                  <TakeawayBag size={18} />
                  Takeaway
                </button>
              </div>
              <AnimatePresence>
                {orderType === 'dine-in' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="cart__table-input-wrapper"
                  >
                    <ModernInput 
                      placeholder="Enter Table Number" 
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="cart__table-input"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Free Delivery Progress */}
            <motion.div className="cart__delivery-progress" variants={fadeUp}>
              <div className="cart__progress-header">
                <span className="cart__progress-title">Free Delivery Progress</span>
                <span className="cart__progress-status">
                  {awayFromFree > 0 
                    ? `Add ${formatCurrency(awayFromFree)} more` 
                    : 'You get free delivery! 🎉'}
                </span>
              </div>
              <div className="cart__progress-bar-bg">
                <motion.div 
                  className="cart__progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </motion.div>

            {/* Items List */}
            <div className="cart__items-list">
              <AnimatePresence>
                {items.map(item => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                    className="cart__item-card"
                  >
                    <div className="cart__item-image-wrapper">
                      <img src={item.image} alt={item.name} className="cart__item-image" />
                    </div>
                    
                    <div className="cart__item-details">
                      <div className="cart__item-header">
                        <h3 className="cart__item-name">{item.name}</h3>
                        <span className="cart__item-price">{formatCurrency(item.price)}</span>
                      </div>
                      
                      {item.customization && item.customization.length > 0 && (
                        <div className="cart__item-tags">
                          {item.customization.map((tag, i) => (
                            <span key={i} className="cart__item-tag">{tag}</span>
                          ))}
                        </div>
                      )}

                      <div className="cart__instructions-wrapper">
                        <textarea 
                          className="cart__instructions-input" 
                          placeholder="Add note (e.g., make it spicy)..."
                          value={instructions[item.id] || ''}
                          onChange={(e) => handleInstructionChange(item.id, e.target.value)}
                          rows={1}
                        />
                      </div>
                    </div>

                    <div className="cart__item-actions">
                      <div className="cart__item-total">{formatCurrency(item.itemTotal)}</div>
                      <div className="cart__stepper">
                        <button className="cart__stepper-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus size={16} />
                        </button>
                        <motion.span 
                          key={item.quantity}
                          initial={{ scale: 1.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="cart__stepper-val"
                        >
                          {item.quantity}
                        </motion.span>
                        <button className="cart__stepper-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus size={16} />
                        </button>
                      </div>
                      <button className="cart__remove-btn" onClick={() => removeItem(item.id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Suggestions */}
            <motion.div className="cart__suggestions-section" variants={fadeUp}>
              <h4 className="cart__suggestions-title">You might also like</h4>
              <div className="cart__suggestions-list">
                {SUGGESTIONS.map(suggestion => (
                  <div key={suggestion.id} className="cart__suggestion-chip" onClick={() => handleAddSuggestion(suggestion)}>
                    <div className="cart__suggestion-info">
                      <span className="cart__suggestion-name">{suggestion.name}</span>
                      <span className="cart__suggestion-price">{formatCurrency(suggestion.price)}</span>
                    </div>
                    <button className="cart__suggestion-add">
                      <Plus size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          <motion.div className="cart__sidebar" variants={fadeUp}>
            <ModernCard className="cart__summary-card">
              <div className="cart__summary-header">
                <BadgeCheck className="cart__summary-icon" size={24} />
                <h2>Order Summary</h2>
              </div>

              {/* Coupon Section */}
              <div className="cart__coupon-section">
                {!appliedCoupon ? (
                  <div className="cart__coupon-input-wrapper">
                    <TicketPercent className="cart__coupon-icon" size={20} />
                    <input 
                      type="text" 
                      placeholder="Coupon Code" 
                      className="cart__coupon-input"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button className="cart__coupon-apply" onClick={handleApplyCoupon}>
                      Apply
                    </button>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="cart__coupon-success"
                  >
                    <div className="cart__coupon-success-left">
                      <TicketPercent size={18} />
                      <span className="cart__coupon-code">{appliedCoupon} applied</span>
                    </div>
                    <button className="cart__coupon-remove" onClick={removeCoupon}>
                      <X size={16} />
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="cart__breakdown">
                <div className="cart__breakdown-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="cart__breakdown-row">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? <span className="cart__free-text">Free</span> : formatCurrency(deliveryFee)}</span>
                </div>
                <div className="cart__breakdown-row">
                  <span>GST (5%)</span>
                  <span>{formatCurrency(gst)}</span>
                </div>
                {discount > 0 && (
                  <div className="cart__breakdown-row cart__discount-row">
                    <span>Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
              </div>

              {discount > 0 && (
                <div className="cart__savings-banner">
                  🎉 You saved {formatCurrency(discount)} on this order!
                </div>
              )}

              <div className="cart__total-row">
                <span>Total</span>
                <span className="cart__total-amount">{formatCurrency(total)}</span>
              </div>

              <div className="cart__actions">
                <ModernButton 
                  variant="primary" 
                  className="cart__checkout-btn"
                  onClick={() => alert('Proceeding to checkout...')}
                >
                  <CreditCard size={18} />
                  Proceed to Checkout
                </ModernButton>
                <ModernButton 
                  variant="outline" 
                  className="cart__continue-btn"
                  onClick={() => navigate('/')}
                >
                  Continue Shopping
                </ModernButton>
              </div>

              <div className="cart__secure-note">
                <Clock size={14} />
                <span>Secure and fast checkout powered by Qzaar</span>
              </div>
            </ModernCard>
          </motion.div>
        </div>
      </motion.div>
    </ResponsiveLayout>
  );
};

export default CartPage;
