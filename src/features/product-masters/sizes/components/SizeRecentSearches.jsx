import { Clock, X, ArrowUpRight, Trash2 } from "lucide-react";

/**
 * Recent Searches popover for Sizes module
 */
export default function SizeRecentSearches({
  isOpen = false,
  items = [],
  onSelect,
  onClearAll,
  onRemoveItem,
}) {
  if (!isOpen || !items || items.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-base-300 bg-base-100 p-3 shadow-xl z-30 animate-in fade-in-50 zoom-in-95 duration-150">
      <div className="flex items-center justify-between px-2 pb-2 border-b border-base-200">
        <div className="flex items-center gap-1.5 text-xs font-bold text-base-content/60">
          <Clock className="w-3.5 h-3.5" />
          <span>Recent Searches</span>
        </div>
        {onClearAll && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div className="pt-2 flex flex-wrap gap-1.5">
        {items.map((item, idx) => {
          const text = typeof item === "string" ? item : item.name || item.query;
          const key = typeof item === "string" ? `${item}-${idx}` : item.id || `${text}-${idx}`;

          return (
            <div
              key={key}
              className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-base-200 hover:bg-base-300/80 text-xs text-base-content/80 font-medium transition-all"
            >
              <button
                type="button"
                onClick={() => onSelect?.(item)}
                className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
              >
                <span>{text}</span>
                <ArrowUpRight className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" />
              </button>
              {onRemoveItem && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveItem(item);
                  }}
                  className="text-base-content/40 hover:text-rose-500 p-0.5 rounded transition-colors cursor-pointer"
                  title="Remove from history"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

