/**
 * Inventory Service
 * Handles inventory and stock management
 */

import api from './api';

export const inventoryService = {
  /**
   * Get all inventory items
   * @param {string} shopId - Restaurant ID
   * @param {object} filters - { category, search, sortBy, limit, offset }
   * @returns {Promise}
   */
  getItems: (shopId, filters = {}) => {
    const params = new URLSearchParams(filters);
    return api.get(`/inventory/${shopId}?${params.toString()}`);
  },

  /**
   * Get single inventory item
   * @param {string} shopId - Restaurant ID
   * @param {string} itemId - Item ID
   * @returns {Promise}
   */
  getItem: (shopId, itemId) => 
    api.get(`/inventory/${shopId}/${itemId}`),

  /**
   * Create new inventory item
   * @param {string} shopId - Restaurant ID
   * @param {object} itemData
   * @returns {Promise}
   */
  createItem: (shopId, itemData) => 
    api.post(`/inventory/${shopId}`, itemData),

  /**
   * Update inventory item
   * @param {string} shopId - Restaurant ID
   * @param {string} itemId - Item ID
   * @param {object} itemData
   * @returns {Promise}
   */
  updateItem: (shopId, itemId, itemData) => 
    api.put(`/inventory/${shopId}/${itemId}`, itemData),

  /**
   * Delete inventory item
   * @param {string} shopId - Restaurant ID
   * @param {string} itemId - Item ID
   * @returns {Promise}
   */
  deleteItem: (shopId, itemId) => 
    api.delete(`/inventory/${shopId}/${itemId}`),

  /**
   * Add to stock
   * @param {string} shopId - Restaurant ID
   * @param {string} itemId - Item ID
   * @param {number} amount
   * @returns {Promise}
   */
  addStock: (shopId, itemId, amount) => 
    api.post(`/inventory/${shopId}/${itemId}/add-stock`, { amount }),

  /**
   * Remove from stock
   * @param {string} shopId - Restaurant ID
   * @param {string} itemId - Item ID
   * @param {number} amount
   * @returns {Promise}
   */
  removeStock: (shopId, itemId, amount) => 
    api.post(`/inventory/${shopId}/${itemId}/remove-stock`, { amount }),

  /**
   * Get low stock items
   * @param {string} shopId - Restaurant ID
   * @returns {Promise}
   */
  getLowStockItems: (shopId) => 
    api.get(`/inventory/${shopId}/low-stock`),

  /**
   * Search inventory items
   * @param {string} shopId - Restaurant ID
   * @param {string} query
   * @returns {Promise}
   */
  search: (shopId, query) => 
    api.get(`/inventory/${shopId}/search?q=${query}`),

  /**
   * Bulk update inventory
   * @param {string} shopId - Restaurant ID
   * @param {array} items
   * @returns {Promise}
   */
  bulkUpdate: (shopId, items) => 
    api.post(`/inventory/${shopId}/bulk-update`, { items }),

  /**
   * Export inventory list
   * @param {string} shopId - Restaurant ID
   * @returns {Promise}
   */
  export: (shopId) => 
    api.post(`/inventory/${shopId}/export`, {}),

  /**
   * Get inventory statistics
   * @param {string} shopId - Restaurant ID
   * @returns {Promise}
   */
  getStats: (shopId) => 
    api.get(`/inventory/${shopId}/stats`),

  /**
   * Get expiring items
   * @param {string} shopId - Restaurant ID
   * @param {number} daysAhead - Items expiring within X days
   * @returns {Promise}
   */
  getExpiringItems: (shopId, daysAhead = 7) => 
    api.get(`/inventory/${shopId}/expiring?days=${daysAhead}`),

  /**
   * Get stock history
   * @param {string} shopId - Restaurant ID
   * @param {string} itemId - Item ID
   * @returns {Promise}
   */
  getStockHistory: (shopId, itemId) => 
    api.get(`/inventory/${shopId}/${itemId}/history`),

  /**
   * Get dashboard view
   * @param {string} shopId - Restaurant ID
   * @returns {Promise}
   */
  getDashboard: (shopId) => 
    api.get(`/inventory/${shopId}/dashboard`),
};

export default inventoryService;
