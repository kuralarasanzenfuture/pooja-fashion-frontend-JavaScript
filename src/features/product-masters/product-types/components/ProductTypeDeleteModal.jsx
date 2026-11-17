import React from "react";
import { Trash2, X, Building, Tag } from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";
import ProductTypeThumb from "./ProductTypeThumb.jsx";

export default function ProductTypeDeleteModal({
  isOpen = false,
  onClose,
  productType = null,
  onConfirm,
  isDeleting = false,
}) {
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isOpen && Boolean(productType),
    onClose
  );

  if (!isRendered || !productType) return null;

  const id = productType.id;
  const name = productType.typeName || productType.type_name || "Unnamed Product Type";
  const code = productType.typeCode || productType.type_code || "—";
  const companyName = productType.companyName || productType.company_name || "Pooja Fashion";

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
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-base-200/80">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500/20 to-red-500/10 border border-rose-500/30 flex items-center justify-center text-rose-600 shrink-0">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-base-content tracking-tight">
                  Delete Product Type?
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 border border-rose-500/20">
                  Destructive
                </span>
              </div>
              <p className="text-xs text-base-content/60 mt-0.5">
                This action will permanently remove this product type from your catalog.
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

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <ProductTypeThumb name={name} code={code} size="md" />
              <div className="min-w-0">
                <span className="font-bold text-sm text-base-content block truncate">
                  {name}
                </span>
                <span className="font-mono text-xs text-primary font-semibold block">
                  {code}
                </span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-base-content/50 block">
                Company
              </span>
              <span className="text-xs font-semibold text-base-content truncate max-w-[130px] block">
                {companyName}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-800 dark:text-amber-300">
            <strong>Warning:</strong> Product types that are referenced by active products cannot be deleted. If products exist under this type, consider setting its status to <em>Inactive</em> instead.
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-base-200 bg-base-200/30">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={onConfirm}
            loading={isDeleting}
          >
            Delete Product Type
          </Button>
        </div>
      </div>
    </div>
  );
}
