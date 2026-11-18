import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import {
  X,
  Receipt,
  Percent,
  Sparkles,
  Building,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Check,
  Calculator,
  ChevronDown,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";
import { CompanySelect } from "../../../company/components/index.js";
import {
  TAX_TYPES,
  STANDARD_GST_SLABS,
} from "../utils/taxHelper.js";

/**
 * Curated Fashion & Apparel Tax Presets with industry guidance
 */
export const FASHION_TAX_PRESETS = [
  {
    code: "GST_0",
    name: "GST 0% (Nil-Rated / Khadi & Handloom)",
    type: "GST",
    rate: 0,
    cgst_rate: 0,
    sgst_rate: 0,
    igst_rate: 0,
    cess_rate: 0,
    is_inclusive: false,
    description: "Raw cotton, silk yarn, handloom fabrics, unstitched cloth, and khadi garments.",
    badge: "GST_0",
  },
  {
    code: "GST_5",
    name: "GST 5% (Essential Apparel & Fabrics ≤ ₹1,000)",
    type: "GST",
    rate: 5,
    cgst_rate: 2.5,
    sgst_rate: 2.5,
    igst_rate: 5,
    cess_rate: 0,
    is_inclusive: false,
    description: "Apparel, sarees, and clothing accessories with sale price up to ₹1,000 per piece, cotton yarn.",
    badge: "GST_5",
  },
  {
    code: "GST_12",
    name: "GST 12% (Premium Apparel & High-Value Fabrics > ₹1,000)",
    type: "GST",
    rate: 12,
    cgst_rate: 6,
    sgst_rate: 6,
    igst_rate: 12,
    cess_rate: 0,
    is_inclusive: false,
    description: "Readymade garments, designer sarees, and dress materials with sale price exceeding ₹1,000.",
    badge: "GST_12",
  },
  {
    code: "GST_18",
    name: "GST 18% (Standard Branded Fashion & Tailoring)",
    type: "GST",
    rate: 18,
    cgst_rate: 9,
    sgst_rate: 9,
    igst_rate: 18,
    cess_rate: 0,
    is_inclusive: false,
    description: "Synthetic and man-made fibers, branded footwear > ₹1,000, stitching, and boutique alteration services.",
    badge: "GST_18",
  },
  {
    code: "GST_28",
    name: "GST 28% (Luxury Fashion & High-End Accessories)",
    type: "GST",
    rate: 28,
    cgst_rate: 14,
    sgst_rate: 14,
    igst_rate: 28,
    cess_rate: 0,
    is_inclusive: false,
    description: "Ultra-luxury designer wear, premium leather apparel, and special high-value accessories.",
    badge: "GST_28",
  },
  {
    code: "GST_18_CESS",
    name: "GST 18% + 12% Cess (Special Luxury Items)",
    type: "GST",
    rate: 18,
    cgst_rate: 9,
    sgst_rate: 9,
    igst_rate: 18,
    cess_rate: 12,
    is_inclusive: false,
    description: "Special luxury items subject to Goods & Services Compensation Cess.",
    badge: "GST_18_CESS",
  },
];

/**
 * Automatically derives a clean uppercase tax code from tax name or rate
 * e.g. "GST 18% Standard" -> "GST_18_STANDARD"
 */
export function generateTaxCodeFromName(name = "") {
  return name
    .trim()
    .replace(/['’%]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 30);
}

/**
 * TaxFormModal Component
 * Implements luxury max-w-4xl 2-column modal layout adhering strictly to
 * Pooja Fashion's Royal Purple UI Design System (#2A0081).
 *
 * Features:
 * - Real-time presets auto-suggestion matching ProductTypeFormModal
 * - Real-time code & 50/50 intra / 100 inter GST component auto-derivation
 * - Standardized CompanySelect for SuperAdmin/Admin
 * - Synchronized Operational Capabilities card with DaisyUI toggles
 * - Formatted "Why these settings?" guidance block
 */
export default function TaxFormModal({
  open,
  isOpen: legacyIsOpen,
  mode = "add",
  initialData = null,
  onClose,
  onSubmit,
  isSubmitting = false,
  saving = false,
}) {
  const isModalOpen = open ?? legacyIsOpen ?? false;
  const isEditing = mode === "edit";
  const submitting = isSubmitting || saving;

  const user = useSelector((state) => state.auth.user);
  const roleCode = String(user?.roleCode || user?.role || "").toUpperCase();
  const userCompanyId = user?.companyId || user?.company_id;
  const isSuperAdmin = roleCode === "SUPERADMIN";
  const isAdmin = roleCode === "ADMIN";
  const canSelectCompany = (isSuperAdmin || isAdmin) && !userCompanyId;

  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isModalOpen,
    onClose
  );

  // Form State
  const [companyId, setCompanyId] = useState(userCompanyId || "");
  const [taxCode, setTaxCode] = useState("");
  const [taxName, setTaxName] = useState("");
  const [taxType, setTaxType] = useState("GST");
  const [rate, setRate] = useState("");
  const [cgstRate, setCgstRate] = useState("");
  const [sgstRate, setSgstRate] = useState("");
  const [igstRate, setIgstRate] = useState("");
  const [cessRate, setCessRate] = useState("0");
  const [isInclusive, setIsInclusive] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Custom component split override state
  const [showCustomSplit, setShowCustomSplit] = useState(false);

  const [codeManuallyEdited, setCodeManuallyEdited] = useState(false);

  // Preset Dropdown state
  const [showPresetsDropdown, setShowPresetsDropdown] = useState(false);
  const [forceShowPresets, setForceShowPresets] = useState(false);
  const presetDropdownRef = useRef(null);

  const [errors, setErrors] = useState({});

  // Close preset dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        presetDropdownRef.current &&
        !presetDropdownRef.current.contains(e.target)
      ) {
        setShowPresetsDropdown(false);
        setForceShowPresets(false);
      }
    };
    if (showPresetsDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPresetsDropdown]);

  // Reset or Populate form on open
  useEffect(() => {
    if (isModalOpen) {
      if (initialData && isEditing) {
        setCompanyId(initialData.company_id || initialData.companyId || userCompanyId || "");
        setTaxCode(initialData.tax_code || initialData.taxCode || "");
        setTaxName(initialData.tax_name || initialData.taxName || "");
        setTaxType(initialData.tax_type || initialData.taxType || "GST");
        setRate(initialData.rate !== undefined ? String(initialData.rate) : "");
        setCgstRate(initialData.cgst_rate !== undefined ? String(initialData.cgst_rate) : "");
        setSgstRate(initialData.sgst_rate !== undefined ? String(initialData.sgst_rate) : "");
        setIgstRate(initialData.igst_rate !== undefined ? String(initialData.igst_rate) : "");
        setCessRate(initialData.cess_rate !== undefined ? String(initialData.cess_rate) : "0");
        setIsInclusive(Boolean(initialData.is_inclusive ?? initialData.isInclusive));
        setIsActive(initialData.is_active !== undefined ? Boolean(initialData.is_active) : true);
        setCodeManuallyEdited(true);

        const customSplitNeeded =
          initialData.cgst_rate !== undefined &&
          initialData.rate !== undefined &&
          Math.abs(Number(initialData.cgst_rate) - Number(initialData.rate) / 2) > 0.01;
        setShowCustomSplit(Boolean(customSplitNeeded));
      } else {
        setCompanyId(userCompanyId || "");
        setTaxCode("");
        setTaxName("");
        setTaxType("GST");
        setRate("");
        setCgstRate("");
        setSgstRate("");
        setIgstRate("");
        setCessRate("0");
        setIsInclusive(false);
        setIsActive(true);
        setCodeManuallyEdited(false);
        setShowCustomSplit(false);
      }
      setErrors({});
      setShowPresetsDropdown(false);
      setForceShowPresets(false);
    }
  }, [isModalOpen, initialData, isEditing, userCompanyId]);

  // Filter presets based on typed taxName
  const trimmedName = (taxName || "").trim();
  const hasTyped = trimmedName.length > 0;

  const matchingPresets = useMemo(() => {
    if (!hasTyped) return [];
    const q = trimmedName.toLowerCase();
    return FASHION_TAX_PRESETS.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        String(p.rate).includes(q)
      );
    });
  }, [hasTyped, trimmedName]);

  // Dropdown is visible ONLY when matching presets exist or user clicked Real-time Presets
  const isDropdownVisible =
    showPresetsDropdown &&
    (forceShowPresets || !hasTyped || matchingPresets.length > 0);

  const displayPresets =
    forceShowPresets && matchingPresets.length === 0
      ? FASHION_TAX_PRESETS
      : matchingPresets.length > 0
      ? matchingPresets
      : FASHION_TAX_PRESETS;

  // Auto-generate code from name in real-time
  const handleNameChange = (e) => {
    const val = e.target.value;
    setTaxName(val);
    if (errors.taxName) setErrors((prev) => ({ ...prev, taxName: null }));

    if (!codeManuallyEdited) {
      if (val.trim()) {
        setTaxCode(generateTaxCodeFromName(val));
      } else if (rate !== "") {
        setTaxCode(`GST_${rate}`);
      } else {
        setTaxCode("");
      }
    }
  };

  const handleCodeChange = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, "");
    setTaxCode(val);
    setCodeManuallyEdited(true);
    if (errors.taxCode) setErrors((prev) => ({ ...prev, taxCode: null }));
  };

  const handleAutoGenerateCode = () => {
    if (taxName.trim()) {
      setTaxCode(generateTaxCodeFromName(taxName));
    } else if (rate !== "") {
      setTaxCode(`GST_${rate}`);
    }
    setCodeManuallyEdited(false);
    if (errors.taxCode) setErrors((prev) => ({ ...prev, taxCode: null }));
  };

  // Auto-calculate components on rate change
  const handleRateChange = (newRateVal) => {
    setRate(newRateVal);
    if (errors.rate) setErrors((prev) => ({ ...prev, rate: null }));

    if (newRateVal === "" || isNaN(Number(newRateVal))) {
      setCgstRate("");
      setSgstRate("");
      setIgstRate("");
      return;
    }

    const num = Number(newRateVal);
    const half = (num / 2).toFixed(2);
    setCgstRate(half);
    setSgstRate(half);
    setIgstRate(num.toFixed(2));

    if (!codeManuallyEdited && !taxName.trim()) {
      setTaxCode(`GST_${num}`);
    }
  };

  // Apply a preset slab with single click
  const handleApplyPreset = (preset) => {
    setTaxName(preset.name);
    setTaxCode(preset.code);
    setRate(String(preset.rate));
    setCgstRate(String(preset.cgst_rate));
    setSgstRate(String(preset.sgst_rate));
    setIgstRate(String(preset.igst_rate));
    setCessRate(String(preset.cess_rate || 0));
    setTaxType(preset.type || "GST");
    setIsInclusive(Boolean(preset.is_inclusive));
    setCodeManuallyEdited(true);
    setShowPresetsDropdown(false);
    setForceShowPresets(false);
    setErrors({});
  };

  const togglePresets = () => {
    if (isDropdownVisible) {
      setShowPresetsDropdown(false);
      setForceShowPresets(false);
    } else {
      setShowPresetsDropdown(true);
      setForceShowPresets(true);
    }
  };

  // Computed displayed split values
  const numRate = rate !== "" ? Number(rate) : 0;
  const displayCgst = cgstRate !== "" ? Number(cgstRate).toFixed(2) : (numRate / 2).toFixed(2);
  const displaySgst = sgstRate !== "" ? Number(sgstRate).toFixed(2) : (numRate / 2).toFixed(2);
  const displayIgst = igstRate !== "" ? Number(igstRate).toFixed(2) : numRate.toFixed(2);

  // Validation
  const validateForm = () => {
    const errs = {};
    if (canSelectCompany && !companyId) {
      errs.companyId = "Target company is required.";
    }
    if (!taxName.trim()) {
      errs.taxName = "Tax name is required.";
    }
    if (!taxCode.trim()) {
      errs.taxCode = "Tax code is required.";
    }
    if (rate === "" || isNaN(Number(rate))) {
      errs.rate = "Valid tax rate is required.";
    } else if (Number(rate) < 0 || Number(rate) > 100) {
      errs.rate = "Tax rate must be between 0% and 100%.";
    }

    if (cgstRate !== "" && sgstRate !== "") {
      const sum = Number(cgstRate) + Number(sgstRate);
      if (sum > Number(rate) + 0.01) {
        errs.cgstRate = `CGST (${cgstRate}%) + SGST (${sgstRate}%) exceeds total tax rate (${rate}%).`;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!validateForm()) return;

    const payload = {
      company_id: Number(canSelectCompany ? companyId : userCompanyId || 1),
      tax_code: taxCode.trim().toUpperCase(),
      tax_name: taxName.trim(),
      tax_type: taxType,
      rate: Number(rate),
      cess_rate: Number(cessRate) || 0,
      is_inclusive: Boolean(isInclusive),
      is_active: Boolean(isActive),
    };

    if (cgstRate !== "") payload.cgst_rate = Number(cgstRate);
    if (sgstRate !== "") payload.sgst_rate = Number(sgstRate);
    if (igstRate !== "") payload.igst_rate = Number(igstRate);

    onSubmit?.(payload);
  };

  if (!isRendered) return null;

  return (
    <div
      className={backdropClasses}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full max-w-4xl p-0 rounded-3xl bg-base-100 border border-base-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${cardClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Standardized Luxury Header */}
        <div className="relative px-6 py-5 border-b border-base-200 bg-gradient-to-r from-base-200/50 via-base-100 to-base-200/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-base-content tracking-tight">
                {isEditing ? "Edit Tax Slab" : "Add Tax Slab"}
              </h2>
              <p className="text-xs text-base-content/60">
                Register a tax rate master for GST billing, intra/inter-state split, and invoice compliance.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-xl hover:bg-base-200 text-base-content/60 hover:text-base-content transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - 2 Columns on Large Screens */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[82vh] overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Core Fields & Presets */}
            <div className="space-y-4">
              {/* Target Company Select (SuperAdmin / Admin only) */}
              {canSelectCompany && (
                <div>
                  <CompanySelect
                    value={companyId}
                    onChange={(id) => {
                      setCompanyId(id);
                      if (errors.companyId) setErrors((prev) => ({ ...prev, companyId: null }));
                    }}
                    required={true}
                    error={errors.companyId}
                    label="Target Company"
                    placeholder="-- Select Target Company --"
                  />
                </div>
              )}

              {/* Tax Name with Real-time Presets Button */}
              <div className="relative" ref={presetDropdownRef}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-base-content/80">
                    Tax Name <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={togglePresets}
                    className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer bg-primary/10 hover:bg-primary/20 px-2 py-0.5 rounded-lg border border-primary/20 transition-colors"
                    title="Browse real-time GST presets"
                  >
                    <Zap className="size-3 text-amber-500 fill-amber-500" />
                    <span>{isDropdownVisible ? "Close Presets" : "⚡ Presets"}</span>
                    <ChevronDown
                      className={`size-3 transition-transform ${
                        isDropdownVisible ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. GST 18% (Standard Branded Fashion)"
                    value={taxName}
                    onChange={handleNameChange}
                    onFocus={() => {
                      if (!hasTyped) setShowPresetsDropdown(true);
                    }}
                    disabled={submitting}
                    maxLength={100}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-base-200/50 border text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                      errors.taxName ? "border-rose-500 focus:border-rose-500" : "border-base-300"
                    }`}
                  />
                </div>

                {errors.taxName && (
                  <span className="mt-1 block text-xs text-rose-500 font-medium">
                    {errors.taxName}
                  </span>
                )}

                {/* Quick Preset Chips row right under input - shown only before typing */}
                {!hasTyped && (
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-base-content/50 font-medium flex items-center gap-1">
                      <Sparkles className="size-3 text-amber-500" /> Quick:
                    </span>
                    {FASHION_TAX_PRESETS.slice(0, 5).map((preset) => {
                      const active =
                        taxName.trim().toLowerCase() === preset.name.toLowerCase() ||
                        (rate !== "" && Number(rate) === preset.rate);
                      return (
                        <button
                          key={preset.code}
                          type="button"
                          onClick={() => handleApplyPreset(preset)}
                          className={`text-[11px] px-2 py-0.5 rounded-lg border font-medium transition-all cursor-pointer ${
                            active
                              ? "bg-primary text-primary-content border-primary"
                              : "bg-base-200/60 hover:bg-base-200 text-base-content/75 border-base-300 hover:border-primary/40"
                          }`}
                        >
                          {preset.rate}% ({preset.badge})
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Presets Dropdown Menu */}
                {isDropdownVisible && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 p-1.5 bg-base-100 border border-base-300 rounded-2xl shadow-xl z-30 max-h-60 overflow-y-auto space-y-1 animate-in fade-in-50 duration-150">
                    <div className="px-2.5 py-1 text-[11px] font-semibold text-base-content/50 uppercase tracking-wider flex items-center justify-between border-b border-base-200 pb-1 mb-1">
                      <span>
                        {hasTyped && matchingPresets.length > 0
                          ? `Matching GST Presets (${matchingPresets.length})`
                          : `Standard GST Slabs (${displayPresets.length})`}
                      </span>
                      <span className="text-[10px] text-primary font-normal">click to auto-fill</span>
                    </div>

                    {displayPresets.map((preset) => {
                      const isSelected =
                        taxName.trim().toLowerCase() === preset.name.toLowerCase() ||
                        (rate !== "" && Number(rate) === preset.rate);
                      return (
                        <button
                          key={preset.code}
                          type="button"
                          onClick={() => handleApplyPreset(preset)}
                          className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-start justify-between gap-3 group cursor-pointer ${
                            isSelected
                              ? "bg-primary/15 border border-primary/30 text-primary"
                              : "hover:bg-base-200 text-base-content"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-xs leading-snug group-hover:text-primary transition-colors">
                                {preset.name}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-base-200 text-base-content/70 border border-base-300 font-mono">
                                {preset.badge}
                              </span>
                            </div>
                            {preset.description && (
                              <p className="text-[11px] text-base-content/60 truncate mt-0.5 max-w-md">
                                {preset.description}
                              </p>
                            )}
                          </div>
                          {isSelected ? (
                            <span className="shrink-0 p-1 rounded-full bg-primary text-white">
                              <Check className="size-3" />
                            </span>
                          ) : (
                            <span className="shrink-0 text-[10px] font-semibold opacity-0 group-hover:opacity-100 text-primary transition-opacity">
                              Apply ↵
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Tax Code & Total Rate (2 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tax Code */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-base-content/80">
                      Tax Code <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoGenerateCode}
                      disabled={(!taxName.trim() && rate === "") || submitting}
                      className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-40"
                      title="Auto-generate uppercase code"
                    >
                      <Sparkles className="size-3 text-amber-500" /> Auto
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. GST_18"
                    value={taxCode}
                    onChange={handleCodeChange}
                    disabled={submitting}
                    maxLength={50}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-base-200/50 border text-sm font-mono uppercase text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                      errors.taxCode ? "border-rose-500 focus:border-rose-500" : "border-base-300"
                    }`}
                  />
                  {errors.taxCode ? (
                    <span className="mt-1 block text-xs text-rose-500 font-medium">
                      {errors.taxCode}
                    </span>
                  ) : codeManuallyEdited ? (
                    <span className="mt-1 block text-[11px] text-primary font-medium">
                      Custom code active · Click Auto to sync
                    </span>
                  ) : (
                    <span className="mt-1 block text-[11px] text-base-content/50">
                      Auto-generated from tax name in real-time
                    </span>
                  )}
                </div>

                {/* Total Tax Rate (%) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-base-content/80">
                      Total Tax Rate (%) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-base-content/50 font-medium">
                      Slab percentage
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      placeholder="e.g. 18"
                      value={rate}
                      onChange={(e) => handleRateChange(e.target.value)}
                      disabled={submitting}
                      className={`w-full px-3.5 py-2.5 pr-8 rounded-xl bg-base-200/50 border text-sm font-mono text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                        errors.rate ? "border-rose-500 focus:border-rose-500" : "border-base-300"
                      }`}
                    />
                    <Percent className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none" />
                  </div>
                  {errors.rate ? (
                    <span className="mt-1 block text-xs text-rose-500 font-medium">
                      {errors.rate}
                    </span>
                  ) : (
                    <span className="mt-1 block text-[11px] text-base-content/50">
                      Total levy applied on taxable base value
                    </span>
                  )}
                </div>
              </div>

              {/* Tax Regime & Additional Cess Rate (2 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tax Regime / Type */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-base-content/80">
                      Tax Regime / Type
                    </label>
                  </div>
                  <select
                    value={taxType}
                    onChange={(e) => setTaxType(e.target.value)}
                    disabled={submitting}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-base-200/50 border border-base-300 text-xs sm:text-sm text-base-content focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer font-medium"
                  >
                    {TAX_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <span className="mt-1 block text-[11px] text-base-content/50">
                    GST is standard for Indian fashion commerce
                  </span>
                </div>

                {/* Additional CESS Rate (%) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-base-content/80">
                      Additional CESS Rate (%)
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      placeholder="0"
                      value={cessRate}
                      onChange={(e) => setCessRate(e.target.value)}
                      disabled={submitting}
                      className="w-full px-3.5 py-2.5 pr-8 rounded-xl bg-base-200/50 border border-base-300 text-sm font-mono text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                    <Percent className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none" />
                  </div>
                  <span className="mt-1 block text-[11px] text-base-content/50">
                    0% for standard apparel; applied to luxury items
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Split Bento, Operational Toggles, and "Why these settings?" Guidance */}
            <div className="space-y-4">
              {/* GST Sub-Component Split Bento Box */}
              <div className="p-4 rounded-2xl bg-base-200/40 border border-base-300 space-y-3">
                <div className="flex items-center justify-between border-b border-base-300/70 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-base-content/70">
                      GST Components Split (Intra vs Inter-State)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                    {rate !== "" ? `Auto-Derived from ${rate}%` : "Standard 50/50 Split"}
                  </span>
                </div>

                {/* 3 Calculated Cards: CGST, SGST, IGST */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  {/* CGST */}
                  <div className="p-2.5 rounded-xl bg-base-100 border border-base-200 shadow-xs flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-base-content/60 block uppercase">
                      CGST (Central)
                    </span>
                    <div className="my-1">
                      <span className="text-sm sm:text-base font-black font-mono text-base-content block">
                        {displayCgst}%
                      </span>
                    </div>
                    <span className="text-[9px] font-semibold text-emerald-600 bg-emerald-500/10 px-1 py-0.5 rounded">
                      50% Intra
                    </span>
                  </div>

                  {/* SGST */}
                  <div className="p-2.5 rounded-xl bg-base-100 border border-base-200 shadow-xs flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-base-content/60 block uppercase">
                      SGST (State)
                    </span>
                    <div className="my-1">
                      <span className="text-sm sm:text-base font-black font-mono text-base-content block">
                        {displaySgst}%
                      </span>
                    </div>
                    <span className="text-[9px] font-semibold text-emerald-600 bg-emerald-500/10 px-1 py-0.5 rounded">
                      50% Intra
                    </span>
                  </div>

                  {/* IGST */}
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 shadow-xs flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 block uppercase">
                      IGST (Inter)
                    </span>
                    <div className="my-1">
                      <span className="text-sm sm:text-base font-black font-mono text-indigo-600 dark:text-indigo-400 block">
                        {displayIgst}%
                      </span>
                    </div>
                    <span className="text-[9px] font-semibold text-indigo-600 bg-indigo-500/15 px-1 py-0.5 rounded">
                      100% Inter
                    </span>
                  </div>
                </div>

                {/* Optional Custom Split Drawer/Toggle */}
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <button
                    type="button"
                    onClick={() => setShowCustomSplit((prev) => !prev)}
                    className="text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>{showCustomSplit ? "Hide Custom Rate Overrides" : "⚙️ Customize Component Split"}</span>
                  </button>
                  {showCustomSplit && (
                    <button
                      type="button"
                      onClick={() => {
                        if (rate !== "") {
                          const half = (Number(rate) / 2).toFixed(2);
                          setCgstRate(half);
                          setSgstRate(half);
                          setIgstRate(Number(rate).toFixed(2));
                        }
                      }}
                      className="text-xs text-base-content/50 hover:text-primary cursor-pointer"
                    >
                      Reset to 50/50
                    </button>
                  )}
                </div>

                {showCustomSplit && (
                  <div className="grid grid-cols-3 gap-2 pt-1 animate-in fade-in-50 duration-150">
                    <div>
                      <label className="text-[10px] font-bold text-base-content/60 block mb-1">
                        CGST Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={cgstRate}
                        onChange={(e) => setCgstRate(e.target.value)}
                        placeholder={displayCgst}
                        className="w-full px-2 py-1.5 rounded-lg bg-base-100 border border-base-300 text-xs font-mono text-center focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-base-content/60 block mb-1">
                        SGST Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={sgstRate}
                        onChange={(e) => setSgstRate(e.target.value)}
                        placeholder={displaySgst}
                        className="w-full px-2 py-1.5 rounded-lg bg-base-100 border border-base-300 text-xs font-mono text-center focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-base-content/60 block mb-1">
                        IGST Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={igstRate}
                        onChange={(e) => setIgstRate(e.target.value)}
                        placeholder={displayIgst}
                        className="w-full px-2 py-1.5 rounded-lg bg-base-100 border border-base-300 text-xs font-mono text-center focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {errors.cgstRate && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1">
                    {errors.cgstRate}
                  </p>
                )}
              </div>

              {/* Operational Capabilities (MRP Inclusive & Active Status) */}
              <div className="p-4.5 rounded-2xl bg-base-200/40 border border-base-300 space-y-3.5">
                <div className="flex items-center justify-between border-b border-base-300/70 pb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-base-content/70">
                    Operational Capabilities
                  </span>
                  <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                    Billing Rules
                  </span>
                </div>

                {/* MRP Inclusive Toggle */}
                <div className="flex items-center justify-between gap-3 py-1">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-base-content block leading-tight">
                        Price Inclusive (<code className="text-[11px] font-mono text-amber-600">is_inclusive</code>)
                      </span>
                      <span className="text-[11px] text-base-content/60 block mt-0.5">
                        When enabled, the product MRP retail price already contains this tax amount.
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isInclusive}
                    onChange={(e) => setIsInclusive(e.target.checked)}
                    disabled={submitting}
                    className="toggle toggle-warning toggle-sm shrink-0 cursor-pointer"
                  />
                </div>

                {/* Active Status Toggle */}
                <div className="flex items-center justify-between gap-3 py-1 border-t border-base-200">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-base-content block leading-tight">
                        Active Status (<code className="text-[11px] font-mono text-emerald-600">is_active</code>)
                      </span>
                      <span className="text-[11px] text-base-content/60 block mt-0.5">
                        Whether this tax slab is live and available on POS billing & checkouts.
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    disabled={submitting}
                    className="toggle toggle-success toggle-sm shrink-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* "Why these settings?" Guidance Card (Matching ProductTypeFormModal) */}
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-black text-base-content tracking-wide uppercase">
                    Why these settings?
                  </span>
                </div>

                <div className="space-y-2 text-[11px] text-base-content/75 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <div>
                      <strong className="text-base-content font-mono font-semibold">Rate:</strong> The total tax rate applied on the item taxable base value.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div>
                      <strong className="text-base-content font-mono font-semibold">CGST & SGST:</strong> Equal half split (50/50) applied on intra-state sales within the same state.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                    <div>
                      <strong className="text-base-content font-mono font-semibold">IGST:</strong> Applied at full rate (100%) when shipping or selling to customers in other states.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <div>
                      <strong className="text-base-content font-mono font-semibold">Active (Yes/No):</strong> Whether you can sell and bill with this tax slab on POS checkouts.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <div>
                      <strong className="text-base-content font-mono font-semibold">Price Inclusive:</strong> When enabled, the retail price (MRP) already contains the tax amount.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-base-200/50 border-t border-base-200 flex items-center justify-end gap-3 shrink-0">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            loading={submitting}
          >
            {isEditing ? "Save Changes" : "Create Tax Slab"}
          </Button>
        </div>
      </div>
    </div>
  );
}
