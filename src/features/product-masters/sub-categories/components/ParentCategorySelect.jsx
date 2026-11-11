import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  ChevronDown,
  Search,
  X,
  Check,
  FolderTree,
  Tags,
  SearchX,
} from "lucide-react";
import { normalizeCategoryImageUrl, formatCategoryName } from "../../categories/utils/categoryImageHelper.js";

/**
 * Thumbnail component with graceful image load and fallback
 */
function CategoryOptionThumb({ url, name, size = "md" }) {
  const [imgError, setImgError] = useState(false);
  const resolvedUrl = useMemo(() => normalizeCategoryImageUrl(url), [url]);

  const sizeClass =
    size === "sm"
      ? "size-8 rounded-lg"
      : size === "lg"
      ? "size-12 rounded-xl"
      : "size-10 rounded-xl";

  if (resolvedUrl && !imgError) {
    return (
      <div
        className={`${sizeClass} overflow-hidden border border-base-300 bg-base-200/80 shrink-0 shadow-2xs relative`}
      >
        <img
          src={resolvedUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-base-200 text-primary flex items-center justify-center shrink-0 shadow-2xs`}
    >
      <Tags className={size === "sm" ? "size-3.5" : "size-4"} />
    </div>
  );
}

/**
 * ParentCategorySelect
 * Luxury searchable dropdown with instant keyboard filtering,
 * rich category image previews, category code badges, and smooth animations.
 */
export default function ParentCategorySelect({
  categories = [],
  value = "",
  onChange,
  disabled = false,
  error = null,
  placeholder = "Select a parent category...",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);

  // Find currently selected category
  const selectedCategory = useMemo(() => {
    if (!value) return null;
    return categories.find((c) => String(c.id) === String(value)) || null;
  }, [categories, value]);

  // Filter categories by search query (name or code)
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase().trim();
    return categories.filter((cat) => {
      const name = String(cat.categoryName || cat.category_name || "").toLowerCase();
      const code = String(cat.categoryCode || cat.category_code || "").toLowerCase();
      const company = String(cat.companyName || cat.company_name || "").toLowerCase();
      return name.includes(q) || code.includes(q) || company.includes(q);
    });
  }, [categories, searchQuery]);

  // Auto-focus search input when opening
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setHighlightedIndex(0);
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Keep highlighted index in bounds
  useEffect(() => {
    setHighlightedIndex((prev) => {
      if (filteredCategories.length === 0) return 0;
      return Math.min(prev, filteredCategories.length - 1);
    });
  }, [filteredCategories.length]);

  // Auto-scroll highlighted option into view
  useEffect(() => {
    if (!isOpen || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-index="${highlightedIndex}"]`);
    if (el) {
      el.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, isOpen]);

  // Close on outside click or global Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleGlobalKeyDown = (e) => {
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
      document.addEventListener("keydown", handleGlobalKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [isOpen, searchQuery]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        if (!disabled) setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredCategories.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCategories.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = filteredCategories[highlightedIndex];
      if (target) {
        handleSelect(target);
      }
    }
  };

  const handleSelect = (category) => {
    onChange?.(String(category.id), category);
    setIsOpen(false);
  };

  const selectedName = formatCategoryName(
    selectedCategory?.categoryName || selectedCategory?.category_name || ""
  );
  const selectedCode =
    selectedCategory?.categoryCode || selectedCategory?.category_code || "";
  const selectedImage =
    selectedCategory?.imageUrl || selectedCategory?.image_url || null;

  return (
    <div
      ref={containerRef}
      className="relative w-full text-left"
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full px-3.5 py-2 rounded-xl border bg-base-100 flex items-center justify-between gap-3 transition-all cursor-pointer select-none focus:outline-none ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-base-200/50 border-base-300"
            : isOpen
            ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
            : error
            ? "border-rose-500 ring-2 ring-rose-500/20 text-rose-600"
            : "border-base-300 hover:border-primary/50 hover:bg-base-200/30"
        }`}
      >
        {selectedCategory ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <CategoryOptionThumb
              url={selectedImage}
              name={selectedName}
              size="sm"
            />
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs sm:text-sm font-bold text-base-content truncate">
                {selectedName}
              </span>
              {selectedCode && (
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 shrink-0">
                  {selectedCode}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 text-base-content/40">
            <FolderTree className="size-4 shrink-0" />
            <span className="text-xs sm:text-sm font-normal truncate">
              {placeholder}
            </span>
          </div>
        )}

        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          {selectedCategory && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          )}
          <ChevronDown
            className={`size-4 text-base-content/40 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-primary" : ""
            }`}
          />
        </div>
      </button>

      {/* Floating Menu Popover */}
      {isOpen && (
        <div
          role="listbox"
          tabIndex={-1}
          className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-2xl bg-base-100 text-base-content border border-base-300 shadow-2xl shadow-slate-900/15 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Pinned Sticky Search Bar */}
          <div className="p-2 border-b border-base-200/80 bg-base-100 sticky top-0 z-10">
            <div className="relative flex items-center">
              <Search className="size-3.5 absolute left-3 text-base-content/40 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(0);
                }}
                placeholder="Search category by name or code..."
                className="w-full pl-8.5 pr-8 py-2 text-xs bg-base-200/50 hover:bg-base-200/80 focus:bg-base-100 border border-base-300/80 focus:border-primary rounded-xl text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
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
                  className="absolute right-2.5 p-0.5 rounded-full text-base-content/40 hover:text-base-content hover:bg-base-200 cursor-pointer transition-colors"
                  title="Clear search"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Categories List */}
          <div ref={listRef} className="max-h-60 overflow-y-auto p-1.5 space-y-1">
            {filteredCategories.length === 0 ? (
              <div className="py-7 px-3 text-center">
                <div className="size-9 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-2 text-base-content/40">
                  <SearchX className="size-4" />
                </div>
                <p className="text-xs font-semibold text-base-content/70">
                  No categories found
                </p>
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
              filteredCategories.map((cat, idx) => {
                const isSelected = String(cat.id) === String(value);
                const isHighlighted = idx === highlightedIndex;
                const catName = cat.categoryName || cat.category_name || "";
                const catCode = cat.categoryCode || cat.category_code || "";
                const catImage = cat.imageUrl || cat.image_url || null;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    data-index={idx}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onClick={() => handleSelect(cat)}
                    className={`w-full text-left p-2 rounded-xl flex items-center justify-between gap-3 transition-all cursor-pointer group ${
                      isSelected
                        ? "bg-primary/10 text-primary border border-primary/30 font-bold shadow-2xs"
                        : isHighlighted
                        ? "bg-primary/5 text-primary"
                        : "text-base-content hover:bg-base-200/70 hover:text-primary"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CategoryOptionThumb
                        url={catImage}
                        name={catName}
                        size="md"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-xs font-semibold truncate ${
                              isSelected ? "text-primary font-bold" : "text-base-content"
                            }`}
                          >
                            {formatCategoryName(catName)}
                          </span>
                          {catCode && (
                            <span
                              className={`text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded ${
                                isSelected
                                  ? "bg-primary/20 text-primary"
                                  : "bg-base-200 text-base-content/65"
                              }`}
                            >
                              {catCode}
                            </span>
                          )}
                        </div>

                        {cat.companyName && (
                          <span className="text-[10px] text-base-content/40 block truncate mt-0.5">
                            {cat.companyName}
                          </span>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="size-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Check className="size-3" />
                      </div>
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
