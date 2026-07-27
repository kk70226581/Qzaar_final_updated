import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  ChevronRight,
  Clock3,
  PackagePlus,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react';
import AdminLayout from '../layout/AdminLayout';
import '../../styles/pages/AdminDashboard.css';

const orders = [
  { id: 'ORD-005', customer: 'Robert Brown', items: 5, total: 1450, status: 'preparing', time: '2 min ago' },
  { id: 'ORD-003', customer: 'Mike Johnson', items: 4, total: 1200, status: 'pending', time: '7 min ago' },
  { id: 'ORD-001', customer: 'John Doe', items: 3, total: 836, status: 'preparing', time: '10 min ago' },
  { id: 'ORD-002', customer: 'Jane Smith', items: 2, total: 456, status: 'ready', time: '17 min ago' },
  { id: 'ORD-004', customer: 'Sarah Williams', items: 2, total: 550, status: 'completed', time: '42 min ago' },
];

const statusLabels = {
  pending: 'Waiting',
  preparing: 'In kitchen',
  ready: 'Ready to serve',
  completed: 'Completed',
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('Good afternoon');

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening');
  }, []);

  const metrics = [
    { label: "Today's revenue", value: '₹12,450', note: '+18.4% vs. yesterday', icon: TrendingUp, tone: 'revenue' },
    { label: 'Orders today', value: '34', note: '8 orders in the last hour', icon: ShoppingCart, tone: 'orders' },
    { label: 'In service', value: '5', note: '2 need attention', icon: Clock3, tone: 'service' },
    { label: 'Returning guests', value: '2,847', note: '+126 this month', icon: Users, tone: 'guests' },
  ];

  const quickActions = [
    { label: 'Add a menu item', detail: 'Create a dish or modifier', icon: PackagePlus, path: '/menu' },
    { label: 'Open live orders', detail: 'Manage the current queue', icon: ShoppingCart, path: '/orders' },
    { label: 'View performance', detail: 'Explore today’s numbers', icon: TrendingUp, path: '/modern/admin/analytics' },
  ];

  return (
    <AdminLayout title="Restaurant Dashboard">
      <motion.div
        className="admin-dashboard"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
      >
        <motion.section
          className="admin-dashboard__welcome"
          variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
        >
          <div>
            <p className="admin-dashboard__eyebrow"><span /> Live restaurant operations</p>
            <h2>{greeting}, Karan.</h2>
            <p className="admin-dashboard__intro">Your restaurant is on pace for a strong service. Here’s the live picture.</p>
          </div>
          <div className="admin-dashboard__service-chip">
            <span className="admin-dashboard__service-dot" />
            <div><strong>Service is live</strong><small>Last updated just now</small></div>
          </div>
        </motion.section>

        <section className="admin-dashboard__metrics" aria-label="Today’s performance">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <motion.article
                key={metric.label}
                className={`admin-dashboard__metric-card admin-dashboard__metric-card--${metric.tone}`}
                variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
              >
                <div className="admin-dashboard__metric-top">
                  <span className="admin-dashboard__metric-label">{metric.label}</span>
                  <span className="admin-dashboard__metric-icon"><Icon size={19} /></span>
                </div>
                <strong className="admin-dashboard__metric-value">{metric.value}</strong>
                <p className="admin-dashboard__metric-note">{metric.note}</p>
              </motion.article>
            );
          })}
        </section>

        <div className="admin-dashboard__content-grid">
          <motion.section
            className="admin-dashboard__panel admin-dashboard__orders-panel"
            variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
          >
            <div className="admin-dashboard__panel-header">
              <div>
                <p className="admin-dashboard__panel-kicker">Order queue</p>
                <h3>Active orders <span>{orders.filter((order) => order.status !== 'completed').length}</span></h3>
              </div>
              <button className="admin-dashboard__link-button" onClick={() => navigate('/orders')}>
                View all orders <ArrowRight size={16} />
              </button>
            </div>
            <div className="admin-dashboard__orders-list">
              {orders.map((order) => (
                <button className="admin-dashboard__order-item" key={order.id} onClick={() => navigate('/orders')}>
                  <span className={`admin-dashboard__order-status admin-dashboard__order-status--${order.status}`} />
                  <div className="admin-dashboard__order-main">
                    <div className="admin-dashboard__order-title">
                      <strong>{order.id}</strong>
                      <span className={`admin-dashboard__badge admin-dashboard__badge--${order.status}`}>{statusLabels[order.status]}</span>
                    </div>
                    <span>{order.customer} <i>•</i> {order.items} items</span>
                  </div>
                  <span className="admin-dashboard__order-time">{order.time}</span>
                  <strong className="admin-dashboard__order-total">₹{order.total.toLocaleString('en-IN')}</strong>
                  <ChevronRight className="admin-dashboard__order-arrow" size={18} />
                </button>
              ))}
            </div>
          </motion.section>

          <motion.aside
            className="admin-dashboard__sidebar"
            variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
          >
            <section className="admin-dashboard__panel admin-dashboard__pulse-card">
              <div className="admin-dashboard__panel-header">
                <div><p className="admin-dashboard__panel-kicker">Today’s pulse</p><h3>Service health</h3></div>
                <CheckCircle2 size={21} />
              </div>
              <div className="admin-dashboard__health-score"><strong>98</strong><span>/100</span><em>Excellent</em></div>
              <div className="admin-dashboard__progress"><span /></div>
              <div className="admin-dashboard__mini-stats">
                <div><span>Avg. order</span><strong>₹366</strong></div>
                <div><span>Peak time</span><strong>12–1 PM</strong></div>
              </div>
            </section>

            <section className="admin-dashboard__panel">
              <div className="admin-dashboard__panel-header"><div><p className="admin-dashboard__panel-kicker">Shortcuts</p><h3>Quick actions</h3></div></div>
              <div className="admin-dashboard__actions-list">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return <button key={action.label} onClick={() => navigate(action.path)} className="admin-dashboard__action">
                    <span><Icon size={18} /></span><div><strong>{action.label}</strong><small>{action.detail}</small></div><ChevronRight size={17} />
                  </button>;
                })}
              </div>
            </section>

            <section className="admin-dashboard__panel admin-dashboard__alerts">
              <div className="admin-dashboard__panel-header"><div><p className="admin-dashboard__panel-kicker">Updates</p><h3>Needs attention</h3></div><BellRing size={19} /></div>
              <div className="admin-dashboard__alert"><span className="admin-dashboard__alert-dot admin-dashboard__alert-dot--blue" /><p><strong>ORD-005 just arrived</strong><small>New table order • 2 min ago</small></p></div>
              <div className="admin-dashboard__alert"><span className="admin-dashboard__alert-dot admin-dashboard__alert-dot--amber" /><p><strong>Paneer is running low</strong><small>Only 2 portions remaining</small></p></div>
            </section>
          </motion.aside>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminDashboard;
