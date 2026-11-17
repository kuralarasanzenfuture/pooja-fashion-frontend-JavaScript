import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { X, Ruler, Sparkles, ChevronDown, Zap } from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";
import { CompanySelect } from "../../../company/components/index.js";
import SizeGroupSelect from "./SizeGroupSelect.jsx";
import { useAllSizeGroups } from "../../size_groups/hooks/useSizeGroups.js";
import { getPopularSizePresets, searchSizePresets } from "../data/index.js";
import {
  formatSizeName,
  generateSizeCodeFromName,
} from "../utils/sizeHelper.js";

const EMPTY_FORM = {
  company_id: "",
  size_group_id: "",
  size_code: "",
  size_name: "",
  display_order: 0,
  is_active: true,
};

function validate(values, canSelectCompany) {
  const errors = {};
  if (canSelectCompany && !values.company_id) {
    errors.company_id = "Target company is required.";
  }
  if (!values.size_group_id) {
    errors.size_group_id = "Parent Size Group is required.";
  }
  const name = (values.size_name || "").trim();
  const code = (values.size_code || "").trim();

  if (!name) {
    errors.size_name = "Size name is required.";
  } else if (name.length > 100) {
    errors.size_name = "Size name cannot exceed 100 characters.";
  }

  if (code) {
    if (code.length > 50) {
      errors.size_code = "Size code cannot exceed 50 characters.";
    } else if (!/^[A-Za-z0-9_.-]+$/.test(code)) {
      errors.size_code = "Use letters, numbers, hyphens, periods, or underscores only.";
    }
  }

  const order = Number(values.display_order);
  if (isNaN(order) || order < 0) {
    errors.display_order = "Display order must be 0 or greater.";
  }

  return errors;
}

/**
 * Add / Edit Size Form Modal
 * Enhanced with spacious max-w-2xl width, 2-column Name & Code layout, and clean sequence ordering.
 */
