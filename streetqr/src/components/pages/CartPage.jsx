import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  CreditCard,
  Gift,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  TicketPercent,
  Trash2,
  UtensilsCrossed,
} from 'lucide-react';
import {
  ModernButton,
  ModernCard,
  ModernEmpty,
  ModernInput,
} from '../ui';
import ResponsiveLayout from '../layout/ResponsiveLayout';
import '../../styles/pages/CartPage.css';

const formatCurrency = (value) => `\u20b9${value}`;

const CartPage = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([
    {
      id: 1,
      name: 'Butter Paneer Tikka',
      price: 299,
      quantity: 2,
      image: '/images/showcase/showcase-1.png',
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
      image: '/images/showcase/showcase-3.png',
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
      image: '/images/showcase/showcase-6.png',
      customization: {},
      itemTotal: 89,
    },
  ]);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.itemTotal, 0),
    [items]
  );

  const deliveryFee = 30;
  const gst = Math.round(subtotal * 0.05);
  const discount = appliedCoupon ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + deliveryFee + gst - discount;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const estimatedTime = '24-30 mins';

  const cartPerks = [
    { icon: Clock3, label: 'Prep time', value: estimatedTime },
    { icon: ShieldCheck, label: 'Payment', value: 'Encrypted' },
    { icon: Gift, label: 'Offer', value: appliedCoupon ? `${appliedCoupon.discount}% off` : 'Try SAVE10' },
  ];

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(items.map((item) =>
      item.id === id
        ? { ...item, quantity: newQuantity, itemTotal: item.price * newQuantity }
        : item
    ));
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const applyCoupon = () => {
    if (couponCode.trim()) {
      setAppliedCoupon({
        code: couponCode.trim().toUpperCase(),
        discount: 10,
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
            description="Browse our menu and add delicious items to your cart."
            primaryCTA={{
              label: 'Browse Menu',
              onClick: () => navigate('/modern/menu'),
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
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 280, damping: 28 },
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
        <header className="cart__header">
          <div className="cart__header-copy">
            <span className="cart__eyebrow">
              <ShoppingBag size={16} />
              Ready for checkout
            </span>
            <h1 className="cart__title">Your table cart</h1>
            <p className="cart__subtitle">
              Review items, apply offers, and move to secure payment when everything looks right.
            </p>
            <div className="cart__perks">
              {cartPerks.map((perk) => {
                const Icon = perk.icon;
                return (
                  <span key={perk.label}>
                    <Icon size={16} />
                    <strong>{perk.value}</strong>
                    {perk.label}
                  </span>
                );
              })}
            </div>
          </div>

          <motion.div
            className="cart__hero-art"
            initial={{ opacity: 0, y: 18, rotate: 1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          >
            <img src="/images/ads/cart-cartoon-banner.png" alt="Cartoon checkout basket" />
            <div className="cart__hero-badge">
              <CreditCard size={18} />
              <span>Secure payment next</span>
            </div>
          </motion.div>
        </header>

        <div className="cart__container">
          <motion.section
            className="cart__items"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="cart__section-heading">
              <div>
                <h2 className="cart__section-title">Items in cart</h2>
                <p>{totalItems} total servings across {items.length} dishes</p>
              </div>
              <button type="button" onClick={() => navigate('/modern/menu')}>
                <UtensilsCrossed size={17} />
                Add more
              </button>
            </div>

            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  className="cart__item"
                  variants={itemVariants}
                  exit="exit"
                >
                  <div className="cart__item-image">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.src = '/images/showcase/showcase-1.png';
                      }}
                    />
                  </div>

                  <div className="cart__item-details">
                    <div className="cart__item-topline">
                      <h3 className="cart__item-name">{item.name}</h3>
                      <span className="cart__item-unit">{formatCurrency(item.price)} each</span>
                    </div>

                    {(item.customization.size ||
                      item.customization.spice ||
                      (item.customization.addOns && item.customization.addOns.length > 0)) && (
                      <div className="cart__item-customization">
                        {item.customization.size && (
                          <span className="cart__custom-tag">{item.customization.size}</span>
                        )}
                        {item.customization.spice && (
                          <span className="cart__custom-tag">{item.customization.spice}</span>
                        )}
                        {item.customization.addOns?.map((addon) => (
                          <span key={addon} className="cart__custom-tag">+{addon}</span>
                        ))}
                      </div>
                    )}

                    <div className="cart__item-footer">
                      <span className="cart__item-price">{formatCurrency(item.itemTotal)}</span>

                      <div className="cart__quantity-control">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="cart__qty-btn"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="cart__qty-value">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="cart__qty-btn"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

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

          <motion.aside
            className="cart__summary-sidebar"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ModernCard variant="elevated" className="cart__summary-card">
              <div className="cart__summary">
                <div className="cart__summary-head">
                  <div>
                    <h2 className="cart__section-title">Payment summary</h2>
                    <p>Taxes, offers, and delivery are calculated here.</p>
                  </div>
                  <span>
                    <BadgeCheck size={18} />
                  </span>
                </div>

                <div className="cart__promo-section">
                  <div className="cart__promo-title">
                    <TicketPercent size={18} />
                    <strong>Apply offer</strong>
                  </div>
                  {appliedCoupon ? (
                    <div className="cart__coupon-applied">
                      <div className="cart__coupon-info">
                        <span className="cart__coupon-code">{appliedCoupon.code}</span>
                        <span className="cart__coupon-badge">{appliedCoupon.discount}% OFF</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="cart__coupon-remove"
                        aria-label="Remove coupon"
                      >
                        x
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
                      <button onClick={applyCoupon} className="cart__apply-coupon">
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                <div className="cart__summary-rows">
                  <div className="cart__summary-row">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="cart__summary-row">
                    <span>Delivery fee</span>
                    <span>{formatCurrency(deliveryFee)}</span>
                  </div>
                  <div className="cart__summary-row">
                    <span>GST and taxes</span>
                    <span>{formatCurrency(gst)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="cart__summary-row cart__summary-row--discount">
                      <span>Discount</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="cart__summary-divider" />
                  <div className="cart__summary-row cart__summary-total">
                    <span>Total amount</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

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
                    <ArrowRight size={18} />
                  </ModernButton>
                </div>

                <div className="cart__secure-note">
                  <ShieldCheck size={16} />
                  <span>Secure checkout. Your payment data is encrypted.</span>
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
