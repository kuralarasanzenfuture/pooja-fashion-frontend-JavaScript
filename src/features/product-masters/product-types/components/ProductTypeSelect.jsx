import React, { useState, useRef, useEffect } from "react";
import { Tag, ChevronDown, Check, Search, AlertCircle, X } from "lucide-react";
import ProductTypeThumb from "./ProductTypeThumb.jsx";

/**
 * Premium DaisyUI Product Type Select Component
 * Replaces native HTML select with an accessible DaisyUI styled dropdown.
 */
export default function ProductTypeSelect({
  value,
  onChange,
  onBlur,
  productTypes = [],
  isLoading = false,
  error,
  disabled = false,
  label = "Product Type",
  required = false,
  helperText,
  placeholder = "-- Select Product Type --",
  className = "",
  allowClear = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedType = productTypes.find(
    (pt) => String(pt.id) === String(value) || String(pt.typeCode) === String(value)
  );

  const filteredTypes = productTypes.filter((pt) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    const name = String(pt.typeName || pt.type_name || "").toLowerCase();
    const code = String(pt.typeCode || pt.type_code || "").toLowerCase();
    return name.includes(q) || code.includes(q);
  });

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onBlur]);

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

  const handleSelect = (pt) => {
    onChange?.(pt.id);
    setIsOpen(false);
    if (onBlur) onBlur();
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.("");
    if (onBlur) onBlur();
  };

  return (
    <div className={`form-control w-full ${className}`} ref={dropdownRef}>
      {label && (
        <label className="label py-1">
          <span className="text-xs sm:text-sm font-semibold text-base-content flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-primary" />
            <span>{label}</span>
            {required && <span className="text-rose-500">*</span>}
          </span>
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          disabled={disabled || isLoading}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full min-h-[42px] px-3.5 py-2 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
            error
              ? "border-rose-500 bg-rose-500/5 focus:ring-2 focus:ring-rose-500/20"
              : isOpen
              ? "border-primary bg-base-100 shadow-md ring-2 ring-primary/20"
              : "border-base-300 bg-base-200/50 hover:bg-base-200 hover:border-base-300"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {selectedType ? (
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <ProductTypeThumb
                code={selectedType.typeCode || selectedType.type_code}
                name={selectedType.typeName || selectedType.type_name}
                size="xs"
              />
              <span className="text-xs sm:text-sm font-bold text-base-content truncate">
                {selectedType.typeName || selectedType.type_name}
              </span>
              {(selectedType.typeCode || selectedType.type_code) && (
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20 shrink-0">
                  {selectedType.typeCode || selectedType.type_code}
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs sm:text-sm text-base-content/40 font-normal">
              {isLoading ? "Loading product types..." : placeholder}
            </span>
          )}

          <div className="flex items-center gap-1 shrink-0">
            {allowClear && selectedType && !disabled && (
              <span
                onClick={handleClear}
                className="p-1 rounded-full hover:bg-base-300 text-base-content/40 hover:text-base-content transition-colors cursor-pointer"
                title="Clear selection"
              >
                <X className="w-3.5 h-3.5" />
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 text-base-content/50 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-50 left-0 right-0 mt-1.5 bg-base-100 border border-base-300 rounded-2xl shadow-xl overflow-hidden py-1 animate-in fade-in-50 duration-150">
            {productTypes.length > 5 && (
              <div className="p-2 border-b border-base-200">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-base-content/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search product types..."
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-base-300 bg-base-200/50 text-base-content focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            )}

            <div className="max-h-56 overflow-y-auto py-1">
              {filteredTypes.length === 0 ? (
                <div className="px-3 py-4 text-center text-xs text-base-content/50">
                  No product types found
                </div>
              ) : (
                filteredTypes.map((pt) => {
                  const isSelected = String(pt.id) === String(value);
                  const name = pt.typeName || pt.type_name;
                  const code = pt.typeCode || pt.type_code;

                  return (
                    <button
                      key={pt.id}
                      type="button"
                      onClick={() => handleSelect(pt)}
                      className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-primary/10 text-primary font-bold"
                          : "hover:bg-base-200 text-base-content"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <ProductTypeThumb code={code} name={name} size="xs" />
                        <span className="truncate">{name}</span>
                        {code && (
                          <span className="font-mono text-[10px] px-1 py-0.2 rounded bg-base-200 text-base-content/60 border border-base-300 shrink-0">
                            {code}
                          </span>
                        )}
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-primary shrink-0 ml-2" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {error ? (
        <label className="label py-1">
          <span className="label-text-alt text-rose-500 font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {error}
          </span>
        </label>
      ) : helperText ? (
        <label className="label py-1">
          <span className="label-text-alt text-base-content/50">{helperText}</span>
        </label>
      ) : null}
    </div>
  );
}
