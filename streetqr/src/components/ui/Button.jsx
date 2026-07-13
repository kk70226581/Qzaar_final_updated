import React from 'react';
import { motion } from 'framer-motion';

const Button = React.forwardRef(
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
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:focus:ring-offset-slate-950';

    const variants = {
      primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-md hover:shadow-lg active:scale-95',
      secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700',
      ghost: 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
      danger: 'bg-danger-600 text-white hover:bg-danger-700 active:scale-95',
      success: 'bg-success-600 text-white hover:bg-success-700 active:scale-95',
      outline: 'border-2 border-brand-600 text-brand-600 hover:bg-brand-50 dark:border-brand-400 dark:text-brand-400 dark:hover:bg-brand-950/20',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-2',
      md: 'px-4 py-2.5 text-base gap-2',
      lg: 'px-6 py-3 text-lg gap-3',
      xl: 'px-8 py-4 text-lg gap-3',
    };

    const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${
      fullWidth ? 'w-full' : ''
    } ${className}`.trim();

    const Component = as;

    return (
      <motion.div
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
      >
        <Component
          ref={ref}
          className={buttonClasses}
          disabled={disabled || isLoading}
          onClick={onClick}
          {...props}
        >
          {Icon && iconPosition === 'left' && <Icon size={20} />}

          {isLoading ? (
            <span className="animate-spin">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.581 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </span>
          ) : (
            children
          )}

          {Icon && iconPosition === 'right' && <Icon size={20} />}
        </Component>
      </motion.div>
    );
  }
);

Button.displayName = 'Button';

export default Button;
