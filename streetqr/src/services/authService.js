/**
 * Auth Service
 * Handles authentication and authorization
 */

import api from './api';

export const authService = {
  /**
   * Login with email and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise} { token, user }
   */
  login: (email, password) => 
    api.post(`/auth/login`, { email, password })
      .then(response => {
        if (response.token) {
          api.setAuthToken(response.token);
        }
        return response;
      }),

  /**
   * Logout current user
   * @returns {Promise}
   */
  logout: () => {
    api.clearAuthToken();
    return Promise.resolve();
  },

  /**
   * Register new account
   * @param {object} userData
   * @returns {Promise}
   */
  register: (userData) => 
    api.post(`/auth/register`, userData),

  /**
   * Get current user profile
   * @returns {Promise}
   */
  getCurrentUser: () => 
    api.get(`/auth/me`),

  /**
   * Update user profile
   * @param {object} userData
   * @returns {Promise}
   */
  updateProfile: (userData) => 
    api.put(`/auth/profile`, userData),

  /**
   * Change password
   * @param {string} oldPassword
   * @param {string} newPassword
   * @returns {Promise}
   */
  changePassword: (oldPassword, newPassword) => 
    api.post(`/auth/change-password`, { oldPassword, newPassword }),

  /**
   * Request password reset
   * @param {string} email
   * @returns {Promise}
   */
  requestPasswordReset: (email) => 
    api.post(`/auth/forgot-password`, { email }),

  /**
   * Reset password with token
   * @param {string} token
   * @param {string} newPassword
   * @returns {Promise}
   */
  resetPassword: (token, newPassword) => 
    api.post(`/auth/reset-password`, { token, newPassword }),

  /**
   * Refresh authentication token
   * @returns {Promise}
   */
  refreshToken: () => 
    api.post(`/auth/refresh-token`),

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => 
    api.isAuthenticated(),

  /**
   * Get stored auth token
   * @returns {string|null}
   */
  getToken: () => 
    api.getAuthToken(),

  /**
   * Verify token validity
   * @returns {Promise}
   */
  verifyToken: () => 
    api.get(`/auth/verify`),

  /**
   * Setup 2FA
   * @returns {Promise}
   */
  setup2FA: () => 
    api.post(`/auth/2fa/setup`),

  /**
   * Confirm 2FA code
   * @param {string} code
   * @returns {Promise}
   */
  confirm2FA: (code) => 
    api.post(`/auth/2fa/confirm`, { code }),

  /**
   * Verify 2FA code during login
   * @param {string} code
   * @returns {Promise}
   */
  verify2FA: (code) => 
    api.post(`/auth/2fa/verify`, { code }),

  /**
   * Get user permissions
   * @returns {Promise}
   */
  getPermissions: () => 
    api.get(`/auth/permissions`),

  /**
   * Check if user has permission
   * @param {string} permission
   * @returns {Promise}
   */
  hasPermission: (permission) => 
    api.post(`/auth/check-permission`, { permission }),
};

export default authService;
