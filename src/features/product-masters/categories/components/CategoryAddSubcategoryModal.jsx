import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  X,
  FolderTree,
  Sparkles,
  Zap,
  Lock,
  Tags,
  Check,
} from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";
import CategoryThumb from "./CategoryThumb.jsx";
import ImageUploader from "../../sub-categories/components/ImageUploader.jsx";
import {
  getPopularSubcategoryPresets,
  searchSubcategoryPresets,
} from "../../sub-categories/data/index.js";

const DESC_MAX = 2000;

function validate(v) {
  const e = {};
  const name = (v.subcategory_name || "").trim();
  if (!name) {
    e.subcategory_name = "Subcategory name is required.";
  } else if (name.length > 150) {
    e.subcategory_name = "Subcategory name must be 150 characters or fewer.";
  }

  const code = (v.subcategory_code || "").trim();
  if (code) {
    if (code.length > 50) {
      e.subcategory_code = "Subcategory code must be 50 characters or fewer.";
    } else if (!/^[A-Za-z0-9_-]+$/.test(code)) {
      e.subcategory_code = "Use uppercase letters, numbers, hyphen or underscore only.";
    }
  }

  const order = Number(v.display_order);
  if (!Number.isInteger(order) || order < 0) {
    e.display_order = "Display order must be 0 or a positive whole number.";
  }

  if (v.description && v.description.length > DESC_MAX) {
    e.description = `Description must be ${DESC_MAX} characters or fewer.`;
  }

  return e;
}

/**
 * CategoryAddSubcategoryModal
 * Dedicated modal for creating a subcategory directly linked to a specific category.
 * Shows the parent category in a locked, read-only display card (no dropdown selector).
 */
