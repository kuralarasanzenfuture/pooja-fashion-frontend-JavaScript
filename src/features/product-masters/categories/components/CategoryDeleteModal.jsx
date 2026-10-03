import React from "react";
import {
  AlertTriangle,
  Trash2,
  X,
  Tags,
  ShieldAlert,
  Layers,
  Building,
} from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";

/**
 * Premium Luxury Delete Category Modal
 */
export default function CategoryDeleteModal({
  isOpen = false,
  onClose,
  category = null,
  onConfirm,
  isDeleting = false,
}) {
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isOpen && !!category,
    onClose
  );

  if (!isRendered || !category) return null;

  const name = category.categoryName || category.category_name || "Unnamed Category";
  const code = category.categoryCode || category.category_code || "—";
  const imageUrl = category.imageUrl || category.image_url;
  const displayOrder = category.displayOrder ?? category.display_order ?? 0;
  const companyName = category.companyName || category.company_name || "Pooja Fashion";
  const companyCode = category.companyCode || category.company_code || null;

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
                  Delete Category?
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
            ? This action removes the category record and visual assets permanently.
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
                <Tags className="w-6 h-6" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-bold text-base-content truncate">
                  {name}
                </h4>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                  {code}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-base-300/80 text-base-content/70">
                  Seq #{displayOrder}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-base-content/60 font-medium">
                <span className="truncate">{companyName}</span>
                {companyCode && (
                  <span className="badge badge-xs text-[9px] font-mono uppercase font-bold tracking-wider badge-ghost">
                    {companyCode}
                  </span>
                )}
                <span>•</span>
                <span className="font-mono">ID: #{category.id}</span>
              </div>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-amber-800 dark:text-amber-300 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 leading-relaxed">
              <span className="font-bold block">Safety Verification Notice</span>
              <p className="text-[11px] opacity-90">
                Note: Categories with linked products or active subcategories cannot be deleted. All associations must be reassigned or deleted first.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-base-200/80 bg-base-200/40 flex items-center justify-end gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="group inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl text-white bg-gradient-to-r from-rose-600 via-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 active:scale-95 shadow-md shadow-rose-600/30 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {isDeleting ? (
              <>
                <span className="loading loading-spinner loading-xs text-white" />
                <span>Deleting Category...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>Delete Category</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
