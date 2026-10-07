import { useState } from "react";
import {
  X,
  Layers,
  Calendar,
  Building,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Edit2,
  Trash2,
  ExternalLink,
  FolderTree,
} from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";

/**
 * SubCategory Details Quick View Modal
 */
export default function SubCategoryDetailsModal({
  isOpen = false,
  subcategory = null,
  onClose,
  onEdit,
  onDelete,
  onToggleStatus,
  onImageClick,
  onNavigateFullPage,
}) {
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isOpen && !!subcategory,
    onClose
  );
  const [copied, setCopied] = useState(false);

  if (!isRendered || !subcategory) return null;

  const name =
    subcategory.subcategoryName ||
    subcategory.subcategory_name ||
    "Unnamed Subcategory";
  const code =
    subcategory.subcategoryCode ||
    subcategory.subcategory_code ||
    "—";
  const categoryName =
    subcategory.categoryName ||
    subcategory.category_name ||
    subcategory.category?.category_name ||
    "—";
  const categoryCode =
    subcategory.categoryCode ||
    subcategory.category_code ||
    subcategory.category?.category_code ||
    null;
  const categoryId =
    subcategory.categoryId ||
    subcategory.category_id ||
    subcategory.category?.id;
  const imageUrl = subcategory.imageUrl || subcategory.image_url;
  const displayOrder = subcategory.displayOrder ?? subcategory.display_order ?? 0;
  const isActive =
    subcategory.isActive !== undefined
      ? Boolean(subcategory.isActive)
      : subcategory.is_active !== undefined
      ? Boolean(subcategory.is_active)
      : true;
  const desc = subcategory.description;
  const companyName = subcategory.companyName || subcategory.company_name || "Pooja Fashion";
  const companyCode = subcategory.companyCode || subcategory.company_code || null;
  const updatedAt = subcategory.updatedAt || subcategory.updated_at;
  const createdAt = subcategory.createdAt || subcategory.created_at;

  const handleCopyCode = () => {
    if (!code || code === "—") return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fmtDate = (iso) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  return (
    <div
      className={backdropClasses}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-subcat-title"
    >
      <div
        className={`relative w-full max-w-2xl p-0 rounded-3xl bg-base-100 border border-base-300 shadow-2xl overflow-hidden ${cardClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-base-300 bg-base-100">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <Layers className="size-5" />
            </span>
            <div>
              <h3 id="view-subcat-title" className="text-lg font-bold text-base-content leading-tight">
                {name}
              </h3>
              <p className="text-xs text-base-content/60 mt-0.5">
                Subcategory Master Record • #{subcategory.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="p-1.5 rounded-lg text-base-content/50 hover:text-base-content hover:bg-base-200 transition-colors cursor-pointer"
            onClick={handleClose}
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[calc(85vh-130px)] overflow-y-auto">
          {/* Top Banner Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Visual Media Showcase */}
            <div className="relative group rounded-2xl border border-base-300 bg-base-200/50 aspect-video md:aspect-square flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                    onClick={() => onImageClick?.(imageUrl, name)}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="text-white text-xs font-semibold px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-xs flex items-center gap-1.5">
                      Click to expand
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-base-content/40 p-4 text-center">
                  <Layers className="size-8" />
                  <span className="text-xs font-medium">No Image Uploaded</span>
                </div>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="md:col-span-2 grid grid-cols-2 gap-3">
              {/* Parent Category Card */}
              <div className="col-span-2 p-3.5 rounded-xl border border-base-300 bg-base-200/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-medium text-base-content/60 block">
                    Parent Category
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <FolderTree className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-base-content">
                      {categoryName}
                    </span>
                    {categoryCode && (
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-base-200 text-base-content/70">
                        {categoryCode}
                      </span>
                    )}
                  </div>
                </div>
                {categoryId && (
                  <span className="text-xs text-primary font-medium">
                    ID #{categoryId}
                  </span>
                )}
              </div>

              {/* Status Card */}
              <div className="p-3.5 rounded-xl border border-base-300 bg-base-200/30">
                <span className="text-[11px] font-medium text-base-content/60 block">
                  Status
                </span>
                <div className="mt-1 flex items-center gap-1.5">
                  {isActive ? (
                    <>
                      <CheckCircle2 className="size-4 text-emerald-500" />
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        Active in Catalog
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="size-4 text-rose-500" />
                      <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                        Inactive / Hidden
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Display Order Card */}
              <div className="p-3.5 rounded-xl border border-base-300 bg-base-200/30">
                <span className="text-[11px] font-medium text-base-content/60 block">
                  Display Sequence
                </span>
                <span className="text-sm font-bold text-base-content mt-1 block">
                  Priority #{displayOrder}
                </span>
              </div>

              {/* Subcategory Code */}
              <div className="col-span-2 p-3.5 rounded-xl border border-base-300 bg-base-200/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-medium text-base-content/60 block">
                    Subcategory Code
                  </span>
                  <span className="text-xs font-mono font-bold text-base-content mt-0.5 block tracking-wider">
                    {code}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-2 py-1 rounded-lg text-xs font-semibold border border-base-300 bg-base-100 hover:bg-base-200 text-base-content/70 hover:text-base-content transition-all cursor-pointer flex items-center gap-1.5"
                  title="Copy Code"
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-base-content/70 uppercase tracking-wider">
              Description
            </h4>
            <div className="p-4 rounded-xl border border-base-300 bg-base-200/20 text-xs sm:text-sm text-base-content/80 leading-relaxed">
              {desc || (
                <span className="italic text-base-content/40">
                  No description provided for this subcategory.
                </span>
              )}
            </div>
          </div>

          {/* Audit & Ownership Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-base-300/60 text-xs">
            {companyName && (
              <div className="flex items-center gap-2 text-base-content/70">
                <Building className="size-3.5 text-base-content/40" />
                <span>Company: <strong className="text-base-content">{companyName}</strong></span>
                {companyCode && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-base-200 rounded">
                    {companyCode}
                  </span>
                )}
              </div>
            )}
            <div className="flex items-center gap-2 text-base-content/70">
              <Calendar className="size-3.5 text-base-content/40" />
              <span>Created: <strong className="text-base-content">{fmtDate(createdAt)}</strong></span>
            </div>
            {updatedAt && (
              <div className="flex items-center gap-2 text-base-content/70 sm:col-span-2">
                <Calendar className="size-3.5 text-base-content/40" />
                <span>Last Updated: <strong className="text-base-content">{fmtDate(updatedAt)}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-base-300 bg-base-100">
          <div className="flex items-center gap-2">
            {onNavigateFullPage && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => onNavigateFullPage(subcategory.id)}
                className="text-xs font-semibold gap-1.5"
              >
                <span>Full Page View</span>
                <ExternalLink className="size-3.5" />
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onToggleStatus && (
              <Button
                type="button"
                variant="outline"
                onClick={() => onToggleStatus(subcategory.id, !isActive)}
                className="text-xs font-semibold"
              >
                {isActive ? "Deactivate" : "Activate"}
              </Button>
            )}

            {onDelete && (
              <Button
                type="button"
                variant="danger"
                onClick={() => onDelete(subcategory)}
                className="text-xs font-semibold gap-1.5"
              >
                <Trash2 className="size-3.5" />
                <span>Delete</span>
              </Button>
            )}

            {onEdit && (
              <Button
                type="button"
                variant="primary"
                onClick={() => onEdit(subcategory)}
                className="text-xs font-semibold gap-1.5 shadow-md shadow-primary/20"
              >
                <Edit2 className="size-3.5" />
                <span>Edit Subcategory</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
