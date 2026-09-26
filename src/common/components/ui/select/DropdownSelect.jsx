import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, AlertCircle } from "lucide-react";

/**
 * Premium Tailwind UI Dropdown Select Component
 * Replaces native HTML select elements with an interactive, accessible, themed dropdown.
 */
export default function DropdownSelect({
  label,
  required = false,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  error = null,
  disabled = false,
  helperText = null,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Find currently selected option
  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (option) => {
    if (disabled) return;
    setIsOpen(false);
    if (onChange) {
      // Support standard HTML event shape or raw value
      onChange({
        target: {
          name,
          value: option.value,
        },
      });
    }
  };

  const SelectedIcon = selectedOption?.icon;

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-base-content/70 mb-1">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full px-3.5 py-2.5 text-left text-sm rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 outline-hidden ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-base-200/50 border-base-300"
            : isOpen
            ? "bg-base-100 border-primary ring-2 ring-primary/20 shadow-sm"
            : error
            ? "bg-base-100 border-rose-400 focus:border-rose-500 ring-1 ring-rose-500/20 text-rose-600"
            : "bg-base-100 border-base-300 hover:border-base-content/30 hover:bg-base-200/30"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {SelectedIcon && (
            <div className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <SelectedIcon className="w-3.5 h-3.5" />
            </div>
          )}
          <span
            className={`truncate font-medium ${
              selectedOption ? "text-base-content" : "text-base-content/40"
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="badge badge-xs badge-primary font-bold uppercase tracking-wider text-[9px] px-1.5 py-0.5">
              {selectedOption.badge}
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-base-content/50 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu Popup */}
      {isOpen && (
        <div
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 left-0 right-0 top-full mt-1.5 max-h-64 overflow-y-auto rounded-2xl bg-base-100/95 backdrop-blur-md border border-base-300 shadow-2xl p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150"
        >
          {options.map((option) => {
            const isSelected = String(option.value) === String(value);
            const OptionIcon = option.icon;

            return (
              <div
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option)}
                className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-primary/15 text-primary font-bold shadow-xs"
                    : "text-base-content hover:bg-base-200/80 hover:text-primary"
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  {OptionIcon && (
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? "bg-primary text-primary-content"
                          : "bg-base-200 text-base-content/70"
                      }`}
                    >
                      <OptionIcon className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate">{option.label}</span>
                      {option.badge && (
                        <span
                          className={`badge badge-xs text-[9px] uppercase font-bold tracking-wider ${
                            isSelected
                              ? "badge-primary text-primary-content"
                              : "badge-ghost text-base-content/60"
                          }`}
                        >
                          {option.badge}
                        </span>
                      )}
                    </div>
                    {option.description && (
                      <p className="text-[11px] font-normal text-base-content/50 truncate mt-0.5">
                        {option.description}
                      </p>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Error or Helper Text */}
      {error ? (
        <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-base-content/50 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}
