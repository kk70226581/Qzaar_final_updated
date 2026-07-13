import React from 'react';

const Badge = React.forwardRef(
  (
    {
      children,
      variant = 'default',
      size = 'md',
      icon: Icon,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center font-medium gap-1.5 rounded-full';

    const variants = {
      default: 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50',
      success: 'bg-success-50 text-success-900 dark:bg-success-900/20 dark:text-success-400',
      warning: 'bg-warning-50 text-warning-900 dark:bg-warning-900/20 dark:text-warning-400',
      danger: 'bg-danger-50 text-danger-900 dark:bg-danger-900/20 dark:text-danger-400',
      info: 'bg-info-50 text-info-900 dark:bg-info-900/20 dark:text-info-400',
      brand: 'bg-brand-50 text-brand-900 dark:bg-brand-900/20 dark:text-brand-400',
    };

    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    };

    const badgeClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`.trim();

    return (
      <span ref={ref} className={badgeClasses} {...props}>
        {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
