/**
 * Services Index
 * Centralized export of all service modules
 */

export { default as api } from './api';
export { default as analyticsService } from './analyticsService';
export { default as settingsService } from './settingsService';
export { default as inventoryService } from './inventoryService';
export { default as authService } from './authService';
export { default as menuService } from './menuService';
export { default as orderService } from './orderService';
export { default as cartService } from './cartService';
export { default as paymentService } from './paymentService';

// Export as object for convenience
export const services = {
  api: require('./api').default,
  analytics: require('./analyticsService').default,
  settings: require('./settingsService').default,
  inventory: require('./inventoryService').default,
  auth: require('./authService').default,
  menu: require('./menuService').default,
  order: require('./orderService').default,
  cart: require('./cartService').default,
  payment: require('./paymentService').default,
};
