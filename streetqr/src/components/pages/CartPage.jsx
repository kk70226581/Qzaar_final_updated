import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  Trash,
} from 'lucide-react';
import {
  ModernButton,
  ModernInput,
  ModernEmpty,
  ModernCard,
} from '../ui';
import ResponsiveLayout from '../layout/ResponsiveLayout';
import '../../styles/pages/CartPage.css';

/**
 * CartPage - Shopping cart with item management
 * 
 * Features:
 * - Add/remove items
 * - Quantity management
 * - Coupon code support
 * - Order summary
 * - Tax and fee calculation
 * - Checkout button
 * - Mobile optimized
 * - Item customization display
 */

const CartPage = () => {
  const navigate = useNavigate();

  // Mock cart data
  const [items, setItems] = useState([
    {
      id: 1,
      name: 'Butter Paneer Tikka',
      price: 299,
      quantity: 2,
      image: '/images/food1.jpg',
      customization: {
        size: 'Medium',
        spice: 'Medium',
        addOns: ['Extra Cheese'],
      },
      itemTotal: 598,
    },
    {
      id: 2,
      name: 'Garlic Naan',
      price: 79,
      quantity: 1,
      image: '/images/food2.jpg',
      customization: {
        addOns: [],
      },
      itemTotal: 79,
    },
    {
      id: 3,
      name: 'Mango Lassi',
      price: 89,
      quantity: 1,
      image: '/images/food3.jpg',
      customization: {},
      itemTotal: 89,
    },
  ]);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Calculate totals
  const subtotal = useMemo(() =>
    items.reduce((sum, item) => sum + item.itemTotal, 0),
    [items]
  );

  const deliveryFee = 30;
  const gst = Math.round(subtotal * 0.05);
  const discount = appliedCoupon ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + deliveryFee + gst - discount;

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(items.map(item =>
      item.id === id
        ? { ...item, quantity: newQuantity, itemTotal: item.price * newQuantity }
        : item
    ));
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const applyCoupon = () => {
    if (couponCode.trim()) {
      // Mock coupon validation
      setAppliedCoupon({
        code: couponCode,
        discount: 10, // 10% discount
      });
      setCouponCode('');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  if (items.length === 0) {
    return (
      <ResponsiveLayout>
        <div className="cart__empty-container">
          <ModernEmpty
            type="cart"
            title="Your cart is empty"
            description="Browse our menu and add delicious items to your cart"
            primaryCTA={{
              label: 'Browse Menu',
              onClick: () => navigate('/menu/1'),
            }}
          />
        </div>
      </ResponsiveLayout>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <ResponsiveLayout>
      <main className="cart">
        {/* HEADER */}
        <header className="cart__header">
          <h1 className="cart__title">Shopping Cart</h1>
          <span className="cart__item-count">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </header>

        <div className="cart__container">
          {/* ITEMS LIST */}
          <motion.section
            className="cart__items"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="cart__section-title">Items in Cart</h2>

            <AnimatePresence>
              {items.map(item => (
                <motion.div
                  key={item.id}
                  className="cart__item"
                  variants={itemVariants}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  {/* ITEM IMAGE */}
                  <div className="cart__item-image">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => (e.target.src = '/images/placeholder.jpg')}
                    />
                  </div>

                  {/* ITEM DETAILS */}
                  <div className="cart__item-details">
                    <h3 className="cart__item-name">{item.name}</h3>

                    {/* CUSTOMIZATION */}
                    {(item.customization.size ||
                      item.customization.spice ||
                      (item.customization.addOns &&
                        item.customization.addOns.length > 0)) && (
                      <div className="cart__item-customization">
                        {item.customization.size && (
                          <span className="cart__custom-tag">
                            {item.customization.size}
                          </span>
                        )}
                        {item.customization.spice && (
                          <span className="cart__custom-tag">
                            {item.customization.spice}
                          </span>
                        )}
                        {item.customization.addOns?.map((addon, idx) => (
                          <span key={idx} className="cart__custom-tag">
                            +{addon}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* PRICE AND QUANTITY */}
                    <div className="cart__item-footer">
                      <span className="cart__item-price">
                        ₹{item.itemTotal}
                      </span>

                      <div className="cart__quantity-control">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                          className="cart__qty-btn"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="cart__qty-value">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                          className="cart__qty-btn"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* REMOVE BUTTON */}
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove item"
                    className="cart__item-remove"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.section>

          {/* SIDEBAR - SUMMARY */}
          <motion.aside
            className="cart__summary-sidebar"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ModernCard variant="elevated">
              {/* ORDER SUMMARY */}
              <div className="cart__summary">
                <h2 className="cart__section-title">Order Summary</h2>

                {/* PROMO CODE */}
                <div className="cart__promo-section">
                  {appliedCoupon ? (
                    <div className="cart__coupon-applied">
                      <div className="cart__coupon-info">
                        <span className="cart__coupon-code">
                          {appliedCoupon.code}
                        </span>
                        <span className="cart__coupon-badge">
                          {appliedCoupon.discount}% OFF
                        </span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="cart__coupon-remove"
                        aria-label="Remove coupon"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="cart__promo-input-group">
                      <ModernInput
                        type="text"
                        placeholder="Promo code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="cart__promo-input"
                      />
                      <button
                        onClick={applyCoupon}
                        className="cart__apply-coupon"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                {/* SUMMARY ROWS */}
                <div className="cart__summary-rows">
                  <div className="cart__summary-row">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>

                  <div className="cart__summary-row">
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee}</span>
                  </div>

                  <div className="cart__summary-row">
                    <span>GST & Taxes (5%)</span>
                    <span>₹{gst}</span>
                  </div>

                  {discount > 0 && (
                    <div className="cart__summary-row cart__summary-row--discount">
                      <span>Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}

                  <div className="cart__summary-divider" />

                  <div className="cart__summary-row cart__summary-total">
                    <span>Total Amount</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                {/* CTA BUTTONS */}
                <div className="cart__actions">
                  <ModernButton
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate('/modern/menu')}
                    className="cart__continue-shopping"
                  >
                    Continue Shopping
                  </ModernButton>

                  <ModernButton
                    variant="primary"
                    size="lg"
                    onClick={() => navigate('/modern/checkout')}
                    className="cart__checkout-btn"
                  >
                    <ShoppingCart size={20} />
                    Proceed to Checkout
                  </ModernButton>
                </div>

                {/* SAFE CHECKOUT NOTE */}
                <div className="cart__secure-note">
                  🔒 Secure checkout - Your data is encrypted
                </div>
              </div>
            </ModernCard>
          </motion.aside>
        </div>
      </main>
    </ResponsiveLayout>
  );
};

export default CartPage;
