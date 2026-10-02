import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, CheckCircle2, AlertCircle, Ban } from "lucide-react";

const STATUS_OPTIONS = [
  {
    value: "active",
    label: "Active (Full Access)",
    dotColor: "bg-emerald-500",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: CheckCircle2,
    description: "User has full access to assigned store modules and features.",
  },
  {
    value: "inactive",
    label: "Inactive (Suspended)",
    dotColor: "bg-amber-500",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    icon: AlertCircle,
    description: "Account temporarily disabled. User cannot sign in.",
  },
  {
    value: "blocked",
    label: "Blocked (Restricted)",
    dotColor: "bg-rose-500",
    badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    icon: Ban,
    description: "Security lockdown. System access revoked.",
  },
];

/**
 * Premium DaisyUI Status Select Component
 * Replaces native HTML select with a luxury, accessible DaisyUI styled dropdown.
 */
export default function StatusSelect({
  value = "active",
  onChange,
  disabled = false,
  label = "Account Status",
  helperText,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption =
    STATUS_OPTIONS.find((opt) => opt.value === value) || STATUS_OPTIONS[0];

  // Close when clicking outside
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

  const handleSelect = (option) => {
    if (disabled) return;
    onChange(option.value);
    setIsOpen(false);
  };

  const SelectedIcon = selectedOption.icon;

  return (
    <div className={`space-y-1.5 relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/70">
          {label}
        </label>
      )}

      {/* Trigger Box */}
      <div
        tabIndex={0}
        role="button"
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 bg-base-100 ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-base-200"
            : isOpen
            ? "border-primary ring-2 ring-primary/20 shadow-sm"
            : "border-base-300 hover:border-primary/50"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${selectedOption.badgeColor}`}
          >
            <SelectedIcon className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <span className="font-semibold text-base-content text-xs sm:text-sm truncate">
              {selectedOption.label}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${selectedOption.dotColor} shrink-0 animate-pulse`}
            />
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-base-content/50 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </div>

      {/* Floating Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-base-100 rounded-2xl border border-base-300 shadow-2xl shadow-slate-950/15 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
          {STATUS_OPTIONS.map((opt) => {
            const isSelected = opt.value === value;
            const OptIcon = opt.icon;

            return (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt)}
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
                        : `${opt.badgeColor} border`
                    }`}
                  >
                    <OptIcon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-xs sm:text-sm font-semibold">
                        {opt.label}
                      </span>
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          isSelected ? "bg-white" : opt.dotColor
                        }`}
                      />
                    </div>
                    <p
                      className={`text-[11px] truncate mt-0.5 ${
                        isSelected ? "text-white/80" : "text-base-content/50"
                      }`}
                    >
                      {opt.description}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {helperText && <p className="text-[11px] text-base-content/50">{helperText}</p>}
    </div>
  );
}
