import React, { useState, useEffect } from "react";
import { Tags, Maximize2 } from "lucide-react";

/**
 * CategoryThumb
 * Thumbnail component with fallback icon and interactive high-res preview trigger.
 * If category has no image, shows clean Tags icon matching catalog design.
 */
export default function CategoryThumb({ url, name, size = "md", onImageClick }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [url]);

  const sizeClasses =
    size === "lg"
      ? "w-full h-44 rounded-2xl shadow-xs"
      : size === "sm"
      ? "w-9 h-9 rounded-lg"
      : "w-12 h-12 rounded-xl shadow-2xs";

  const isClickable = Boolean(url && !hasError && onImageClick);

  if (url && !hasError) {
    const thumbNode = (
      <div
        className={`relative group/thumb overflow-hidden shrink-0 border border-base-300 bg-base-200/60 transition-all duration-300 ${sizeClasses} ${
          isClickable
            ? "cursor-pointer hover:border-primary/60 hover:shadow-md hover:ring-2 hover:ring-primary/20 active:scale-95"
            : ""
        }`}
        onClick={isClickable ? (e) => { e.stopPropagation(); onImageClick(url, name); } : undefined}
      >
        <img
          src={url}
          alt={name}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover/thumb:scale-110"
        />
        {isClickable && (
          <div className="absolute inset-0 bg-black/45 opacity-0 group-hover/thumb:opacity-100 transition-all duration-200 flex flex-col items-center justify-center text-white backdrop-blur-2xs gap-0.5">
            <Maximize2 className={size === "lg" ? "size-6 drop-shadow-md text-amber-300 animate-in zoom-in-75 duration-150" : "size-4 drop-shadow-md text-amber-300 animate-in zoom-in-75 duration-150"} />
            {size === "lg" && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-white drop-shadow-xs">Preview</span>
            )}
          </div>
        )}
      </div>
    );

    if (isClickable) {
      return (
        <div className="tooltip tooltip-top tooltip-primary" data-tip="Click to view full image in high quality">
          {thumbNode}
        </div>
      );
    }
    return thumbNode;
  }

  return (
    <div
      className={`flex items-center justify-center shrink-0 border border-primary/20 bg-gradient-to-br from-primary/10 via-base-200 to-base-300/40 text-primary ${sizeClasses}`}
    >
      <Tags className={size === "lg" ? "size-10 opacity-70" : size === "sm" ? "size-4 opacity-70" : "size-5 opacity-70"} />
    </div>
  );
}
