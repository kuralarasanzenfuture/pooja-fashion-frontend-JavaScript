import React from "react";
import { History, X, Clock } from "lucide-react";

/**
 * UnitRecentSearches Popover
 * Displays recent unit search keywords saved in localStorage.
 */
export default function UnitRecentSearches({
  isOpen,
  items = [],
  onSelect,
  onClearAll,
  onRemoveItem,
}) {
  if (!isOpen || items.length === 0) return null;

  return (
    <div className="absolute left-0 right-0 top-full mt-2 bg-base-100 rounded-2xl border border-base-300 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-base-200">
        <div className="flex items-center gap-1.5 text-xs font-bold text-base-content/60 uppercase tracking-wider">
          <History className="w-3.5 h-3.5 text-primary" />
          <span>Recent Searches</span>
        </div>
        <button
          type="button"
          onClick={onClearAll}
          className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 hover:underline cursor-pointer"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-1 max-h-48 overflow-y-auto">
        {items.map((item, idx) => {
          const text = typeof item === "string" ? item : item.name || item.query;
          return (
            <div
              key={idx}
              className="flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-base-200 text-xs text-base-content/80 group cursor-pointer"
              onClick={() => onSelect(item)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Clock className="w-3.5 h-3.5 text-base-content/40 group-hover:text-primary transition-colors shrink-0" />
                <span className="truncate font-medium">{text}</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveItem(idx);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 rounded-lg hover:bg-base-300/50 transition-all"
                title="Remove"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
