import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Calendar,
  Clock3,
  Download,
  IndianRupee,
  ReceiptText,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react';
import {
  ModernBadge,
  ModernButton,
  ModernCard,
} from '../ui';
import AdminLayout from '../layout/AdminLayout';
import '../../styles/pages/AnalyticsPage.css';

const formatCurrency = (value) => `\u20b9${value.toLocaleString('en-IN')}`;

const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const metrics = {
    totalRevenue: 87450,
    totalOrders: 324,
    averageOrderValue: 270,
    customerCount: 2847,
    repeatCustomers: 687,
    ordersGrowth: '+12.5%',
    revenueGrowth: '+18.3%',
  };

  const chartData = [
    { day: 'Mon', revenue: 12450, orders: 45 },
    { day: 'Tue', revenue: 13200, orders: 48 },
    { day: 'Wed', revenue: 11800, orders: 42 },
    { day: 'Thu', revenue: 14300, orders: 52 },
    { day: 'Fri', revenue: 18900, orders: 68 },
    { day: 'Sat', revenue: 21400, orders: 76 },
    { day: 'Sun', revenue: 15200, orders: 57 },
  ];

  const popularDishes = [
    { name: 'Butter Paneer Tikka', orders: 156, revenue: 46644 },
    { name: 'Tandoori Chicken', orders: 142, revenue: 49558 },
    { name: 'Biryani', orders: 98, revenue: 39102 },
    { name: 'Dal Makhani', orders: 87, revenue: 17313 },
    { name: 'Garlic Naan', orders: 234, revenue: 18486 },
  ];

  const peakHours = [
    { hour: '12-1 PM', orders: 45, revenue: 12150 },
    { hour: '1-2 PM', orders: 52, revenue: 14040 },
    { hour: '7-8 PM', orders: 68, revenue: 18360 },
    { hour: '8-9 PM', orders: 71, revenue: 19170 },
  ];

  const metricCards = [
    {
      label: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue),
      growth: metrics.revenueGrowth,
      icon: IndianRupee,
      tone: 'green',
    },
    {
      label: 'Total Orders',
      value: metrics.totalOrders.toLocaleString('en-IN'),
      growth: metrics.ordersGrowth,
      icon: ReceiptText,
      tone: 'blue',
    },
    {
      label: 'Avg Order Value',
      value: formatCurrency(metrics.averageOrderValue),
      growth: '+8.2%',
      icon: BarChart3,
      tone: 'orange',
    },
    {
      label: 'Repeat Customers',
      value: metrics.repeatCustomers.toLocaleString('en-IN'),
      growth: '+15.4%',
      icon: RotateCcw,
      tone: 'violet',
    },
  ];

  const maxChartValue = Math.max(...chartData.map((item) => item[selectedMetric]));
  const chartLabel = selectedMetric === 'revenue' ? 'Revenue' : 'Orders';
  const rangeLabels = {
    day: 'Today',
    week: 'This Week',
    month: 'This Month',
    year: 'This Year',
  };

  const exportReport = () => {
    const rows = [
      ['Day', 'Revenue (INR)', 'Orders'],
      ...chartData.map(({ day, revenue, orders }) => [day, revenue, orders]),
    ];
    const report = new Blob([rows.map((row) => row.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(report);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qzaar-${dateRange}-report.csv`;
    link.click();
    URL.revokeObjectURL(url);
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

  return (
    <AdminLayout title="Analytics & Reports">
      <motion.div
        className="analytics"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="analytics__hero" variants={itemVariants}>
          <div className="analytics__hero-copy">
            <ModernBadge variant="info" size="sm" icon={Sparkles}>
              Live report
            </ModernBadge>
            <div>
              <h2>Service performance</h2>
              <p>Track revenue, orders, best sellers and rush windows from one clean workspace.</p>
            </div>
          </div>

          <div className="analytics__controls">
            <label className="analytics__date-field">
              <Calendar size={16} />
              <select
                className="analytics__date-select"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                aria-label="Select report date range"
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </label>
            <ModernButton
              variant="secondary"
              size="md"
              icon={Download}
              onClick={exportReport}
            >
              Export
            </ModernButton>
          </div>
        </motion.div>

        <motion.div
          className="analytics__metrics"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {metricCards.map((metric) => {
            const Icon = metric.icon;

            return (
              <motion.div
                key={metric.label}
                className={`analytics__metric analytics__metric--${metric.tone}`}
                variants={itemVariants}
                whileHover={{ y: -4 }}
              >
                <motion.div
                  className="analytics__metric-icon"
                  animate={{ y: [0, -3, 0], rotate: [0, -2, 2, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Icon size={22} />
                </motion.div>
                <div>
                  <div className="analytics__metric-label">{metric.label}</div>
                  <div className="analytics__metric-value">{metric.value}</div>
                  <div className="analytics__metric-growth">
                    <TrendingUp size={15} />
                    {metric.growth}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="analytics__content">
          <motion.section className="analytics__main-panel" variants={itemVariants}>
            <ModernCard variant="elevated" className="analytics__card analytics__chart-card">
              <div className="analytics__panel-header">
                <div>
                  <span className="analytics__eyebrow">{rangeLabels[dateRange]}</span>
                  <h3>{chartLabel} trend</h3>
                </div>

                <div className="analytics__metric-tabs" aria-label="Chart metric">
                  {[
                    { key: 'revenue', label: 'Revenue', icon: IndianRupee },
                    { key: 'orders', label: 'Orders', icon: ReceiptText },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = selectedMetric === tab.key;

                    return (
                      <button
                        key={tab.key}
                        type="button"
                        className={`analytics__metric-tab ${isActive ? 'is-active' : ''}`}
                        onClick={() => setSelectedMetric(tab.key)}
                      >
                        <Icon size={15} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="analytics__chart">
                {chartData.map((data, idx) => {
                  const value = data[selectedMetric];
                  const height = Math.max(14, (value / maxChartValue) * 100);

                  return (
                    <div key={data.day} className="analytics__chart-bar">
                      <div className="analytics__bar-container">
                        <motion.div
                          className={`analytics__bar analytics__bar--${selectedMetric}`}
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: idx * 0.06, type: 'spring', stiffness: 120, damping: 18 }}
                        />
                      </div>
                      <div className="analytics__bar-label">{data.day}</div>
                      <div className="analytics__bar-value">
                        {selectedMetric === 'revenue'
                          ? `${formatCurrency(Math.round(data.revenue / 1000))}K`
                          : data.orders}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ModernCard>
          </motion.section>

          <motion.aside className="analytics__side-panels" variants={containerVariants}>
            <motion.section variants={itemVariants}>
              <ModernCard variant="elevated" className="analytics__card analytics__list-card">
                <div className="analytics__panel-header analytics__panel-header--compact">
                  <div>
                    <span className="analytics__eyebrow">Menu mix</span>
                    <h3>Top dishes</h3>
                  </div>
                  <motion.span
                    className="analytics__floating-icon analytics__floating-icon--gold"
                    animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.08, 1] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Trophy size={18} />
                  </motion.span>
                </div>

                <div className="analytics__list">
                  {popularDishes.map((dish, idx) => (
                    <motion.div
                      key={dish.name}
                      className="analytics__list-item"
                      whileHover={{ x: 4 }}
                    >
                      <span className="analytics__rank">#{idx + 1}</span>
                      <div className="analytics__dish-info">
                        <p className="analytics__dish-name">{dish.name}</p>
                        <p className="analytics__dish-meta">{dish.orders} orders</p>
                      </div>
                      <div className="analytics__dish-revenue">{formatCurrency(dish.revenue)}</div>
                    </motion.div>
                  ))}
                </div>
              </ModernCard>
            </motion.section>

            <motion.section variants={itemVariants}>
              <ModernCard variant="elevated" className="analytics__card analytics__list-card">
                <div className="analytics__panel-header analytics__panel-header--compact">
                  <div>
                    <span className="analytics__eyebrow">Rush windows</span>
                    <h3>Peak hours</h3>
                  </div>
                  <motion.span
                    className="analytics__floating-icon analytics__floating-icon--blue"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Clock3 size={18} />
                  </motion.span>
                </div>

                <div className="analytics__list analytics__list--hours">
                  {peakHours.map((hour) => (
                    <motion.div
                      key={hour.hour}
                      className="analytics__hour-item"
                      whileHover={{ x: 4 }}
                    >
                      <div className="analytics__hour-label">{hour.hour}</div>
                      <div className="analytics__hour-detail">
                        <span>{hour.orders} orders</span>
                        <strong>{formatCurrency(hour.revenue)}</strong>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ModernCard>
            </motion.section>

            <motion.section variants={itemVariants}>
              <ModernCard variant="elevated" className="analytics__card analytics__summary-card">
                <Users size={18} />
                <div>
                  <span>Customer reach</span>
                  <strong>{metrics.customerCount.toLocaleString('en-IN')}</strong>
                </div>
              </ModernCard>
            </motion.section>
          </motion.aside>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default AnalyticsPage;
