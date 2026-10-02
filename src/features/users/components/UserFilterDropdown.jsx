import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

/**
 * Custom Filter Dropdown matching Pooja Fashion's Application Brand Theme (#2A0081 Royal Purple)
 * Provides custom floating menus without OS-native styling, harsh black focus rings, or double borders.
 */
export default function UserFilterDropdown({
  label,
  value,
  options = [],
  onChange,
  icon: Icon,
  minWidth = "min-w-[145px]",
  align = "left",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click or escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
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
  }, [isOpen]);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));
  const isFiltered = value !== "" && value !== undefined && value !== null;
  const displayLabel = selectedOption ? selectedOption.label : label;

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all duration-200 cursor-pointer select-none focus:outline-none ${minWidth} ${
          isOpen
            ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20 shadow-xs"
            : isFiltered
            ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs ring-1 ring-primary/30"
            : "border-base-300 bg-base-100 text-base-content hover:border-primary/40 hover:bg-base-200/50"
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-1.5 min-w-0 truncate">
          {Icon && (
            <Icon
              className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                isFiltered || isOpen ? "text-primary" : "text-base-content/50"
              }`}
            />
          )}
          <span className="truncate">{displayLabel}</span>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-1">
          {isFiltered && (
            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 animate-pulse" />
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-primary" : "text-base-content/40"
            }`}
          />
        </div>
      </button>

      {/* Floating Menu */}
      {isOpen && (
        <div
          className={`absolute top-full mt-1.5 z-50 min-w-[190px] max-h-64 overflow-y-auto rounded-2xl bg-base-100 text-base-content border border-base-300 shadow-2xl shadow-slate-900/15 p-1.5 animate-in fade-in zoom-in-95 duration-150 ${
            align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left"
          }`}
          role="listbox"
        >
          <div className="space-y-0.5">
            {options.map((option) => {
              const isSelected = String(option.value) === String(value);

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary text-primary-content font-bold shadow-xs"
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
            })}
          </div>
        </div>
      )}
    </div>
  );
}
