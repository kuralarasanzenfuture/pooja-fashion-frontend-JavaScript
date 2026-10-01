import { useEffect, useState } from "react";
import { X, Tags, Sparkles, Layers, Image as ImageIcon } from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";
import ImageUploader from "./ImageUploader.jsx";

const EMPTY = {
  category_code: "",
  category_name: "",
  description: "",
  display_order: 0,
  is_active: true,
};

const DESC_MAX = 2000;

function validate(v) {
  const e = {};
  const code = (v.category_code || "").trim();
  const name = (v.category_name || "").trim();

  if (code) {
    if (code.length > 50) {
      e.category_code = "Category code must be 50 characters or fewer.";
    } else if (!/^[A-Za-z0-9_-]+$/.test(code)) {
      e.category_code = "Use uppercase letters, numbers, hyphen or underscore only.";
    }
  }

  if (!name) {
    e.category_name = "Category name is required.";
  } else if (name.length > 150) {
    e.category_name = "Category name must be 150 characters or fewer.";
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
 * Add / Edit Category Modal with application-standard design styling
 */
export default function CategoryFormModal({
  open,
  isOpen,
  mode = "add", // "add" | "edit"
  initialData = null,
  saving = false,
  onClose,
  onSubmit,
}) {
  const isModalOpen = open ?? isOpen ?? false;
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(isModalOpen, onClose);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [objectUrl, setObjectUrl] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

  // Reset whenever modal opens or initialData changes
  useEffect(() => {
    if (!isModalOpen) return;
    setForm(
      initialData
        ? {
            category_code: initialData.categoryCode ?? initialData.category_code ?? "",
            category_name: initialData.categoryName ?? initialData.category_name ?? "",
            description: initialData.description ?? "",
            display_order: initialData.displayOrder ?? initialData.display_order ?? 0,
            is_active:
              initialData.isActive !== undefined
                ? Boolean(initialData.isActive)
                : initialData.is_active !== undefined
                ? Boolean(initialData.is_active)
                : true,
          }
        : EMPTY
    );
    setErrors({});
    setImageFile(null);
    setRemoveImage(false);
  }, [open, initialData]);

  // Local preview for newly picked file
  useEffect(() => {
    if (!imageFile) {
      setObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && !saving && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, saving, onClose]);

  if (!open) return null;

  const currentImageUrl = initialData?.imageUrl || initialData?.image_url || null;
  const previewUrl = objectUrl || (removeImage ? null : currentImageUrl);

  const set = (key) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const handleAutoGenerateCode = () => {
    if (!form.category_name.trim()) return;
    const autoCode = form.category_name
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "_")
      .replace(/_+/g, "_")
      .slice(0, 50);
    setForm((f) => ({ ...f, category_code: autoCode }));
    if (errors.category_code) setErrors((er) => ({ ...er, category_code: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }

    const res = await onSubmit?.({
      values: {
        category_code: form.category_code.trim().toUpperCase(),
        category_name: form.category_name.trim(),
        description: form.description.trim(),
        display_order: Number(form.display_order) || 0,
        is_active: form.is_active,
      },
      imageFile,
      removeImage,
    });

    if (res?.errors) {
      setErrors(res.errors);
    }
  };

  if (!isRendered) return null;

  return (
    <div
      className={backdropClasses}
      onClick={!saving ? handleClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-modal-title"
    >
      <div
        className={`relative w-full max-w-4xl p-0 rounded-3xl bg-base-100 border border-base-300 shadow-2xl overflow-hidden ${cardClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-4 border-b border-base-300 px-6 py-4.5 bg-base-100">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <Tags className="size-5" />
            </span>
            <div>
              <h3 id="category-modal-title" className="text-lg font-bold text-base-content leading-tight">
                {mode === "edit" ? "Edit Product Category" : "Add New Category"}
              </h3>
              <p className="text-xs text-base-content/60 mt-0.5">
                {mode === "edit"
                  ? "Update category details, display sequence, and image visual assets."
                  : "Register a product classification master for sarees, dress materials, and fabrics."}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="p-1.5 rounded-lg text-base-content/50 hover:text-base-content hover:bg-base-200 transition-colors cursor-pointer"
            onClick={handleClose}
            disabled={saving}
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid gap-6 px-6 py-5 md:grid-cols-5">
            {/* Form Fields Column */}
            <div className="space-y-4.5 md:col-span-3">
              {/* Category Name */}
              <div>
                <label className="block text-xs font-semibold text-base-content/80 mb-1.5">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pure Silk Sarees, Cotton Dress Materials"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-base-200/50 border text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                    errors.category_name ? "border-rose-500 focus:border-rose-500" : "border-base-300"
                  }`}
                  value={form.category_name}
                  onChange={set("category_name")}
                  disabled={saving}
                  maxLength={150}
                  autoFocus
                />
                {errors.category_name && (
                  <span className="mt-1 block text-xs text-rose-500 font-medium">
                    {errors.category_name}
                  </span>
                )}
              </div>

              {/* Code & Display Order */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-base-content/80">
                      Category Code
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoGenerateCode}
                      className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      title="Generate from name"
                    >
                      <Sparkles className="size-3" /> Auto
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. SILK_SAREES"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-base-200/50 border text-sm font-mono uppercase text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                      errors.category_code ? "border-rose-500 focus:border-rose-500" : "border-base-300"
                    }`}
                    value={form.category_code}
                    onChange={set("category_code")}
                    disabled={saving}
                    maxLength={50}
                  />
                  {errors.category_code ? (
                    <span className="mt-1 block text-xs text-rose-500 font-medium">
                      {errors.category_code}
                    </span>
                  ) : (
                    <span className="mt-1 block text-[11px] text-base-content/50">
                      Auto-generated if left empty
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-base-content/80 mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-base-200/50 border text-sm font-mono text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                      errors.display_order ? "border-rose-500 focus:border-rose-500" : "border-base-300"
                    }`}
                    value={form.display_order}
                    onChange={set("display_order")}
                    disabled={saving}
                  />
                  {errors.display_order ? (
                    <span className="mt-1 block text-xs text-rose-500 font-medium">
                      {errors.display_order}
                    </span>
                  ) : (
                    <span className="mt-1 block text-[11px] text-base-content/50">
                      Controls position in POS screens
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-base-content/80">
                    Description
                  </label>
                  <span className="text-[11px] text-base-content/50 font-mono">
                    {(form.description || "").length}/{DESC_MAX}
                  </span>
                </div>
                <textarea
                  rows={3}
                  placeholder="Provide an overview of fabrics, weave types, and items in this category..."
                  className={`w-full px-3.5 py-2 rounded-xl bg-base-200/50 border text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none ${
                    errors.description ? "border-rose-500 focus:border-rose-500" : "border-base-300"
                  }`}
                  value={form.description}
                  onChange={set("description")}
                  disabled={saving}
                />
                {errors.description && (
                  <span className="mt-1 block text-xs text-rose-500 font-medium">
                    {errors.description}
                  </span>
                )}
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-base-300 bg-base-200/40">
                <div>
                  <span className="block text-xs font-bold text-base-content">
                    Active Catalog Status
                  </span>
                  <span className="block text-[11px] text-base-content/60 mt-0.5">
                    When active, products under this category appear in POS and invoice billing.
                  </span>
                </div>
                <input
                  type="checkbox"
                  className="toggle toggle-success toggle-sm"
                  checked={form.is_active}
                  onChange={set("is_active")}
                  disabled={saving}
                />
              </div>
            </div>

            {/* Image Column */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-semibold text-base-content/80 mb-1">
                Category Image Asset
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
              <p className="text-[11px] text-base-content/50 leading-relaxed">
                Appears on touch POS terminals and customer digital invoices. Square ratio works best.
              </p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2.5 border-t border-base-300 bg-base-200/40 px-6 py-4">
            <Button
              type="button"
              variant="ghost"
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
              {mode === "edit" ? "Save Changes" : "Create Category"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
