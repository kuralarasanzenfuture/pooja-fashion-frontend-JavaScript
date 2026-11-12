import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { X, Ruler, Sparkles, Building, ChevronDown, Check, Zap } from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";
import { CompanySelect } from "../../../company/components/index.js";
import { getPopularSizeGroupPresets, searchSizeGroupPresets } from "../data/index.js";
import {
  formatSizeGroupName,
  generateSizeGroupCodeFromName,
} from "../utils/sizeGroupHelper.js";

const EMPTY_FORM = {
  company_id: "",
  size_group_code: "",
  size_group_name: "",
  description: "",
  is_active: true,
};

const DESC_MAX = 2000;

function validate(values, canSelectCompany) {
  const errors = {};
  if (canSelectCompany && !values.company_id) {
    errors.company_id = "Target company is required.";
  }
  const name = (values.size_group_name || "").trim();
  const code = (values.size_group_code || "").trim();

  if (!name) {
    errors.size_group_name = "Size group name is required.";
  } else if (name.length > 100) {
    errors.size_group_name = "Size group name cannot exceed 100 characters.";
  }

  if (code) {
    if (code.length > 50) {
      errors.size_group_code = "Size group code cannot exceed 50 characters.";
    } else if (!/^[A-Za-z0-9_-]+$/.test(code)) {
      errors.size_group_code = "Use uppercase letters, numbers, hyphen or underscore only.";
    }
  }

  if (values.description && values.description.length > DESC_MAX) {
    errors.description = `Description must be ${DESC_MAX} characters or fewer.`;
  }

  return errors;
}

/**
 * Add / Edit Size Group Form Modal
 */
export default function SizeGroupFormModal({
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
  const [codeManuallyEdited, setCodeManuallyEdited] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [presetSearch, setPresetSearch] = useState("");

  const presets = useMemo(() => {
    return presetSearch ? searchSizeGroupPresets(presetSearch) : getPopularSizeGroupPresets();
  }, [presetSearch]);

  useEffect(() => {
    if (!isModalOpen) return;

    if (mode === "edit" && initialData) {
      setForm({
        company_id:
          initialData.companyId ||
          initialData.company_id ||
          initialCompanyId ||
          "",
        size_group_code: initialData.sizeGroupCode || initialData.size_group_code || "",
        size_group_name: initialData.sizeGroupName || initialData.size_group_name || "",
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
  }, [isModalOpen, mode, initialData, initialCompanyId, userCompanyId]);

  if (!isRendered) return null;

  const handleChange = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "size_group_name" && mode === "add" && !codeManuallyEdited) {
        next.size_group_code = generateSizeGroupCodeFromName(value);
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
      size_group_name: preset.name,
      size_group_code: preset.code,
      description: preset.description || prev.description,
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

    const result = await onSubmit?.({
      values: form,
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
        className={`relative w-full max-w-xl bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden ${cardClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-base-200">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-base-content tracking-tight">
                {isEdit ? "Edit Size Group" : "Create Size Group"}
              </h2>
              <p className="text-xs text-base-content/60 mt-0.5">
                {isEdit
                  ? "Update size group configuration and catalog status"
                  : "Define a product sizing bracket (e.g. Men, Women, Blouse, Footwear)"}
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
          {/* Quick Presets Picker */}
          {!isEdit && (
            <div className="relative">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-base-content/70 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Standard Sizing Presets</span>
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
                    placeholder="Search preset (Men, Women, Blouse, Waist, Kids...)"
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

          {/* Company Selector (For SuperAdmin / Admin without fixed company) */}
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

          {/* Size Group Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1.5">
              Size Group Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={form.size_group_name}
              onChange={(e) => handleChange("size_group_name", e.target.value)}
              placeholder="e.g. Men Apparel, Women Ethnic, Saree Blouse"
              maxLength={100}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-base-100 border text-xs sm:text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.size_group_name ? "border-rose-500" : "border-base-300 focus:border-primary"
              }`}
            />
            {errors.size_group_name && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.size_group_name}</p>
            )}
          </div>

          {/* Size Group Code */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/70">
                Size Group Code
              </label>
              {!isEdit && form.size_group_name && (
                <button
                  type="button"
                  onClick={() => {
                    const generated = generateSizeGroupCodeFromName(form.size_group_name);
                    handleChange("size_group_code", generated);
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
              value={form.size_group_code}
              onChange={(e) => {
                setCodeManuallyEdited(true);
                handleChange("size_group_code", e.target.value.toUpperCase());
              }}
              placeholder="e.g. MEN_APPAREL"
              maxLength={50}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-base-100 border font-mono text-xs sm:text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.size_group_code ? "border-rose-500" : "border-base-300 focus:border-primary"
              }`}
            />
            {errors.size_group_code && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.size_group_code}</p>
            )}
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
              placeholder="Brief details about which apparel lines or size charts use this group..."
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
                When active, this size group and its sizes are available for product variant tagging.
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
              {isEdit ? "Update Size Group" : "Create Size Group"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

