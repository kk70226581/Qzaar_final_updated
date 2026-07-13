import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import '../../styles/components/ModernButton.css';

/**
 * ModernButton - Premium button component with multiple variants
 * 
 * Features:
 * - 4 variants: primary, secondary, ghost, danger, success
 * - 5 sizes: xs, sm, md, lg, xl
 * - Icon support (left/right positioning)
 * - Loading state with spinner
 * - Full-width option
 * - Hover/active animations
 * - Accessibility support
 * 
 * @example
 * <ModernButton variant="primary" size="lg" fullWidth>
 *   Order Now
 * </ModernButton>
 * 
 * <ModernButton 
 *   variant="primary" 
 *   icon={ShoppingCart} 
 *   isLoading={loading}
 *   onClick={handleOrder}
 * >
 *   Add to Cart
 * </ModernButton>
 */

const ModernButton = React.forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      disabled = false,
      icon: Icon,
      iconPosition = 'left',
      as = 'button',
      className = '',
      onClick,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const Component = as;

    return (
      <motion.div
        className={`modern-button-wrapper ${fullWidth ? 'w-full' : ''}`}
        whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
        whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      >
        <Component
          ref={ref}
          type={type}
          disabled={disabled || isLoading}
          onClick={onClick}
          className={`
            modern-button
            modern-button--${variant}
            modern-button--${size}
            ${fullWidth ? 'modern-button--full-width' : ''}
            ${disabled || isLoading ? 'modern-button--disabled' : ''}
            ${className}
          `.trim()}
          {...props}
        >
          {/* Icon before text */}
          {Icon && iconPosition === 'left' && (
            <Icon 
              className="modern-button__icon modern-button__icon--left"
              size={size === 'xs' ? 16 : size === 'sm' ? 18 : size === 'md' ? 20 : size === 'lg' ? 22 : 24}
              aria-hidden="true"
            />
          )}

          {/* Loading spinner */}
          {isLoading && (
            <Loader2 
              className="modern-button__spinner"
              size={size === 'xs' ? 16 : size === 'sm' ? 18 : size === 'md' ? 20 : size === 'lg' ? 22 : 24}
              aria-label="Loading..."
            />
          )}

          {/* Text content */}
          {!isLoading && (
            <span className="modern-button__text">
              {children}
            </span>
          )}

          {/* Loading text alternative */}
          {isLoading && (
            <span className="modern-button__text modern-button__text--loading">
              Loading...
            </span>
          )}

          {/* Icon after text */}
          {Icon && iconPosition === 'right' && !isLoading && (
            <Icon 
              className="modern-button__icon modern-button__icon--right"
              size={size === 'xs' ? 16 : size === 'sm' ? 18 : size === 'md' ? 20 : size === 'lg' ? 22 : 24}
              aria-hidden="true"
            />
          )}
        </Component>
      </motion.div>
    );
  }
);

ModernButton.displayName = 'ModernButton';

export default ModernButton;
