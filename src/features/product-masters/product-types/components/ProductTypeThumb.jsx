import React from "react";
import { Shirt, Scissors, ShoppingBag, Footprints, Layers, Sparkles, Tag } from "lucide-react";
import { getProductTypeTheme } from "../utils/productTypeHelper.js";

/**
 * ProductTypeThumb Component
 * Displays a styled icon or abbreviation badge for product types.
 */
export default function ProductTypeThumb({
  name = "",
  code = "",
  size = "md",
  className = "",
  onClick,
}) {
  const theme = getProductTypeTheme(code || name);
  const c = String(code || name || "").toUpperCase();

  const sizeClasses = {
    xs: "w-6 h-6 text-[9px] rounded-lg",
    sm: "w-8 h-8 text-[11px] rounded-xl",
    md: "w-10 h-10 text-xs rounded-2xl",
    lg: "w-14 h-14 text-sm rounded-2xl",
    xl: "w-20 h-20 text-lg rounded-3xl",
  }[size] || "w-10 h-10 text-xs rounded-2xl";

  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-7 h-7",
    xl: "w-10 h-10",
  }[size] || "w-5 h-5";

  // Pick an icon based on type
  const renderIcon = () => {
    if (c.includes("READY") || c.includes("GARMENT")) return <Shirt className={iconSizes} />;
    if (c.includes("FABRIC") || c.includes("TEXTILE")) return <Layers className={iconSizes} />;
    if (c.includes("ACCESSORY")) return <ShoppingBag className={iconSizes} />;
    if (c.includes("FOOTWEAR") || c.includes("SHOE")) return <Footprints className={iconSizes} />;
    if (c.includes("SERVICE") || c.includes("TAILOR")) return <Scissors className={iconSizes} />;
    if (c.includes("SAREE") || c.includes("LEHENGA")) return <Sparkles className={iconSizes} />;
    return <Tag className={iconSizes} />;
  };

  const Component = onClick ? "button" : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`relative flex items-center justify-center font-mono font-black tracking-tight border select-none shrink-0 transition-transform active:scale-95 ${sizeClasses} ${theme.bg} ${theme.border} ${theme.text} ${className}`}
      title={name || code}
    >
      {renderIcon()}
    </Component>
  );
}

