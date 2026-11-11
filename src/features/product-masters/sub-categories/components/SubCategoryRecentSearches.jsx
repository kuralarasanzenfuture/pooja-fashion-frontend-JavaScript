import React, { useState } from "react";
import { Clock, X, Tags, Check } from "lucide-react";
import { normalizeCategoryImageUrl, formatCategoryName } from "../../categories/utils/categoryImageHelper.js";

const PASTEL_THEMES = [
  {
    bg: "bg-[#FFF9E6] dark:bg-amber-950/25",
    hoverBg: "hover:bg-[#FFF3CD] dark:hover:bg-amber-900/35",
    border: "border-[#FFEBAA] dark:border-amber-800/40",
    text: "text-[#78350F] dark:text-amber-200",
    accent: "text-amber-700 dark:text-amber-300",
    imgBg: "bg-white/80 dark:bg-amber-900/30",
    badge: "bg-amber-200/50 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200",
  },
  {
    bg: "bg-[#FFEFEB] dark:bg-rose-950/25",
    hoverBg: "hover:bg-[#FFE2DB] dark:hover:bg-rose-900/35",
    border: "border-[#FFD2C8] dark:border-rose-800/40",
    text: "text-[#881337] dark:text-rose-200",
    accent: "text-rose-700 dark:text-rose-300",
    imgBg: "bg-white/80 dark:bg-rose-900/30",
    badge: "bg-rose-200/50 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200",
  },
  {
    bg: "bg-[#EAF4FF] dark:bg-sky-950/25",
    hoverBg: "hover:bg-[#D8ECFF] dark:hover:bg-sky-900/35",
    border: "border-[#BEDDFF] dark:border-sky-800/40",
    text: "text-[#0C4A6E] dark:text-sky-200",
    accent: "text-sky-700 dark:text-sky-300",
    imgBg: "bg-white/80 dark:bg-sky-900/30",
    badge: "bg-sky-200/50 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200",
  },
  {
    bg: "bg-[#F5EDFF] dark:bg-purple-950/25",
    hoverBg: "hover:bg-[#EBDAFF] dark:hover:bg-purple-900/35",
    border: "border-[#DFC4FF] dark:border-purple-800/40",
    text: "text-[#581C87] dark:text-purple-200",
    accent: "text-purple-700 dark:text-purple-300",
    imgBg: "bg-white/80 dark:bg-purple-900/30",
    badge: "bg-purple-200/50 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200",
  },
  {
    bg: "bg-[#EBF9F1] dark:bg-emerald-950/25",
    hoverBg: "hover:bg-[#D6F4E2] dark:hover:bg-emerald-900/35",
    border: "border-[#B8ECCB] dark:border-emerald-800/40",
    text: "text-[#064E3B] dark:text-emerald-200",
    accent: "text-emerald-700 dark:text-emerald-300",
    imgBg: "bg-white/80 dark:bg-emerald-900/30",
    badge: "bg-emerald-200/50 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200",
  },
  {
    bg: "bg-[#FFF2E8] dark:bg-orange-950/25",
    hoverBg: "hover:bg-[#FFE3D1] dark:hover:bg-orange-900/35",
    border: "border-[#FFD1B3] dark:border-orange-800/40",
    text: "text-[#7C2D12] dark:text-orange-200",
    accent: "text-orange-700 dark:text-orange-300",
    imgBg: "bg-white/80 dark:bg-orange-900/30",
    badge: "bg-orange-200/50 text-orange-800 dark:bg-orange-900/60 dark:text-orange-200",
  },
  {
    bg: "bg-[#EEF2FF] dark:bg-indigo-950/25",
    hoverBg: "hover:bg-[#E0E7FF] dark:hover:bg-indigo-900/35",
    border: "border-[#C7D2FE] dark:border-indigo-800/40",
    text: "text-[#312E81] dark:text-indigo-200",
    accent: "text-indigo-700 dark:text-indigo-300",
    imgBg: "bg-white/80 dark:bg-indigo-900/30",
    badge: "bg-indigo-200/50 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200",
  },
  {
    bg: "bg-[#FDF2F8] dark:bg-pink-950/25",
    hoverBg: "hover:bg-[#FCE7F3] dark:hover:bg-pink-900/35",
    border: "border-[#FBCFE8] dark:border-pink-800/40",
    text: "text-[#831843] dark:text-pink-200",
    accent: "text-pink-700 dark:text-pink-300",
    imgBg: "bg-white/80 dark:bg-pink-900/30",
    badge: "bg-pink-200/50 text-pink-800 dark:bg-pink-900/60 dark:text-pink-200",
  },
];

function getTheme(item, index) {
  const str = String(item.id || item.query || item.name || index);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash + str.charCodeAt(i) * (i + 1)) % PASTEL_THEMES.length;
  }
  return PASTEL_THEMES[(hash + index) % PASTEL_THEMES.length];
}

