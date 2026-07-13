import React from 'react';
import { motion } from 'framer-motion';
import ModernCard from '../ui/ModernCard';
import '../../styles/features/FeatureCard.css';

/**
 * FeatureCard - Feature showcase card component
 * 
 * Features:
 * - Icon support
 * - Title and description
 * - Optional CTA
 * - Multiple color schemes
 * - Hover effects
 * - Responsive sizing
 * - Dark mode support
 * 
 * @example
 * <FeatureCard
 *   icon={<DeliveryIcon />}
 *   title="Fast Delivery"
 *   description="Get your food in 30 minutes or less"
 *   color="primary"
 * />
 */

const FeatureCard = ({
  icon,
  title,
  description,
  cta,
  color = 'primary',
  className = '',
}) => {
  const iconColor = {
    primary: 'var(--primary-500)',
    success: 'var(--success-500)',
    warning: 'var(--warning-500)',
    info: 'var(--info-500)',
  }[color];

  return (
    <motion.div
      className={`feature-card ${className}`}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <ModernCard variant="elevated" className="feature-card__inner">
        {/* ICON */}
        {icon && (
          <div className="feature-card__icon-wrapper">
            <div className="feature-card__icon" style={{ color: iconColor }}>
              {icon}
            </div>
          </div>
        )}

        {/* CONTENT */}
        <div className="feature-card__content">
          {/* TITLE */}
          {title && (
            <h3 className="feature-card__title">{title}</h3>
          )}

          {/* DESCRIPTION */}
          {description && (
            <p className="feature-card__description">{description}</p>
          )}

          {/* CTA */}
          {cta && (
            <div className="feature-card__cta">
              {cta}
            </div>
          )}
        </div>
      </ModernCard>
    </motion.div>
  );
};

export default FeatureCard;
