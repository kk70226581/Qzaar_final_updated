import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Download,
  Filter,
} from 'lucide-react';
import {
  ModernCard,
  ModernButton,
  ModernBadge,
} from '../ui';
import AdminLayout from '../layout/AdminLayout';
import '../../styles/pages/AnalyticsPage.css';

/**
 * AnalyticsPage - Restaurant analytics and reporting
 * 
 * Features:
 * - Sales analytics
 * - Customer insights
 * - Order trends
 * - Revenue metrics
 * - Popular dishes
 * - Peak hour analysis
 * - Export reports
 * - Date range selection
 */

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
    <AdminLayout title="Analytics & Reports">
      <motion.div
        className="analytics"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="analytics__controls-row mb-6 flex justify-between items-center gap-4 flex-wrap">
          <p className="text-sm text-slate-500 dark:text-slate-400">Real-time revenue, orders and sales performance trends</p>
          <div className="analytics__controls">
            <select
              className="analytics__date-select"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <ModernButton
              variant="secondary"
              size="md"
              onClick={() => alert('Exporting report...')}
            >
              <Download size={18} />
              Export
            </ModernButton>
          </div>
        </div>

        <div className="analytics__container-inner">
        {/* METRICS GRID */}
        <motion.div
          className="analytics__metrics"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { label: 'Total Revenue', value: `₹${metrics.totalRevenue}`, growth: metrics.revenueGrowth },
            { label: 'Total Orders', value: metrics.totalOrders, growth: metrics.ordersGrowth },
            { label: 'Avg Order Value', value: `₹${metrics.averageOrderValue}`, growth: '+8.2%' },
            { label: 'Repeat Customers', value: metrics.repeatCustomers, growth: '+15.4%' },
          ].map((metric, idx) => (
            <motion.div
              key={idx}
              className="analytics__metric"
              variants={itemVariants}
            >
              <div className="analytics__metric-label">{metric.label}</div>
              <div className="analytics__metric-value">{metric.value}</div>
              <div className="analytics__metric-growth">
                <TrendingUp size={16} />
                {metric.growth}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CONTENT GRID */}
        <div className="analytics__content">
          {/* REVENUE CHART */}
          <motion.section
            className="analytics__section"
            variants={itemVariants}
          >
            <ModernCard variant="elevated">
              <div className="analytics__chart-header">
                <h2 className="analytics__chart-title">Revenue Trend</h2>
                <BarChart3 size={20} />
              </div>

              <div className="analytics__chart">
                {chartData.map((data, idx) => (
                  <div key={idx} className="analytics__chart-bar">
                    <div className="analytics__bar-label">{data.day}</div>
                    <div className="analytics__bar-container">
                      <motion.div
                        className="analytics__bar"
                        initial={{ height: 0 }}
                        animate={{ height: `${(data.revenue / 25000) * 100}%` }}
                        transition={{ delay: idx * 0.1 }}
                        style={{
                          background: `linear-gradient(135deg, #f24e42, #ff6b6b)`,
                        }}
                      />
                    </div>
                    <div className="analytics__bar-value">₹{(data.revenue / 1000).toFixed(0)}K</div>
                  </div>
                ))}
              </div>
            </ModernCard>
          </motion.section>

          {/* SIDEBAR */}
          <div className="analytics__sidebar">
            {/* POPULAR DISHES */}
            <motion.section
              className="analytics__section"
              variants={itemVariants}
            >
              <ModernCard variant="elevated">
                <h2 className="analytics__section-title">Top Dishes</h2>
                <div className="analytics__list">
                  {popularDishes.map((dish, idx) => (
                    <div key={idx} className="analytics__list-item">
                      <div className="analytics__rank">#{idx + 1}</div>
                      <div className="analytics__dish-info">
                        <p className="analytics__dish-name">{dish.name}</p>
                        <p className="analytics__dish-meta">
                          {dish.orders} orders
                        </p>
                      </div>
                      <div className="analytics__dish-revenue">
                        ₹{dish.revenue}
                      </div>
                    </div>
                  ))}
                </div>
              </ModernCard>
            </motion.section>

            {/* PEAK HOURS */}
            <motion.section
              className="analytics__section"
              variants={itemVariants}
            >
              <ModernCard variant="elevated">
                <h2 className="analytics__section-title">Peak Hours</h2>
                <div className="analytics__list">
                  {peakHours.map((hour, idx) => (
                    <div key={idx} className="analytics__hour-item">
                      <div className="analytics__hour-label">{hour.hour}</div>
                      <div className="analytics__hour-bars">
                        <div className="analytics__hour-order">
                          {hour.orders} orders
                        </div>
                        <div className="analytics__hour-revenue">
                          ₹{hour.revenue}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ModernCard>
            </motion.section>
          </div>
        </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
};


export default AnalyticsPage;
