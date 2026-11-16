import React from "react";
import { History, X } from "lucide-react";

/**
 * ColorRecentSearches
 * Horizontal chips showing recent searches with quick removal and 1-click query execution.
 */
export default function ColorRecentSearches({
  searches = [],
  onSelectSearch,
  onRemoveSearch,
  onClearAll,
}) {
  if (!searches || searches.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar text-xs">
      <div className="flex items-center gap-1 text-base-content/50 shrink-0 font-medium">
        <History className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Recent:</span>
      </div>

      <div className="flex items-center gap-1.5 flex-nowrap">
        {searches.map((term) => (
          <span
            key={term}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-base-200 hover:bg-base-300/80 text-base-content/80 border border-base-300 text-xs font-medium transition-all group shrink-0"
          >
            <button
              type="button"
              onClick={() => onSelectSearch?.(term)}
              className="cursor-pointer hover:text-primary transition-colors truncate max-w-[120px]"
            >
              {term}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveSearch?.(term);
              }}
              className="text-base-content/40 hover:text-rose-500 rounded-full p-0.5 transition-colors cursor-pointer"
              title="Remove from history"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {searches.length > 2 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-[11px] font-semibold text-base-content/40 hover:text-rose-500 hover:underline px-1 shrink-0 cursor-pointer transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
