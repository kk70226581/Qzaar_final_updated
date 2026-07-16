import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Volume2,
  Maximize2,
  RefreshCw,
} from 'lucide-react';
import {
  ModernBadge,
  ModernButton,
} from '../ui';
import AdminLayout from '../layout/AdminLayout';
import '../../styles/pages/KitchenDisplaySystem.css';


/**
 * KitchenDisplaySystem - Kitchen order management display
 * 
 * Features:
 * - Order cards with items
 * - Preparation timers
 * - Priority levels
 * - Status columns (Pending, Preparing, Ready)
 * - Sound alerts
 * - Fullscreen mode
 * - Real-time updates
 * - Mobile optimized
 */

const KitchenDisplaySystem = () => {
  const [orders, setOrders] = useState([]);
  const [fullscreen, setFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    // Initialize orders
    setOrders([
      {
        id: 'ORD-001',
        items: [
          { name: 'Butter Paneer Tikka', qty: 2, notes: 'Extra spicy' },
          { name: 'Garlic Naan', qty: 1, notes: '' },
        ],
        status: 'pending',
        priority: 'high',
        orderTime: Date.now() - 120000, // 2 minutes ago
        prepTime: 15,
      },
      {
        id: 'ORD-002',
        items: [
          { name: 'Tandoori Chicken', qty: 1, notes: '' },
          { name: 'Mango Lassi', qty: 2, notes: '' },
        ],
        status: 'preparing',
        priority: 'normal',
        orderTime: Date.now() - 300000, // 5 minutes ago
        prepTime: 20,
      },
      {
        id: 'ORD-003',
        items: [
          { name: 'Biryani', qty: 2, notes: 'Less oil' },
          { name: 'Raita', qty: 1, notes: '' },
        ],
        status: 'preparing',
        priority: 'high',
        orderTime: Date.now() - 180000, // 3 minutes ago
        prepTime: 25,
      },
      {
        id: 'ORD-004',
        items: [{ name: 'Gulab Jamun', qty: 3, notes: '' }],
        status: 'ready',
        priority: 'low',
        orderTime: Date.now() - 600000, // 10 minutes ago
        prepTime: 5,
      },
    ]);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setOrders(prevOrders =>
        prevOrders.map(order => ({
          ...order,
          status:
            order.status === 'pending'
              ? 'preparing'
              : order.status === 'preparing'
              ? 'ready'
              : order.status,
        }))
      );
    }, 120000); // Update every 2 minutes

    return () => clearInterval(interval);
  }, []);

  const getElapsedTime = (orderTime) => {
    const elapsed = Math.floor((Date.now() - orderTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');

  const handleMarkReady = (id) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === id ? { ...order, status: 'ready' } : order
      )
    );
    if (soundEnabled) playSound();
  };

  const handleMarkCompleted = (id) => {
    setOrders(prevOrders =>
      prevOrders.filter(order => order.id !== id)
    );
  };

  const playSound = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const OrderCard = ({ order, onMarkReady, onMarkCompleted }) => (
    <motion.div
      className="kds__order-card"
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="kds__order-header">
        <h3 className="kds__order-id">{order.id}</h3>
        <ModernBadge
          variant={order.priority === 'high' ? 'danger' : 'default'}
          size="sm"
        >
          {order.priority.toUpperCase()}
        </ModernBadge>
      </div>

      <div className="kds__order-timer">
        <Clock size={20} />
        <span className="kds__order-time">
          {getElapsedTime(order.orderTime)}
        </span>
        <span className="kds__order-target">/ {order.prepTime}m</span>
      </div>

      <div className="kds__order-items">
        {order.items.map((item, idx) => (
          <div key={idx} className="kds__order-item">
            <span className="kds__item-qty">{item.qty}x</span>
            <span className="kds__item-name">{item.name}</span>
            {item.notes && (
              <span className="kds__item-notes">{item.notes}</span>
            )}
          </div>
        ))}
      </div>

      {order.status !== 'ready' ? (
        <ModernButton
          variant="success"
          size="md"
          className="kds__action-btn"
          onClick={() => onMarkReady(order.id)}
        >
          <CheckCircle size={16} />
          Mark Ready
        </ModernButton>
      ) : (
        <ModernButton
          variant="primary"
          size="md"
          className="kds__action-btn"
          onClick={() => onMarkCompleted(order.id)}
        >
          <CheckCircle size={16} />
          Completed
        </ModernButton>
      )}
    </motion.div>
  );

  const containerClass = fullscreen ? 'kds kds--fullscreen' : 'kds';

  return (
    <AdminLayout title="Kitchen Display System">
      <div className={containerClass}>
        {/* TOOLBAR */}
        <div className="kds__toolbar">
          <div className="kds__toolbar-actions">

          <button
            className={`kds__toolbar-btn ${soundEnabled ? 'active' : ''}`}
            onClick={() => setSoundEnabled(!soundEnabled)}
            aria-label="Toggle sound"
          >
            <Volume2 size={20} />
          </button>
          <button
            className="kds__toolbar-btn"
            onClick={() => setFullscreen(!fullscreen)}
            aria-label="Toggle fullscreen"
          >
            <Maximize2 size={20} />
          </button>
          <button
            className="kds__toolbar-btn"
            onClick={() => window.location.reload()}
            aria-label="Refresh"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* COLUMNS */}
      <div className="kds__columns">
        {/* PENDING COLUMN */}
        <div className="kds__column">
          <div className="kds__column-header">
            <h2 className="kds__column-title">Pending</h2>
            <span className="kds__column-count">{pendingOrders.length}</span>
          </div>
          <div className="kds__column-content">
            {pendingOrders.length === 0 ? (
              <div className="kds__empty-state">
                <CheckCircle size={40} />
                <p>No pending orders</p>
              </div>
            ) : (
              pendingOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onMarkReady={handleMarkReady}
                  onMarkCompleted={handleMarkCompleted}
                />
              ))
            )}
          </div>
        </div>

        {/* PREPARING COLUMN */}
        <div className="kds__column">
          <div className="kds__column-header">
            <h2 className="kds__column-title">Preparing</h2>
            <span className="kds__column-count">{preparingOrders.length}</span>
          </div>
          <div className="kds__column-content">
            {preparingOrders.length === 0 ? (
              <div className="kds__empty-state">
                <AlertCircle size={40} />
                <p>No orders preparing</p>
              </div>
            ) : (
              preparingOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onMarkReady={handleMarkReady}
                  onMarkCompleted={handleMarkCompleted}
                />
              ))
            )}
          </div>
        </div>

        {/* READY COLUMN */}
        <div className="kds__column kds__column--ready">
          <div className="kds__column-header">
            <h2 className="kds__column-title">Ready</h2>
            <span className="kds__column-count">{readyOrders.length}</span>
          </div>
          <div className="kds__column-content">
            {readyOrders.length === 0 ? (
              <div className="kds__empty-state">
                <CheckCircle size={40} />
                <p>No ready orders</p>
              </div>
            ) : (
              readyOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onMarkReady={handleMarkReady}
                  onMarkCompleted={handleMarkCompleted}
                />
              ))
            )}
          </div>
        </div>
      </div>
      </div>
    </AdminLayout>
  );
};




export default KitchenDisplaySystem;
