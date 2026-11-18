import React from "react";
import "./Button.css";

/**
 * Global Luxury Button Component for Pooja Fashion POS & ERP
 * 
 * Supports both modern boutique luxury variants (primary, gold, secondary, outline, danger, success, ghost)
 * and dynamic animated variants (gradient-one, gradient-two, gradient-three, clip-four, clip-five, clip-six).
 * 'destructive' automatically maps to 'clip-four' (luxury destructive swipe).
 *
 * @param {React.ReactNode} children - Button text or content
 * @param {string} variant - Visual variant: 'primary' | 'gold' | 'secondary' | 'outline' | 'danger' | 'destructive' | 'success' | 'ghost' | 'gradient-one' | 'gradient-two' | 'gradient-three' | 'clip-four' | 'clip-five' | 'clip-six'
 * @param {string} size - Size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 * @param {string} type - 'button' | 'submit' | 'reset'
 * @param {boolean} disabled - Disable button
 * @param {boolean} loading - Display loading spinner
 * @param {boolean} isLoading - Alias for loading
 * @param {React.ComponentType | React.ReactNode} icon - Optional Lucide or SVG icon component / element
 * @param {React.ComponentType | React.ReactNode} leftIcon - Left icon alias
 * @param {React.ComponentType | React.ReactNode} rightIcon - Right icon alias
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
  isLoading = false,
  icon: Icon,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
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

  // Normalize variant class - ensure destructive maps to clip-four
  const variantClass = variant === "destructive" ? "clip-four" : (variant || "primary");

  const isBtnLoading = loading || isLoading;
  const isDisabled = disabled || isBtnLoading;

  // Resolve left and right icons
  const resolvedLeftIcon = (iconPosition === "left" && Icon) || LeftIcon;
  const resolvedRightIcon = (iconPosition === "right" && Icon) || RightIcon;

  const renderIcon = (iconItem) => {
    if (!iconItem) return null;
    if (React.isValidElement(iconItem)) {
      return iconItem;
    }
    const Comp = iconItem;
    return <Comp className="w-4 h-4 shrink-0" />;
  };

  return (
    <button
      type={type}
      className={`common-button ${variantClass} ${sizeClass} ${fullWidth ? "full-width" : ""} ${className}`}
      disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
      {...props}
    >
      {/* Loading Spinner */}
      {isBtnLoading && (
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
      {!isBtnLoading && resolvedLeftIcon && (
        <span className="button-icon left" aria-hidden="true">
          {renderIcon(resolvedLeftIcon)}
        </span>
      )}

      {/* Button Label */}
      {children && <span className="button-label">{children}</span>}

      {/* Right Icon */}
      {!isBtnLoading && resolvedRightIcon && (
        <span className="button-icon right" aria-hidden="true">
          {renderIcon(resolvedRightIcon)}
        </span>
      )}
    </button>
  );
};

export default Button;