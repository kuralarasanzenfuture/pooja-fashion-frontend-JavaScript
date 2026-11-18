import React from "react";
import { AlertTriangle, Trash2, X, Building, Scale } from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";
import UnitThumb from "./UnitThumb.jsx";

export default function UnitDeleteModal({
  isOpen = false,
  onClose,
  unit = null,
  onConfirm,
  isDeleting = false,
}) {
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isOpen && Boolean(unit),
    onClose
  );

  if (!isRendered || !unit) return null;

  const id = unit.id;
  const name = unit.unitName || unit.unit_name || "Unnamed Unit";
  const code = unit.unitCode || unit.unit_code || "—";
  const decimals = unit.decimalPlaces !== undefined ? unit.decimalPlaces : unit.decimal_places ?? 0;
  const companyName = unit.companyName || unit.company_name || "Pooja Fashion";

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
                  Delete Unit?
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 border border-rose-500/20">
                  Destructive
                </span>
              </div>
              <p className="text-xs text-base-content/60 mt-0.5">
                This action will permanently delete this unit of measurement from catalog.
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
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-base-200/50 border border-base-300/80">
            <UnitThumb code={code} name={name} size="lg" className="shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-sm sm:text-base text-base-content truncate">
                  {name}
                </span>
                <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                  {code}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-base-content/60 mt-1 flex-wrap">
                <span className="font-mono text-xs text-base-content/80">
                  {decimals} decimal {decimals === 1 ? "place" : "places"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Building className="w-3 h-3 text-base-content/40" />
                  <span className="truncate max-w-[150px]">{companyName}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="space-y-1">
              <p className="font-semibold text-rose-800 dark:text-rose-300">
                Warning: Catalog impact
              </p>
              <p className="leading-relaxed">
                If products, invoice line items, or purchase orders reference this unit, deleting it
                may disrupt stock quantity displays or bill prints. Consider toggling the status to <strong>Inactive</strong> instead.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-base-200 bg-base-200/30">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="clip-four"
            size="sm"
            onClick={() => onConfirm?.(id)}
            loading={isDeleting}
            icon={Trash2}
          >
            Delete Unit
          </Button>
        </div>
      </div>
    </div>
  );
}

