import { useEffect, useState, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import {
  X,
  Tag,
  Sparkles,
  ChevronDown,
  Building,
  Check,
  Package,
  ShoppingBag,
  Truck,
  Zap,
} from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";
import { CompanySelect } from "../../../company/components/index.js";
import ProductTypeThumb from "./ProductTypeThumb.jsx";
import {
  PRODUCT_TYPE_PRESETS,
  POPULAR_PRODUCT_TYPES,
  searchProductTypePresets,
} from "../data/index.js";
import {
  formatProductTypeName,
  generateProductTypeCodeFromName,
} from "../utils/productTypeHelper.js";

const EMPTY_FORM = {
  company_id: "",
  type_code: "",
  type_name: "",
  description: "",
  is_stock_item: true,
  is_saleable: true,
  is_purchasable: true,
  is_active: true,
};

function validate(values, canSelectCompany) {
  const errors = {};
  if (canSelectCompany && !values.company_id) {
    errors.company_id = "Target company is required.";
  }

  const name = (values.type_name || "").trim();
  const code = (values.type_code || "").trim();

  if (!name) {
    errors.type_name = "Product type name is required.";
  } else if (name.length > 100) {
    errors.type_name = "Product type name cannot exceed 100 characters.";
  }

  if (code) {
    if (code.length > 50) {
      errors.type_code = "Type code cannot exceed 50 characters.";
    } else if (!/^[A-Za-z0-9_.-]+$/.test(code)) {
      errors.type_code = "Use letters, numbers, hyphens, periods, or underscores only.";
    }
  }

  if (values.description && values.description.length > 2000) {
    errors.description = "Description cannot exceed 2000 characters.";
  }

  return errors;
}

/**
 * Add / Edit Product Type Form Modal
 */
export default function ProductTypeFormModal({
  open,
  isOpen,
  mode = "add", // "add" | "edit"
  isEdit = false,
  initialData = null,
  initialCompanyId = null,
  saving = false,
  isLoading = false,
  onClose,
  onSubmit,
}) {
  const isModalOpen = open ?? isOpen ?? false;
  const isEditing = mode === "edit" || isEdit;
  const isSubmitting = saving || isLoading;
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isModalOpen,
    onClose
  );

  const currentUser = useSelector((state) => state.auth?.user);
  const roleCode = String(currentUser?.roleCode || currentUser?.role || "").toUpperCase();
  const userCompanyId = currentUser?.companyId || currentUser?.company_id;
  const isSuperAdminOrAdmin = roleCode === "SUPERADMIN" || roleCode === "ADMIN";
  const canSelectCompany = isSuperAdminOrAdmin && !userCompanyId;

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [codeManuallyEdited, setCodeManuallyEdited] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [forceShowPresets, setForceShowPresets] = useState(false);
  const suggestionContainerRef = useRef(null);

  // Close suggestions on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        suggestionContainerRef.current &&
        !suggestionContainerRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showSuggestions]);

  const trimmedName = (form.type_name || "").trim();
  const hasTyped = trimmedName.length > 0;

  const matchingPresets = useMemo(() => {
    if (!hasTyped) return [];
    return searchProductTypePresets(trimmedName);
  }, [hasTyped, trimmedName]);

  const popularPresets = useMemo(() => POPULAR_PRODUCT_TYPES, []);

  // Dropdown is visible ONLY when:
  // - User hasn't typed yet and suggestions are open, OR
  // - User has typed and matching presets exist (matchingPresets.length > 0), OR
  // - User explicitly clicked "⚡ Presets" button (forceShowPresets)
  // When user types a name that DOES NOT MATCH: isDropdownVisible is FALSE (not show down!)
  const isDropdownVisible =
    showSuggestions &&
    (forceShowPresets || !hasTyped || matchingPresets.length > 0);

  const displayPresets =
    forceShowPresets && matchingPresets.length === 0
      ? popularPresets
      : hasTyped
      ? matchingPresets
      : popularPresets;

  const toggleSuggestions = () => {
    if (isDropdownVisible) {
      setShowSuggestions(false);
      setForceShowPresets(false);
    } else {
      setShowSuggestions(true);
      if (hasTyped && matchingPresets.length === 0) {
        setForceShowPresets(true);
      }
    }
  };

  useEffect(() => {
    if (!isModalOpen) return;

    if (isEditing && initialData) {
      setForm({
        company_id:
          initialData.companyId ||
          initialData.company_id ||
          initialCompanyId ||
          "",
        type_code: initialData.typeCode || initialData.type_code || "",
        type_name: initialData.typeName || initialData.type_name || "",
        description: initialData.description || "",
        is_stock_item:
          initialData.isStockItem !== undefined
            ? Boolean(initialData.isStockItem)
            : initialData.is_stock_item !== undefined
            ? Boolean(initialData.is_stock_item)
            : true,
        is_saleable:
          initialData.isSaleable !== undefined
            ? Boolean(initialData.isSaleable)
            : initialData.is_saleable !== undefined
            ? Boolean(initialData.is_saleable)
            : true,
        is_purchasable:
          initialData.isPurchasable !== undefined
            ? Boolean(initialData.isPurchasable)
            : initialData.is_purchasable !== undefined
            ? Boolean(initialData.is_purchasable)
            : true,
        is_active:
          initialData.isActive !== undefined
            ? Boolean(initialData.isActive)
            : initialData.is_active !== undefined
            ? Boolean(initialData.is_active)
            : true,
      });
      setCodeManuallyEdited(true);
    } else {
      setForm({
        ...EMPTY_FORM,
        company_id: initialCompanyId || userCompanyId || "",
      });
      setCodeManuallyEdited(false);
    }
    setErrors({});
    setShowSuggestions(false);
    setForceShowPresets(false);
  }, [isModalOpen, isEditing, initialData, initialCompanyId, userCompanyId]);

  // Real-time name change & code auto-write
  const handleNameChange = (e) => {
    const val = e.target.value;
    setForm((prev) => {
      const next = { ...prev, type_name: val };
      if (!isEditing && !codeManuallyEdited) {
        next.type_code = generateProductTypeCodeFromName(val);
      }
      return next;
    });

    setForceShowPresets(false);
    setShowSuggestions(true);

    if (errors.type_name) setErrors((er) => ({ ...er, type_name: undefined }));
    if (!codeManuallyEdited && errors.type_code) setErrors((er) => ({ ...er, type_code: undefined }));
  };

  // Manual code input
  const handleCodeChange = (e) => {
    const val = e.target.value.toUpperCase();
    setForm((prev) => ({ ...prev, type_code: val }));
    setCodeManuallyEdited(true);
    if (errors.type_code) setErrors((er) => ({ ...er, type_code: undefined }));
  };

  // Auto button click to regenerate code from current name
  const handleAutoGenerateCode = () => {
    if (!form.type_name.trim()) return;
    const autoCode = generateProductTypeCodeFromName(form.type_name);
    setForm((prev) => ({ ...prev, type_code: autoCode }));
    setCodeManuallyEdited(false);
    if (errors.type_code) setErrors((er) => ({ ...er, type_code: undefined }));
  };

  const handleSelectPreset = (preset) => {
    setForm((prev) => ({
      ...prev,
      type_name: preset.name,
      type_code: preset.code,
      description: preset.description || prev.description,
      is_stock_item: preset.is_stock_item !== undefined ? preset.is_stock_item : prev.is_stock_item,
      is_saleable: preset.is_saleable !== undefined ? preset.is_saleable : prev.is_saleable,
      is_purchasable: preset.is_purchasable !== undefined ? preset.is_purchasable : prev.is_purchasable,
    }));
    setCodeManuallyEdited(true);
    setShowSuggestions(false);
    setForceShowPresets(false);
    if (errors.type_name) setErrors((er) => ({ ...er, type_name: undefined }));
    if (errors.type_code) setErrors((er) => ({ ...er, type_code: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form, canSelectCompany);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      type_name: form.type_name.trim(),
      type_code: form.type_code.trim() ? form.type_code.trim().toUpperCase() : undefined,
      description: form.description?.trim() || null,
      is_stock_item: Boolean(form.is_stock_item),
      is_saleable: Boolean(form.is_saleable),
      is_purchasable: Boolean(form.is_purchasable),
      is_active: Boolean(form.is_active),
    };

    if (canSelectCompany && form.company_id) {
      payload.company_id = Number(form.company_id);
    } else if (userCompanyId) {
      payload.company_id = Number(userCompanyId);
    }

    const result = await onSubmit?.({
      values: payload,
      isEdit: isEditing,
    });

    if (result !== false) {
      handleClose();
    }
  };

  if (!isRendered) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 ${backdropClasses}`}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full max-w-2xl bg-base-100 rounded-3xl shadow-2xl border border-base-200 overflow-hidden ${cardClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-base-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-base-content tracking-tight">
                {isEditing ? "Edit Product Type" : "Add New Product Type"}
              </h2>
              <p className="text-xs text-base-content/60">
                {isEditing
                  ? "Update product classification master, operational flags, and billing rules."
                  : "Register a high-level product classification (Garments, Fabric, Footwear, Services)."}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Target Company Select (SuperAdmin / Admin only) */}
          {canSelectCompany && (
            <div>
              <CompanySelect
                value={form.company_id}
                onChange={(id) => {
                  setForm((f) => ({ ...f, company_id: id }));
                  if (errors.company_id) setErrors((er) => ({ ...er, company_id: undefined }));
                }}
                required={true}
                error={errors.company_id}
                label="Target Company"
                placeholder="-- Select Target Company --"
              />
            </div>
          )}

          {/* Product Type Name Input with Real-time Presets */}
          <div className="relative" ref={suggestionContainerRef}>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-base-content/80">
                Product Type Name <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={toggleSuggestions}
                className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer bg-primary/10 hover:bg-primary/20 px-2 py-0.5 rounded-lg border border-primary/20 transition-colors"
                title="Browse real-time product type presets"
              >
                <Zap className="size-3 text-amber-500 fill-amber-500" />
                <span>{isDropdownVisible ? "Close Presets" : "⚡ Presets"}</span>
                <ChevronDown className={`size-3 transition-transform ${isDropdownVisible ? "rotate-180" : ""}`} />
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Ready Made Garments, Fabric & Textiles, Services"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-base-200/50 border text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                  errors.type_name ? "border-rose-500 focus:border-rose-500" : "border-base-300"
                }`}
                value={form.type_name}
                onChange={handleNameChange}
                onBlur={() => {
                  if (form.type_name) {
                    setForm((f) => ({
                      ...f,
                      type_name: formatProductTypeName(f.type_name),
                    }));
                  }
                }}
                onFocus={() => {
                  if (!hasTyped) setShowSuggestions(true);
                }}
                disabled={isSubmitting}
                maxLength={100}
                autoFocus
              />
            </div>

            {/* Real-time suggestions dropdown - only shown when matching or explicitly toggled */}
            {isDropdownVisible && (
              <div className="absolute z-30 left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-2xl bg-base-100 border border-base-300 shadow-xl p-1.5 space-y-1 animate-in fade-in-50 duration-150">
                <div className="px-2.5 py-1 text-[11px] font-semibold text-base-content/50 uppercase tracking-wider flex items-center justify-between border-b border-base-200 pb-1 mb-1">
                  <span>
                    {hasTyped && matchingPresets.length > 0
                      ? `Matching Presets (${matchingPresets.length})`
                      : `Standard Product Types (${displayPresets.length})`}
                  </span>
                  <span className="text-[10px] text-primary font-normal">click to auto-fill</span>
                </div>
                {displayPresets.map((preset) => {
                  const isSelected = form.type_name.trim().toLowerCase() === preset.name.toLowerCase();
                  return (
                    <button
                      key={preset.id || preset.code}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
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
                            {preset.code}
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

            {errors.type_name && (
              <span className="mt-1 block text-xs text-rose-500 font-medium">
                {errors.type_name}
              </span>
            )}

            {/* Quick chips below - only show when user hasn't typed */}
            {!hasTyped && (
              <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-base-content/50 font-medium flex items-center gap-1">
                  <Sparkles className="size-3 text-amber-500" /> Quick:
                </span>
                {popularPresets.slice(0, 5).map((preset) => {
                  const active = form.type_name.trim().toLowerCase() === preset.name.toLowerCase();
                  return (
                    <button
                      key={preset.id || preset.code}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`text-[11px] px-2 py-0.5 rounded-lg border font-medium transition-all cursor-pointer ${
                        active
                          ? "bg-primary text-primary-content border-primary"
                          : "bg-base-200/60 hover:bg-base-200 text-base-content/75 border-base-300 hover:border-primary/40"
                      }`}
                    >
                      {preset.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Type Code Input with Auto Button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-base-content/80">
                Product Type Code <span className="text-base-content/40 font-normal">(Optional)</span>
              </label>
              <button
                type="button"
                onClick={handleAutoGenerateCode}
                disabled={!form.type_name.trim() || isSubmitting}
                className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-40"
                title="Generate uppercase code from name"
              >
                <Sparkles className="size-3" /> Auto
              </button>
            </div>
            <input
              type="text"
              placeholder="e.g. READY_MADE"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-base-200/50 border text-sm font-mono uppercase text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                errors.type_code ? "border-rose-500 focus:border-rose-500" : "border-base-300"
              }`}
              value={form.type_code}
              onChange={handleCodeChange}
              disabled={isSubmitting}
              maxLength={50}
            />
            {errors.type_code ? (
              <span className="mt-1 block text-xs text-rose-500 font-medium">
                {errors.type_code}
              </span>
            ) : codeManuallyEdited ? (
              <span className="mt-1 block text-[11px] text-primary font-medium">
                Custom code active · Click Auto to sync with name
              </span>
            ) : (
              <span className="mt-1 block text-[11px] text-base-content/50">
                Auto-generated from name in real-time
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-base-content/80">
                Description <span className="text-base-content/40 font-normal">(Optional)</span>
              </label>
              <span className="text-[10px] text-base-content/40 font-mono">
                {(form.description || "").length} / 2000
              </span>
            </div>
            <textarea
              rows={2}
              placeholder="Brief details about products classified under this type..."
              className={`w-full px-3.5 py-2 rounded-xl bg-base-200/50 border text-xs sm:text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                errors.description ? "border-rose-500 focus:border-rose-500" : "border-base-300"
              }`}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              disabled={isSubmitting}
              maxLength={2000}
            />
            {errors.description && (
              <span className="mt-1 block text-xs text-rose-500 font-medium">
                {errors.description}
              </span>
            )}
          </div>

          {/* Operational Feature Toggles (Stock, Sale, Purchase) */}
          <div className="p-4 rounded-2xl bg-base-200/40 border border-base-300 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-base-content/60 block">
              Operational Configuration
            </span>

            {/* Stock Item Toggle */}
            <div className="flex items-center justify-between gap-3 py-1">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-base-content block leading-tight">
                    Stock Item (Inventory Tracked)
                  </span>
                  <span className="text-[11px] text-base-content/60 block mt-0.5">
                    Enable to track physical warehouse stock quantities, batches, and reorder levels.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={form.is_stock_item}
                onChange={(e) => setForm((f) => ({ ...f, is_stock_item: e.target.checked }))}
                disabled={isSubmitting}
                className="toggle toggle-primary toggle-sm shrink-0"
              />
            </div>

            {/* Saleable Toggle */}
            <div className="flex items-center justify-between gap-3 py-1 border-t border-base-200">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-base-content block leading-tight">
                    Saleable (POS & Sales Invoicing)
                  </span>
                  <span className="text-[11px] text-base-content/60 block mt-0.5">
                    Allow products under this type to be added to POS retail bills and customer invoices.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={form.is_saleable}
                onChange={(e) => setForm((f) => ({ ...f, is_saleable: e.target.checked }))}
                disabled={isSubmitting}
                className="toggle toggle-success toggle-sm shrink-0"
              />
            </div>

            {/* Purchasable Toggle */}
            <div className="flex items-center justify-between gap-3 py-1 border-t border-base-200">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-base-content block leading-tight">
                    Purchasable (Supplier Orders & Inward)
                  </span>
                  <span className="text-[11px] text-base-content/60 block mt-0.5">
                    Allow products under this type to be included in purchase orders and supplier GRNs.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={form.is_purchasable}
                onChange={(e) => setForm((f) => ({ ...f, is_purchasable: e.target.checked }))}
                disabled={isSubmitting}
                className="toggle toggle-warning toggle-sm shrink-0"
              />
            </div>
          </div>

          {/* Active Catalog Status */}
          <div className="p-4 rounded-2xl bg-base-200/40 border border-base-300 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-base-content block">Active in Catalog</span>
              <span className="text-[11px] text-base-content/60 block mt-0.5">
                When active, this product type is available across products creation and catalog filters.
              </span>
            </div>
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
              disabled={isSubmitting}
              className="toggle toggle-success toggle-sm shrink-0"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-base-200">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="clip-six"
              size="sm"
              loading={isSubmitting}
            >
              {isEditing ? "Update Product Type" : "Create Product Type"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
