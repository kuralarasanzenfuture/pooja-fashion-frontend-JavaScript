import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  X,
  Palette,
  Sparkles,
  ChevronDown,
  Zap,
  Building,
  Check,
  Pipette,
} from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";
import { CompanySelect } from "../../../company/components/index.js";
import ColorThumb from "./ColorThumb.jsx";
import { COLOR_PRESETS, POPULAR_COLORS, searchColorPresets } from "../data/index.js";
import {
  formatColorName,
  formatHexCode,
  isValidHexCode,
  generateColorCodeFromName,
  getContrastColor,
} from "../utils/colorHelper.js";

const EMPTY_FORM = {
  company_id: "",
  color_code: "",
  color_name: "",
  hex_code: "#2A0081",
  is_multicolor: false,
  description: "",
  display_order: 0,
  is_active: true,
};

function validate(values, canSelectCompany) {
  const errors = {};
  if (canSelectCompany && !values.company_id) {
    errors.company_id = "Target company is required.";
  }

  const name = (values.color_name || "").trim();
  const code = (values.color_code || "").trim();

  if (!name) {
    errors.color_name = "Color name is required.";
  } else if (name.length > 100) {
    errors.color_name = "Color name cannot exceed 100 characters.";
  }

  if (code) {
    if (code.length > 50) {
      errors.color_code = "Color code cannot exceed 50 characters.";
    } else if (!/^[A-Za-z0-9_-]+$/.test(code)) {
      errors.color_code = "Use letters, numbers, hyphens, or underscores only.";
    }
  }

  if (!values.is_multicolor && values.hex_code) {
    const formatted = formatHexCode(values.hex_code);
    if (!isValidHexCode(formatted)) {
      errors.hex_code = "Must be a valid 6-character hex code (e.g. #FF0000).";
    }
  }

  const order = Number(values.display_order);
  if (isNaN(order) || order < 0) {
    errors.display_order = "Display order must be 0 or greater.";
  }

  return errors;
}

/**
 * Add / Edit Color Form Modal
 */