function RecentSubCategoryCard({
  item,
  index,
  catalog = [],
  activeQuery = "",
  onSelectSearch,
  onRemoveItem,
}) {
  const [imgError, setImgError] = useState(false);

  const name = formatCategoryName(
    item.name || item.subcategoryName || item.subcategory_name || item.query || "Subcategory"
  );
  const code = item.code || item.subcategoryCode || item.subcategory_code || "";
  const parentName = formatCategoryName(item.categoryName || item.category_name || item.parentName || "");

  // Match against catalog to get real uploaded image
  const catalogMatch = (catalog || []).find((s) => {
    const sName = (s.subcategoryName || s.subcategory_name || "").toLowerCase();
    const sCode = (s.subcategoryCode || s.subcategory_code || "").toLowerCase();
    const itemName = (item.name || item.query || "").toLowerCase();
    const itemCode = (item.code || "").toLowerCase();
    return (
      (s.id && item.id && String(s.id) === String(item.id)) ||
      (sName && itemName && sName === itemName) ||
      (itemCode && sCode && sCode === itemCode)
    );
  });

  const realCatalogImage = catalogMatch?.imageUrl || catalogMatch?.image_url;
  const rawItemImage = item?.imageUrl || item?.image_url;

  let resolvedImageUrl = null;
  if (catalogMatch) {
    if (realCatalogImage) {
      resolvedImageUrl = normalizeCategoryImageUrl(realCatalogImage);
    }
  } else if (rawItemImage && !rawItemImage.includes("images.unsplash.com")) {
    resolvedImageUrl = normalizeCategoryImageUrl(rawItemImage);
  }

  const query = item.query || name;
  const isSelected =
    Boolean(activeQuery) &&
    (activeQuery || "").trim().toLowerCase() === query.trim().toLowerCase();

  const theme = getTheme(item, index);
  const showImage = Boolean(resolvedImageUrl) && !imgError;

  const handleClick = () => {
    const target = catalogMatch || item;
    onSelectSearch?.({
      ...target,
      name,
      query: name,
    });
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative flex flex-col items-center justify-between shrink-0 cursor-pointer rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 border transition-all duration-200 select-none ${theme.bg} ${theme.border} ${theme.hoverBg} ${
        isSelected
          ? "ring-2.5 ring-primary shadow-md scale-[1.03] -translate-y-0.5"
          : "shadow-2xs hover:shadow-md hover:-translate-y-1"
      }`}
      style={{
        width: "106px",
        minWidth: "106px",
        maxWidth: "112px",
        minHeight: "142px",
      }}
    >
      {onRemoveItem && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemoveItem(item.id || item.query || name);
          }}
          className="absolute -top-1.5 -right-1.5 z-20 w-4.5 h-4.5 rounded-full bg-white dark:bg-base-200 text-base-content/60 hover:text-rose-600 hover:scale-110 shadow-sm border border-base-300/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150 cursor-pointer active:scale-90"
          title="Remove from recent"
        >
          <X className="w-2.5 h-2.5" />
        </button>
      )}

      {/* Product Image / Icon */}
      <div
        className={`relative w-15 h-15 sm:w-16 sm:h-16 rounded-2xl ${theme.imgBg} border border-white/60 dark:border-white/10 shadow-2xs overflow-hidden flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105`}
      >
        {showImage ? (
          <img
            src={resolvedImageUrl}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-1">
            <Tags className={`w-6 h-6 ${theme.accent}`} />
          </div>
        )}

        {isSelected && (
          <div className="absolute top-1 right-1 z-10 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
            <Check className="w-2.5 h-2.5" />
          </div>
        )}
      </div>

      {/* Title & Metadata */}
      <div className="w-full text-center mt-2 flex flex-col items-center min-w-0">
        <span
          className={`text-[11px] sm:text-xs font-bold leading-tight truncate w-full block ${theme.text}`}
          title={name}
        >
          {name}
        </span>
        {parentName && (
          <span className="text-[9px] text-base-content/50 truncate w-full block mt-0.5">
            {parentName}
          </span>
        )}
        {code && (
          <span
            className={`mt-1 text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded-md ${theme.badge} max-w-[90px] truncate`}
          >
            {code}
          </span>
        )}
      </div>
    </div>
  );
}

export default function SubCategoryRecentSearches({
  recentSearches = [],
  catalog = [],
  onSelectSearch,
  onClearAll,
  onRemoveItem,
  activeQuery = "",
  className = "",
}) {
  if (!recentSearches || recentSearches.length === 0) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl bg-base-200/50 dark:bg-base-200/20 border border-base-300/80 p-3 sm:p-4 space-y-3 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Clock className="w-3 h-3" />
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-base-content tracking-tight select-none">
            Recent searches
          </h4>
          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-full bg-base-300/80 text-base-content/60">
            {recentSearches.length}
          </span>
        </div>

        {onClearAll && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClearAll();
            }}
            className="text-xs font-semibold text-base-content/60 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer select-none px-2.5 py-1 rounded-lg hover:bg-rose-500/10 active:scale-95 duration-150"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Horizontal Strip */}
      <div className="relative">
        <div className="flex items-stretch gap-2.5 sm:gap-3.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none scroll-smooth">
          {recentSearches.map((item, index) => (
            <RecentSubCategoryCard
              key={item.id || `${item.name || item.query || "item"}-${index}`}
              item={item}
              index={index}
              catalog={catalog}
              activeQuery={activeQuery}
              onSelectSearch={onSelectSearch}
              onRemoveItem={onRemoveItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
