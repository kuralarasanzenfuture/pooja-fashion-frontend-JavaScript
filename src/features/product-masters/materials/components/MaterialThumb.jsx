import React from "react";
import { Layers } from "lucide-react";
import { getMaterialInitials, getMaterialTheme } from "../utils/materialHelper.js";

/**
 * MaterialThumb Component
 * Renders a stylized fabric swatch / textile badge with consistent initials and color accent.
 */
export default function MaterialThumb({
  name = "",
  code = "",
  size = "md",
  className = "",
  onClick,
}) {
  const initials = getMaterialInitials(name || code);
  const theme = getMaterialTheme(name || code);

  const sizeClasses = {
    xs: "w-6 h-6 text-[10px] rounded-lg",
    sm: "w-8 h-8 text-xs rounded-xl",
    md: "w-10 h-10 text-sm rounded-2xl",
    lg: "w-14 h-14 text-lg rounded-2xl",
    xl: "w-20 h-20 text-2xl rounded-3xl",
  }[size] || "w-10 h-10 text-sm rounded-2xl";

  const Component = onClick ? "button" : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`relative flex items-center justify-center font-extrabold tracking-wider border select-none shrink-0 transition-transform active:scale-95 ${sizeClasses} ${theme.bg} ${theme.border} ${theme.text} ${className}`}
      title={name || code}
    >
      <span>{initials}</span>
    </Component>
  );
}
