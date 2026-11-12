import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { X, Tag, Sparkles, Building, ChevronDown, Check, Zap, Globe } from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";
import { CompanySelect } from "../../../company/components/index.js";
import BrandLogoUploader from "./BrandLogoUploader.jsx";
import { getPopularBrandPresets, searchBrandPresets } from "../data/index.js";
import {
  formatBrandName,
  generateBrandCodeFromName,
  normalizeBrandLogoUrl,
} from "../utils/brandHelper.js";

const EMPTY_FORM = {
  company_id: "",
  brand_code: "",
  brand_name: "",
  description: "",
  website_url: "",
  display_order: 0,
  is_active: true,
};

const DESC_MAX = 2000;

function validate(values, canSelectCompany) {
  const errors = {};
  if (canSelectCompany && !values.company_id) {
    errors.company_id = "Target company is required.";
  }
  const name = (values.brand_name || "").trim();
  const code = (values.brand_code || "").trim();
  const website = (values.website_url || "").trim();

  if (!name) {
    errors.brand_name = "Brand name is required.";
  } else if (name.length > 150) {
    errors.brand_name = "Brand name cannot exceed 150 characters.";
  }

  if (code) {
    if (code.length > 50) {
      errors.brand_code = "Brand code cannot exceed 50 characters.";
    } else if (!/^[A-Za-z0-9_-]+$/.test(code)) {
      errors.brand_code = "Use uppercase letters, numbers, hyphen or underscore only.";
    }
  }

  if (website) {
    try {
      const url = new URL(website);
      if (!["http:", "https:"].includes(url.protocol)) {
        errors.website_url = "Website URL must start with http:// or https://";
      }
    } catch {
      errors.website_url = "Please enter a valid website URL (e.g. https://brand.com).";
    }
  }

  const order = Number(values.display_order);
  if (!Number.isInteger(order) || order < 0) {
    errors.display_order = "Display order must be 0 or a positive integer.";
  }

  if (values.description && values.description.length > DESC_MAX) {
    errors.description = `Description must be ${DESC_MAX} characters or fewer.`;
  }

  return errors;
}

/**
 * Add / Edit Brand Form Modal
 */
