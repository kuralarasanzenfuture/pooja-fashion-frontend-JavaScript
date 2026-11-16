import React from "react";
import { Palette } from "lucide-react";
import {
  formatHexCode,
  isValidHexCode,
  isLightColor,
  getColorInitials,
  getColorSwatchStyle,
} from "../utils/colorHelper.js";

/**
 * ColorThumb
 * Premium color swatch preview with light-color edge definition,
 * multi-color silk gradient support, and accessible contrast indicators.
 */
export default function ColorThumb({
  hex,
  name = "",
  code = "",
  size = "md",
  className = "",
  showBorder = true,
  onClick,
}) {
  const isMulticolor =
    !hex ||
    String(hex).toLowerCase() === "multicolor" ||
    String(code).toUpperCase() === "MULTICOLOR";

  const validHex = isValidHexCode(hex);
  const isLight = validHex ? isLightColor(hex) : false;
  const initials = getColorInitials(name, code);
  const swatchStyle = getColorSwatchStyle(hex);

  const sizeClasses = {
    xs: "w-5 h-5 text-[9px] rounded-md",
    sm: "w-7 h-7 text-[10px] rounded-lg",
    md: "w-9 h-9 text-xs rounded-xl",
    lg: "w-12 h-12 text-sm rounded-2xl",
    xl: "w-16 h-16 text-base rounded-2xl",
  }[size] || "w-9 h-9 text-xs rounded-xl";

  const ringClass = isMulticolor
    ? "ring-1 ring-black/10 shadow-xs"
    : isLight
    ? "ring-1 ring-base-content/20 shadow-xs"
    : "ring-1 ring-black/10 shadow-xs";

  return (
    <div
      onClick={onClick}
      style={swatchStyle}
      className={`relative shrink-0 flex items-center justify-center font-bold font-mono transition-transform duration-200 select-none ${
        onClick ? "cursor-pointer hover:scale-105" : ""
      } ${sizeClasses} ${showBorder ? ringClass : ""} ${className}`}
      title={`${name || "Color"} ${validHex ? `(${formatHexCode(hex)})` : ""}`}
    >
      {/* If multicolor, show vibrant tiny palette icon on large sizes */}
      {isMulticolor ? (
        <span className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
          {size === "xs" || size === "sm" ? (
            <span className="text-[9px] font-extrabold">MC</span>
          ) : (
            <Palette className={size === "lg" || size === "xl" ? "w-5 h-5" : "w-3.5 h-3.5"} />
          )}
        </span>
      ) : !validHex ? (
        <span className="text-base-content/40 text-[10px]">{initials}</span>
      ) : null}
    </div>
  );
}
