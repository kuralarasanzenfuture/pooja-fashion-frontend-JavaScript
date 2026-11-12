import { Ruler } from "lucide-react";
import { getSizeInitials, getSizeGradient } from "../utils/sizeHelper.js";

/**
 * Size visual thumbnail badge with monogram code
 */
export default function SizeThumb({
  code = "",
  name = "",
  size = "md",
  className = "",
  onClick,
}) {
  const initials = getSizeInitials(code, name);
  const gradient = getSizeGradient(code || name);

  const sizeClasses = {
    xs: "w-7 h-7 text-[10px] rounded-lg",
    sm: "w-9 h-9 text-xs rounded-xl",
    md: "w-11 h-11 text-xs sm:text-sm font-black rounded-2xl",
    lg: "w-14 h-14 text-sm sm:text-base font-black rounded-2xl",
    xl: "w-20 h-20 text-xl font-black rounded-3xl",
  }[size] || "w-11 h-11 text-sm rounded-2xl";

  const Component = onClick ? "button" : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center shrink-0 font-mono tracking-tight shadow-xs border bg-gradient-to-br transition-transform duration-200 ${gradient} ${sizeClasses} ${
        onClick ? "cursor-pointer hover:scale-105 active:scale-95" : ""
      } ${className}`}
      title={name ? `${name} (${code})` : code}
    >
      <span className="truncate px-1 uppercase">{initials}</span>
      <span className="absolute bottom-1 right-1 opacity-20 pointer-events-none">
        <Ruler className="w-2.5 h-2.5" />
      </span>
    </Component>
  );
}