export default function ColorFormModal({
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
    return presetSearch ? searchColorPresets(presetSearch) : COLOR_PRESETS;
  }, [presetSearch]);

  useEffect(() => {
    if (!isModalOpen) return;

    if (isEditing && initialData) {
      const rawHex = initialData.hexCode || initialData.hex_code || null;
      const isMulti = !rawHex || String(rawHex).toLowerCase() === "multicolor";

      setForm({
        company_id:
          initialData.companyId ||
          initialData.company_id ||
          initialCompanyId ||
          "",
        color_code: initialData.colorCode || initialData.color_code || "",
        color_name: initialData.colorName || initialData.color_name || "",
        hex_code: rawHex ? formatHexCode(rawHex) : "#2A0081",
        is_multicolor: isMulti,
        description: initialData.description || "",
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

      if (field === "color_name" && mode === "add" && !codeManuallyEdited) {
        next.color_code = generateColorCodeFromName(value);
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
      color_name: preset.name,
      color_code: preset.code,
      hex_code: preset.hex ? formatHexCode(preset.hex) : prev.hex_code,
      is_multicolor: !preset.hex,
      description: preset.desc || prev.description,
      display_order: preset.order || prev.display_order,
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
      color_name: form.color_name.trim(),
      color_code: form.color_code.trim() || undefined,
      hex_code: form.is_multicolor ? null : formatHexCode(form.hex_code),
      description: form.description?.trim() || null,
      display_order: Number(form.display_order) || 0,
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

  const effectiveHex = form.is_multicolor ? null : formatHexCode(form.hex_code);

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
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-base-content tracking-tight">
                {isEditing ? "Edit Color" : "Add New Color"}
              </h2>
              <p className="text-xs text-base-content/60">
                {isEditing
                  ? "Update color swatch, hex code, or catalog visibility."
                  : "Configure a fabric or apparel color for product variants."}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Quick Presets Picker (only in add mode) */}
          {mode === "add" && (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Popular Fashion Colors</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPresetsOpen((prev) => !prev)}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{isPresetsOpen ? "Close Presets" : "Browse All 50"}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      isPresetsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Collapsible Presets Panel */}
              {isPresetsOpen ? (
                <div className="pt-2 space-y-2 border-t border-primary/15 animate-in fade-in-50 duration-150">
                  <input
                    type="text"
                    value={presetSearch}
                    onChange={(e) => setPresetSearch(e.target.value)}
                    placeholder="Search colors (e.g. Maroon, Gold, Navy)..."
                    className="w-full px-3 py-1.5 rounded-xl bg-base-100 border border-base-300 text-xs text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-40 overflow-y-auto pt-1">
                    {presets.map((preset) => (
                      <button
                        key={`${preset.code}-${preset.name}`}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className="p-2 rounded-xl border border-base-300/80 bg-base-100 hover:border-primary hover:bg-primary/10 text-left transition-all cursor-pointer flex items-center gap-2 group"
                      >
                        <ColorThumb hex={preset.hex} name={preset.name} code={preset.code} size="xs" />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-base-content group-hover:text-primary truncate">
                            {preset.name}
                          </div>
                          <div className="text-[10px] font-mono text-base-content/60 truncate">
                            {preset.hex || "Multicolor"}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {POPULAR_COLORS.map((preset) => (
                    <button
                      key={preset.code}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className="px-2.5 py-1 rounded-xl bg-base-100 hover:border-primary border border-base-300/80 text-xs font-medium text-base-content/80 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs hover:scale-102"
                      title={preset.name}
                    >
                      <ColorThumb hex={preset.hex} name={preset.name} code={preset.code} size="xs" />
                      <span className="font-semibold text-xs">{preset.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Company Selector (SuperAdmin / Admin only) */}
          {canSelectCompany && (
            <CompanySelect
              value={form.company_id}
              onChange={(val) => handleChange("company_id", val)}
              error={errors.company_id}
              required={true}
              className="w-full"
            />
          )}

          {/* Color Name */}
          <div>
            <label className="text-xs sm:text-sm font-bold text-base-content block mb-1.5">
              Color Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={form.color_name}
              onChange={(e) => handleChange("color_name", e.target.value)}
              placeholder="e.g. Royal Blue, Rani Pink, Peacock Blue"
              className="w-full px-3.5 py-2.5 rounded-xl bg-base-200/60 border border-base-300 text-xs sm:text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {errors.color_name && (
              <p className="text-xs text-rose-500 mt-1">{errors.color_name}</p>
            )}
          </div>

          {/* Color Swatch & Hex Picker Card */}
          <div className="p-4 rounded-2xl bg-base-200/40 border border-base-300/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-base-content flex items-center gap-1.5">
                <Pipette className="w-3.5 h-3.5 text-primary" />
                <span>Color Swatch & Hex Code</span>
              </label>

              {/* Multicolor checkbox toggle */}
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.is_multicolor}
                  onChange={(e) => handleChange("is_multicolor", e.target.checked)}
                  className="checkbox checkbox-xs checkbox-primary rounded"
                />
                <span className="text-xs font-semibold text-base-content/80">
                  Multicolor / Printed
                </span>
              </label>
            </div>

            {!form.is_multicolor ? (
              <div className="flex items-center gap-3">
                {/* Interactive Color Input */}
                <div className="relative group shrink-0">
                  <input
                    type="color"
                    value={effectiveHex || "#2A0081"}
                    onChange={(e) => handleChange("hex_code", e.target.value.toUpperCase())}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    title="Click to open color palette"
                  />
                  <div
                    className="w-12 h-12 rounded-2xl shadow-sm ring-1 ring-black/15 group-hover:scale-105 transition-transform flex items-center justify-center cursor-pointer"
                    style={{ backgroundColor: effectiveHex || "#2A0081" }}
                  >
                    <Pipette
                      className="w-4 h-4 opacity-75"
                      style={{ color: getContrastColor(effectiveHex) }}
                    />
                  </div>
                </div>

                {/* Text Hex input */}
                <div className="flex-1">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-base-content/40">
                      #
                    </span>
                    <input
                      type="text"
                      maxLength={7}
                      value={form.hex_code.replace(/^#/, "")}
                      onChange={(e) => {
                        const val = `#${e.target.value.replace(/[^0-9A-Fa-f]/g, "").toUpperCase()}`;
                        handleChange("hex_code", val);
                      }}
                      placeholder="FF0000"
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-base-100 border border-base-300 font-mono text-xs sm:text-sm text-base-content uppercase focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  {errors.hex_code && (
                    <p className="text-xs text-rose-500 mt-1">{errors.hex_code}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-base-100 border border-base-300">
                <ColorThumb hex={null} code="MULTICOLOR" size="md" />
                <div className="text-xs text-base-content/70">
                  <span className="font-bold text-base-content block">
                    Multicolor Fabric / Saree
                  </span>
                  <span>Will be rendered with multi-shade silk rainbow gradient.</span>
                </div>
              </div>
            )}
          </div>

          {/* Color Code & Display Order (2-column layout) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Color Code */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs sm:text-sm font-bold text-base-content">
                  Color Code <span className="text-base-content/40 font-normal">(Optional)</span>
                </label>
                {mode === "add" && form.color_name && (
                  <button
                    type="button"
                    onClick={() => {
                      const code = generateColorCodeFromName(form.color_name);
                      handleChange("color_code", code);
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
                value={form.color_code}
                onChange={(e) => {
                  setCodeManuallyEdited(true);
                  handleChange("color_code", e.target.value.toUpperCase());
                }}
                placeholder="e.g. ROYAL-BLUE, RED, BLK"
                className="w-full px-3.5 py-2.5 rounded-xl bg-base-200/60 border border-base-300 font-mono text-xs sm:text-sm text-base-content uppercase placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              {errors.color_code && (
                <p className="text-xs text-rose-500 mt-1">{errors.color_code}</p>
              )}
            </div>

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
                className="w-full px-3.5 py-2.5 rounded-xl bg-base-200/60 border border-base-300 font-mono text-xs sm:text-sm text-base-content focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              {errors.display_order && (
                <p className="text-xs text-rose-500 mt-1">{errors.display_order}</p>
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
              placeholder="e.g. Traditional wedding silk saree red, Kanchipuram bridal tone..."
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
                Colors marked inactive are hidden from POS color selectors and catalog filters.
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
              {isEditing ? "Save Changes" : "Create Color"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
