import React from "react";
import "./PowerSwitch.css";

const SIZES = {
  xs: {
    button: "w-5 h-5 p-0.5",
    stroke: 16,
    svgSize: "w-3.5 h-3.5",
    labelText: "text-[11px]",
  },
  sm: {
    button: "w-7 h-7 p-1",
    stroke: 14,
    svgSize: "w-4.5 h-4.5",
    labelText: "text-xs",
  },
  md: {
    button: "w-9 h-9 p-1.5",
    stroke: 14,
    svgSize: "w-5.5 h-5.5",
    labelText: "text-sm",
  },
  lg: {
    button: "w-11 h-11 p-2",
    stroke: 13,
    svgSize: "w-7 h-7",
    labelText: "text-base",
  },
};

const VARIANTS = {
  emerald: {
    powerColor: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.5)",
    labelActive: "text-emerald-600 dark:text-emerald-400 font-semibold",
  },
  purple: {
    powerColor: "var(--color-primary, #6366f1)",
    glowColor: "rgba(99, 102, 241, 0.5)",
    labelActive: "text-primary font-semibold",
  },
  amber: {
    powerColor: "#f59e0b",
    glowColor: "rgba(245, 158, 11, 0.5)",
    labelActive: "text-amber-600 dark:text-amber-400 font-semibold",
  },
};

/**
 * Premium Animated Power Switch Component
 * Based on Milan Raring's power-switch animation, tailored to Pooja Fashion's design system.
 * Supports standard circular tactile button or unified interactive status pill.
 */
export default function PowerSwitch({
  checked = false,
  onChange,
  disabled = false,
  loading = false,
  size = "sm",
  variant = "emerald",
  asPill = false,
  showLabel = false,
  labelActive = "Active",
  labelInactive = "Inactive",
  title,
  ariaLabel,
  className = "",
  id,
}) {
  const sizeConfig = SIZES[size] || SIZES.sm;
  const variantConfig = VARIANTS[variant] || VARIANTS.emerald;

  const handleClick = (e) => {
    e.stopPropagation();
    if (disabled || loading) return;
    if (onChange) {
      onChange(!checked, e);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(e);
    }
  };

  const defaultTitle =
    title ||
    (checked
      ? `${labelActive} — Click to switch to ${labelInactive.toLowerCase()}`
      : `${labelInactive} — Click to switch to ${labelActive.toLowerCase()}`);

  const powerSvg = (
    <svg
      viewBox="0 0 150 150"
      className={`power-svg ${asPill ? "w-3.5 h-3.5" : sizeConfig.svgSize}`}
      style={{ strokeWidth: `${sizeConfig.stroke}px` }}
    >
      {/* Power Line */}
      <line
        x1="75"
        y1="30"
        x2="75"
        y2="58"
        className="power-line"
      />
      {/* Power Arc (gap at the top) */}
      <circle
        cx="75"
        cy="80"
        r="35"
        className="power-circle"
      />
    </svg>
  );

  // UNIFIED STATUS PILL MODE
  if (asPill) {
    return (
      <div
        id={id}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        title={defaultTitle}
        aria-label={ariaLabel || defaultTitle}
        style={{
          "--power-color": variantConfig.powerColor,
          "--power-glow": variantConfig.glowColor,
        }}
        className={`pf-status-pill ${checked ? "is-active" : ""} ${
          disabled ? "is-disabled" : ""
        } ${className}`}
      >
        <span
          className={`pf-power-switch ${checked ? "is-active" : ""} border-none bg-transparent shadow-none p-0 w-3.5 h-3.5`}
        >
          {powerSvg}
        </span>
        <span>{checked ? labelActive : labelInactive}</span>
      </div>
    );
  }

  // CIRCULAR POWER BUTTON MODE
  return (
    <div
      className={`inline-flex items-center gap-2 select-none ${className}`}
      onClick={handleClick}
      title={defaultTitle}
    >
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel || defaultTitle}
        disabled={disabled || loading}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        style={{
          "--power-color": variantConfig.powerColor,
          "--power-glow": variantConfig.glowColor,
        }}
        className={`pf-power-switch ${sizeConfig.button} ${
          checked ? "is-active" : ""
        } ${disabled ? "is-disabled" : ""}`}
      >
        {powerSvg}
      </button>

      {showLabel && (
        <span
          className={`transition-colors font-medium ${sizeConfig.labelText} ${
            checked ? variantConfig.labelActive : "text-base-content/50"
          }`}
        >
          {checked ? labelActive : labelInactive}
        </span>
      )}
    </div>
  );
}
