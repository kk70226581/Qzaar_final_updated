import React from 'react';
import { motion } from 'framer-motion';

const Card = React.forwardRef(
  (
    {
      children,
      variant = 'default',
      isInteractive = false,
      className = '',
      onClick,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'bg-white dark:bg-slate-900 rounded-lg shadow-md overflow-hidden transition-all duration-300';

    const variants = {
      default: 'hover:shadow-lg',
      interactive: 'hover:shadow-xl hover:scale-105 cursor-pointer active:scale-100',
      elevated: 'shadow-lg hover:shadow-xl',
      flat: 'shadow-sm',
    };

    const cardClasses = `${baseStyles} ${variants[isInteractive ? 'interactive' : variant]} ${className}`.trim();

    const Component = isInteractive || onClick ? motion.div : 'div';

    return (
      <Component
        ref={ref}
        className={cardClasses}
        whileHover={isInteractive || onClick ? { scale: 1.02 } : {}}
        whileTap={isInteractive || onClick ? { scale: 0.98 } : {}}
        onClick={onClick}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';

export default Card;

export const CardImage = ({ src, alt, aspectRatio = 'aspect-square', className = '' }) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    return (
      <div className={`${aspectRatio} bg-slate-200 dark:bg-slate-800 flex items-center justify-center ${className}`}>
        <svg
          className="w-12 h-12 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="m2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-12-6.75h.008v.008h-.008v-.008zm4 0h.008v.008h-.008v-.008zm4 0h.008v.008h-.008v-.008z"
          />
        </svg>
      </div>
    );
  }

  return (
    <motion.img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover ${aspectRatio} ${className}`}
      onError={() => setHasError(true)}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    />
  );
};

export const CardContent = ({ children, className = '' }) => (
  <div className={`p-4 sm:p-6 ${className}`}>{children}</div>
);

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-4 sm:px-6 pt-4 sm:pt-6 pb-2 sm:pb-3 ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-4 sm:px-6 pb-4 sm:pb-6 pt-2 sm:pt-3 border-t border-slate-200 dark:border-slate-800 ${className}`}>
    {children}
  </div>
);
