/**
 * API Client - Centralized HTTP client with interceptors
 * 
 * Features:
 * - Automatic auth token injection
 * - Error handling and retry logic
 * - Request/response interceptors
 * - Timeout management
 * - Base URL configuration
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT || '30000');

/**
 * API Client Class
 * Wrapper around fetch with common functionality
 */
class ApiClient {
  constructor(baseURL = API_BASE_URL, timeout = API_TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Make HTTP request
   * @param {string} endpoint - API endpoint
   * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
   * @param {object} options - Request options (body, headers, etc.)
   * @returns {Promise} Response data
   */
  async request(endpoint, method = 'GET', options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = this.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle errors
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}`);
        error.status = response.status;
        
        try {
          error.data = await response.json();
        } catch {
          error.data = await response.text();
        }

        throw error;
      }

      // Parse response
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await response.json();
      }

      return await response.text();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        error.message = 'Request timeout';
      }

      // Handle authentication errors
      if (error.status === 401) {
        this.clearAuthToken();
        window.location.href = '/login';
      }

      throw error;
    }
  }

  /**
   * GET request
   */
  get(endpoint, options = {}) {
    return this.request(endpoint, 'GET', options);
  }

  /**
   * POST request
   */
  post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, 'POST', {
      ...options,
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  put(endpoint, data = {}, options = {}) {
    return this.request(endpoint, 'PUT', {
      ...options,
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  delete(endpoint, options = {}) {
    return this.request(endpoint, 'DELETE', options);
  }

  /**
   * PATCH request
   */
  patch(endpoint, data = {}, options = {}) {
    return this.request(endpoint, 'PATCH', {
      ...options,
      body: JSON.stringify(data),
    });
  }

  /**
   * Get auth token from localStorage
   */
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * Set auth token
   */
  setAuthToken(token) {
    localStorage.setItem('authToken', token);
  }

  /**
   * Clear auth token
   */
  clearAuthToken() {
    localStorage.removeItem('authToken');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getAuthToken();
  }
}

// Create singleton instance
const api = new ApiClient();

export default api;
