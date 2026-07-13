/**
 * Payment Service
 * Handles payment processing
 */

import api from './api';

export const paymentService = {
  /**
   * Process payment
   * @param {object} paymentData
   * @returns {Promise}
   */
  processPayment: (paymentData) => 
    api.post(`/payments/process`, paymentData),

  /**
   * Get payment status
   * @param {string} transactionId
   * @returns {Promise}
   */
  getPaymentStatus: (transactionId) => 
    api.get(`/payments/${transactionId}`),

  /**
   * Validate card
   * @param {object} cardData
   * @returns {Promise}
   */
  validateCard: (cardData) => 
    api.post(`/payments/validate-card`, cardData),

  /**
   * Initiate UPI payment
   * @param {object} upiData
   * @returns {Promise}
   */
  initiateUPI: (upiData) => 
    api.post(`/payments/upi/initiate`, upiData),

  /**
   * Verify UPI payment
   * @param {string} transactionId
   * @returns {Promise}
   */
  verifyUPI: (transactionId) => 
    api.get(`/payments/upi/verify/${transactionId}`),

  /**
   * Save card for future use
   * @param {object} cardData
   * @returns {Promise}
   */
  saveCard: (cardData) => 
    api.post(`/payments/cards/save`, cardData),

  /**
   * Get saved cards
   * @returns {Promise}
   */
  getSavedCards: () => 
    api.get(`/payments/cards`),

  /**
   * Delete saved card
   * @param {number} cardId
   * @returns {Promise}
   */
  deleteCard: (cardId) => 
    api.delete(`/payments/cards/${cardId}`),

  /**
   * Add wallet
   * @param {object} walletData
   * @returns {Promise}
   */
  addWallet: (walletData) => 
    api.post(`/payments/wallet/add`, walletData),

  /**
   * Get wallet balance
   * @returns {Promise}
   */
  getWalletBalance: () => 
    api.get(`/payments/wallet/balance`),

  /**
   * Use wallet for payment
   * @param {object} paymentData
   * @returns {Promise}
   */
  useWallet: (paymentData) => 
    api.post(`/payments/wallet/use`, paymentData),

  /**
   * Get payment history
   * @returns {Promise}
   */
  getHistory: () => 
    api.get(`/payments/history`),

  /**
   * Refund payment
   * @param {string} transactionId
   * @param {string} reason
   * @returns {Promise}
   */
  refundPayment: (transactionId, reason) => 
    api.post(`/payments/${transactionId}/refund`, { reason }),

  /**
   * Get refund status
   * @param {string} transactionId
   * @returns {Promise}
   */
  getRefundStatus: (transactionId) => 
    api.get(`/payments/${transactionId}/refund-status`),

  /**
   * Initiate subscription
   * @param {object} subscriptionData
   * @returns {Promise}
   */
  initiateSubscription: (subscriptionData) => 
    api.post(`/payments/subscription/initiate`, subscriptionData),

  /**
   * Cancel subscription
   * @param {number} subscriptionId
   * @returns {Promise}
   */
  cancelSubscription: (subscriptionId) => 
    api.post(`/payments/subscription/${subscriptionId}/cancel`),

  /**
   * Get transaction receipt
   * @param {string} transactionId
   * @returns {Promise}
   */
  getReceipt: (transactionId) => 
    api.get(`/payments/${transactionId}/receipt`),

  /**
   * Download receipt PDF
   * @param {string} transactionId
   * @returns {Promise}
   */
  downloadReceipt: (transactionId) => 
    api.post(`/payments/${transactionId}/download-receipt`),

  /**
   * Get available payment methods
   * @returns {Promise}
   */
  getAvailableMethods: () => 
    api.get(`/payments/methods`),

  /**
   * Validate payment gateway
   * @returns {Promise}
   */
  validateGateway: () => 
    api.get(`/payments/validate-gateway`),

  /**
   * Calculate tax
   * @param {object} orderData
   * @returns {Promise}
   */
  calculateTax: (orderData) => 
    api.post(`/payments/calculate-tax`, orderData),

  /**
   * Get payment intent
   * @param {object} intentData
   * @returns {Promise}
   */
  getPaymentIntent: (intentData) => 
    api.post(`/payments/intent`, intentData),
};

export default paymentService;
