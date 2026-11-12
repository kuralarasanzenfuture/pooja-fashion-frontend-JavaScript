import { Ruler } from "lucide-react";
import {
  getSizeGroupStyle,
  getSizeGroupInitials,
} from "../utils/sizeGroupHelper.js";

const SIZE_MAP = {
  xs: "w-7 h-7 text-[10px] rounded-lg",
  sm: "w-9 h-9 text-xs rounded-xl",
  md: "w-11 h-11 text-sm rounded-xl",
  lg: "w-16 h-16 text-base rounded-2xl",
  xl: "w-20 h-20 text-xl rounded-3xl",
};

/**
 * Visual monogram and scale icon thumbnail for Size Groups
 * High-craft human luxury styling matching brand avatars.
 */
export default function SizeGroupThumb({
  name = "",
  code = "",
  size = "md",
  className = "",
}) {
  const sizeClasses = SIZE_MAP[size] || SIZE_MAP.md;
  const style = getSizeGroupStyle(name, code);
  const initials = style.initials || getSizeGroupInitials(name || code);

  return (
    <div
      style={{
        background: style.background,
        color: style.text,
        borderColor: style.border,
      }}
      className={`relative shrink-0 flex items-center justify-center font-bold tracking-wider select-none shadow-xs border transition-transform duration-200 group/sgthumb ${sizeClasses} ${className}`}
      title={name ? (code ? `${name} (${code})` : name) : "Size Group"}
    >
      {/* Subtle top-lit surface highlight */}
      <span
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 65%)",
        }}
        aria-hidden="true"
      />

      {/* Subtle inner hairline bevel */}
      <span
        className="pointer-events-none absolute inset-[1px] rounded-[inherit] opacity-25"
        style={{
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.25)",
        }}
        aria-hidden="true"
      />

      <span className="relative z-10 font-sans uppercase font-bold text-center leading-none">
        {initials}
      </span>

      <div className="absolute -bottom-1 -right-1 bg-black/60 backdrop-blur-xs rounded-full p-0.5 border border-white/20 text-white/90 z-20">
        <Ruler className="w-2.5 h-2.5" />
      </div>
    </div>
  );
}
