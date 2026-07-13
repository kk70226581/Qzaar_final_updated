/**
 * Analytics Service
 * Handles all analytics-related API calls
 */

import api from './api';

export const analyticsService = {
  /**
   * Get metrics for a specific period
   * @param {string} shopId - Restaurant ID
   * @param {string} period - 'day', 'week', 'month', 'year'
   * @returns {Promise}
   */
  getMetrics: (shopId, period = 'week') => 
    api.get(`/analytics/metrics/${shopId}?period=${period}`),

  /**
   * Get revenue chart data
   * @param {string} shopId - Restaurant ID
   * @param {number} days - Number of days to fetch (7, 30, etc.)
   * @returns {Promise}
   */
  getRevenueChart: (shopId, days = 7) => 
    api.get(`/analytics/revenue-chart/${shopId}?days=${days}`),

  /**
   * Get popular dishes
   * @param {string} shopId - Restaurant ID
   * @param {number} limit - Number of dishes to fetch
   * @returns {Promise}
   */
  getPopularDishes: (shopId, limit = 5) => 
    api.get(`/analytics/popular-dishes/${shopId}?limit=${limit}`),

  /**
   * Get peak hours analysis
   * @param {string} shopId - Restaurant ID
   * @param {number} limit - Number of hours to fetch
   * @returns {Promise}
   */
  getPeakHours: (shopId, limit = 4) => 
    api.get(`/analytics/peak-hours/${shopId}?limit=${limit}`),

  /**
   * Get customer insights
   * @param {string} shopId - Restaurant ID
   * @returns {Promise}
   */
  getCustomerInsights: (shopId) => 
    api.get(`/analytics/customer-insights/${shopId}`),

  /**
   * Get order trends
   * @param {string} shopId - Restaurant ID
   * @param {string} period - Time period
   * @returns {Promise}
   */
  getOrderTrends: (shopId, period = 'week') => 
    api.get(`/analytics/order-trends/${shopId}?period=${period}`),

  /**
   * Export analytics report
   * @param {string} shopId - Restaurant ID
   * @param {string} format - 'pdf', 'csv', 'excel'
   * @returns {Promise}
   */
  exportReport: (shopId, format = 'pdf') => 
    api.post(`/analytics/export/${shopId}`, { format }),

  /**
   * Get analytics for custom date range
   * @param {string} shopId - Restaurant ID
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise}
   */
  getDateRangeAnalytics: (shopId, startDate, endDate) => 
    api.get(`/analytics/date-range/${shopId}?start=${startDate}&end=${endDate}`),

  /**
   * Get revenue breakdown by category
   * @param {string} shopId - Restaurant ID
   * @returns {Promise}
   */
  getRevenueByCategory: (shopId) => 
    api.get(`/analytics/revenue-by-category/${shopId}`),

  /**
   * Get customer retention metrics
   * @param {string} shopId - Restaurant ID
   * @returns {Promise}
   */
  getRetentionMetrics: (shopId) => 
    api.get(`/analytics/retention/${shopId}`),
};

export default analyticsService;
