/**
 * Settings Service
 * Handles restaurant settings and configuration
 */

import api from './api';

export const settingsService = {
  /**
   * Get all settings
   * @param {string} shopId - Restaurant ID
   * @returns {Promise}
   */
  getSettings: (shopId) => 
    api.get(`/settings/${shopId}/all`),

  /**
   * Update restaurant profile
   * @param {string} shopId - Restaurant ID
   * @param {object} profileData
   * @returns {Promise}
   */
  updateProfile: (shopId, profileData) => 
    api.put(`/settings/${shopId}/profile`, profileData),

  /**
   * Get profile settings
   * @param {string} shopId - Restaurant ID
   * @returns {Promise}
   */
  getProfileSettings: (shopId) => 
    api.get(`/settings/${shopId}/profile`),

  /**
   * Update operating hours
   * @param {string} shopId - Restaurant ID
   * @param {object} hoursData
   * @returns {Promise}
   */
  updateOperatingHours: (shopId, hoursData) => 
    api.put(`/settings/${shopId}/hours`, hoursData),

  /**
   * Get operating hours
   * @param {string} shopId - Restaurant ID
   * @returns {Promise}
   */
  getOperatingHours: (shopId) => 
    api.get(`/settings/${shopId}/hours`),

  /**
   * Update payment methods
   * @param {string} shopId - Restaurant ID
   * @param {object} paymentData
   * @returns {Promise}
   */
  updatePaymentMethods: (shopId, paymentData) => 
    api.put(`/settings/${shopId}/payments`, paymentData),

  /**
   * Get payment methods
   * @param {string} shopId - Restaurant ID
   * @returns {Promise}
   */
  getPaymentMethods: (shopId) => 
    api.get(`/settings/${shopId}/payments`),

  /**
   * Update notification preferences
   * @param {string} shopId - Restaurant ID
   * @param {object} notificationData
   * @returns {Promise}
   */
  updateNotificationPreferences: (shopId, notificationData) => 
    api.put(`/settings/${shopId}/notifications`, notificationData),

  /**
   * Get notification preferences
   * @param {string} shopId - Restaurant ID
   * @returns {Promise}
   */
  getNotificationPreferences: (shopId) => 
    api.get(`/settings/${shopId}/notifications`),

  /**
   * Update delivery settings
   * @param {string} shopId - Restaurant ID
   * @param {object} deliveryData
   * @returns {Promise}
   */
  updateDeliverySettings: (shopId, deliveryData) => 
    api.put(`/settings/${shopId}/delivery`, deliveryData),

  /**
   * Get delivery settings
   * @param {string} shopId - Restaurant ID
   * @returns {Promise}
   */
  getDeliverySettings: (shopId) => 
    api.get(`/settings/${shopId}/delivery`),

  /**
   * Get appearance settings
   * @param {string} shopId - Restaurant ID
   * @returns {Promise}
   */
  getAppearanceSettings: (shopId) => 
    api.get(`/settings/${shopId}/appearance`),

  /**
   * Update appearance settings
   * @param {string} shopId - Restaurant ID
   * @param {object} appearanceData
   * @returns {Promise}
   */
  updateAppearanceSettings: (shopId, appearanceData) => 
    api.put(`/settings/${shopId}/appearance`, appearanceData),

  /**
   * Get integrations
   * @param {string} shopId - Restaurant ID
   * @returns {Promise}
   */
  getIntegrations: (shopId) => 
    api.get(`/settings/${shopId}/integrations`),

  /**
   * Update integrations
   * @param {string} shopId - Restaurant ID
   * @param {object} integrationData
   * @returns {Promise}
   */
  updateIntegrations: (shopId, integrationData) => 
    api.put(`/settings/${shopId}/integrations`, integrationData),
};

export default settingsService;
