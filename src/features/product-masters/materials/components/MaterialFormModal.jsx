import { useEffect, useState, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import {
  X,
  Layers,
  Sparkles,
  ChevronDown,
  Building,
  Check,
} from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";
import { CompanySelect } from "../../../company/components/index.js";
import MaterialThumb from "./MaterialThumb.jsx";
import { MATERIAL_PRESETS, POPULAR_MATERIALS, searchMaterialPresets } from "../data/index.js";
import {
  formatMaterialName,
  generateMaterialCodeFromName,
} from "../utils/materialHelper.js";

const EMPTY_FORM = {
  company_id: "",
  material_code: "",
  material_name: "",
  description: "",
  is_active: true,
};

function validate(values, canSelectCompany) {
  const errors = {};
  if (canSelectCompany && !values.company_id) {
    errors.company_id = "Target company is required.";
  }

  const name = (values.material_name || "").trim();
  const code = (values.material_code || "").trim();

  if (!name) {
    errors.material_name = "Material name is required.";
  } else if (name.length > 150) {
    errors.material_name = "Material name cannot exceed 150 characters.";
  }

  if (code) {
    if (code.length > 50) {
      errors.material_code = "Material code cannot exceed 50 characters.";
    } else if (!/^[A-Za-z0-9_-]+$/.test(code)) {
      errors.material_code = "Use letters, numbers, hyphens, or underscores only.";
    }
  }

  return errors;
}

/**
 * Add / Edit Material Form Modal
 */
export default function MaterialFormModal({
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

  // Autocomplete suggestions matching what user has typed in material_name
  const filteredPresets = useMemo(() => {
    if (!form.material_name || !form.material_name.trim()) {
      return POPULAR_MATERIALS;
    }
    return searchMaterialPresets(form.material_name);
  }, [form.material_name]);

  useEffect(() => {
    if (!isModalOpen) return;

    if (isEditing && initialData) {
      setForm({
        company_id:
          initialData.companyId ||
          initialData.company_id ||
          initialCompanyId ||
          "",
        material_code: initialData.materialCode || initialData.material_code || "",
        material_name: initialData.materialName || initialData.material_name || "",
        description: initialData.description || "",
        is_active:
          initialData.isActive !== undefined
            ? initialData.isActive
            : Boolean(initialData.is_active),
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
  }, [isModalOpen, isEditing, initialData, initialCompanyId, userCompanyId]);

  const handleChange = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "material_name" && !isEditing && !codeManuallyEdited) {
        next.material_code = generateMaterialCodeFromName(value);
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
      material_name: preset.name,
      material_code: preset.code,
      description: preset.desc || prev.description,
    }));
    setCodeManuallyEdited(true);
    setShowSuggestions(false);
    if (errors.material_name) setErrors((er) => ({ ...er, material_name: undefined }));
    if (errors.material_code) setErrors((er) => ({ ...er, material_code: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form, canSelectCompany);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      material_name: form.material_name.trim(),
      material_code: form.material_code.trim() || undefined,
      description: form.description?.trim() || null,
      is_active: Boolean(form.is_active),
    };

    if (canSelectCompany && form.company_id) {
      payload.company_id = Number(form.company_id);
    }

    const result = await onSubmit?.({
      values: payload,
      isEdit: isEditing,
    });

    if (result !== false) {
      handleClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 ${backdropClasses}`}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full max-w-2xl bg-base-100 rounded-3xl shadow-2xl border border-base-200 overflow-hidden ${cardClasses}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-base-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-base-content tracking-tight">
                {isEditing ? "Edit Material" : "Add New Material"}
              </h2>
              <p className="text-xs text-base-content/60">
                {isEditing
                  ? "Update textile fabric name, code, or description."
                  : "Configure an apparel fabric or textile material for products."}
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
                onChange={(id) => handleChange("company_id", id)}
                required={true}
                error={errors.company_id}
                label="Target Company"
                placeholder="-- Select Target Company --"
              />
            </div>
          )}

          {/* Material Name & Code (Single Row) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Material Name with Autocomplete Presets Dropdown */}
            <div className="relative" ref={suggestionContainerRef}>
              <div className="flex items-center justify-between mb-1.5 h-5">
                <label className="text-xs sm:text-sm font-bold text-base-content flex items-center gap-1">
                  Material Name <span className="text-rose-500">*</span>
                </label>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setShowSuggestions((prev) => !prev)}
                    className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Fabric Presets</span>
                  </button>
                )}
              </div>
              <input
                type="text"
                value={form.material_name}
                onChange={(e) => {
                  handleChange("material_name", e.target.value);
                  if (!showSuggestions && !isEditing) setShowSuggestions(true);
                }}
                onFocus={() => {
                  if (!isEditing) setShowSuggestions(true);
                }}
                placeholder="e.g. Cotton, Pure Silk, Georgette, Banarasi..."
                className={`w-full px-3.5 py-2.5 rounded-xl bg-base-200/60 border text-xs sm:text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.material_name
                    ? "border-rose-500 focus:border-rose-500"
                    : "border-base-300 focus:border-primary"
                }`}
              />
              {errors.material_name && (
                <p className="text-xs text-rose-500 mt-1 font-medium">
                  {errors.material_name}
                </p>
              )}

              {/* Floating Autocomplete Presets Dropdown */}
              {!isEditing && showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-2xl bg-base-100 border border-base-200 shadow-2xl p-1.5 max-h-56 overflow-y-auto space-y-1">
                  <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-base-content/50 flex items-center justify-between border-b border-base-200 pb-1 mb-1">
                    <span>
                      {form.material_name?.trim()
                        ? `Suggested Fabrics (${filteredPresets.length})`
                        : "Fast Presets"}
                    </span>
                    <span className="text-[10px] text-primary lowercase font-medium">
                      click to autofill
                    </span>
                  </div>

                  {filteredPresets.length === 0 ? (
                    <div className="px-3 py-3 text-xs text-base-content/60 text-center">
                      No matching fabric preset. Custom fabric name &quot;{form.material_name}&quot; will be used.
                    </div>
                  ) : (
                    filteredPresets.slice(0, 15).map((preset) => (
                      <button
                        key={preset.code}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-primary/10 transition-colors flex items-center justify-between group cursor-pointer border border-transparent hover:border-primary/20"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <MaterialThumb name={preset.name} code={preset.code} size="xs" />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-base-content group-hover:text-primary block truncate">
                              {preset.name}
                            </span>
                            {preset.desc && (
                              <span className="text-[11px] text-base-content/50 block truncate max-w-[180px] sm:max-w-[240px]">
                                {preset.desc}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-base-200 group-hover:bg-primary/20 text-base-content/70 group-hover:text-primary font-semibold shrink-0 ml-2">
                          {preset.code}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Material Code */}
            <div>
              <div className="flex items-center justify-between mb-1.5 h-5">
                <label className="text-xs sm:text-sm font-bold text-base-content">
                  Material Code
                </label>
                {!codeManuallyEdited && form.material_code && (
                  <span className="text-[10px] sm:text-[11px] text-primary font-medium truncate">
                    Auto-generated from name
                  </span>
                )}
              </div>
              <input
                type="text"
                value={form.material_code}
                onChange={(e) => {
                  setCodeManuallyEdited(true);
                  handleChange("material_code", e.target.value.toUpperCase());
                }}
                placeholder="e.g. COTTON, SILK, BANARASI-SILK..."
                className={`w-full px-3.5 py-2.5 rounded-xl bg-base-200/60 border font-mono uppercase text-xs sm:text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.material_code
                    ? "border-rose-500 focus:border-rose-500"
                    : "border-base-300 focus:border-primary"
                }`}
              />
              {errors.material_code && (
                <p className="text-xs text-rose-500 mt-1 font-medium">
                  {errors.material_code}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs sm:text-sm font-bold text-base-content block mb-1.5">
              Description <span className="text-base-content/40 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="e.g. Traditional natural breathable fabric, ideal for bridal sarees and lehengas..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-base-200/60 border border-base-300 text-xs sm:text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            />
          </div>

          {/* Catalog Status Toggle */}
          <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300 flex items-center justify-between">
            <div>
              <span className="text-xs sm:text-sm font-bold text-base-content block">
                Active in Catalog
              </span>
              <span className="text-[11px] text-base-content/60">
                Materials marked inactive are hidden from product forms and catalog filters.
              </span>
            </div>
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => handleChange("is_active", e.target.checked)}
              className="toggle toggle-success toggle-sm cursor-pointer"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-base-200">
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
              {isEditing ? "Save Changes" : "Create Material"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

