import { Search, X } from "lucide-react";

export default function SidebarSearch({ searchQuery, onSearchChange, onClear, collapsed }) {
  if (collapsed) {
    return null;
  }

  return (
    <div className="px-3 py-2">
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Quick search menu..."
          className="w-full pl-8 pr-7 py-1.5 text-xs font-medium text-slate-800 bg-slate-100/90 hover:bg-slate-100 focus:bg-white border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all placeholder:text-slate-400"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
