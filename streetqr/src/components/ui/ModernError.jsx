import React from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Network,
  Lock,
  Clock,
  Zap,
} from 'lucide-react';
import { ModernButton } from './index';
import '../../styles/components/ModernError.css';

/**
 * ModernError - Error state component
 * 
 * Features:
 * - 5 error types: general, network, permission, timeout, server
 * - Custom icon support
 * - Error code display
 * - Detailed error messages
 * - Primary and secondary CTA buttons
 * - Smooth animations
 * - Dark mode support
 * - Mobile responsive
 * - Accessibility compliant
 * 
 * @example
 * <ModernError
 *   type="network"
 *   title="Connection Error"
 *   message="Unable to connect to the server"
 *   errorCode="ERR_NETWORK"
 *   primaryCTA={{
 *     label: "Retry",
 *     onClick: () => retry()
 *   }}
 * />
 */

const errorTypes = {
  general: {
    icon: AlertTriangle,
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Please try again.',
    color: 'danger',
  },
  network: {
    icon: Network,
    title: 'Connection Error',
    description: 'Unable to connect to the server. Check your internet connection.',
    color: 'warning',
  },
  permission: {
    icon: Lock,
    title: 'Access Denied',
    description: 'You don\'t have permission to access this resource.',
    color: 'danger',
  },
  timeout: {
    icon: Clock,
    title: 'Request Timeout',
    description: 'The request took too long. Please try again.',
    color: 'warning',
  },
  server: {
    icon: Zap,
    title: 'Server Error',
    description: 'The server is experiencing issues. Please try again later.',
    color: 'danger',
  },
};

const ModernError = ({
  type = 'general',
  icon: CustomIcon,
  title,
  message,
  description,
  errorCode,
  primaryCTA,
  secondaryCTA,
  showDetails = false,
  details,
  className = '',
}) => {
  const [showDetailsExpanded, setShowDetailsExpanded] = React.useState(showDetails);
  const errorConfig = errorTypes[type] || errorTypes.general;
  const Icon = CustomIcon || errorConfig.icon;

  const displayTitle = title || errorConfig.title;
  const displayDescription = message || description || errorConfig.description;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  };

  return (
    <motion.div
      className={`modern-error modern-error--${errorConfig.color} ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      role="alert"
      aria-label={displayTitle}
      aria-describedby="error-description"
    >
      {/* Icon */}
      <motion.div
        className="modern-error__visual"
        variants={itemVariants}
      >
        <div className="modern-error__icon-wrapper">
          <Icon className="modern-error__icon" size={64} />
        </div>
      </motion.div>

      {/* Title */}
      <motion.h2
        className="modern-error__title"
        variants={itemVariants}
      >
        {displayTitle}
      </motion.h2>

      {/* Description */}
      <motion.p
        className="modern-error__description"
        variants={itemVariants}
        id="error-description"
      >
        {displayDescription}
      </motion.p>

      {/* Error Code */}
      {errorCode && (
        <motion.div
          className="modern-error__code"
          variants={itemVariants}
        >
          <span className="modern-error__code-label">Error Code:</span>
          <code className="modern-error__code-value">{errorCode}</code>
        </motion.div>
      )}

      {/* Details Section */}
      {details && (
        <motion.div
          className="modern-error__details-wrapper"
          variants={itemVariants}
        >
          <button
            className="modern-error__details-toggle"
            onClick={() => setShowDetailsExpanded(!showDetailsExpanded)}
            aria-expanded={showDetailsExpanded}
            aria-controls="error-details"
          >
            {showDetailsExpanded ? '▼' : '▶'} Details
          </button>

          {showDetailsExpanded && (
            <motion.pre
              className="modern-error__details"
              id="error-details"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {typeof details === 'string' ? details : JSON.stringify(details, null, 2)}
            </motion.pre>
          )}
        </motion.div>
      )}

      {/* CTA Buttons */}
      <motion.div
        className="modern-error__actions"
        variants={itemVariants}
      >
        {primaryCTA && (
          <ModernButton
            variant="primary"
            size="lg"
            onClick={primaryCTA.onClick}
            className="modern-error__cta-primary"
          >
            {primaryCTA.label}
          </ModernButton>
        )}

        {secondaryCTA && (
          <ModernButton
            variant="secondary"
            size="lg"
            onClick={secondaryCTA.onClick}
            className="modern-error__cta-secondary"
          >
            {secondaryCTA.label}
          </ModernButton>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ModernError;
