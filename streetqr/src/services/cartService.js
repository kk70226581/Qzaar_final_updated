/**
 * Cart Service
 * Handles shopping cart operations
 */

import api from './api';

export const cartService = {
  /**
   * Get cart
   * @param {string} userId - User ID
   * @returns {Promise}
   */
  getCart: (userId) => 
    api.get(`/cart/${userId}`),

  /**
   * Add item to cart
   * @param {string} userId - User ID
   * @param {object} item - { itemId, quantity, customizations }
   * @returns {Promise}
   */
  addItem: (userId, item) => 
    api.post(`/cart/${userId}/items`, item),

  /**
   * Update cart item
   * @param {string} userId - User ID
   * @param {string} itemId - Item ID
   * @param {object} itemData - { quantity, customizations }
   * @returns {Promise}
   */
  updateItem: (userId, itemId, itemData) => 
    api.put(`/cart/${userId}/items/${itemId}`, itemData),

  /**
   * Remove item from cart
   * @param {string} userId - User ID
   * @param {string} itemId - Item ID
   * @returns {Promise}
   */
  removeItem: (userId, itemId) => 
    api.delete(`/cart/${userId}/items/${itemId}`),

  /**
   * Clear entire cart
   * @param {string} userId - User ID
   * @returns {Promise}
   */
  clearCart: (userId) => 
    api.post(`/cart/${userId}/clear`),

  /**
   * Update quantity
   * @param {string} userId - User ID
   * @param {string} itemId - Item ID
   * @param {number} quantity
   * @returns {Promise}
   */
  updateQuantity: (userId, itemId, quantity) => 
    api.put(`/cart/${userId}/items/${itemId}/quantity`, { quantity }),

  /**
   * Get cart summary
   * @param {string} userId - User ID
   * @returns {Promise}
   */
  getCartSummary: (userId) => 
    api.get(`/cart/${userId}/summary`),

  /**
   * Apply coupon
   * @param {string} userId - User ID
   * @param {string} couponCode
   * @returns {Promise}
   */
  applyCoupon: (userId, couponCode) => 
    api.post(`/cart/${userId}/coupon`, { couponCode }),

  /**
   * Remove coupon
   * @param {string} userId - User ID
   * @returns {Promise}
   */
  removeCoupon: (userId) => 
    api.post(`/cart/${userId}/coupon/remove`),

  /**
   * Add delivery address
   * @param {string} userId - User ID
   * @param {object} address
   * @returns {Promise}
   */
  addDeliveryAddress: (userId, address) => 
    api.post(`/cart/${userId}/delivery-address`, address),

  /**
   * Set delivery address
   * @param {string} userId - User ID
   * @param {string} addressId
   * @returns {Promise}
   */
  setDeliveryAddress: (userId, addressId) => 
    api.put(`/cart/${userId}/delivery-address`, { addressId }),

  /**
   * Get delivery fee
   * @param {string} userId - User ID
   * @returns {Promise}
   */
  getDeliveryFee: (userId) => 
    api.get(`/cart/${userId}/delivery-fee`),

  /**
   * Save cart for later
   * @param {string} userId - User ID
   * @returns {Promise}
   */
  saveForLater: (userId) => 
    api.post(`/cart/${userId}/save`),

  /**
   * Get saved carts
   * @param {string} userId - User ID
   * @returns {Promise}
   */
  getSavedCarts: (userId) => 
    api.get(`/cart/${userId}/saved`),

  /**
   * Restore saved cart
   * @param {string} userId - User ID
   * @param {string} cartId
   * @returns {Promise}
   */
  restoreSavedCart: (userId, cartId) => 
    api.post(`/cart/${userId}/saved/${cartId}/restore`),

  /**
   * Estimate total
   * @param {string} userId - User ID
   * @returns {Promise}
   */
  estimateTotal: (userId) => 
    api.post(`/cart/${userId}/estimate-total`),

  /**
   * Check item availability
   * @param {string} userId - User ID
   * @returns {Promise}
   */
  checkAvailability: (userId) => 
    api.post(`/cart/${userId}/check-availability`),

  /**
   * Get cart history
   * @param {string} userId - User ID
   * @returns {Promise}
   */
  getHistory: (userId) => 
    api.get(`/cart/${userId}/history`),

  /**
   * Share cart
   * @param {string} userId - User ID
   * @returns {Promise}
   */
  shareCart: (userId) => 
    api.post(`/cart/${userId}/share`),

  /**
   * Sync cart
   * @param {string} userId - User ID
   * @returns {Promise}
   */
  syncCart: (userId) => 
    api.post(`/cart/${userId}/sync`),
};

export default cartService;
