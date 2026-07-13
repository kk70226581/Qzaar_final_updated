import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Search, 
  Inbox,
  Heart,
  MapPin,
} from 'lucide-react';
import { ModernButton } from './index';
import '../../styles/components/ModernEmpty.css';

/**
 * ModernEmpty - Empty state component
 * 
 * Features:
 * - 5 pre-built empty state types
 * - Custom icon support
 * - Primary and secondary CTA buttons
 * - Smooth animations
 * - Dark mode support
 * - Mobile responsive
 * - Accessibility compliant
 * 
 * @example
 * <ModernEmpty
 *   type="cart"
 *   title="Your cart is empty"
 *   description="Add items to get started"
 *   primaryCTA={{
 *     label: "Browse Menu",
 *     onClick: () => navigate('/menu')
 *   }}
 * />
 */

const emptyStates = {
  cart: {
    icon: ShoppingCart,
    title: 'Your cart is empty',
    description: 'Browse delicious items and add them to cart',
  },
  search: {
    icon: Search,
    title: 'No results found',
    description: 'Try adjusting your search or filters',
  },
  orders: {
    icon: Inbox,
    title: 'No orders yet',
    description: 'Your order history will appear here',
  },
  favorites: {
    icon: Heart,
    title: 'No favorites yet',
    description: 'Save your favorite items for quick access',
  },
  location: {
    icon: MapPin,
    title: 'Location not available',
    description: 'Please enable location to see nearby restaurants',
  },
};

const ModernEmpty = ({
  type = 'search',
  icon: CustomIcon,
  title,
  description,
  primaryCTA,
  secondaryCTA,
  illustration,
  className = '',
}) => {
  const defaultState = emptyStates[type] || emptyStates.search;
  const Icon = CustomIcon || defaultState.icon;
  
  const displayTitle = title || defaultState.title;
  const displayDescription = description || defaultState.description;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
      className={`modern-empty ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      role="status"
      aria-label={displayTitle}
    >
      {/* Illustration or Icon */}
      <motion.div
        className="modern-empty__visual"
        variants={itemVariants}
      >
        {illustration ? (
          <div className="modern-empty__illustration">
            {illustration}
          </div>
        ) : (
          <div className="modern-empty__icon-wrapper">
            <Icon className="modern-empty__icon" size={64} />
          </div>
        )}
      </motion.div>

      {/* Title */}
      <motion.h2
        className="modern-empty__title"
        variants={itemVariants}
      >
        {displayTitle}
      </motion.h2>

      {/* Description */}
      <motion.p
        className="modern-empty__description"
        variants={itemVariants}
      >
        {displayDescription}
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        className="modern-empty__actions"
        variants={itemVariants}
      >
        {primaryCTA && (
          <ModernButton
            variant="primary"
            size="lg"
            onClick={primaryCTA.onClick}
            className="modern-empty__cta-primary"
          >
            {primaryCTA.label}
          </ModernButton>
        )}

        {secondaryCTA && (
          <ModernButton
            variant="secondary"
            size="lg"
            onClick={secondaryCTA.onClick}
            className="modern-empty__cta-secondary"
          >
            {secondaryCTA.label}
          </ModernButton>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ModernEmpty;
