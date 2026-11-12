import { Clock, X, Trash2, ArrowRight } from "lucide-react";
import SizeGroupThumb from "./SizeGroupThumb.jsx";

/**
 * Dropdown overlay for recent size group searches
 */
export default function SizeGroupRecentSearches({
  isOpen = false,
  recentSearches = [],
  onSelectSearch,
  onClearAll,
  onRemoveItem,
}) {
  if (!isOpen || recentSearches.length === 0) return null;

  return (
    <div className="absolute left-0 right-0 top-full mt-2 z-40 rounded-2xl bg-base-100 border border-base-300 shadow-2xl p-3 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between px-2 pb-2 mb-1.5 border-b border-base-200 text-xs font-semibold text-base-content/60">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-primary" />
          <span>Recent Size Group Searches</span>
        </div>
        {onClearAll && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-64 overflow-y-auto scrollbar-thin p-0.5">
        {recentSearches.map((item) => {
          const name = item.name || item.sizeGroupName || item.query || "";
          const code = item.code || item.sizeGroupCode || "";

          return (
            <div
              key={item.id || item.query || name}
              onClick={() => onSelectSearch(item)}
              className="group flex items-center justify-between gap-2.5 p-2 rounded-xl bg-base-200/50 hover:bg-base-200 border border-base-300/50 hover:border-primary/30 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <SizeGroupThumb name={name} size="sm" />
                <div className="min-w-0 truncate">
                  <div className="text-xs font-bold text-base-content group-hover:text-primary transition-colors truncate">
                    {name}
                  </div>
                  {code && (
                    <div className="text-[10px] font-mono text-base-content/50 truncate">
                      {code}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {onRemoveItem && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveItem(item);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-base-content/40 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                    title="Remove from history"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                <ArrowRight className="w-3.5 h-3.5 text-base-content/30 group-hover:text-primary transition-colors" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

