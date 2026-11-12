import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check, Search, X, SearchX } from "lucide-react";

/**
 * Custom Category Filter Dropdown matching Pooja Fashion's Application Brand Theme (#2A0081 Royal Purple)
 * Provides luxury custom floating menus with search filtering, keyboard navigation, and responsive placement.
 */
export default function CategoryFilterDropdown({
  label,
  value,
  options = [],
  onChange,
  icon: Icon,
  minWidth = "min-w-[145px]",
  align = "left",
  searchable = undefined,
  searchPlaceholder = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);

  // Auto-enable search if explicit or if list has more than 5 options
  const isSearchEnabled =
    searchable === true || (searchable === undefined && options.length > 5);

  // Reset search and highlighted index when opening/closing
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setHighlightedIndex(0);
      if (isSearchEnabled) {
        const timer = setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, isSearchEnabled]);

  // Close dropdown on outside click or global escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        if (searchQuery) {
          setSearchQuery("");
        } else {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, searchQuery]);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase().trim();
    return options.filter((opt) => {
      const labelMatch = String(opt.label || "").toLowerCase().includes(q);
      const badgeMatch = opt.badge ? String(opt.badge).toLowerCase().includes(q) : false;
      const valueMatch = opt.value ? String(opt.value).toLowerCase().includes(q) : false;
      return labelMatch || badgeMatch || valueMatch;
    });
  }, [options, searchQuery]);

  // Keep highlighted index within bounds
  useEffect(() => {
    setHighlightedIndex((prev) => {
      if (filteredOptions.length === 0) return 0;
      return Math.min(prev, filteredOptions.length - 1);
    });
  }, [filteredOptions.length]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (!isOpen || !listRef.current) return;
    const highlightedEl = listRef.current.querySelector(`[data-index="${highlightedIndex}"]`);
    if (highlightedEl) {
      highlightedEl.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, isOpen]);

  // Keyboard navigation inside dropdown
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredOptions[highlightedIndex]) {
        onChange(filteredOptions[highlightedIndex].value);
        setIsOpen(false);
      }
    }
  };

  const selectedOption = options.find((opt) => String(opt.value) === String(value));
  const isFiltered = value !== "" && value !== undefined && value !== null && value !== "all";
  const displayLabel = selectedOption ? selectedOption.label : label;

  return (
    <div ref={dropdownRef} className="relative inline-block text-left" onKeyDown={handleKeyDown}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`group inline-flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer select-none border ${minWidth} ${
          isOpen
            ? "border-primary bg-primary/10 text-primary shadow-xs ring-2 ring-primary/20"
            : isFiltered
            ? "border-primary/40 bg-primary/5 text-primary hover:border-primary/70 hover:bg-primary/10"
            : "border-base-300 bg-base-100 text-base-content/80 hover:bg-base-200 hover:border-base-content/20"
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && (
            <Icon
              className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                isFiltered || isOpen ? "text-primary" : "text-base-content/50 group-hover:text-base-content/70"
              }`}
            />
          )}
          <span className="truncate">{displayLabel}</span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary" : "text-base-content/40 group-hover:text-base-content/60"
          }`}
        />
      </button>

      {/* Floating Menu */}
      {isOpen && (
        <div
          className={`absolute top-full mt-1.5 z-50 min-w-[220px] max-w-xs rounded-2xl bg-base-100 text-base-content border border-base-300 shadow-2xl shadow-slate-900/15 overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${
            align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left"
          }`}
          role="listbox"
        >
          {/* Pinned Search Input Header */}
          {isSearchEnabled && (
            <div className="p-1.5 border-b border-base-200/80 bg-base-100">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 absolute left-2.5 text-base-content/40 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setHighlightedIndex(0);
                  }}
                  placeholder={
                    searchPlaceholder ||
                    `Search ${typeof label === "string" ? label.toLowerCase() : "options"}...`
                  }
                  className="w-full pl-8 pr-7 py-1.5 text-xs bg-base-200/50 hover:bg-base-200/80 focus:bg-base-100 border border-base-300/80 focus:border-primary rounded-xl text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  onClick={(e) => e.stopPropagation()}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchQuery("");
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-2 p-0.5 rounded-full text-base-content/40 hover:text-base-content hover:bg-base-200 cursor-pointer transition-colors"
                    title="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Scrollable Options List */}
          <div ref={listRef} className="max-h-60 overflow-y-auto p-1.5 space-y-0.5">
            {filteredOptions.length === 0 ? (
              <div className="py-6 px-3 text-center">
                <div className="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-2 text-base-content/40">
                  <SearchX className="w-4 h-4" />
                </div>
                <p className="text-xs font-semibold text-base-content/70">No options found</p>
                <p className="text-[11px] text-base-content/40 mt-0.5">
                  No match for "{searchQuery}"
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchQuery("");
                    searchInputRef.current?.focus();
                  }}
                  className="mt-2 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                >
                  Clear search
                </button>
              </div>
            ) : (
              filteredOptions.map((option, idx) => {
                const isSelected = String(option.value) === String(value);
                const isHighlighted = idx === highlightedIndex;

                return (
                  <button
                    key={String(option.value)}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    data-index={idx}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary text-primary-content font-bold shadow-xs"
                        : isHighlighted
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-base-content hover:bg-primary/10 hover:text-primary font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 truncate">
                      {option.icon && (
                        <option.icon
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isSelected ? "text-primary-content" : "text-base-content/40"
                          }`}
                        />
                      )}
                      {option.dotColor && (
                        <span className={`w-2 h-2 rounded-full shrink-0 ${option.dotColor}`} />
                      )}
                      <span className="truncate">{option.label}</span>
                      {option.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                            isSelected
                              ? "bg-white/20 text-primary-content"
                              : "bg-base-200 text-base-content/60"
                          }`}
                        >
                          {option.badge}
                        </span>
                      )}
                    </div>

                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-primary-content shrink-0 ml-1" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
