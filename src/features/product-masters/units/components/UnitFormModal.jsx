import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  X,
  Scale,
  Sparkles,
  ChevronDown,
  Building,
} from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";
import { CompanySelect } from "../../../company/components/index.js";
import UnitThumb from "./UnitThumb.jsx";
import { UNIT_PRESETS, POPULAR_UNITS, searchUnitPresets } from "../data/index.js";
import {
  formatUnitName,
  generateUnitCodeFromName,
} from "../utils/unitHelper.js";

const EMPTY_FORM = {
  company_id: "",
  unit_code: "",
  unit_name: "",
  decimal_places: 0,
  is_active: true,
};

function validate(values, canSelectCompany) {
  const errors = {};
  if (canSelectCompany && !values.company_id) {
    errors.company_id = "Target company is required.";
  }

  const name = (values.unit_name || "").trim();
  const code = (values.unit_code || "").trim();

  if (!name) {
    errors.unit_name = "Unit name is required.";
  } else if (name.length > 100) {
    errors.unit_name = "Unit name cannot exceed 100 characters.";
  }

  if (code) {
    if (code.length > 30) {
      errors.unit_code = "Unit code cannot exceed 30 characters.";
    } else if (!/^[A-Za-z0-9_-]+$/.test(code)) {
      errors.unit_code = "Use letters, numbers, hyphens, or underscores only.";
    }
  }

  const dec = Number(values.decimal_places);
  if (isNaN(dec) || dec < 0 || dec > 6) {
    errors.decimal_places = "Decimal places must be an integer between 0 and 6.";
  }

  return errors;
}

/**
 * Add / Edit Unit Form Modal
 */
export default function UnitFormModal({
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
    return presetSearch ? searchUnitPresets(presetSearch) : UNIT_PRESETS;
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
        unit_code: initialData.unitCode || initialData.unit_code || "",
        unit_name: initialData.unitName || initialData.unit_name || "",
        decimal_places:
          initialData.decimalPlaces !== undefined
            ? initialData.decimalPlaces
            : initialData.decimal_places ?? 0,
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

      if (field === "unit_name" && !isEditing && !codeManuallyEdited) {
        next.unit_code = generateUnitCodeFromName(value);
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
      unit_name: preset.name,
      unit_code: preset.code,
      decimal_places: preset.decimal_places ?? 0,
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
      unit_name: form.unit_name.trim(),
      unit_code: form.unit_code.trim() || undefined,
      decimal_places: Number(form.decimal_places) || 0,
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
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-base-content tracking-tight">
                {isEditing ? "Edit Unit" : "Add New Unit"}
              </h2>
              <p className="text-xs text-base-content/60">
                {isEditing
                  ? "Update measurement unit code, name, or decimal precision."
                  : "Configure a unit of measurement for inventory, POS billing, and fabrics."}
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
                  Quick Pick Unit Presets
                </span>
                <button
                  type="button"
                  onClick={() => setIsPresetsOpen((prev) => !prev)}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>{isPresetsOpen ? "Close Presets" : "Browse All (30)"}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${isPresetsOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              {/* Popular quick chips */}
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_UNITS.map((preset) => (
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
                    placeholder="Search 30 standard units..."
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
                          <UnitThumb name={preset.name} code={preset.code} size="xs" />
                          <div>
                            <span className="text-xs font-bold text-base-content block">
                              {preset.name}
                            </span>
                            <span className="text-[10px] text-base-content/50 font-mono">
                              {preset.code} • {preset.decimal_places} decimals
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

          {/* Unit Name & Code (Single Row) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Unit Name */}
            <div>
              <div className="flex items-center justify-between mb-1.5 h-5">
                <label className="text-xs sm:text-sm font-bold text-base-content">
                  Unit Name <span className="text-rose-500">*</span>
                </label>
              </div>
              <input
                type="text"
                value={form.unit_name}
                onChange={(e) => handleChange("unit_name", e.target.value)}
                placeholder="e.g. Pieces, Meter, Kilogram, Pair, Set..."
                className={`w-full px-3.5 py-2.5 rounded-xl bg-base-200/60 border text-xs sm:text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.unit_name
                    ? "border-rose-500 focus:border-rose-500"
                    : "border-base-300 focus:border-primary"
                }`}
              />
              {errors.unit_name && (
                <p className="text-xs text-rose-500 mt-1 font-medium">
                  {errors.unit_name}
                </p>
              )}
            </div>

            {/* Unit Code */}
            <div>
              <div className="flex items-center justify-between mb-1.5 h-5">
                <label className="text-xs sm:text-sm font-bold text-base-content">
                  Unit Code (Abbreviation)
                </label>
                {!codeManuallyEdited && form.unit_code && (
                  <span className="text-[10px] sm:text-[11px] text-primary font-medium truncate">
                    Auto-suggested
                  </span>
                )}
              </div>
              <input
                type="text"
                value={form.unit_code}
                onChange={(e) => {
                  setCodeManuallyEdited(true);
                  handleChange("unit_code", e.target.value.toUpperCase());
                }}
                placeholder="e.g. PCS, MTR, KG, PAIR, SET..."
                className={`w-full px-3.5 py-2.5 rounded-xl bg-base-200/60 border font-mono uppercase text-xs sm:text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.unit_code
                    ? "border-rose-500 focus:border-rose-500"
                    : "border-base-300 focus:border-primary"
                }`}
              />
              {errors.unit_code && (
                <p className="text-xs text-rose-500 mt-1 font-medium">
                  {errors.unit_code}
                </p>
              )}
            </div>
          </div>

          {/* Decimal Places Selection */}
          <div>
            <label className="text-xs sm:text-sm font-bold text-base-content block mb-1.5">
              Decimal Precision (0 - 6 Places)
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {[0, 1, 2, 3, 4, 5, 6].map((dec) => (
                <button
                  key={dec}
                  type="button"
                  onClick={() => handleChange("decimal_places", dec)}
                  className={`py-2 px-1 text-center rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    Number(form.decimal_places) === dec
                      ? "bg-primary text-primary-content border-primary shadow-xs"
                      : "bg-base-200/50 hover:bg-base-200 border-base-300 text-base-content"
                  }`}
                >
                  <span className="block">{dec}</span>
                  <span className="text-[9px] opacity-75 font-mono block">
                    {(1).toFixed(dec)}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-base-content/50 mt-1.5">
              Use <strong>0</strong> for whole discrete items (Pieces, Sarees, Sets), <strong>2</strong> for length/fabric metre cuts, and <strong>3</strong> for weight (KGs).
            </p>
            {errors.decimal_places && (
              <p className="text-xs text-rose-500 mt-1 font-medium">
                {errors.decimal_places}
              </p>
            )}
          </div>

          {/* Catalog Status Toggle */}
          <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300 flex items-center justify-between">
            <div>
              <span className="text-xs sm:text-sm font-bold text-base-content block">
                Active in Catalog
              </span>
              <span className="text-[11px] text-base-content/60">
                Units marked inactive are hidden from inventory entry and POS selectors.
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
              {isEditing ? "Save Changes" : "Create Unit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

