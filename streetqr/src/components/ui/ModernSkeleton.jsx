import React from 'react';
import '../../styles/components/ModernSkeleton.css';

/**
 * ModernSkeleton - Skeleton loader for loading states
 * 
 * Variants:
 * - text: Text line skeleton
 * - circle: Circular skeleton (avatars)
 * - rectangle: Rectangular skeleton (images/cards)
 * 
 * Features:
 * - Customizable width/height
 * - Shimmer animation
 * - Multiple lines option
 * - Responsive sizing
 * - Dark mode support
 * 
 * @example
 * {isLoading ? (
 *   <>
 *     <ModernSkeleton variant="rectangle" width="100%" height={200} />
 *     <ModernSkeleton variant="text" width="80%" />
 *     <ModernSkeleton variant="text" width="60%" />
 *   </>
 * ) : (
 *   <ActualContent />
 * )}
 */

const ModernSkeleton = ({
  variant = 'text',
  width = '100%',
  height = 'auto',
  lines = 1,
  className = '',
  ...props
}) => {
  // Multiple lines for text
  if (variant === 'text' && lines > 1) {
    return (
      <div className={`modern-skeleton__group ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="modern-skeleton modern-skeleton--text"
            style={{
              width: i === lines - 1 ? '60%' : '100%',
              height: 'auto',
            }}
            {...props}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`modern-skeleton modern-skeleton--${variant} ${className}`}
      style={{
        width,
        height: height === 'auto' ? height : height,
        borderRadius:
          variant === 'circle' ? '9999px' : variant === 'text' ? 'var(--rounded-md)' : 'var(--rounded-lg)',
      }}
      {...props}
    />
  );
};

ModernSkeleton.displayName = 'ModernSkeleton';

export default ModernSkeleton;
