import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  ShoppingCart,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Menu,
  Settings,
  LogOut,
} from 'lucide-react';
import {
  ModernCard,
  ModernButton,
  ModernBadge,
} from '../ui';
import AdminLayout from '../layout/AdminLayout';
import '../../styles/pages/AdminDashboard.css';

/**
 * AdminDashboard - Restaurant admin dashboard
 * 
 * Features:
 * - Sales metrics and charts
 * - Today's orders overview
 * - Active orders list
 * - Revenue tracking
 * - Customer metrics
 * - Quick actions
 * - Navigation menu
 * - Mobile optimized
 */

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    // Simulate fetching dashboard data
    setMetrics({
      todayRevenue: 12450,
      totalOrders: 34,
      activeOrders: 5,
      totalCustomers: 2847,
      averageOrderValue: 366,
      peakHour: '12:00 PM - 1:00 PM',
      completionRate: '98%',
    });

    setOrders([
      {
        id: 'ORD-001',
        customer: 'John Doe',
        items: 3,
        total: 836,
        status: 'preparing',
        time: '2:42 PM',
      },
      {
        id: 'ORD-002',
        customer: 'Jane Smith',
        items: 2,
        total: 456,
        status: 'ready',
        time: '2:35 PM',
      },
      {
        id: 'ORD-003',
        customer: 'Mike Johnson',
        items: 4,
        total: 1200,
        status: 'pending',
        time: '2:50 PM',
      },
      {
        id: 'ORD-004',
        customer: 'Sarah Williams',
        items: 2,
        total: 550,
        status: 'completed',
        time: '2:10 PM',
      },
      {
        id: 'ORD-005',
        customer: 'Robert Brown',
        items: 5,
        total: 1450,
        status: 'preparing',
        time: '2:55 PM',
      },
    ]);
  }, [selectedPeriod]);

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'preparing':
        return 'info';
      case 'ready':
        return 'success';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <AlertCircle size={16} />;
      case 'preparing':
        return <Clock size={16} />;
      case 'ready':
      case 'completed':
        return <CheckCircle size={16} />;
      default:
        return null;
    }
  };

  if (!metrics) return null;

  return (
    <AdminLayout title="Restaurant Dashboard">
      <motion.div
        className="admin-dashboard"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="admin-dashboard__container-inner">
        {/* METRICS GRID */}
        <motion.div
          className="admin-dashboard__metrics"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            {
              icon: <TrendingUp size={24} />,
              label: "Today's Revenue",
              value: `₹${metrics.todayRevenue}`,
              color: 'primary',
            },
            {
              icon: <ShoppingCart size={24} />,
              label: 'Total Orders',
              value: metrics.totalOrders,
              color: 'success',
            },
            {
              icon: <Clock size={24} />,
              label: 'Active Orders',
              value: metrics.activeOrders,
              color: 'info',
            },
            {
              icon: <Users size={24} />,
              label: 'Total Customers',
              value: metrics.totalCustomers,
              color: 'warning',
            },
          ].map((metric, idx) => (
            <motion.div
              key={idx}
              className="admin-dashboard__metric-card"
              variants={itemVariants}
            >
              <div className={`admin-dashboard__metric-icon admin-dashboard__metric-icon--${metric.color}`}>
                {metric.icon}
              </div>
              <div className="admin-dashboard__metric-content">
                <p className="admin-dashboard__metric-label">
                  {metric.label}
                </p>
                <p className="admin-dashboard__metric-value">
                  {metric.value}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CONTENT GRID */}
        <div className="admin-dashboard__content-grid">
          {/* ACTIVE ORDERS */}
          <motion.section
            className="admin-dashboard__section"
            variants={itemVariants}
          >
            <ModernCard variant="elevated">
              <div className="admin-dashboard__section-header">
                <h2 className="admin-dashboard__section-title">
                  Active Orders
                </h2>
                <button className="admin-dashboard__view-all">
                  View All →
                </button>
              </div>

              <div className="admin-dashboard__orders-list">
                {orders.map((order, idx) => (
                  <div
                    key={idx}
                    className="admin-dashboard__order-item"
                  >
                    <div className="admin-dashboard__order-info">
                      <div className="admin-dashboard__order-header">
                        <span className="admin-dashboard__order-id">
                          {order.id}
                        </span>
                        <ModernBadge
                          variant={getStatusColor(order.status)}
                          size="sm"
                        >
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </ModernBadge>
                      </div>
                      <p className="admin-dashboard__order-customer">
                        {order.customer} • {order.items} items
                      </p>
                      <p className="admin-dashboard__order-time">
                        {order.time}
                      </p>
                    </div>
                    <div className="admin-dashboard__order-total">
                      ₹{order.total}
                    </div>
                  </div>
                ))}
              </div>
            </ModernCard>
          </motion.section>

          {/* SIDEBAR */}
          <motion.aside
            className="admin-dashboard__sidebar"
            variants={itemVariants}
          >
            {/* QUICK STATS */}
            <ModernCard variant="elevated">
              <div className="admin-dashboard__quick-stats">
                <h3 className="admin-dashboard__card-title">
                  Quick Stats
                </h3>

                <div className="admin-dashboard__stat-row">
                  <span>Avg Order Value</span>
                  <span className="admin-dashboard__stat-value">
                    ₹{metrics.averageOrderValue}
                  </span>
                </div>

                <div className="admin-dashboard__stat-row">
                  <span>Peak Hour</span>
                  <span className="admin-dashboard__stat-value">
                    {metrics.peakHour}
                  </span>
                </div>

                <div className="admin-dashboard__stat-row">
                  <span>Completion Rate</span>
                  <span className="admin-dashboard__stat-value">
                    {metrics.completionRate}
                  </span>
                </div>
              </div>
            </ModernCard>

            {/* QUICK ACTIONS */}
            <ModernCard variant="elevated">
              <h3 className="admin-dashboard__card-title">
                Quick Actions
              </h3>

              <div className="admin-dashboard__actions-list">
                <ModernButton
                  variant="secondary"
                  size="md"
                  onClick={() => alert('Add menu item')}
                  className="admin-dashboard__action-btn"
                >
                  Add Menu Item
                </ModernButton>

                <ModernButton
                  variant="secondary"
                  size="md"
                  onClick={() => alert('View reports')}
                  className="admin-dashboard__action-btn"
                >
                  View Reports
                </ModernButton>

                <ModernButton
                  variant="secondary"
                  size="md"
                  onClick={() => alert('Update status')}
                  className="admin-dashboard__action-btn"
                >
                  Update Status
                </ModernButton>

                <ModernButton
                  variant="secondary"
                  size="md"
                  onClick={() => alert('Manage staff')}
                  className="admin-dashboard__action-btn"
                >
                  Manage Staff
                </ModernButton>
              </div>
            </ModernCard>

            {/* NOTIFICATIONS */}
            <ModernCard variant="elevated">
              <h3 className="admin-dashboard__card-title">
                Notifications
              </h3>

              <div className="admin-dashboard__notifications">
                <div className="admin-dashboard__notification">
                  <span className="admin-dashboard__notification-dot" />
                  <span className="admin-dashboard__notification-text">
                    New order received - ORD-005
                  </span>
                </div>

                <div className="admin-dashboard__notification">
                  <span className="admin-dashboard__notification-dot" />
                  <span className="admin-dashboard__notification-text">
                    Order ORD-002 ready for delivery
                  </span>
                </div>

                <div className="admin-dashboard__notification">
                  <span className="admin-dashboard__notification-dot" />
                  <span className="admin-dashboard__notification-text">
                    Low stock: Paneer (2 units)
                  </span>
                </div>
              </div>
            </ModernCard>
          </motion.aside>
        </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
};



export default AdminDashboard;
