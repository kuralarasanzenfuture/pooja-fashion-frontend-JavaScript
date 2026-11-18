import React from "react";
import { History, X, Search } from "lucide-react";

/**
 * TaxRecentSearches Component
 * Dropdown popover displaying user's recent tax search queries
 */
export default function TaxRecentSearches({
  isOpen = false,
  items = [],
  onSelect,
  onClearAll,
  onRemoveItem,
}) {
  if (!isOpen || !items || items.length === 0) return null;

  return (
    <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-base-100 border border-base-200/90 rounded-2xl shadow-xl overflow-hidden py-2 animate-in fade-in-50 duration-150">
      <div className="flex items-center justify-between px-3.5 pb-2 border-b border-base-200 text-[11px] font-bold uppercase tracking-wider text-base-content/50">
        <span className="flex items-center gap-1.5">
          <History className="w-3.5 h-3.5 text-primary" /> Recent Searches
        </span>
        <button
          type="button"
          onClick={onClearAll}
          className="text-primary hover:underline lowercase font-semibold cursor-pointer"
        >
          clear all
        </button>
      </div>

      <div className="max-h-48 overflow-y-auto py-1">
        {items.map((item, idx) => {
          const text = typeof item === "string" ? item : item.name || item.query;
          return (
            <div
              key={`${text}-${idx}`}
              className="flex items-center justify-between px-3.5 py-1.5 hover:bg-base-200/70 transition-colors text-xs text-base-content group cursor-pointer"
              onClick={() => onSelect(item)}
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="w-3 h-3 text-base-content/40 group-hover:text-primary transition-colors" />
                <span className="truncate font-medium">{text}</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveItem(idx);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-base-300/50 rounded-full text-base-content/40 hover:text-rose-500 transition-all cursor-pointer"
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
