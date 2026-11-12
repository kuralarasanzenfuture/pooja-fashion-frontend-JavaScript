import React, { useState, useRef, useEffect } from "react";
import { Layers, ChevronDown, Check, Search, AlertCircle } from "lucide-react";

/**
 * Premium DaisyUI Size Group Select Component
 * Replaces native HTML select with a luxury, accessible DaisyUI styled dropdown.
 */
export default function SizeGroupSelect({
  value,
  onChange,
  onBlur,
  sizeGroups = [],
  isLoading = false,
  error,
  disabled = false,
  label = "Parent Size Group",
  required = false,
  helperText,
  placeholder = "-- Select Parent Size Group --",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedGroup = sizeGroups.find((g) => String(g.id) === String(value));

  // Filter size groups if search query is entered
  const filteredGroups = sizeGroups.filter((g) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    const name = String(g.sizeGroupName || g.size_group_name || "").toLowerCase();
    const code = String(g.sizeGroupCode || g.size_group_code || "").toLowerCase();
    const desc = String(g.description || "").toLowerCase();
    return name.includes(q) || code.includes(q) || desc.includes(q);
  });

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        if (onBlur) onBlur();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onBlur]);

  // Focus search input when opening
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    if (!isOpen) {
      setSearch("");
    }
  }, [isOpen]);

  const handleSelect = (group) => {
    if (disabled) return;
    onChange(group.id);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className={`space-y-1.5 relative ${className}`} ref={dropdownRef}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/70">
            {label} {required && <span className="text-error">*</span>}
          </label>
          <span className="text-[11px] text-base-content/50">
            {sizeGroups.length} active {sizeGroups.length === 1 ? "group" : "groups"}
          </span>
        </div>
      )}

      {/* DaisyUI Styled Trigger Box */}
      <div
        tabIndex={0}
        role="button"
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 bg-base-100 ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-base-200"
            : isOpen
            ? "border-primary ring-2 ring-primary/20 shadow-sm"
            : error
            ? "border-error focus:border-error ring-1 ring-error/20"
            : "border-base-300 hover:border-primary/50"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Layers className="w-4 h-4" />
          </div>

          {selectedGroup ? (
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-semibold text-base-content truncate">
                {selectedGroup.sizeGroupName || selectedGroup.size_group_name}
              </span>
              {(selectedGroup.sizeGroupCode || selectedGroup.size_group_code) && (
                <span className="badge badge-sm badge-primary font-mono text-[10px] uppercase font-bold tracking-wider shrink-0">
                  {selectedGroup.sizeGroupCode || selectedGroup.size_group_code}
                </span>
              )}
            </div>
          ) : (
            <span className="text-base-content/40 font-normal">
              {isLoading ? "Loading available size groups..." : placeholder}
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-base-content/50 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </div>

      {/* DaisyUI Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-base-100 rounded-2xl border border-base-300 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {sizeGroups.length > 3 && (
            <div className="p-2 border-b border-base-200 bg-base-200/40">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search size group name or code..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-base-300 bg-base-100 text-base-content focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto p-1.5 space-y-1">
            {filteredGroups.length === 0 ? (
              <div className="p-4 text-center text-xs text-base-content/50">
                No matching size groups found
              </div>
            ) : (
              filteredGroups.map((g) => {
                const isSelected = String(g.id) === String(value);
                const gName = g.sizeGroupName || g.size_group_name;
                const gCode = g.sizeGroupCode || g.size_group_code;
                const desc = g.description;

                return (
                  <div
                    key={g.id}
                    onClick={() => handleSelect(g)}
                    className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? "bg-primary text-primary-content shadow-xs font-semibold"
                        : "hover:bg-base-200/80 text-base-content"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <Layers className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-xs sm:text-sm font-medium">
                            {gName}
                          </span>
                          {gCode && (
                            <span
                              className={`badge badge-xs text-[9px] font-mono uppercase font-bold tracking-wider ${
                                isSelected
                                  ? "badge-ghost bg-white/20 text-white"
                                  : "badge-primary"
                              }`}
                            >
                              {gCode}
                            </span>
                          )}
                        </div>
                        {desc && (
                          <p
                            className={`text-[11px] truncate mt-0.5 ${
                              isSelected ? "text-white/80" : "text-base-content/50"
                            }`}
                          >
                            {desc}
                          </p>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-error mt-1 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {helperText && !error && (
        <p className="text-[11px] text-base-content/50 mt-1">{helperText}</p>
      )}
    </div>
  );
}

