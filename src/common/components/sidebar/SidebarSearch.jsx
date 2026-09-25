import { Search, X } from "lucide-react";

export default function SidebarSearch({ searchQuery, onSearchChange, onClear, collapsed }) {
  if (collapsed) {
    return null;
  }

  return (
    <div className="px-3 py-2">
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-base-content/40 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Quick search menu..."
          className="w-full pl-8 pr-7 py-2 text-sm font-medium text-base-content bg-base-200/80 hover:bg-base-200 focus:bg-base-100 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-base-content/40"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content p-0.5 rounded cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
