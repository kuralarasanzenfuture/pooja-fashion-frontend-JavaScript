import {
  AlertTriangle,
  Trash2,
  X,
  Ruler,
  Layers,
  Building,
} from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";
import SizeThumb from "./SizeThumb.jsx";
import { formatSizeName } from "../utils/sizeHelper.js";

/**
 * Size Delete Confirmation Modal
 */
export default function SizeDeleteModal({
  isOpen = false,
  onClose,
  size = null,
  onConfirm,
  isDeleting = false,
}) {
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isOpen && Boolean(size),
    onClose
  );

  if (!isRendered || !size) return null;

  const name = formatSizeName(size.sizeName || size.size_name || "Unnamed Size");
  const code = size.sizeCode || size.size_code || "—";
  const groupName = size.sizeGroupName || size.size_group_name || "Parent Size Group";
  const companyName = size.companyName || size.company_name || "Pooja Fashion";

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
                  Delete Size?
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 border border-rose-500/20">
                  Destructive
                </span>
              </div>
              <p className="text-xs text-base-content/60 mt-0.5">
                This action will permanently delete this size from catalog.
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
            <SizeThumb code={code} name={name} size="md" className="shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-base-content truncate">
                  {name}
                </span>
                <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                  {code}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-base-content/60 mt-1">
                <span className="flex items-center gap-1">
                  <Layers className="w-3 h-3 text-primary" />
                  <span className="truncate max-w-[130px]">{groupName}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Building className="w-3 h-3 text-base-content/40" />
                  <span className="truncate max-w-[120px]">{companyName}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 text-xs text-base-content/80 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-600">Inventory and Product Safety Check</p>
              <p className="text-base-content/60 mt-0.5">
                If this size is assigned to existing product variants or barcode SKUs, the deletion will be rejected to prevent inventory inconsistency.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-base-200 bg-base-200/40">
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
            onClick={onConfirm}
            loading={isDeleting}
            icon={Trash2}
          >
            Delete Size
          </Button>
        </div>
      </div>
    </div>
  );
}