export default function BrandFormModal({
  open,
  isOpen,
  mode = "add", // "add" | "edit"
  initialData = null,
  initialCompanyId = null,
  saving = false,
  onClose,
  onSubmit,
}) {
  const isModalOpen = open ?? isOpen ?? false;
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
  const [logoFile, setLogoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [removeLogo, setRemoveLogo] = useState(false);
  const [codeManuallyEdited, setCodeManuallyEdited] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [presetSearch, setPresetSearch] = useState("");

  const presets = useMemo(() => {
    return presetSearch ? searchBrandPresets(presetSearch) : getPopularBrandPresets();
  }, [presetSearch]);

  // Sync form state when modal opens or initialData changes
  useEffect(() => {
    if (!isModalOpen) return;

    if (mode === "edit" && initialData) {
      const existingLogo = initialData.logoUrl || initialData.logo_url;
      setForm({
        company_id:
          initialData.companyId ||
          initialData.company_id ||
          initialCompanyId ||
          "",
        brand_code: initialData.brandCode || initialData.brand_code || "",
        brand_name: initialData.brandName || initialData.brand_name || "",
        description: initialData.description || "",
        website_url: initialData.websiteUrl || initialData.website_url || "",
        display_order: initialData.displayOrder ?? initialData.display_order ?? 0,
        is_active:
          initialData.isActive !== undefined
            ? initialData.isActive
            : Boolean(initialData.is_active),
      });
      setPreviewUrl(normalizeBrandLogoUrl(existingLogo));
      setCodeManuallyEdited(true);
    } else {
      setForm({
        ...EMPTY_FORM,
        company_id: initialCompanyId || userCompanyId || "",
      });
      setPreviewUrl(null);
      setCodeManuallyEdited(false);
    }

    setLogoFile(null);
    setRemoveLogo(false);
    setErrors({});
    setIsPresetsOpen(false);
    setPresetSearch("");
  }, [isModalOpen, mode, initialData, initialCompanyId, userCompanyId]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isRendered) return null;

  const handleChange = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };

      // Auto-generate code in add mode unless manually edited
      if (field === "brand_name" && mode === "add" && !codeManuallyEdited) {
        next.brand_code = generateBrandCodeFromName(value);
      }

      return next;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSelectPreset = (preset) => {
    setForm((prev) => ({
      ...prev,
      brand_name: preset.name,
      brand_code: preset.code,
      website_url: preset.website_url || prev.website_url,
      description: preset.description || prev.description,
      display_order: preset.display_order ?? prev.display_order,
    }));
    setCodeManuallyEdited(true);
    setIsPresetsOpen(false);
  };

  const handleLogoSelect = (file) => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setLogoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setRemoveLogo(false);
  };

  const handleLogoRemove = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setLogoFile(null);
    setPreviewUrl(null);
    setRemoveLogo(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form, canSelectCompany);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await onSubmit?.({
      values: form,
      logoFile,
      removeLogo,
      isEdit: mode === "edit",
    });

    if (result?.errors) {
      setErrors(result.errors);
    }
  };

  const isEdit = mode === "edit";

  return (
    <div
      className={backdropClasses}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full max-w-2xl bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden ${cardClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-base-200">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-base-content tracking-tight">
                {isEdit ? "Edit Brand Master" : "Create New Brand"}
              </h2>
              <p className="text-xs text-base-content/60 mt-0.5">
                {isEdit
                  ? "Update brand details, logo asset, and catalog status"
                  : "Register an apparel brand, manufacturer, or designer label"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-xl text-base-content/40 hover:text-base-content hover:bg-base-200 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto scrollbar-thin">
          {/* Quick Presets Picker (in add mode) */}
          {!isEdit && (
            <div className="relative">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-base-content/70 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Popular Brand Presets</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsPresetsOpen((prev) => !prev)}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{isPresetsOpen ? "Close presets" : "Browse presets"}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isPresetsOpen ? "rotate-180" : ""}`} />
                </button>
              </div>

              {isPresetsOpen && (
                <div className="p-3 rounded-2xl bg-base-200/60 border border-base-300 space-y-2 mb-3">
                  <input
                    type="text"
                    value={presetSearch}
                    onChange={(e) => setPresetSearch(e.target.value)}
                    placeholder="Search brand preset (Manyavar, Fabindia, Biba, Raymond...)"
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-base-100 border border-base-300 focus:outline-none focus:border-primary"
                  />
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pt-1">
                    {presets.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPreset(p)}
                        className="px-2.5 py-1 rounded-xl bg-base-100 hover:bg-primary hover:text-white border border-base-300 text-xs font-medium text-base-content/80 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Zap className="w-3 h-3 text-amber-500" />
                        <span>{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Company Selector (For SuperAdmin / Admin without assigned company) */}
          {canSelectCompany && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1.5">
                Company <span className="text-rose-500">*</span>
              </label>
              <CompanySelect
                value={form.company_id}
                onChange={(val) => handleChange("company_id", val)}
                error={errors.company_id}
              />
              {errors.company_id && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.company_id}</p>
              )}
            </div>
          )}

          {/* Grid: Brand Name & Brand Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Brand Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1.5">
                Brand Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.brand_name}
                onChange={(e) => handleChange("brand_name", e.target.value)}
                placeholder="e.g. Manyavar, Fabindia, Biba"
                maxLength={150}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-base-100 border text-xs sm:text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.brand_name ? "border-rose-500" : "border-base-300 focus:border-primary"
                }`}
              />
              {errors.brand_name && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.brand_name}</p>
              )}
            </div>

            {/* Brand Code */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70">
                  Brand Code
                </label>
                {!isEdit && form.brand_name && (
                  <button
                    type="button"
                    onClick={() => {
                      const generated = generateBrandCodeFromName(form.brand_name);
                      handleChange("brand_code", generated);
                      setCodeManuallyEdited(false);
                    }}
                    className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Auto-generate
                  </button>
                )}
              </div>
              <input
                type="text"
                value={form.brand_code}
                onChange={(e) => {
                  setCodeManuallyEdited(true);
                  handleChange("brand_code", e.target.value.toUpperCase());
                }}
                placeholder="e.g. MANYAVAR"
                maxLength={50}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-base-100 border font-mono text-xs sm:text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.brand_code ? "border-rose-500" : "border-base-300 focus:border-primary"
                }`}
              />
              {errors.brand_code && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.brand_code}</p>
              )}
            </div>
          </div>

          {/* Grid: Website URL & Display Order */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1.5">
                Website URL
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-base-content/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="url"
                  value={form.website_url}
                  onChange={(e) => handleChange("website_url", e.target.value)}
                  placeholder="https://www.brand.com"
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-base-100 border text-xs sm:text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.website_url ? "border-rose-500" : "border-base-300 focus:border-primary"
                  }`}
                />
              </div>
              {errors.website_url && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.website_url}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                min={0}
                value={form.display_order}
                onChange={(e) => handleChange("display_order", e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-base-100 border text-xs sm:text-sm text-base-content font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.display_order ? "border-rose-500" : "border-base-300 focus:border-primary"
                }`}
              />
              {errors.display_order && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.display_order}</p>
              )}
            </div>
          </div>

          {/* Brand Logo Upload */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1.5">
              Brand Logo
            </label>
            <BrandLogoUploader
              previewUrl={previewUrl}
              onSelect={handleLogoSelect}
              onRemove={handleLogoRemove}
              disabled={saving}
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/70">
                Description
              </label>
              <span className="text-[11px] text-base-content/40 font-mono">
                {(form.description || "").length} / {DESC_MAX}
              </span>
            </div>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Brief description of the brand identity, heritage, or product focus..."
              maxLength={DESC_MAX}
              className={`w-full px-3.5 py-2 rounded-xl bg-base-100 border text-xs sm:text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.description ? "border-rose-500" : "border-base-300 focus:border-primary"
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.description}</p>
            )}
          </div>

          {/* Catalog Status Toggle */}
          <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300 flex items-center justify-between">
            <div>
              <span className="text-xs sm:text-sm font-bold text-base-content block">
                Active in Catalog
              </span>
              <span className="text-[11px] text-base-content/60">
                When active, this brand is visible in billing, filters, and product creation.
              </span>
            </div>
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => handleChange("is_active", e.target.checked)}
              className="toggle toggle-success toggle-sm cursor-pointer"
            />
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-base-200">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="clip-six"
              size="sm"
              loading={saving}
            >
              {isEdit ? "Update Brand" : "Create Brand"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

