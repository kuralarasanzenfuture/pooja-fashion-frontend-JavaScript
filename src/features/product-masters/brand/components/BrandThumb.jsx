import { useState } from "react";
import { Maximize2 } from "lucide-react";
import {
  normalizeBrandLogoUrl,
  getBrandStyle,
  getBrandInitials,
} from "../utils/brandHelper.js";

const SIZE_MAP = {
  xs: "w-7 h-7 text-[10px] rounded-lg",
  sm: "w-9 h-9 text-xs rounded-xl",
  md: "w-11 h-11 text-sm rounded-xl",
  lg: "w-16 h-16 text-base rounded-2xl",
  xl: "w-24 h-24 text-2xl rounded-3xl",
};

/**
 * Brand logo thumbnail with bespoke human-crafted fashion monogram fallback
 * and optional click-to-zoom modal trigger.
 */
export default function BrandThumb({
  url = null,
  name = "",
  code = "",
  size = "md",
  onImageClick = null,
  className = "",
}) {
  const [hasError, setHasError] = useState(false);
  const sizeClasses = SIZE_MAP[size] || SIZE_MAP.md;
  const normalizedUrl = normalizeBrandLogoUrl(url);
  const showImage = Boolean(normalizedUrl) && !hasError;

  const brandStyle = getBrandStyle(name, code);
  const initials = brandStyle.initials || getBrandInitials(name || code);

  if (showImage) {
    return (
      <div
        className={`relative group shrink-0 overflow-hidden bg-base-100 border border-base-300 shadow-2xs ${sizeClasses} ${className} ${
          onImageClick ? "cursor-pointer" : ""
        }`}
        onClick={(e) => {
          if (onImageClick) {
            e.stopPropagation();
            onImageClick({
              src: normalizedUrl,
              title: name ? `${name} Brand Logo` : "Brand Logo",
            });
          }
        }}
      >
        <img
          src={normalizedUrl}
          alt={name ? `${name} logo` : "Brand Logo"}
          onError={() => setHasError(true)}
          className="w-full h-full object-contain p-1 transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {onImageClick && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-[1px]">
            <Maximize2 className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        background: brandStyle.background,
        color: brandStyle.text,
        borderColor: brandStyle.border,
      }}
      className={`relative shrink-0 flex items-center justify-center font-bold tracking-wider select-none shadow-xs border transition-transform duration-200 group/brandthumb ${sizeClasses} ${className}`}
      title={name ? (code ? `${name} (${code})` : name) : "Brand"}
    >
      {/* Subtle top-lit surface highlight for authentic tangible luxury finish */}
      <span
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 65%)",
        }}
        aria-hidden="true"
      />

      {/* Subtle hairline inner bevel */}
      <span
        className="pointer-events-none absolute inset-[1px] rounded-[inherit] opacity-25"
        style={{
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.25)",
        }}
        aria-hidden="true"
      />

      {/* Monogram typography */}
      <span className="relative z-10 font-sans uppercase font-bold text-center leading-none">
        {initials}
      </span>

      {/* Subtle authentic brand accent pip if defined */}
      {brandStyle.accent && (
        <span
          className="pointer-events-none absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full opacity-75 shadow-xs"
          style={{ backgroundColor: brandStyle.accent }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
