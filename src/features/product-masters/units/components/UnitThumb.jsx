import React from "react";
import { Scale } from "lucide-react";
import { getUnitTheme } from "../utils/unitHelper.js";

/**
 * UnitThumb Component
 * Renders an avatar / badge showing unit code abbreviation with customized styling.
 */
export default function UnitThumb({
  name = "",
  code = "",
  size = "md",
  className = "",
  onClick,
}) {
  const displayCode = (code || name || "UN").slice(0, 4).toUpperCase();
  const theme = getUnitTheme(code || name);

  const sizeClasses = {
    xs: "w-6 h-6 text-[9px] rounded-lg",
    sm: "w-8 h-8 text-[11px] rounded-xl",
    md: "w-10 h-10 text-xs rounded-2xl",
    lg: "w-14 h-14 text-sm rounded-2xl",
    xl: "w-20 h-20 text-lg rounded-3xl",
  }[size] || "w-10 h-10 text-xs rounded-2xl";

  const Component = onClick ? "button" : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`relative flex items-center justify-center font-mono font-black tracking-tight border select-none shrink-0 transition-transform active:scale-95 ${sizeClasses} ${theme.bg} ${theme.border} ${theme.text} ${className}`}
      title={name || code}
    >
      <span>{displayCode}</span>
    </Component>
  );
}
