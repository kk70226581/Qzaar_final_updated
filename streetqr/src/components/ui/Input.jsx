import React from 'react';

const Input = React.forwardRef(
  (
    {
      label,
      error,
      hint,
      icon: Icon,
      iconPosition = 'left',
      size = 'md',
      variant = 'default',
      type = 'text',
      disabled = false,
      required = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'w-full rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-950';

    const variants = {
      default:
        'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:border-brand-500 focus:ring-brand-500/20',
      ghost:
        'bg-transparent border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 focus:border-brand-500 focus:ring-brand-500/20',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-4 py-3 text-lg',
    };

    const inputClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${
      Icon && iconPosition === 'left' ? 'pl-10' : ''
    } ${Icon && iconPosition === 'right' ? 'pr-10' : ''} ${error ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500' : ''} ${className}`.trim();

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {label}
            {required && <span className="text-danger-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type={type}
            disabled={disabled}
            className={inputClasses}
            {...props}
          />

          {Icon && (
            <div
              className={`absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none ${
                iconPosition === 'left' ? 'left-3' : 'right-3'
              }`}
            >
              <Icon size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />
            </div>
          )}
        </div>

        {error && <p className="text-sm text-danger-600 dark:text-danger-400 mt-1.5">{error}</p>}
        {hint && !error && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

export const TextArea = React.forwardRef(
  (
    {
      label,
      error,
      hint,
      size = 'md',
      variant = 'default',
      disabled = false,
      required = false,
      rows = 4,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'w-full rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-950 resize-none';

    const variants = {
      default:
        'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:border-brand-500 focus:ring-brand-500/20',
      ghost:
        'bg-transparent border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 focus:border-brand-500 focus:ring-brand-500/20',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-4 py-3 text-lg',
    };

    const textareaClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${error ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500' : ''} ${className}`.trim();

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {label}
            {required && <span className="text-danger-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          rows={rows}
          disabled={disabled}
          className={textareaClasses}
          {...props}
        />

        {error && <p className="text-sm text-danger-600 dark:text-danger-400 mt-1.5">{error}</p>}
        {hint && !error && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">{hint}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
