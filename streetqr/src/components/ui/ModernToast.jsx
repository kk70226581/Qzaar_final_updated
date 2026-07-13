import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import '../../styles/components/ModernToast.css';

/**
 * ModernToast - Toast notification component
 * 
 * Features:
 * - 4 variants: success, error, info, warning
 * - Auto-dismiss or manual close
 * - Smooth animations
 * - Icon support
 * - Multiple toast management via ToastContainer
 * - Accessible with ARIA labels
 * - Mobile responsive
 * - Dark mode support
 * 
 * @example
 * // Single toast
 * <ModernToast
 *   variant="success"
 *   title="Success"
 *   message="Your order has been placed"
 *   duration={3000}
 *   onClose={() => {}}
 * />
 * 
 * // Using hook (recommended)
 * const { addToast } = useToast();
 * addToast({
 *   variant: 'success',
 *   title: 'Success',
 *   message: 'Order placed successfully'
 * });
 */

const iconMap = {
  success: <CheckCircle size={20} />,
  error: <AlertCircle size={20} />,
  info: <Info size={20} />,
  warning: <AlertTriangle size={20} />,
};

const ModernToast = ({
  id,
  variant = 'info',
  title,
  message,
  duration = 3000,
  onClose = () => {},
  action,
  dismissible = true,
}) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <motion.div
      className={`modern-toast modern-toast--${variant}`}
      initial={{ opacity: 0, y: -20, x: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      role="alert"
      aria-live="polite"
      aria-label={`${variant} notification: ${title}`}
    >
      {/* Icon */}
      <div className="modern-toast__icon">
        {iconMap[variant]}
      </div>

      {/* Content */}
      <div className="modern-toast__content">
        {title && (
          <h3 className="modern-toast__title">
            {title}
          </h3>
        )}
        {message && (
          <p className="modern-toast__message">
            {message}
          </p>
        )}
      </div>

      {/* Action Button */}
      {action && (
        <button
          className="modern-toast__action"
          onClick={() => {
            action.onClick?.();
            onClose();
          }}
        >
          {action.label}
        </button>
      )}

      {/* Close Button */}
      {dismissible && (
        <button
          className="modern-toast__close"
          onClick={onClose}
          aria-label="Close notification"
        >
          <X size={18} />
        </button>
      )}
    </motion.div>
  );
};

/**
 * ToastContainer - Manages multiple toasts
 * 
 * @example
 * <ToastContainer position="top-right" />
 */
export const ToastContainer = ({ position = 'top-right' }) => {
  const [toasts, setToasts] = React.useState([]);

  // Expose addToast globally via window object or context
  React.useEffect(() => {
    window.addToast = (toast) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { ...toast, id }]);
      return id;
    };

    window.removeToast = (id) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return () => {
      delete window.addToast;
      delete window.removeToast;
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className={`modern-toast-container modern-toast-container--${position}`}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <ModernToast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

/**
 * useToast Hook - For easier toast management
 * 
 * @example
 * const { addToast } = useToast();
 * addToast({
 *   variant: 'success',
 *   title: 'Success',
 *   message: 'Operation completed'
 * });
 */
export const useToast = () => {
  const addToast = React.useCallback((toast) => {
    if (window.addToast) {
      return window.addToast(toast);
    }
  }, []);

  const removeToast = React.useCallback((id) => {
    if (window.removeToast) {
      window.removeToast(id);
    }
  }, []);

  return { addToast, removeToast };
};

export default ModernToast;
