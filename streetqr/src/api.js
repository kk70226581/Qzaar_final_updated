import axios from 'axios';
import { io } from 'socket.io-client';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// ✅ Axios Instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ✅ WebSocket Instance
let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(API_BASE_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });
  }
  return socket;
};

export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// ✅ Payment APIs
export const createRazorpayOrder = async (payload) => {
  return apiClient.post('/api/create-razorpay-order', payload);
};

export const verifyPayment = async (payload) => {
  return apiClient.post('/api/verify-payment', payload);
};

// ✅ Order APIs
export const createOrder = async (payload) => {
  return apiClient.post('/api/order', payload);
};

export const getOrder = async (orderId) => {
  return apiClient.get(`/api/order/${orderId}`);
};

export const getOrders = async (shopId) => {
  return apiClient.get(`/api/orders/${shopId}`);
};

export const getOrderHistory = async (customerEmail) => {
  return apiClient.get(`/api/order-history/${customerEmail}`);
};

export const updateOrderStatus = async (orderId, status) => {
  return apiClient.put(`/api/order-status/${orderId}`, { status });
};

export const cancelOrder = async (orderId, reason) => {
  return apiClient.post(`/api/cancel-order/${orderId}`, { reason });
};

// ✅ Coupon APIs
export const validateCoupon = async (shopId, code, cartTotal) => {
  return apiClient.post('/api/validate-coupon', { shopId, code, cartTotal });
};

export const getCoupons = async (shopId) => {
  return apiClient.get(`/api/coupons/${shopId}`);
};

// ✅ Menu APIs
export const getMenu = async (shopId) => {
  return apiClient.get(`/api/menu/${shopId}`);
};

// ✅ Dashboard APIs
export const getDashboard = async (shopId) => {
  return apiClient.get(`/api/dashboard/${shopId}`);
};
