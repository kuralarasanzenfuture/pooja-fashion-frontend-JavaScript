import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";

/**
 * ColorFilterDropdown
 * Standardized luxury filter dropdown matching Category/Brand/Size dropdown design
 * with dot indicator support, keyboard navigation, and responsive placement.
 */
export default function ColorFilterDropdown({
  label,
  value,
  options = [],
  onChange,
  icon: Icon,
  minWidth = "min-w-[140px]",
  showAll = false,
  allLabel = "All",
  searchable = false,
  searchPlaceholder = "Search...",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    if (!isOpen) {
      setSearch("");
      setHighlightedIndex(-1);
    }
  }, [isOpen, searchable]);

  const filteredOptions = options.filter((opt) => {
    if (!search.trim()) return true;
    const labelText = opt.label || opt.name || String(opt.value || "");
    return labelText.toLowerCase().includes(search.toLowerCase());
  });

  const selectedOption = options.find((opt) => String(opt.value) === String(value));
  const isFiltered = value !== "" && value !== null && value !== undefined && value !== "all";

  const currentLabel = selectedOption?.label || selectedOption?.name || label;

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      const opt = filteredOptions[highlightedIndex];
      if (opt) handleSelect(opt.value);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Standardized Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
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
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.dotColor ? (
            <span className={`w-2 h-2 rounded-full shrink-0 ${selectedOption.dotColor}`} />
          ) : Icon ? (
            <Icon
              className={`w-3.5 h-3.5 shrink-0 ${
                isFiltered || isOpen ? "text-primary" : "text-base-content/50"
              }`}
            />
          ) : null}
          <span className="truncate">{currentLabel}</span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary" : "text-base-content/40"
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 sm:left-0 sm:right-auto mt-1.5 min-w-[180px] max-w-xs rounded-2xl border border-base-300 bg-base-100 p-1.5 shadow-2xl z-50 animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Search Box */}
          {searchable && (
            <div className="p-1 mb-1 border-b border-base-200">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-base-content/40 absolute left-2.5 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-7 py-1 text-xs rounded-lg bg-base-200/50 border-0 focus:ring-1 focus:ring-primary text-base-content placeholder:text-base-content/40"
                  onClick={(e) => e.stopPropagation()}
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-2 text-base-content/40 hover:text-base-content p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto space-y-0.5 py-0.5">
            {showAll && !search && !options.some((o) => o.value === "") && (
              <button
                type="button"
                onClick={() => handleSelect("")}
                className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer text-left ${
                  !isFiltered
                    ? "bg-primary text-primary-content font-bold shadow-xs"
                    : "text-base-content hover:bg-primary/10 hover:text-primary font-medium"
                }`}
              >
                <span>{allLabel} {label}</span>
                {!isFiltered && <Check className="w-4 h-4 shrink-0 text-primary-content ml-1" />}
              </button>
            )}

            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-xs text-base-content/50">
                No matching options
              </div>
            ) : (
              filteredOptions.map((opt, idx) => {
                const isSelected = String(opt.value) === String(value);
                const isHighlighted = idx === highlightedIndex;

                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer text-left ${
                      isSelected
                        ? "bg-primary text-primary-content font-bold shadow-xs"
                        : isHighlighted
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-base-content hover:bg-primary/10 hover:text-primary font-medium"
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      {opt.dotColor ? (
                        <span className={`w-2 h-2 rounded-full shrink-0 ${opt.dotColor}`} />
                      ) : opt.icon ? (
                        <opt.icon
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isSelected ? "text-primary-content" : "text-base-content/50"
                          }`}
                        />
                      ) : null}
                      <span className="truncate">{opt.label || opt.name}</span>
                    </span>
                    {isSelected && (
                      <Check className="w-4 h-4 shrink-0 text-primary-content ml-1" />
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
