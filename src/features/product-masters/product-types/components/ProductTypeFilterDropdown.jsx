import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";

/**
 * ProductTypeFilterDropdown
 * Standardized luxury filter dropdown matching product masters design
 * with dot indicator support, keyboard navigation, and search capability.
 */
export default function ProductTypeFilterDropdown({
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
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={`h-9 px-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer select-none whitespace-nowrap ${
          isFiltered
            ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15 shadow-xs"
            : "border-base-300 bg-base-100 text-base-content/80 hover:bg-base-200/60 hover:border-base-300"
        } ${minWidth}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}

        {selectedOption?.dotColor && (
          <span className={`w-2 h-2 rounded-full ${selectedOption.dotColor} shrink-0`} />
        )}

        <span className="truncate flex-1 text-left">{currentLabel}</span>

        {isFiltered && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="p-0.5 rounded-full hover:bg-primary/20 text-primary transition-colors cursor-pointer"
            title="Clear filter"
          >
            <X className="w-3 h-3" />
          </span>
        )}

        <ChevronDown
          className={`w-3.5 h-3.5 text-base-content/50 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute z-50 mt-1 right-0 sm:left-0 sm:right-auto bg-base-100 border border-base-200/80 rounded-2xl shadow-xl overflow-hidden py-1 min-w-[190px] max-w-[280px] animate-in fade-in-50 duration-150 backdrop-blur-md"
          role="listbox"
        >
          {searchable && (
            <div className="p-2 border-b border-base-200/60">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-base-content/40 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-base-300 bg-base-200/50 text-base-content focus:outline-none focus:border-primary focus:bg-base-100 transition-all"
                />
              </div>
            </div>
          )}

          <div className="max-h-56 overflow-y-auto py-0.5">
            {showAll && (
              <button
                type="button"
                onClick={() => handleSelect("")}
                className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-base-200/70 transition-colors cursor-pointer ${
                  value === "" || value === undefined ? "text-primary font-bold bg-primary/5" : "text-base-content"
                }`}
              >
                <span>{allLabel}</span>
                {(value === "" || value === undefined) && (
                  <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                )}
              </button>
            )}

            {filteredOptions.length === 0 ? (
              <div className="px-3 py-3 text-center text-xs text-base-content/40">
                No options found
              </div>
            ) : (
              filteredOptions.map((opt, index) => {
                const isSelected = String(opt.value) === String(value);
                const isHighlighted = index === highlightedIndex;

                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? "text-primary font-bold bg-primary/10"
                        : isHighlighted
                        ? "bg-base-200 text-base-content"
                        : "hover:bg-base-200/70 text-base-content"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.dotColor && (
                        <span className={`w-2 h-2 rounded-full ${opt.dotColor} shrink-0`} />
                      )}
                      <span className="truncate">{opt.label || opt.name}</span>
                    </div>

                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-primary shrink-0 ml-2" />
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

