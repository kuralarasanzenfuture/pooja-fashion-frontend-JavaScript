import { useState, useRef, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  X,
  Layers,
  Sparkles,
  ChevronDown,
  FolderTree,
  Zap,
  Lock,
  Tags,
} from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";
import { useCategories } from "../../categories/hooks/useCategories.js";
import { normalizeCategoryImageUrl, formatCategoryName } from "../../categories/utils/categoryImageHelper.js";
import ImageUploader from "./ImageUploader.jsx";
import ParentCategorySelect from "./ParentCategorySelect.jsx";
import {
  getPopularSubcategoryPresets,
  searchSubcategoryPresets,
} from "../data/index.js";

const DESC_MAX = 2000;

function validate(v) {
  const e = {};
  if (!v.category_id) {
    e.category_id = "Parent category is required.";
  }

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

function SubCategoryFormContent({
  initialData,
  initialCategoryId,
  initialCompanyId,
  parentCategory,
  fixedCategory = false,
  userCompanyId,
  mode,
  saving,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(() => {
    const defaultCategoryId =
      initialData?.categoryId ??
      initialData?.category_id ??
      initialData?.category?.id ??
      initialCategoryId ??
      "";

    const defaultCompanyId =
      initialData?.companyId ??
      initialData?.company_id ??
      userCompanyId ??
      initialCompanyId ??
      "";

    return initialData
      ? {
          category_id: String(defaultCategoryId),
          company_id: String(defaultCompanyId),
          subcategory_code:
            initialData.subcategoryCode ??
            initialData.subcategory_code ??
            "",
          subcategory_name:
            initialData.subcategoryName ??
            initialData.subcategory_name ??
            "",
          description: initialData.description ?? "",
          display_order:
            initialData.displayOrder ?? initialData.display_order ?? 0,
          is_active:
            initialData.isActive !== undefined
              ? Boolean(initialData.isActive)
              : initialData.is_active !== undefined
              ? Boolean(initialData.is_active)
              : true,
        }
      : {
          category_id: defaultCategoryId ? String(defaultCategoryId) : "",
          company_id: defaultCompanyId ? String(defaultCompanyId) : "",
          subcategory_code: "",
          subcategory_name: "",
          description: "",
          display_order: 0,
          is_active: true,
        };
  });

  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionContainerRef = useRef(null);

  // Fetch parent categories for dropdown
  const categoryQueryParams = useMemo(() => {
    const p = { limit: 100, is_active: true };
    if (userCompanyId) {
      p.company_id = Number(userCompanyId);
    }
    return p;
  }, [userCompanyId]);

  const { data: categoriesResponse, isLoading: categoriesLoading } = useCategories(
    categoryQueryParams
  );

  const categories = useMemo(() => {
    const raw = categoriesResponse?.data || categoriesResponse?.categories || [];
    return Array.isArray(raw) ? raw : [];
  }, [categoriesResponse]);

  const currentCategoryObj = useMemo(() => {
    if (parentCategory) return parentCategory;
    const catId = form.category_id || initialCategoryId;
    return categories.find((c) => String(c.id) === String(catId)) || null;
  }, [parentCategory, form.category_id, initialCategoryId, categories]);

  const isLocked = Boolean(parentCategory || fixedCategory);

  // Compute preview URL using useMemo (no setState in useEffect)
  const objectUrl = useMemo(() => {
    if (!imageFile) return null;
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

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

  const filteredPresets = useMemo(() => {
    return searchSubcategoryPresets(form.subcategory_name);
  }, [form.subcategory_name]);

  const popularPresets = useMemo(() => {
    return getPopularSubcategoryPresets();
  }, []);

  const currentImageUrl =
    initialData?.imageUrl || initialData?.image_url || null;
  const previewUrl = objectUrl || (removeImage ? null : currentImageUrl);

  const set = (key) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const handleCategoryChange = (valOrEvent, selectedCat) => {
    const catId =
      typeof valOrEvent === "object" && valOrEvent?.target
        ? valOrEvent.target.value
        : valOrEvent;
    const selectedCategory =
      selectedCat || categories.find((c) => String(c.id) === String(catId));

    setForm((f) => ({
      ...f,
      category_id: catId,
      company_id: selectedCategory
        ? String(selectedCategory.company_id || selectedCategory.companyId || f.company_id)
        : f.company_id,
    }));

    if (errors.category_id) {
      setErrors((er) => ({ ...er, category_id: undefined }));
    }
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
    setForm((f) => {
      const isAutoCode =
        !f.subcategory_code ||
        f.subcategory_code ===
          f.subcategory_name
            .trim()
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "_")
            .replace(/_+/g, "_")
            .slice(0, 50);

      let matchedCatId = f.category_id;
      if (!matchedCatId && preset.category) {
        const found = categories.find(
          (c) =>
            (c.categoryName || c.category_name || "").toLowerCase() ===
            preset.category.toLowerCase()
        );
        if (found) matchedCatId = String(found.id);
      }

      return {
        ...f,
        subcategory_name: preset.name,
        subcategory_code:
          isAutoCode || mode === "add" ? preset.code : f.subcategory_code,
        category_id: matchedCatId,
        description:
          !f.description || mode === "add" ? preset.description : f.description,
        display_order:
          (!f.display_order || Number(f.display_order) === 0) &&
          preset.display_order
            ? preset.display_order
            : f.display_order,
      };
    });

    if (errors.subcategory_name) setErrors((er) => ({ ...er, subcategory_name: undefined }));
    if (errors.subcategory_code) setErrors((er) => ({ ...er, subcategory_code: undefined }));
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }

    const payload = {
      category_id: Number(form.category_id),
      subcategory_name: formatCategoryName(form.subcategory_name.trim()),
      subcategory_code: form.subcategory_code.trim().toUpperCase() || undefined,
      description: form.description.trim() || null,
      display_order: Number(form.display_order) || 0,
      is_active: form.is_active,
    };

    if (form.company_id) {
      payload.company_id = Number(form.company_id);
    }

    await onSubmit?.({
      values: payload,
      imageFile,
      removeImage,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
      {/* 2-Column Responsive Layout (Left: Form Inputs | Right: Visual Asset & Status) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Left Column (md:col-span-3) */}
        <div className="md:col-span-3 space-y-4">
          {/* Parent Category Selector */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-bold text-base-content block flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FolderTree className="size-3.5 text-primary" />
                <span>Parent Category</span>
                <span className="text-rose-500">*</span>
              </span>
              {isLocked ? (
                <span className="text-[11px] font-semibold text-primary/80 flex items-center gap-1">
                  <Lock className="size-3" />
                  <span>Fixed Hierarchy</span>
                </span>
              ) : (
                categoriesLoading && (
                  <span className="text-[11px] font-normal text-base-content/50">
                    Loading categories...
                  </span>
                )
              )}
            </label>

            {isLocked && currentCategoryObj ? (
              <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-base-200/60 border border-primary/20">
                <div className="flex items-center gap-2.5 min-w-0">
                  {(currentCategoryObj.imageUrl || currentCategoryObj.image_url) ? (
                    <div className="size-9 rounded-xl overflow-hidden border border-primary/20 bg-base-200 shrink-0 shadow-2xs">
                      <img
                        src={normalizeCategoryImageUrl(currentCategoryObj.imageUrl || currentCategoryObj.image_url)}
                        alt={currentCategoryObj.categoryName || currentCategoryObj.category_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                      {(currentCategoryObj.categoryName || currentCategoryObj.category_name || "C").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-base-content block truncate">
                      {formatCategoryName(currentCategoryObj.categoryName || currentCategoryObj.category_name)}
                    </span>
                    {(currentCategoryObj.categoryCode || currentCategoryObj.category_code) && (
                      <span className="text-[10px] font-mono font-semibold text-primary">
                        {currentCategoryObj.categoryCode || currentCategoryObj.category_code}
                      </span>
                    )}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-base-100 text-primary text-[10px] font-bold border border-primary/20 shrink-0">
                  <Lock className="size-3" />
                  <span>LOCKED</span>
                </span>
              </div>
            ) : (
              <ParentCategorySelect
                categories={categories}
                value={form.category_id}
                onChange={handleCategoryChange}
                disabled={saving || categoriesLoading}
                error={errors.category_id}
              />
            )}
            {errors.category_id && (
              <p className="text-xs text-rose-500 font-medium">{errors.category_id}</p>
            )}
          </div>

          {/* Subcategory Name & Code (Single Row) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Subcategory Name & Suggestions */}
            <div className="space-y-1.5 relative" ref={suggestionContainerRef}>
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-base-content block flex items-center gap-1">
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
                onBlur={() => {
                  if (form.subcategory_name) {
                    setForm((f) => ({
                      ...f,
                      subcategory_name: formatCategoryName(f.subcategory_name),
                    }));
                  }
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="e.g. Kanchipuram Silk, Anarkali..."
                maxLength={150}
                disabled={saving}
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-base-200/60 text-xs sm:text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.subcategory_name
                    ? "border-rose-500 ring-2 ring-rose-500/20"
                    : "border-base-300 hover:border-primary/40 focus:border-primary"
                }`}
              />
              {errors.subcategory_name && (
                <p className="text-xs text-rose-500 font-medium">
                  {errors.subcategory_name}
                </p>
              )}

              {/* Presets Dropdown */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-2xl bg-base-100 border border-base-300 shadow-2xl p-2 max-h-56 overflow-y-auto space-y-1">
                  <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-base-content/50 flex items-center justify-between">
                    <span>Fast Presets</span>
                    <span className="text-[10px] lowercase text-primary">click to autofill</span>
                  </div>
                  {(filteredPresets.length > 0 ? filteredPresets : popularPresets).map(
                    (preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-primary/10 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-base-content group-hover:text-primary block truncate">
                            {preset.name}
                          </span>
                          <span className="text-[10px] text-base-content/50 block truncate">
                            Category: {preset.category}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-base-200 text-base-content/60 shrink-0 ml-2">
                          {preset.code}
                        </span>
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Subcategory Code */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-base-content">
                  Subcategory Code <span className="text-base-content/40 font-normal">(Optional)</span>
                </label>
                <button
                  type="button"
                  onClick={handleAutoGenerateCode}
                  disabled={!form.subcategory_name.trim() || saving}
                  className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-40"
                  title="Generate uppercase code from subcategory name"
                >
                  <Zap className="size-3" />
                  <span>Generate</span>
                </button>
              </div>
              <input
                type="text"
                value={form.subcategory_code}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    subcategory_code: e.target.value.toUpperCase(),
                  }))
                }
                placeholder="e.g. KANCHI_SILK"
                maxLength={50}
                disabled={saving}
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-base-200/60 text-xs sm:text-sm font-mono text-base-content placeholder:text-base-content/40 uppercase focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.subcategory_code
                    ? "border-rose-500 ring-2 ring-rose-500/20"
                    : "border-base-300 hover:border-primary/40 focus:border-primary"
                }`}
              />
              {errors.subcategory_code && (
                <p className="text-xs text-rose-500 font-medium">
                  {errors.subcategory_code}
                </p>
              )}
            </div>
          </div>

          {/* Display Order Sequence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-base-content block">
                Display Order <span className="text-base-content/40 font-normal">(Sequence)</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.display_order}
                onChange={set("display_order")}
                disabled={saving}
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-base-200/60 text-xs sm:text-sm text-base-content font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.display_order
                    ? "border-rose-500 ring-2 ring-rose-500/20"
                    : "border-base-300 hover:border-primary/40 focus:border-primary"
                }`}
              />
              {errors.display_order && (
                <p className="text-xs text-rose-500 font-medium">
                  {errors.display_order}
                </p>
              )}
            </div>
            <div className="pt-2 sm:pt-6 text-xs text-base-content/60 leading-relaxed">
              <span>Controls sequence order in category navigation, filter chips, and billing POS.</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-base-content">
                Description <span className="text-base-content/40 font-normal">(Optional)</span>
              </label>
              <span className="text-[11px] text-base-content/50 font-mono">
                {form.description.length} / {DESC_MAX}
              </span>
            </div>
            <textarea
              rows={3}
              value={form.description}
              onChange={set("description")}
              maxLength={DESC_MAX}
              disabled={saving}
              placeholder="Detailed description of products grouped under this subcategory..."
              className={`w-full px-3.5 py-2.5 rounded-xl border bg-base-200/60 text-xs sm:text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                errors.description
                  ? "border-rose-500 ring-2 ring-rose-500/20"
                  : "border-base-300 hover:border-primary/40 focus:border-primary"
              }`}
            />
            {errors.description && (
              <p className="text-xs text-rose-500 font-medium">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Right Column (md:col-span-2) */}
        <div className="md:col-span-2 space-y-4 flex flex-col justify-between">
          {/* Subcategory Image Upload */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-bold text-base-content block">
              Visual Asset / Image <span className="text-base-content/40 font-normal">(Optional)</span>
            </label>
            <ImageUploader
              previewUrl={previewUrl}
              disabled={saving}
              onSelect={(file) => {
                setImageFile(file);
                setRemoveImage(false);
              }}
              onRemove={() => {
                setImageFile(null);
                setRemoveImage(true);
              }}
            />
          </div>

          {/* Active Status Switch */}
          <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300 flex items-center justify-between">
            <div>
              <span className="text-xs sm:text-sm font-bold text-base-content block">
                Catalog Active Status
              </span>
              <span className="text-[11px] text-base-content/60 block mt-0.5">
                Enable to make this subcategory immediately visible in products catalog
              </span>
            </div>
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={set("is_active")}
              disabled={saving}
              className="toggle toggle-success toggle-sm cursor-pointer shrink-0 ml-2"
            />
          </div>
        </div>
      </div>

      {/* Submit & Cancel Actions */}
      <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-base-200">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="clip-six"
          size="sm"
          disabled={saving}
        >
          {saving ? (
            <>
              <span className="loading loading-spinner loading-xs" />
              <span>Saving...</span>
            </>
          ) : (
            <span>
              {mode === "add" ? "Create Subcategory" : "Save Changes"}
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}

/**
 * Add / Edit Subcategory Modal
 */
export default function SubCategoryFormModal({
  open,
  isOpen,
  mode = "add",
  initialData = null,
  initialCategoryId = null,
  initialCompanyId = null,
  parentCategory = null,
  fixedCategory = false,
  saving = false,
  onClose,
  onSubmit,
}) {
  const isModalOpen = open ?? isOpen ?? false;
  const { handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isModalOpen,
    onClose
  );

  const currentUser = useSelector((state) => state.auth?.user);
  const userCompanyId = currentUser?.companyId || currentUser?.company_id;

  // Escape key handler
  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e) => e.key === "Escape" && !saving && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isModalOpen, saving, onClose]);

  if (!isModalOpen) return null;

  return (
    <div
      className={backdropClasses}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full max-w-4xl bg-base-100 rounded-3xl shadow-2xl border border-base-200 overflow-hidden ${cardClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-base-300 bg-base-100">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <Layers className="size-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-base-content leading-tight">
                {mode === "add" ? "Create New Subcategory" : "Edit Subcategory"}
              </h3>
              <p className="text-xs text-base-content/60 mt-0.5">
                {mode === "add"
                  ? "Define subcategory hierarchy linked to a parent category"
                  : `Updating record #${initialData?.id}`}
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

        {/* Inner Form with key for clean state reset */}
        <SubCategoryFormContent
          key={`${isModalOpen}-${initialData?.id || "new"}`}
          initialData={initialData}
          initialCategoryId={initialCategoryId}
          initialCompanyId={initialCompanyId}
          parentCategory={parentCategory}
          fixedCategory={fixedCategory}
          userCompanyId={userCompanyId}
          mode={mode}
          saving={saving}
          onClose={handleClose}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