export default function SizeFormModal({
  open,
  isOpen,
  mode = "add", // "add" | "edit"
  initialData = null,
  initialCompanyId = null,
  initialSizeGroupId = null,
  saving = false,
  onClose,
  onSubmit,
}) {
  const isModalOpen = open ?? isOpen ?? false;
  const isEdit = mode === "edit";
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

  // Fetch size groups for selector
  const effectiveCompanyId = form.company_id || initialCompanyId || userCompanyId;
  const { data: sizeGroupsResponse, isLoading: isLoadingGroups } = useAllSizeGroups(
    effectiveCompanyId ? { company_id: effectiveCompanyId } : {},
    { enabled: isModalOpen }
  );

  const sizeGroups = useMemo(() => {
    const list = sizeGroupsResponse?.data || sizeGroupsResponse || [];
    return Array.isArray(list) ? list : [];
  }, [sizeGroupsResponse]);

  const presets = useMemo(() => {
    return presetSearch ? searchSizePresets(presetSearch) : getPopularSizePresets();
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
        size_group_id:
          initialData.sizeGroupId ||
          initialData.size_group_id ||
          initialSizeGroupId ||
          "",
        size_code: initialData.sizeCode || initialData.size_code || "",
        size_name: initialData.sizeName || initialData.size_name || "",
        display_order: initialData.displayOrder ?? initialData.display_order ?? 0,
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
        size_group_id: initialSizeGroupId || "",
      });
      setCodeManuallyEdited(false);
    }

    setErrors({});
    setIsPresetsOpen(false);
    setPresetSearch("");
  }, [isModalOpen, mode, initialData, initialCompanyId, initialSizeGroupId, userCompanyId]);

  if (!isRendered) return null;

  const handleChange = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "size_name" && mode === "add" && !codeManuallyEdited) {
        next.size_code = generateSizeCodeFromName(value);
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
      size_name: preset.name,
      size_code: preset.code,
      display_order: preset.displayOrder || prev.display_order,
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
      isEdit,
    });

    if (result?.errors) {
      setErrors(result.errors);
    }
  };

  return (
    <div
      className={backdropClasses}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full max-w-2xl bg-base-100 rounded-3xl shadow-2xl border border-base-200 overflow-hidden ${cardClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-base-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-base-content tracking-tight">
                {isEdit ? "Edit Size" : "Add New Size"}
              </h2>
              <p className="text-xs text-base-content/60 mt-0.5">
                {isEdit
                  ? "Update size measurements, code, or active status."
                  : "Configure an individual size variant under a parent size group."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-xl hover:bg-base-200 text-base-content/60 hover:text-base-content transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Quick Presets Picker (only in add mode) */}
          {!isEdit && (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Quick Pick Presets</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPresetsOpen((prev) => !prev)}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{isPresetsOpen ? "Close Presets" : "Browse All"}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      isPresetsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Quick Pick Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                {presets.slice(0, 8).map((preset) => (
                  <button
                    key={`${preset.code}-${preset.name}`}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="px-2.5 py-1 rounded-xl bg-base-100 hover:bg-primary hover:text-white border border-primary/20 text-xs font-medium text-base-content/80 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span className="font-mono font-bold text-primary">{preset.code}</span>
                    <span className="text-[11px] opacity-75">{preset.name}</span>
                  </button>
                ))}
              </div>

              {/* Collapsible Presets Panel */}
              {isPresetsOpen && (
                <div className="pt-2 space-y-2 border-t border-primary/15 animate-in fade-in-50 duration-150">
                  <input
                    type="text"
                    value={presetSearch}
                    onChange={(e) => setPresetSearch(e.target.value)}
                    placeholder="Search presets (e.g. XL, 32, Small)..."
                    className="w-full px-3 py-1.5 rounded-xl bg-base-100 border border-base-300 text-xs text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pt-1">
                    {presets.map((preset) => (
                      <button
                        key={`${preset.code}-${preset.name}`}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className="p-2 rounded-xl border border-base-300/80 bg-base-100 hover:border-primary hover:bg-primary/10 text-left transition-all cursor-pointer group"
                      >
                        <div className="font-mono text-xs font-bold text-primary">
                          {preset.code}
                        </div>
                        <div className="text-[11px] text-base-content/70 truncate">
                          {preset.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Company & Parent Size Group Selector */}
          {canSelectCompany ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CompanySelect
                value={form.company_id}
                onChange={(val) => handleChange("company_id", val)}
                error={errors.company_id}
                required={true}
                label="Target Company"
                placeholder="-- Select Target Company --"
                className="w-full"
              />
              <SizeGroupSelect
                value={form.size_group_id}
                onChange={(val) => handleChange("size_group_id", val)}
                sizeGroups={sizeGroups}
                isLoading={isLoadingGroups}
                error={errors.size_group_id}
                required={true}
                className="w-full"
              />
            </div>
          ) : (
            <SizeGroupSelect
              value={form.size_group_id}
              onChange={(val) => handleChange("size_group_id", val)}
              sizeGroups={sizeGroups}
              isLoading={isLoadingGroups}
              error={errors.size_group_id}
              required={true}
              className="w-full"
            />
          )}

          {/* Size Name & Size Code (Single Row) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Size Name */}
            <div>
              <label className="text-xs sm:text-sm font-bold text-base-content block mb-1.5">
                Size Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.size_name}
                onChange={(e) => handleChange("size_name", e.target.value)}
                placeholder="e.g. Extra Large, 32 Regular, UK 8"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-base-200/60 border text-xs sm:text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.size_name
                    ? "border-rose-500 focus:border-rose-500"
                    : "border-base-300 focus:border-primary"
                }`}
              />
              {errors.size_name && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.size_name}</p>
              )}
            </div>

            {/* Size Code */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs sm:text-sm font-bold text-base-content">
                  Size Code <span className="text-base-content/40 font-normal">(Optional)</span>
                </label>
                {!isEdit && form.size_name && (
                  <button
                    type="button"
                    onClick={() => {
                      const code = generateSizeCodeFromName(form.size_name);
                      handleChange("size_code", code);
                      setCodeManuallyEdited(false);
                    }}
                    className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Auto</span>
                  </button>
                )}
              </div>
              <input
                type="text"
                value={form.size_code}
                onChange={(e) => {
                  setCodeManuallyEdited(true);
                  handleChange("size_code", e.target.value.toUpperCase());
                }}
                placeholder="e.g. XL, 32, UK-8"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-base-200/60 border font-mono text-xs sm:text-sm text-base-content uppercase placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.size_code
                    ? "border-rose-500 focus:border-rose-500"
                    : "border-base-300 focus:border-primary"
                }`}
              />
              {errors.size_code && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.size_code}</p>
              )}
            </div>
          </div>

          {/* Display Order & Helper Info (Single Row) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Display Order */}
            <div>
              <label className="text-xs sm:text-sm font-bold text-base-content block mb-1.5">
                Display Order <span className="text-base-content/40 font-normal">(Sequence)</span>
              </label>
              <input
                type="number"
                min="0"
                value={form.display_order}
                onChange={(e) => handleChange("display_order", e.target.value)}
                placeholder="0"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-base-200/60 border font-mono text-xs sm:text-sm text-base-content focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.display_order
                    ? "border-rose-500 focus:border-rose-500"
                    : "border-base-300 focus:border-primary"
                }`}
              />
              {errors.display_order && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.display_order}</p>
              )}
            </div>

            <div className="pt-2 sm:pt-4 text-xs text-base-content/60 leading-relaxed">
              <span>Determines sorting sequence in POS bill item selectors, size badges, and inventory catalogs.</span>
            </div>
          </div>

          {/* Catalog Status Toggle */}
          <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300 flex items-center justify-between">
            <div>
              <span className="text-xs sm:text-sm font-bold text-base-content block">
                Active in Catalog
              </span>
              <span className="text-[11px] text-base-content/60">
                Sizes marked inactive are hidden from inventory entry and POS selectors.
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
              {isEdit ? "Save Changes" : "Create Size"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