export default function CategoryAddSubcategoryModal({
  isOpen,
  category,
  saving = false,
  onClose,
  onSubmit,
}) {
  const { isRendered, backdropClasses, cardClasses, handleClose } =
    useModalAnimation(Boolean(isOpen), onClose);

  const [form, setForm] = useState({
    subcategory_name: "",
    subcategory_code: "",
    description: "",
    display_order: 0,
    is_active: true,
  });

  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionContainerRef = useRef(null);

  // Reset form when modal opens with a new category
  useEffect(() => {
    if (isOpen) {
      setForm({
        subcategory_name: "",
        subcategory_code: "",
        description: "",
        display_order: 0,
        is_active: true,
      });
      setErrors({});
      setImageFile(null);
      setShowSuggestions(false);
    }
  }, [isOpen, category?.id]);

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

  // Filter presets prioritizing the parent category
  const categoryName = category?.categoryName || category?.category_name || "Category";
  const categoryCode = category?.categoryCode || category?.category_code || "";
  const categoryImage = category?.imageUrl || category?.image_url || null;

  const filteredPresets = useMemo(() => {
    const allMatching = searchSubcategoryPresets(form.subcategory_name);
    if (!form.subcategory_name.trim()) {
      // Prioritize presets matching parent category name
      const lowerCat = categoryName.toLowerCase();
      const directMatches = allMatching.filter((p) =>
        p.category?.toLowerCase().includes(lowerCat)
      );
      if (directMatches.length > 0) return directMatches;
      return getPopularSubcategoryPresets();
    }
    return allMatching;
  }, [form.subcategory_name, categoryName]);

  const set = (key) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const handleAutoGenerateCode = () => {
    if (!form.subcategory_name.trim()) return;
    const autoCode = form.subcategory_name
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "_")
      .replace(/_+/g, "_")
      .slice(0, 50);
    setForm((f) => ({ ...f, subcategory_code: autoCode }));
    if (errors.subcategory_code) {
      setErrors((er) => ({ ...er, subcategory_code: undefined }));
    }
  };

  const handleSelectPreset = (preset) => {
    setForm((f) => ({
      ...f,
      subcategory_name: preset.name,
      subcategory_code: preset.code || f.subcategory_code,
      description: preset.description || f.description,
      display_order: preset.display_order || f.display_order,
    }));
    if (errors.subcategory_name) setErrors((er) => ({ ...er, subcategory_name: undefined }));
    if (errors.subcategory_code) setErrors((er) => ({ ...er, subcategory_code: undefined }));
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category?.id) return;

    const foundErrors = validate(form);
    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors);
      return;
    }

    const payload = {
      category_id: Number(category.id),
      company_id: category.companyId || category.company_id ? Number(category.companyId || category.company_id) : undefined,
      subcategory_name: form.subcategory_name.trim(),
      subcategory_code: form.subcategory_code.trim().toUpperCase() || undefined,
      description: form.description.trim() || null,
      display_order: Number(form.display_order) || 0,
      is_active: form.is_active,
    };

    await onSubmit?.({
      values: payload,
      imageFile,
      removeImage: false,
    });
  };

  if (!isRendered) return null;

  return (
    <div
      className={`${backdropClasses} z-[60]`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full max-w-2xl bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden ${cardClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-base-300 bg-base-100">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <FolderTree className="size-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-base-content leading-tight">
                Add Subcategory
              </h3>
              <p className="text-xs text-base-content/60 mt-0.5">
                Create a subcategory directly linked to{" "}
                <span className="font-semibold text-primary">{categoryName}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            className="p-1.5 rounded-lg text-base-content/50 hover:text-base-content hover:bg-base-200 transition-colors cursor-pointer"
            onClick={handleClose}
            disabled={saving}
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Inner Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[calc(85vh-130px)] overflow-y-auto">
          {/* Pinned Parent Category Display (Read-Only, Not a Dropdown) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-base-content/80 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Tags className="size-3.5 text-primary" />
                <span>Parent Category</span>
              </span>
              <span className="text-[11px] font-semibold text-primary/80 flex items-center gap-1">
                <Lock className="size-3" />
                <span>Fixed Hierarchy</span>
              </span>
            </label>

            <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-base-200/60 border border-primary/20">
              <div className="flex items-center gap-3 min-w-0">
                <CategoryThumb
                  url={categoryImage}
                  name={categoryName}
                  size="md"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-base-content truncate">
                      {categoryName}
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-primary/15 text-primary border border-primary/25">
                      {categoryCode || "CATEGORY"}
                    </span>
                  </div>
                  <p className="text-xs text-base-content/60 truncate mt-0.5">
                    Subcategory will automatically link under this catalog master
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-base-100 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold shadow-2xs">
                <Check className="size-3.5 stroke-[2.5]" />
                <span>Linked</span>
              </div>
            </div>
          </div>

          {/* Subcategory Name & Presets */}
          <div className="space-y-1.5 relative" ref={suggestionContainerRef}>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-base-content/80 flex items-center gap-1">
                <span>Subcategory Name</span>
                <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowSuggestions((prev) => !prev)}
                className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="size-3" />
                <span>Textile Presets</span>
              </button>
            </div>

            <input
              type="text"
              value={form.subcategory_name}
              onChange={set("subcategory_name")}
              onFocus={() => setShowSuggestions(true)}
              placeholder="e.g. Kanchipuram Pure Silk, Anarkali Kurtis, etc."
              disabled={saving}
              className={`w-full px-3.5 py-2.5 rounded-xl border bg-base-100 text-xs sm:text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                errors.subcategory_name
                  ? "border-rose-500 ring-2 ring-rose-500/20"
                  : "border-base-300 hover:border-primary/40 focus:border-primary"
              }`}
            />
            {errors.subcategory_name && (
              <p className="text-xs text-rose-500 font-medium">{errors.subcategory_name}</p>
            )}

            {/* Smart Textile Presets Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1.5 z-30 p-2 rounded-2xl bg-base-100 border border-base-300 shadow-xl space-y-1 max-h-56 overflow-y-auto animate-in fade-in-50 duration-150">
                <div className="px-2 py-1 text-[11px] font-bold text-base-content/50 uppercase tracking-wider flex items-center justify-between">
                  <span>Suggested For {categoryName}</span>
                  <span className="text-[10px] font-normal lowercase">Click to apply</span>
                </div>
                {filteredPresets.slice(0, 10).map((preset) => (
                  <button
                    key={preset.code}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="w-full px-2.5 py-1.5 rounded-xl hover:bg-primary/10 hover:text-primary text-left text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer group"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-base-content group-hover:text-primary truncate">
                        {preset.name}
                      </div>
                      <div className="text-[10px] text-base-content/50 truncate">
                        {preset.description || preset.category}
                      </div>
                    </div>
                    <span className="px-1.5 py-0.2 rounded font-mono text-[9px] bg-base-200 text-base-content/70 shrink-0">
                      {preset.code}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Subcategory Code & Display Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-base-content/80">
                  Subcategory Code (Optional)
                </label>
                {form.subcategory_name && (
                  <button
                    type="button"
                    onClick={handleAutoGenerateCode}
                    className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <Zap className="size-3" />
                    <span>Generate</span>
                  </button>
                )}
              </div>
              <input
                type="text"
                value={form.subcategory_code}
                onChange={set("subcategory_code")}
                placeholder="e.g. KANCHI_SILK"
                disabled={saving}
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-base-100 text-xs sm:text-sm font-mono uppercase text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.subcategory_code
                    ? "border-rose-500 ring-2 ring-rose-500/20"
                    : "border-base-300 hover:border-primary/40 focus:border-primary"
                }`}
              />
              {errors.subcategory_code && (
                <p className="text-xs text-rose-500 font-medium">{errors.subcategory_code}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-base-content/80">
                Display Order Sequence
              </label>
              <input
                type="number"
                min="0"
                value={form.display_order}
                onChange={set("display_order")}
                disabled={saving}
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-base-100 text-xs sm:text-sm text-base-content focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.display_order
                    ? "border-rose-500 ring-2 ring-rose-500/20"
                    : "border-base-300 hover:border-primary/40 focus:border-primary"
                }`}
              />
              {errors.display_order && (
                <p className="text-xs text-rose-500 font-medium">{errors.display_order}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-base-content/80">
                Description (Optional)
              </label>
              <span className="text-[10px] text-base-content/50">
                {form.description.length}/{DESC_MAX}
              </span>
            </div>
            <textarea
              rows={3}
              value={form.description}
              onChange={set("description")}
              maxLength={DESC_MAX}
              placeholder="Detailed description of products grouped under this subcategory..."
              disabled={saving}
              className="w-full px-3.5 py-2.5 rounded-xl border border-base-300 bg-base-100 text-xs sm:text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            />
            {errors.description && (
              <p className="text-xs text-rose-500 font-medium">{errors.description}</p>
            )}
          </div>

          {/* Image Uploader */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-base-content/80">
              Visual Asset / Image (Optional)
            </label>
            <ImageUploader
              previewUrl={imageFile ? URL.createObjectURL(imageFile) : null}
              onSelect={setImageFile}
              onRemove={() => setImageFile(null)}
              disabled={saving}
            />
          </div>

          {/* Active Status Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-base-200/50 border border-base-300">
            <div>
              <span className="text-xs font-bold text-base-content block">
                Active Catalog Status
              </span>
              <span className="text-[11px] text-base-content/60 block mt-0.5">
                Enable to make this subcategory immediately visible on POS & billing
              </span>
            </div>
            <input
              type="checkbox"
              className="toggle toggle-primary toggle-sm cursor-pointer"
              checked={form.is_active}
              onChange={set("is_active")}
              disabled={saving}
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-base-300">
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
              disabled={saving}
            >
              Create Subcategory
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
