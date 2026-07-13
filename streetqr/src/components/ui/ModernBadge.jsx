import React from 'react';
import '../../styles/components/ModernBadge.css';

/**
 * ModernBadge - Status and category badge component
 * 
 * Variants:
 * - default: Neutral (gray)
 * - primary: Brand color
 * - success: Green (positive)
 * - warning: Amber (alert)
 * - danger: Red (critical)
 * - info: Blue (information)
 * 
 * Sizes:
 * - sm: Small badge
 * - md: Medium badge (default)
 * - lg: Large badge
 * 
 * Features:
 * - Icon support
 * - Dot indicator
 * - Multiple styles (solid, outline, subtle)
 * - Responsive sizing
 * - Dark mode support
 * 
 * @example
 * <ModernBadge variant="success">Ready</ModernBadge>
 * <ModernBadge icon={Check} variant="success">Order Confirmed</ModernBadge>
 * <ModernBadge variant="warning" isDot>Preparing</ModernBadge>
 */

const ModernBadge = React.forwardRef(
  (
    {
      children,
      variant = 'default',
      size = 'md',
      icon: Icon,
      isDot = false,
      style = 'solid',
      className = '',
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={`
          modern-badge
          modern-badge--${variant}
          modern-badge--${size}
          modern-badge--${style}
          ${isDot ? 'modern-badge--dot' : ''}
          ${className}
        `.trim()}
      >
        {isDot ? (
          <span className="modern-badge__dot" />
        ) : Icon ? (
          <Icon className="modern-badge__icon" size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
        ) : null}
        {!isDot && <span className="modern-badge__text">{children}</span>}
      </span>
    );
  }
);

ModernBadge.displayName = 'ModernBadge';

export default ModernBadge;
