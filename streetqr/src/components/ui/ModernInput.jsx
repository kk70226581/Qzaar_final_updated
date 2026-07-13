import React, { useState } from 'react';
import { Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import '../../styles/components/ModernInput.css';

/**
 * ModernInput - Enhanced input component with validation states
 * 
 * Types:
 * - text: Standard text input
 * - email: Email validation
 * - password: Hidden input with show/hide toggle
 * - number: Numeric input
 * - textarea: Multi-line text
 * - search: Search input with icon
 * 
 * Features:
 * - Label support (above input)
 * - Helper text below input
 * - Error state with message
 * - Success state with checkmark
 * - Character count for textarea
 * - Password visibility toggle
 * - Focus states with visible ring
 * - Disabled state
 * - Required indicator
 * - Placeholder support
 * 
 * @example
 * <ModernInput
 *   type="email"
 *   label="Email Address"
 *   placeholder="you@example.com"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   error={emailError}
 *   helperText="We'll never share your email"
 *   required
 * />
 */

const ModernInput = React.forwardRef(
  (
    {
      type = 'text',
      label,
      placeholder,
      value,
      onChange,
      error,
      success = false,
      helperText,
      required = false,
      disabled = false,
      maxLength,
      showCharCount = false,
      rows = 3,
      className = '',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [charCount, setCharCount] = useState((value && value.length) || 0);

    const isTextarea = type === 'textarea';
    const isPassword = type === 'password';
    const displayType = isPassword ? (showPassword ? 'text' : 'password') : type;
    const Component = isTextarea ? 'textarea' : 'input';

    const handleChange = (e) => {
      onChange?.(e);
      if (isTextarea && maxLength) {
        setCharCount(e.target.value.length);
      }
    };

    const hasError = !!error;
    const showSuccess = success && !hasError;

    return (
      <div className={`modern-input__wrapper ${className}`}>
        {/* LABEL */}
        {label && (
          <label className="modern-input__label">
            <span className="modern-input__label-text">{label}</span>
            {required && <span className="modern-input__required">*</span>}
          </label>
        )}

        {/* INPUT WRAPPER */}
        <div className="modern-input__input-wrapper">
          <Component
            ref={ref}
            type={displayType}
            className={`
              modern-input__field
              ${hasError ? 'modern-input__field--error' : ''}
              ${showSuccess ? 'modern-input__field--success' : ''}
              ${disabled ? 'modern-input__field--disabled' : ''}
            `.trim()}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            maxLength={maxLength}
            rows={isTextarea ? rows : undefined}
            {...props}
          />

          {/* PASSWORD TOGGLE */}
          {isPassword && (
            <button
              type="button"
              className="modern-input__password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={disabled}
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          )}

          {/* SUCCESS ICON */}
          {showSuccess && (
            <div className="modern-input__icon modern-input__icon--success">
              <Check size={18} />
            </div>
          )}

          {/* ERROR ICON */}
          {hasError && (
            <div className="modern-input__icon modern-input__icon--error">
              <AlertCircle size={18} />
            </div>
          )}
        </div>

        {/* HELPER TEXT / ERROR MESSAGE */}
        {helperText && !hasError && (
          <p className="modern-input__helper-text">{helperText}</p>
        )}

        {/* ERROR MESSAGE */}
        {hasError && (
          <p className="modern-input__error-text">{error}</p>
        )}

        {/* CHARACTER COUNT */}
        {isTextarea && showCharCount && maxLength && (
          <p className="modern-input__char-count">
            {charCount} / {maxLength}
          </p>
        )}
      </div>
    );
  }
);

ModernInput.displayName = 'ModernInput';

export default ModernInput;
