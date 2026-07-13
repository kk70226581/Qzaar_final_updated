/**
 * Order Service
 * Handles order creation, tracking, and management
 */

import api from './api';

export const orderService = {
  /**
   * Create new order
   * @param {string} shopId - Restaurant ID
   * @param {object} orderData
   * @returns {Promise}
   */
  createOrder: (shopId, orderData) => 
    api.post(`/orders/${shopId}`, orderData),

  /**
   * Get order by ID
   * @param {string} shopId - Restaurant ID
   * @param {string} orderId
   * @returns {Promise}
   */
  getOrder: (shopId, orderId) => 
    api.get(`/orders/${shopId}/${orderId}`),

  /**
   * Get all orders for shop
   * @param {string} shopId - Restaurant ID
   * @param {object} filters - { status, limit, offset }
   * @returns {Promise}
   */
  getOrders: (shopId, filters = {}) => {
    const params = new URLSearchParams(filters);
    return api.get(`/orders/${shopId}?${params.toString()}`);
  },

  /**
   * Get user's orders
   * @param {string} userId - User ID
   * @returns {Promise}
   */
  getUserOrders: (userId) => 
    api.get(`/orders/user/${userId}`),

  /**
   * Update order status
   * @param {string} shopId - Restaurant ID
   * @param {string} orderId
   * @param {string} status
   * @returns {Promise}
   */
  updateStatus: (shopId, orderId, status) => 
    api.put(`/orders/${shopId}/${orderId}/status`, { status }),

  /**
   * Cancel order
   * @param {string} shopId - Restaurant ID
   * @param {string} orderId
   * @param {string} reason
   * @returns {Promise}
   */
  cancelOrder: (shopId, orderId, reason = '') => 
    api.post(`/orders/${shopId}/${orderId}/cancel`, { reason }),

  /**
   * Get order timeline
   * @param {string} shopId - Restaurant ID
   * @param {string} orderId
   * @returns {Promise}
   */
  getTimeline: (shopId, orderId) => 
    api.get(`/orders/${shopId}/${orderId}/timeline`),

  /**
   * Get order receipt
   * @param {string} shopId - Restaurant ID
   * @param {string} orderId
   * @returns {Promise}
   */
  getReceipt: (shopId, orderId) => 
    api.get(`/orders/${shopId}/${orderId}/receipt`),

  /**
   * Add order review
   * @param {string} shopId - Restaurant ID
   * @param {string} orderId
   * @param {object} reviewData
   * @returns {Promise}
   */
  addReview: (shopId, orderId, reviewData) => 
    api.post(`/orders/${shopId}/${orderId}/review`, reviewData),

  /**
   * Repeat previous order
   * @param {string} shopId - Restaurant ID
   * @param {string} orderId
   * @returns {Promise}
   */
  repeatOrder: (shopId, orderId) => 
    api.post(`/orders/${shopId}/${orderId}/repeat`),

  /**
   * Apply coupon to order
   * @param {string} shopId - Restaurant ID
   * @param {string} orderId
   * @param {string} couponCode
   * @returns {Promise}
   */
  applyCoupon: (shopId, orderId, couponCode) => 
    api.post(`/orders/${shopId}/${orderId}/apply-coupon`, { couponCode }),

  /**
   * Remove coupon from order
   * @param {string} shopId - Restaurant ID
   * @param {string} orderId
   * @returns {Promise}
   */
  removeCoupon: (shopId, orderId) => 
    api.post(`/orders/${shopId}/${orderId}/remove-coupon`),

  /**
   * Track delivery in real-time
   * @param {string} shopId - Restaurant ID
   * @param {string} orderId
   * @returns {Promise}
   */
  trackDelivery: (shopId, orderId) => 
    api.get(`/orders/${shopId}/${orderId}/tracking`),

  /**
   * Get order statistics (admin)
   * @param {string} shopId - Restaurant ID
   * @returns {Promise}
   */
  getStatistics: (shopId) => 
    api.get(`/orders/stats/${shopId}`),

  /**
   * Export orders (admin)
   * @param {string} shopId - Restaurant ID
   * @returns {Promise}
   */
  exportOrders: (shopId) => 
    api.post(`/orders/${shopId}/export`, {}),

  /**
   * Validate order before creation
   * @param {string} shopId - Restaurant ID
   * @param {object} orderData
   * @returns {Promise}
   */
  validateOrder: (shopId, orderData) => 
    api.post(`/orders/${shopId}/validate`, orderData),
};

export default orderService;
