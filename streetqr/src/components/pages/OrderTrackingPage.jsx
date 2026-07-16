import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle,
  Home,
} from 'lucide-react';
import {
  ModernButton,
  ModernCard,
  ModernEmpty,
} from '../ui';
import ResponsiveLayout from '../layout/ResponsiveLayout';
import '../../styles/pages/OrderTrackingPage.css';

/**
 * OrderTrackingPage - Real-time order tracking
 * 
 * Features:
 * - Order timeline with status
 * - Live order progress
 * - Estimated delivery time
 * - Chef status updates
 * - Contact restaurant
 * - Call waiter option
 * - Mobile optimized
 * - Real-time updates ready
 */

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // State
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(2);

  useEffect(() => {
    // Simulate fetching order details
    setTimeout(() => {
      setOrder({
        id: orderId || 'ORD-ABCD1234',
        status: 'preparing',
        restaurantName: 'Food Haven',
        restaurantPhone: '+1-555-0123',
        customerName: 'John Doe',
        address: '123 Main St, Apt 4B, New York, NY 10001',
        orderTime: '2:30 PM',
        estimatedTime: '2:55 PM',
        currentTime: '2:42 PM',
        items: [
          { name: 'Butter Paneer Tikka', quantity: 2, price: 598 },
          { name: 'Garlic Naan', quantity: 1, price: 79 },
          { name: 'Mango Lassi', quantity: 1, price: 89 },
        ],
        total: 836,
        timeline: [
          {
            step: 'confirmed',
            title: 'Order Confirmed',
            time: '2:30 PM',
            completed: true,
            description: 'Your order has been confirmed',
          },
          {
            step: 'preparing',
            title: 'Preparing Food',
            time: '2:40 PM',
            completed: true,
            description: 'Chef is preparing your food',
          },
          {
            step: 'ready',
            title: 'Ready for Delivery',
            time: '2:55 PM',
            completed: false,
            description: 'Your order will be ready soon',
          },
          {
            step: 'delivered',
            title: 'Delivered',
            time: '3:05 PM',
            completed: false,
            description: 'Order will arrive at your location',
          },
        ],
      });
      setLoading(false);
    }, 800);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev < 3 ? prev + 1 : 3));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [orderId]);

  if (loading || !order) {
    return (
      <ResponsiveLayout>
        <div className="order-tracking__loading">
          <ModernEmpty
            type="orders"
            title="Loading Order Details"
            description="Fetching your order information..."
          />
        </div>
      </ResponsiveLayout>
    );
  }

  const remainingTime = Math.round(
    Math.random() * 15 + 10
  ); // 10-25 minutes

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

  return (
    <ResponsiveLayout>
      <motion.main
        className="order-tracking"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* HEADER */}
        <header className="order-tracking__header">
          <button
            className="order-tracking__back"
            onClick={() => navigate('/')}
            aria-label="Go home"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="order-tracking__title">Order Tracking</h1>
          <div className="order-tracking__header-spacer" />
        </header>

        <div className="order-tracking__container">
          {/* MAIN CONTENT */}
          <motion.section
            className="order-tracking__main"
            variants={itemVariants}
          >
            {/* ORDER ID & STATUS */}
            <ModernCard variant="elevated">
              <div className="order-tracking__header-info">
                <div>
                  <p className="order-tracking__label">Order ID</p>
                  <h2 className="order-tracking__order-id">{order.id}</h2>
                </div>
                <div className="order-tracking__status">
                  <span className="order-tracking__status-badge">
                    {order.status === 'preparing' ? '👨‍🍳' : '🚴'}
                  </span>
                  <span className="order-tracking__status-text">
                    {order.status === 'preparing'
                      ? 'Preparing Your Order'
                      : 'On the Way'}
                  </span>
                </div>
              </div>
            </ModernCard>

            {/* ESTIMATED TIME */}
            <motion.div
              className="order-tracking__countdown"
              variants={itemVariants}
            >
              <div className="order-tracking__countdown-content">
                <Clock size={32} className="order-tracking__countdown-icon" />
                <div className="order-tracking__countdown-text">
                  <p className="order-tracking__countdown-label">
                    Estimated Delivery
                  </p>
                  <p className="order-tracking__countdown-time">
                    {remainingTime} minutes
                  </p>
                  <p className="order-tracking__countdown-exact">
                    Around {order.estimatedTime}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* TIMELINE */}
            <motion.div
              className="order-tracking__timeline"
              variants={itemVariants}
            >
              <h3 className="order-tracking__timeline-title">
                Order Progress
              </h3>
              <div className="order-tracking__timeline-items">
                {order.timeline.map((item, idx) => (
                  <div
                    key={idx}
                    className={`order-tracking__timeline-item ${
                      currentStep >= idx ? 'completed' : ''
                    }`}
                  >
                    <div className="order-tracking__timeline-dot">
                      {currentStep > idx ? (
                        <CheckCircle size={24} />
                      ) : (
                        <div className="order-tracking__timeline-circle" />
                      )}
                    </div>
                    <div className="order-tracking__timeline-content">
                      <h4 className="order-tracking__timeline-step-title">
                        {item.title}
                      </h4>
                      <p className="order-tracking__timeline-description">
                        {item.description}
                      </p>
                      <p className="order-tracking__timeline-time">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* RESTAURANT INFO */}
            <motion.div
              className="order-tracking__restaurant"
              variants={itemVariants}
            >
              <h3 className="order-tracking__section-title">
                Restaurant Details
              </h3>
              <ModernCard variant="default">
                <div className="order-tracking__restaurant-card">
                  <div>
                    <h4 className="order-tracking__restaurant-name">
                      {order.restaurantName}
                    </h4>
                    <p className="order-tracking__restaurant-detail">
                      <Phone size={16} />
                      {order.restaurantPhone}
                    </p>
                  </div>
                  <button
                    className="order-tracking__call-btn"
                    onClick={() =>
                      (window.location.href = `tel:${order.restaurantPhone}`)
                    }
                  >
                    <Phone size={20} />
                    Call
                  </button>
                </div>
              </ModernCard>
            </motion.div>

            {/* DELIVERY ADDRESS */}
            <motion.div
              className="order-tracking__address"
              variants={itemVariants}
            >
              <h3 className="order-tracking__section-title">
                Delivery Address
              </h3>
              <ModernCard variant="default">
                <div className="order-tracking__address-content">
                  <MapPin size={20} className="order-tracking__address-icon" />
                  <div>
                    <p className="order-tracking__address-name">
                      {order.customerName}
                    </p>
                    <p className="order-tracking__address-text">
                      {order.address}
                    </p>
                  </div>
                </div>
              </ModernCard>
            </motion.div>

            {/* QUICK ACTIONS */}
            <motion.div
              className="order-tracking__actions"
              variants={itemVariants}
            >
              <h3 className="order-tracking__section-title">
                Quick Actions
              </h3>
              <div className="order-tracking__actions-grid">
                <button className="order-tracking__action-btn">
                  <MessageCircle size={24} />
                  <span>Chat with Restaurant</span>
                </button>
                <button className="order-tracking__action-btn">
                  <Home size={24} />
                  <span>Call Waiter</span>
                </button>
              </div>
            </motion.div>
          </motion.section>

          {/* SIDEBAR - ORDER SUMMARY */}
          <motion.aside
            className="order-tracking__sidebar"
            variants={itemVariants}
          >
            <ModernCard variant="elevated">
              <div className="order-tracking__summary">
                <h2 className="order-tracking__summary-title">
                  Order Summary
                </h2>

                {/* ITEMS */}
                <div className="order-tracking__items">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="order-tracking__item"
                    >
                      <div>
                        <p className="order-tracking__item-name">
                          {item.name}
                        </p>
                        <p className="order-tracking__item-qty">
                          x{item.quantity}
                        </p>
                      </div>
                      <span className="order-tracking__item-price">
                        ₹{item.price}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="order-tracking__divider" />

                {/* TOTAL */}
                <div className="order-tracking__total">
                  <span>Total Amount:</span>
                  <span className="order-tracking__total-amount">
                    ₹{order.total}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="order-tracking__summary-actions">
                  <ModernButton
                    variant="primary"
                    size="lg"
                    className="order-tracking__rate-btn"
                    onClick={() => alert('Rating feature coming soon!')}
                  >
                    Rate & Review
                  </ModernButton>

                  <ModernButton
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate('/')}
                  >
                    Back Home
                  </ModernButton>
                </div>
              </div>
            </ModernCard>
          </motion.aside>
        </div>
      </motion.main>
    </ResponsiveLayout>
  );
};

export default OrderTrackingPage;
