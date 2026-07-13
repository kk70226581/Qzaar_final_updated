import { CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const toastStyles = {
  success: {
    icon: CheckCircle2,
    color: 'success',
    bg: 'bg-success-50 dark:bg-success-900/20',
    text: 'text-success-900 dark:text-success-400',
  },
  error: {
    icon: XCircle,
    color: 'danger',
    bg: 'bg-danger-50 dark:bg-danger-900/20',
    text: 'text-danger-900 dark:text-danger-400',
  },
  info: {
    icon: Info,
    color: 'info',
    bg: 'bg-info-50 dark:bg-info-900/20',
    text: 'text-info-900 dark:text-info-400',
  },
  warning: {
    icon: AlertCircle,
    color: 'warning',
    bg: 'bg-warning-50 dark:bg-warning-900/20',
    text: 'text-warning-900 dark:text-warning-400',
  },
};

const Toast = {
  success: (message, options = {}) => {
    const { icon: Icon, bg, text } = toastStyles.success;
    toast.custom((t) => (
      <div className={`${bg} ${text} px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 transform transition-all`}>
        <Icon size={20} />
        <span className="font-medium">{message}</span>
      </div>
    ), options);
  },

  error: (message, options = {}) => {
    const { icon: Icon, bg, text } = toastStyles.error;
    toast.custom((t) => (
      <div className={`${bg} ${text} px-4 py-3 rounded-lg shadow-lg flex items-center gap-3`}>
        <Icon size={20} />
        <span className="font-medium">{message}</span>
      </div>
    ), options);
  },

  info: (message, options = {}) => {
    const { icon: Icon, bg, text } = toastStyles.info;
    toast.custom((t) => (
      <div className={`${bg} ${text} px-4 py-3 rounded-lg shadow-lg flex items-center gap-3`}>
        <Icon size={20} />
        <span className="font-medium">{message}</span>
      </div>
    ), options);
  },

  warning: (message, options = {}) => {
    const { icon: Icon, bg, text } = toastStyles.warning;
    toast.custom((t) => (
      <div className={`${bg} ${text} px-4 py-3 rounded-lg shadow-lg flex items-center gap-3`}>
        <Icon size={20} />
        <span className="font-medium">{message}</span>
      </div>
    ), options);
  },

  dismiss: (t) => toast.dismiss(t),
};

export default Toast;
