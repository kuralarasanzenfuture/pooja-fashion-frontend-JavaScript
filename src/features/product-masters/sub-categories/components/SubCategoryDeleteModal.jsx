import {
  AlertTriangle,
  Trash2,
  X,
  Layers,
  FolderTree,
  Building,
} from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";

/**
 * Premium Delete Subcategory Confirmation Modal
 */
export default function SubCategoryDeleteModal({
  isOpen = false,
  onClose,
  subcategory = null,
  onConfirm,
  isDeleting = false,
}) {
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isOpen && !!subcategory,
    onClose
  );

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
    "Parent Category";
  const imageUrl = subcategory.imageUrl || subcategory.image_url;
  const displayOrder = subcategory.displayOrder ?? subcategory.display_order ?? 0;
  const companyName = subcategory.companyName || subcategory.company_name || null;

  return (
    <div
      className={backdropClasses}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full max-w-lg bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden ${cardClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-base-200/80 relative">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500/20 to-red-500/10 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-md shadow-rose-500/15 shrink-0">
              <Trash2 className="w-6 h-6 animate-in pulse duration-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-base-content tracking-tight">
                  Delete Subcategory?
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 border border-rose-500/20">
                  Destructive
                </span>
              </div>
              <p className="text-xs text-base-content/60 mt-0.5 font-medium">
                This will permanently delete this classification master
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isDeleting}
            className="p-1.5 rounded-xl text-base-content/50 hover:text-base-content hover:bg-base-200 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs sm:text-sm text-base-content/80 leading-relaxed">
            Are you sure you want to permanently delete{" "}
            <span className="font-extrabold text-base-content font-mono bg-base-200/80 px-1.5 py-0.5 rounded-md border border-base-300">
              “{name}”
            </span>
            ? This action cannot be undone and will remove all visual assets and hierarchy links.
          </p>

          {/* Item Preview Card */}
          <div className="p-4 rounded-2xl bg-base-200/50 hover:bg-base-200/70 transition-colors border border-base-300/80 flex items-center gap-3.5 shadow-2xs">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="w-14 h-14 rounded-xl object-cover border border-base-300 shrink-0 bg-base-100 shadow-sm"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500/10 to-primary/10 border border-base-300 flex items-center justify-center text-primary shrink-0 shadow-sm">
                <Layers className="w-6 h-6" />
              </div>
            )}

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-base-content truncate">
                  {name}
                </span>
                <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded-md bg-base-100 border border-base-300 text-base-content/70">
                  {code}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-base-content/60">
                <span className="flex items-center gap-1">
                  <FolderTree className="w-3.5 h-3.5 text-primary" />
                  <span>Category: {categoryName}</span>
                </span>
                {companyName && (
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-base-content/40" />
                    <span>{companyName}</span>
                  </span>
                )}
                <span>Order: #{displayOrder}</span>
              </div>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed space-y-1">
              <p className="font-semibold">Linked Products Notice</p>
              <p className="text-amber-700/80 dark:text-amber-400/80">
                Subcategories with linked products cannot be deleted. If products belong to this subcategory, reassign them first before deleting.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-base-200/80 bg-base-200/20">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isDeleting}
            className="text-xs font-semibold"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="danger"
            onClick={() => onConfirm?.(subcategory)}
            disabled={isDeleting}
            className="gap-2 text-xs font-bold shadow-md shadow-rose-500/20"
          >
            {isDeleting ? (
              <>
                <span className="loading loading-spinner loading-xs" />
                <span>Deleting Subcategory...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Confirm Permanent Delete</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
