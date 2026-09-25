import React from "react";
import "./Button.css";

/**
 * Global Luxury Button Component for Pooja Fashion POS & ERP
 * 
 * Supports both modern boutique luxury variants (primary, gold, secondary, outline, danger, success, ghost)
 * and dynamic animated variants (gradient-one, gradient-two, gradient-three, clip-four, clip-five, clip-six).
 *
 * @param {React.ReactNode} children - Button text or content
 * @param {string} variant - Visual variant: 'primary' | 'gold' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost' | 'gradient-one' | 'gradient-two' | 'gradient-three' | 'clip-four' | 'clip-five' | 'clip-six'
 * @param {string} size - Size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 * @param {string} type - 'button' | 'submit' | 'reset'
 * @param {boolean} disabled - Disable button
 * @param {boolean} loading - Display loading spinner
 * @param {React.ComponentType} icon - Optional Lucide or SVG icon component
 * @param {'left' | 'right'} iconPosition - Icon alignment
 * @param {boolean} fullWidth - Make button 100% width
 * @param {string} className - Additional CSS classes
 * @param {function} onClick - Click handler
 */
const Button = ({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = "left",
  fullWidth = false,
  onClick,
  ...props
}) => {
  // Normalize size class
  const sizeMap = {
    xs: "btn-xs",
    sm: "btn-sm",
    small: "btn-sm",
    md: "btn-md",
    medium: "btn-md",
    lg: "btn-lg",
    large: "btn-lg",
    xl: "btn-xl",
  };
  const sizeClass = sizeMap[size] || "btn-md";

  // Normalize variant class
  const variantClass = variant || "primary";

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={`common-button ${variantClass} ${sizeClass} ${fullWidth ? "full-width" : ""} ${className}`}
      disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
      {...props}
    >
      {/* Loading Spinner */}
      {loading && (
        <span className="button-spinner" aria-hidden="true">
          <svg
            className="animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}

      {/* Left Icon */}
      {!loading && Icon && iconPosition === "left" && (
        <span className="button-icon left" aria-hidden="true">
          <Icon className="w-4 h-4 shrink-0" />
        </span>
      )}

      {/* Button Label */}
      {children && <span className="button-label">{children}</span>}

      {/* Right Icon */}
      {!loading && Icon && iconPosition === "right" && (
        <span className="button-icon right" aria-hidden="true">
          <Icon className="w-4 h-4 shrink-0" />
        </span>
      )}
    </button>
  );
};

export default Button;