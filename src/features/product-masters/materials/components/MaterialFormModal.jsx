import { useEffect, useState, useMemo } from "react";
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
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [presetSearch, setPresetSearch] = useState("");

  const presets = useMemo(() => {
    return presetSearch ? searchMaterialPresets(presetSearch) : MATERIAL_PRESETS;
  }, [presetSearch]);

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
    setIsPresetsOpen(false);
    setPresetSearch("");
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
    setIsPresetsOpen(false);
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
        className={`w-full max-w-lg bg-base-100 rounded-3xl shadow-2xl border border-base-200 overflow-hidden ${cardClasses}`}
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
          {/* Quick Pick Presets (Only in Add Mode) */}
          {!isEditing && (
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Quick Pick Fabric Presets
                </span>
                <button
                  type="button"
                  onClick={() => setIsPresetsOpen((prev) => !prev)}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>{isPresetsOpen ? "Close Presets" : "Browse All (40)"}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${isPresetsOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              {/* Popular quick chips */}
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_MATERIALS.map((preset) => (
                  <button
                    key={preset.code}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-base-100 hover:bg-primary hover:text-primary-content border border-base-300 hover:border-primary transition-all shadow-2xs cursor-pointer group"
                  >
                    <span>{preset.name}</span>
                    <span className="text-[10px] opacity-60 font-mono">({preset.code})</span>
                  </button>
                ))}
              </div>

              {/* Browse All Expandable Dropdown */}
              {isPresetsOpen && (
                <div className="pt-2 border-t border-primary/10 space-y-2">
                  <input
                    type="text"
                    placeholder="Search 40 fashion fabrics..."
                    value={presetSearch}
                    onChange={(e) => setPresetSearch(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-base-100 border border-base-300 focus:outline-none focus:border-primary"
                  />
                  <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                    {presets.map((preset) => (
                      <div
                        key={preset.code}
                        onClick={() => handleSelectPreset(preset)}
                        className="flex items-center justify-between p-2 rounded-xl bg-base-100 hover:bg-primary/10 border border-base-200 hover:border-primary/30 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <MaterialThumb name={preset.name} code={preset.code} size="xs" />
                          <div>
                            <span className="text-xs font-bold text-base-content block">
                              {preset.name}
                            </span>
                            <span className="text-[10px] text-base-content/50 font-mono">
                              {preset.code}
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] text-base-content/60 truncate max-w-[150px]">
                          {preset.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

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

          {/* Material Name */}
          <div>
            <label className="text-xs sm:text-sm font-bold text-base-content block mb-1.5">
              Material Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={form.material_name}
              onChange={(e) => handleChange("material_name", e.target.value)}
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
          </div>

          {/* Material Code */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs sm:text-sm font-bold text-base-content">
                Material Code
              </label>
              {!codeManuallyEdited && form.material_code && (
                <span className="text-[11px] text-primary font-medium">
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
              className="w-full px-3.5 py-2 rounded-xl bg-base-200/60 border border-base-300 text-xs sm:text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
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
