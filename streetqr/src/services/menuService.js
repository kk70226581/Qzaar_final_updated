/**
 * Menu Service
 * Handles menu items and categories
 */

import api from './api';

export const menuService = {
  /**
   * Get all menu categories
   * @param {string} shopId - Restaurant ID
   * @returns {Promise}
   */
  getCategories: (shopId) => 
    api.get(`/menu/categories/${shopId}`),

  /**
   * Get menu items with filters
   * @param {string} shopId - Restaurant ID
   * @param {object} filters - { category, search, minPrice, maxPrice, rating, prepTime }
   * @returns {Promise}
   */
  getItems: (shopId, filters = {}) => {
    const params = new URLSearchParams(filters);
    return api.get(`/menu/items/${shopId}?${params.toString()}`);
  },

  /**
   * Get single menu item
   * @param {string} shopId - Restaurant ID
   * @param {string} itemId - Item ID
   * @returns {Promise}
   */
  getItem: (shopId, itemId) => 
    api.get(`/menu/items/${shopId}/${itemId}`),

  /**
   * Get items by category
   * @param {string} shopId - Restaurant ID
   * @param {string} categoryName - Category name
   * @returns {Promise}
   */
  getItemsByCategory: (shopId, categoryName) => 
    api.get(`/menu/categories/${shopId}/${categoryName}/items`),

  /**
   * Search menu items
   * @param {string} shopId - Restaurant ID
   * @param {string} query - Search query
   * @returns {Promise}
   */
  searchItems: (shopId, query) => 
    api.get(`/menu/search/${shopId}?q=${encodeURIComponent(query)}`),

  /**
   * Get recommended items
   * @param {string} shopId - Restaurant ID
   * @returns {Promise}
   */
  getRecommended: (shopId) => 
    api.get(`/menu/recommended/${shopId}`),

  /**
   * Get bestselling items
   * @param {string} shopId - Restaurant ID
   * @returns {Promise}
   */
  getBestsellers: (shopId) => 
    api.get(`/menu/bestsellers/${shopId}`),

  /**
   * Get item customizations
   * @param {string} shopId - Restaurant ID
   * @param {string} itemId - Item ID
   * @returns {Promise}
   */
  getCustomizations: (shopId, itemId) => 
    api.get(`/menu/items/${shopId}/${itemId}/customizations`),

  /**
   * Get item add-ons
   * @param {string} shopId - Restaurant ID
   * @param {string} itemId - Item ID
   * @returns {Promise}
   */
  getAddOns: (shopId, itemId) => 
    api.get(`/menu/items/${shopId}/${itemId}/add-ons`),

  /**
   * Get item reviews
   * @param {string} shopId - Restaurant ID
   * @param {string} itemId - Item ID
   * @param {object} options - { limit, offset, sortBy }
   * @returns {Promise}
   */
  getReviews: (shopId, itemId, options = {}) => {
    const params = new URLSearchParams(options);
    return api.get(`/menu/items/${shopId}/${itemId}/reviews?${params.toString()}`);
  },

  /**
   * Add item review
   * @param {string} shopId - Restaurant ID
   * @param {string} itemId - Item ID
   * @param {object} reviewData - { rating, comment }
   * @returns {Promise}
   */
  addReview: (shopId, itemId, reviewData) => 
    api.post(`/menu/items/${shopId}/${itemId}/reviews`, reviewData),

  /**
   * Create menu item (admin)
   * @param {string} shopId - Restaurant ID
   * @param {object} itemData
   * @returns {Promise}
   */
  createItem: (shopId, itemData) => 
    api.post(`/menu/items/${shopId}`, itemData),

  /**
   * Update menu item (admin)
   * @param {string} shopId - Restaurant ID
   * @param {string} itemId - Item ID
   * @param {object} itemData
   * @returns {Promise}
   */
  updateItem: (shopId, itemId, itemData) => 
    api.put(`/menu/items/${shopId}/${itemId}`, itemData),

  /**
   * Delete menu item (admin)
   * @param {string} shopId - Restaurant ID
   * @param {string} itemId - Item ID
   * @returns {Promise}
   */
  deleteItem: (shopId, itemId) => 
    api.delete(`/menu/items/${shopId}/${itemId}`),

  /**
   * Bulk upload menu items (admin)
   * @param {string} shopId - Restaurant ID
   * @param {FormData} formData - File upload
   * @returns {Promise}
   */
  bulkUpload: (shopId, formData) => 
    api.post(`/menu/bulk-upload/${shopId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  /**
   * Export menu (admin)
   * @param {string} shopId - Restaurant ID
   * @returns {Promise}
   */
  exportMenu: (shopId) => 
    api.post(`/menu/export/${shopId}`, {}),

  /**
   * Get menu statistics
   * @param {string} shopId - Restaurant ID
   * @returns {Promise}
   */
  getStatistics: (shopId) => 
    api.get(`/menu/statistics/${shopId}`),

  /**
   * Update item availability
   * @param {string} shopId - Restaurant ID
   * @param {string} itemId - Item ID
   * @param {boolean} isAvailable
   * @returns {Promise}
   */
  updateAvailability: (shopId, itemId, isAvailable) => 
    api.put(`/menu/items/${shopId}/${itemId}/availability`, { isAvailable }),
};

export default menuService;
