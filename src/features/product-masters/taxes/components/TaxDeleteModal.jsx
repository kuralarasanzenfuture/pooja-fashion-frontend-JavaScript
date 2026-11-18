import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";
import TaxThumb from "./TaxThumb.jsx";

/**
 * TaxDeleteModal Component
 * Confirmation dialog before removing a Tax Master record.
 */
export default function TaxDeleteModal({
  isOpen = false,
  tax = null,
  onClose,
  onConfirm,
  isDeleting = false,
}) {
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isOpen,
    onClose
  );

  if (!isRendered || !tax) return null;

  const rate = Number(tax.rate) || 0;

  return (
    <div
      className={backdropClasses}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full max-w-md p-0 rounded-3xl bg-base-100 border border-base-300 shadow-2xl overflow-hidden flex flex-col ${cardClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 py-5 border-b border-base-200 bg-rose-500/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/10 text-rose-600 border border-rose-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-base-content tracking-tight">
                Delete Tax Slab
              </h3>
              <p className="text-xs text-base-content/60 font-medium">
                This action is permanent and cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-xl text-base-content/40 hover:text-base-content hover:bg-base-200 transition-colors tooltip tooltip-left cursor-pointer"
            data-tip="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-base-content/80 leading-relaxed">
            Are you sure you want to permanently delete this tax rate slab? Products,
            variants, and active invoice drafts configured with this tax rate may be
            impacted.
          </p>

          {/* Tax Slab Snapshot Card */}
          <div className="p-3.5 rounded-2xl bg-base-200/50 border border-base-200 flex items-center gap-3">
            <TaxThumb rate={rate} size="md" />
            <div className="min-w-0">
              <h4 className="text-xs font-black text-base-content truncate">
                {tax.tax_name || tax.taxName}
              </h4>
              <p className="text-[11px] font-mono text-base-content/60 mt-0.5">
                {tax.tax_code || tax.taxCode} · {tax.tax_type || tax.taxType || "GST"}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 text-[11px] leading-relaxed">
            <span className="font-bold">Recommendation:</span> If this tax rate was used
            in historical billing, consider toggling its status to{" "}
            <span className="font-bold">Inactive</span> instead of deleting it.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-base-200/60 border-t border-base-200 flex items-center justify-end gap-3 shrink-0">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleClose}
            disabled={isDeleting}
            className="rounded-xl text-xs font-semibold px-4 cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => onConfirm(tax.id || tax.tax_id)}
            loading={isDeleting}
            className="rounded-xl text-xs font-bold px-5 bg-rose-600 hover:bg-rose-700 text-white gap-1.5 cursor-pointer shadow-md shadow-rose-600/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {isDeleting ? "Deleting..." : "Delete Tax Slab"}
          </Button>
        </div>
      </div>
    </div>
  );
}

