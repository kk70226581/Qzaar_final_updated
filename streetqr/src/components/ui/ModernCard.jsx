import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/components/ModernCard.css';

/**
 * ModernCard - Premium card component with elevation and interactive states
 * 
 * Variants:
 * - default: Flat card with subtle shadow
 * - elevated: Prominent shadow (MD elevation)
 * - interactive: Hover effects, cursor pointer
 * - flat: No shadow, border only
 * 
 * Features:
 * - Composable sections (Header, Image, Content, Footer)
 * - Customizable children
 * - Responsive design
 * - Dark mode support
 * - Smooth animations
 * 
 * @example
 * <ModernCard variant="elevated">
 *   <ModernCard.Header>
 *     <h3>Card Title</h3>
 *   </ModernCard.Header>
 *   <ModernCard.Image src="/image.jpg" alt="Image" />
 *   <ModernCard.Content>
 *     <p>Card content</p>
 *   </ModernCard.Content>
 *   <ModernCard.Footer>
 *     <button>Action</button>
 *   </ModernCard.Footer>
 * </ModernCard>
 */

const ModernCardHeader = ({ children, className = '' }) => (
  <div className={`modern-card__header ${className}`}>
    {children}
  </div>
);

const ModernCardImage = ({ src, alt, className = '' }) => (
  <div className={`modern-card__image-wrapper ${className}`}>
    <img src={src} alt={alt} className="modern-card__image" />
  </div>
);

const ModernCardContent = ({ children, className = '' }) => (
  <div className={`modern-card__content ${className}`}>
    {children}
  </div>
);

const ModernCardFooter = ({ children, className = '' }) => (
  <div className={`modern-card__footer ${className}`}>
    {children}
  </div>
);

const ModernCard = React.forwardRef(
  (
    {
      children,
      variant = 'default',
      className = '',
      onClick,
      isInteractive = false,
      hoverEffect = true,
    },
    ref
  ) => {
    const isClickable = onClick || isInteractive;

    return (
      <motion.div
        ref={ref}
        className={`
          modern-card
          modern-card--${variant}
          ${isClickable ? 'modern-card--interactive' : ''}
          ${className}
        `.trim()}
        onClick={onClick}
        whileHover={hoverEffect && isClickable ? { y: -4, boxShadow: 'var(--shadow-lg)' } : {}}
        whileTap={isClickable ? { scale: 0.98 } : {}}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onKeyPress={isClickable ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClick?.(e);
          }
        } : undefined}
      >
        {children}
      </motion.div>
    );
  }
);

ModernCard.displayName = 'ModernCard';
ModernCard.Header = ModernCardHeader;
ModernCard.Image = ModernCardImage;
ModernCard.Content = ModernCardContent;
ModernCard.Footer = ModernCardFooter;

export default ModernCard;
