import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check, Search, X, SearchX } from "lucide-react";

/**
 * Custom Size Group Filter Dropdown matching application brand theme
 */
export default function SizeGroupFilterDropdown({
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

  const isSearchEnabled =
    searchable === true || (searchable === undefined && options.length > 5);

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

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase().trim();
    return options.filter((opt) => {
      const labelMatch = String(opt.label || "").toLowerCase().includes(q);
      const badgeMatch = opt.badge ? String(opt.badge).toLowerCase().includes(q) : false;
      return labelMatch || badgeMatch;
    });
  }, [options, searchQuery]);

  const selectedOption = useMemo(() => {
    return options.find((opt) => String(opt.value) === String(value)) || options[0];
  }, [options, value]);

  const handleSelect = (val) => {
    onChange?.(val);
    setIsOpen(false);
  };

  const handleListKeyDown = (e) => {
    if (!filteredOptions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredOptions[highlightedIndex]) {
        handleSelect(filteredOptions[highlightedIndex].value);
      }
    }
  };

  const isSelected = (val) => String(val) === String(value);
  const isFiltered = value !== "" && value !== undefined && value !== null && value !== "all";

  return (
    <div ref={dropdownRef} className="relative inline-block text-left" onKeyDown={handleListKeyDown}>
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
                isOpen || isFiltered
                  ? "text-primary"
                  : "text-base-content/50 group-hover:text-base-content/70"
              }`}
            />
          )}
          <span className="truncate">
            {selectedOption?.label || label || "Select option"}
          </span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary" : "text-base-content/40 group-hover:text-base-content/60"
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 mt-1.5 w-64 max-w-[90vw] rounded-2xl bg-base-100 border border-base-300 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {isSearchEnabled && (
            <div className="p-2 border-b border-base-200 bg-base-200/50">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-base-content/40 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setHighlightedIndex(0);
                  }}
                  placeholder={searchPlaceholder || `Search ${label || "options"}...`}
                  className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-base-100 border border-base-300 text-xs text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div ref={listRef} role="listbox" className="p-1 max-h-60 overflow-y-auto scrollbar-thin">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, idx) => {
                const active = isSelected(option.value);
                const isHighlighted = idx === highlightedIndex;
                const OptIcon = option.icon;

                return (
                  <button
                    key={String(option.value)}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => handleSelect(option.value)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer text-left ${
                      active
                        ? "bg-primary text-white font-semibold shadow-xs"
                        : isHighlighted
                        ? "bg-base-200 text-base-content"
                        : "text-base-content/80 hover:bg-base-200/60"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate min-w-0">
                      {OptIcon && (
                        <OptIcon
                          className={`w-3.5 h-3.5 shrink-0 ${
                            active ? "text-white" : "text-base-content/50"
                          }`}
                        />
                      )}
                      <span className="truncate">{option.label}</span>
                      {option.badge && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0 ${
                            active
                              ? "bg-white/20 text-white"
                              : "bg-base-200 text-base-content/60 border border-base-300"
                          }`}
                        >
                          {option.badge}
                        </span>
                      )}
                    </div>

                    {active && <Check className="w-3.5 h-3.5 shrink-0 text-white" />}
                  </button>
                );
              })
            ) : (
              <div className="py-6 px-3 text-center text-xs text-base-content/50 flex flex-col items-center gap-1.5">
                <SearchX className="w-5 h-5 text-base-content/30" />
                <span>No matching {label ? label.toLowerCase() : "options"}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

