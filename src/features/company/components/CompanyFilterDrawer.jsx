import React, { useState, useEffect } from "react";
import { X, Check, ChevronDown, Building2, ShieldCheck, Globe2 } from "lucide-react";
import { DropdownSelect } from "../../../common/components/ui/select/index.js";

/**
 * Slide-Over Floating Filter Drawer for Company & Enterprise Management
 * Fully integrated with DaisyUI Theme tokens (bg-base-100, text-base-content, bg-primary, etc.)
 */
export default function CompanyFilterDrawer({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  statusFilter = "",
  onStatusFilterChange,
  currencyFilter = "",
  onCurrencyFilterChange,
  regionFilter = "",
  onRegionFilterChange,
  gstinOnly = false,
  onGstinOnlyChange,
  onReset,
}) {
  // Determine effective starting values
  const effectiveStatus = filters?.status !== undefined ? filters.status : statusFilter;
  const effectiveCurrency = filters?.currency !== undefined ? filters.currency : currencyFilter;
  const effectiveRegion = filters?.region !== undefined ? filters.region : regionFilter;
  const effectiveGstinOnly = filters?.gstinOnly !== undefined ? filters.gstinOnly : gstinOnly;

  // Local filter draft state to allow user to apply or cancel
  const [draftStatus, setDraftStatus] = useState(effectiveStatus);
  const [draftCurrency, setDraftCurrency] = useState(effectiveCurrency);
  const [draftRegion, setDraftRegion] = useState(effectiveRegion);
  const [draftGstinOnly, setDraftGstinOnly] = useState(effectiveGstinOnly);

  // Sync with props when opened
  useEffect(() => {
    if (isOpen) {
      setDraftStatus(effectiveStatus);
      setDraftCurrency(effectiveCurrency);
      setDraftRegion(effectiveRegion);
      setDraftGstinOnly(effectiveGstinOnly);
    }
  }, [isOpen, effectiveStatus, effectiveCurrency, effectiveRegion, effectiveGstinOnly]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleApply = () => {
    if (onApplyFilters) {
      onApplyFilters({
        status: draftStatus,
        currency: draftCurrency,
        region: draftRegion,
        gstinOnly: draftGstinOnly,
      });
    }
    if (onStatusFilterChange) onStatusFilterChange(draftStatus);
    if (onCurrencyFilterChange) onCurrencyFilterChange(draftCurrency);
    if (onRegionFilterChange) onRegionFilterChange(draftRegion);
    if (onGstinOnlyChange) onGstinOnlyChange(draftGstinOnly);
    if (onClose) onClose();
  };

  const handleReset = () => {
    setDraftStatus("");
    setDraftCurrency("");
    setDraftRegion("");
    setDraftGstinOnly(false);

    if (onReset) {
      onReset();
    } else {
      if (onApplyFilters) {
        onApplyFilters({
          status: "",
          currency: "",
          region: "",
          gstinOnly: false,
        });
      }
      if (onStatusFilterChange) onStatusFilterChange("");
      if (onCurrencyFilterChange) onCurrencyFilterChange("");
      if (onRegionFilterChange) onRegionFilterChange("");
      if (onGstinOnlyChange) onGstinOnlyChange(false);
    }
    if (onClose) onClose();
  };

  const statusOptions = [
    { value: "active", label: "Active", bg: "bg-success/15 text-success border-success/30" },
    { value: "inactive", label: "Inactive", bg: "bg-warning/15 text-warning border-warning/30" },
    { value: "suspended", label: "Suspended", bg: "bg-error/15 text-error border-error/30" },
  ];

  const currencyOptions = [
    { value: "", label: "All Currencies" },
    { value: "INR", label: "INR — Indian Rupee (₹)" },
    { value: "USD", label: "USD — US Dollar ($)" },
    { value: "EUR", label: "EUR — Euro (€)" },
    { value: "GBP", label: "GBP — British Pound (£)" },
    { value: "AED", label: "AED — UAE Dirham (د.إ)" },
  ];

  const regionOptions = [
    { value: "", label: "All Regions / States" },
    { value: "Gujarat", label: "Gujarat (Surat / Ahmedabad)" },
    { value: "Maharashtra", label: "Maharashtra (Mumbai / Pune)" },
    { value: "Delhi", label: "Delhi NCR" },
    { value: "Tamil Nadu", label: "Tamil Nadu (Chennai / Coimbatore)" },
    { value: "Karnataka", label: "Karnataka (Bengaluru)" },
    { value: "Rajasthan", label: "Rajasthan (Jaipur)" },
    { value: "West Bengal", label: "West Bengal (Kolkata)" },
  ];

  return (
    <>
      {/* Backdrop with smooth opacity fade */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Slide-Over Floating Filter Panel styled strictly with DaisyUI theme tokens */}
      <aside
        className={`fixed top-4 sm:top-6 right-4 sm:right-6 bottom-4 sm:bottom-6 w-full max-w-[390px] bg-base-100 text-base-content rounded-3xl border border-base-300 shadow-2xl z-50 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
          isOpen ? "translate-x-0" : "translate-x-[450px]"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-panel-title"
      >
        <div className="overflow-y-auto pr-1 -mr-1 no-scrollbar sm:scrollbar-thin">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-base-200">
            <div className="flex items-center gap-2">
              <h3 id="filter-panel-title" className="text-xl font-bold text-base-content tracking-tight font-display">
                Filters
              </h3>
              {(draftStatus || draftCurrency || draftRegion || draftGstinOnly) && (
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1 text-xs font-semibold rounded-lg bg-base-200 text-base-content/75 hover:text-base-content hover:bg-base-300 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>

          {/* Subtitle */}
          <p className="mt-4 text-xs text-base-content/60 leading-relaxed">
            Pick a record to filter. New entries land in the relevant module and appear instantly across the workspace.
          </p>

          {/* Form Filters */}
          <div className="mt-6 space-y-5">
            {/* 1. Operating Status / Entity State */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-base-content/80">
                Company Status / Operating State
              </label>
              <div className="w-full min-h-[44px] px-2.5 py-1.5 rounded-xl border border-base-300 bg-base-200/50 flex items-center justify-between flex-wrap gap-1.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {draftStatus ? (
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        statusOptions.find((s) => s.value === draftStatus)?.bg || "bg-primary/10 text-primary border-primary/20"
                      }`}
                    >
                      <span className="capitalize">{draftStatus}</span>
                      <button
                        type="button"
                        onClick={() => setDraftStatus("")}
                        className="hover:opacity-75 cursor-pointer font-bold ml-0.5"
                        title="Clear status filter"
                      >
                        ×
                      </button>
                    </span>
                  ) : (
                    <span className="text-xs text-base-content/40 font-medium">
                      All Operating Statuses
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setDraftStatus(draftStatus === opt.value ? "" : opt.value)}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                        draftStatus === opt.value
                          ? "bg-primary text-primary-content border-primary shadow-xs"
                          : "bg-base-100 text-base-content/70 border-base-300 hover:bg-base-200 hover:text-base-content"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkbox toggle: Active only */}
              <label className="flex items-center gap-2 cursor-pointer mt-1 select-none">
                <input
                  type="checkbox"
                  checked={draftStatus === "active"}
                  onChange={(e) => setDraftStatus(e.target.checked ? "active" : "")}
                  className="w-4 h-4 rounded border-base-300 text-primary focus:ring-primary/20 bg-base-100 cursor-pointer"
                />
                <span className="text-xs text-base-content/75 font-medium">Select only active companies</span>
              </label>
            </div>

            {/* 2. Base Currency */}
            <DropdownSelect
              label="Base Currency & Ledger"
              value={draftCurrency}
              onChange={(e) => setDraftCurrency(e.target.value)}
              options={currencyOptions}
            />

            {/* 3. Headquarters Region / State */}
            <DropdownSelect
              label="Headquarters Region / State"
              value={draftRegion}
              onChange={(e) => setDraftRegion(e.target.value)}
              options={regionOptions}
            />

            {/* 4. Documents & GSTIN Compliance */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-base-content/80">
                Statutory Compliance & GSTIN
              </label>
              <div className="w-full px-3 py-2 rounded-xl border border-base-300 bg-base-200/50 flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    draftGstinOnly
                      ? "bg-success/15 text-success border border-success/30"
                      : "bg-base-200 text-base-content/70 border border-base-300"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {draftGstinOnly ? "GST Verified Only" : "All Statutory Registrations"}
                </span>
                <span className="text-[11px] font-mono text-base-content/40">Section 22</span>
              </div>

              {/* Checkbox toggle: Verified GSTIN only */}
              <label className="flex items-center gap-2 cursor-pointer mt-1 select-none">
                <input
                  type="checkbox"
                  checked={draftGstinOnly}
                  onChange={(e) => setDraftGstinOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-base-300 text-primary focus:ring-primary/20 bg-base-100 cursor-pointer"
                />
                <span className="text-xs font-medium text-base-content/75">
                  Select only GST verified entities
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-5 border-t border-base-200 flex items-center gap-3 mt-4">
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-primary-content hover:bg-primary/90 active:scale-95 font-semibold text-xs transition shadow-sm cursor-pointer"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-base-300 hover:bg-base-200 active:scale-95 text-base-content/80 font-semibold text-xs transition cursor-pointer"
          >
            Reset
          </button>
        </div>
      </aside>
    </>
  );
}
