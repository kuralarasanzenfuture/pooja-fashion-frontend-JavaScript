import React, { useState, useRef, useEffect } from "react";
import { Building, ChevronDown, Check, Search, AlertCircle } from "lucide-react";
import { useCompanies } from "../hooks/useCompanies.js";

/**
 * Premium DaisyUI Company Select Component
 * Replaces native HTML select with a luxury, accessible DaisyUI styled dropdown.
 */
export default function CompanySelect({
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  label = "Target Company",
  required = false,
  helperText,
  placeholder = "-- Select Target Company --",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const { data: companiesResponse, isLoading } = useCompanies({
    limit: 100,
    status: "active",
  });
  const companies = companiesResponse?.data || [];

  const selectedCompany = companies.find((c) => String(c.id) === String(value));

  // Filter companies if search term is entered
  const filteredCompanies = companies.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.companyName?.toLowerCase().includes(q) ||
      c.companyCode?.toLowerCase().includes(q) ||
      c.legalName?.toLowerCase().includes(q)
    );
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

  const handleSelect = (company) => {
    if (disabled) return;
    onChange(company.id);
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
            {companies.length} active {companies.length === 1 ? "company" : "companies"}
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
            <Building className="w-4 h-4" />
          </div>

          {selectedCompany ? (
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-semibold text-base-content truncate">
                {selectedCompany.companyName}
              </span>
              {selectedCompany.companyCode && (
                <span className="badge badge-sm badge-primary font-mono text-[10px] uppercase font-bold tracking-wider shrink-0">
                  {selectedCompany.companyCode}
                </span>
              )}
            </div>
          ) : (
            <span className="text-base-content/40 font-normal">
              {isLoading ? "Loading available companies..." : placeholder}
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
          {companies.length > 3 && (
            <div className="p-2 border-b border-base-200 bg-base-200/40">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search company name or code..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-base-300 bg-base-100 text-base-content focus:outline-none focus:border-primary"
                  autoFocus
                />
              </div>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto p-1.5 space-y-1">
            {filteredCompanies.length === 0 ? (
              <div className="p-4 text-center text-xs text-base-content/50">
                No matching companies found
              </div>
            ) : (
              filteredCompanies.map((c) => {
                const isSelected = String(c.id) === String(value);
                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelect(c)}
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
                        <Building className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-xs sm:text-sm font-medium">
                            {c.companyName}
                          </span>
                          {c.companyCode && (
                            <span
                              className={`badge badge-xs text-[9px] font-mono uppercase font-bold tracking-wider ${
                                isSelected
                                  ? "badge-ghost bg-white/20 text-white"
                                  : "badge-primary"
                              }`}
                            >
                              {c.companyCode}
                            </span>
                          )}
                        </div>
                        {c.legalName && (
                          <p
                            className={`text-[11px] truncate mt-0.5 ${
                              isSelected ? "text-white/80" : "text-base-content/50"
                            }`}
                          >
                            {c.legalName}
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
