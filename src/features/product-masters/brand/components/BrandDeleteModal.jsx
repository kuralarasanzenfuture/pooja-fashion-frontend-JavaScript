import {
  AlertTriangle,
  Trash2,
  X,
  Tag,
  Building,
} from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";
import BrandThumb from "./BrandThumb.jsx";
import { formatBrandName } from "../utils/brandHelper.js";

/**
 * Brand Delete Confirmation Modal
 */
export default function BrandDeleteModal({
  isOpen = false,
  onClose,
  brand = null,
  onConfirm,
  isDeleting = false,
}) {
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isOpen && Boolean(brand),
    onClose
  );

  if (!isRendered || !brand) return null;

  const name = formatBrandName(brand.brandName || brand.brand_name || "Unnamed Brand");
  const code = brand.brandCode || brand.brand_code || "—";
  const logoUrl = brand.logoUrl || brand.logo_url;
  const companyName = brand.companyName || brand.company_name || "Pooja Fashion";

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
              <Trash2 className="w-6 h-6 animate-in pulse duration-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-base-content tracking-tight">
                  Delete Brand?
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 border border-rose-500/20">
                  Destructive
                </span>
              </div>
              <p className="text-xs text-base-content/60 mt-0.5">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isDeleting}
            className="p-1.5 rounded-xl text-base-content/40 hover:text-base-content hover:bg-base-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-base-content/80 leading-relaxed">
            Are you sure you want to permanently delete the brand{" "}
            <strong className="text-base-content font-bold">{name}</strong>?
          </p>

          {/* Brand Info Card */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-base-200/60 border border-base-300">
            <BrandThumb url={logoUrl} name={name} code={code} size="md" />
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-base-content truncate">
                {name}
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-base-content/60">
                <span className="font-mono bg-base-100 px-1.5 py-0.2 rounded border border-base-300 text-[10px]">
                  {code}
                </span>
                <span>•</span>
                <span className="truncate">{companyName}</span>
              </div>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 flex items-start gap-3 text-xs leading-relaxed">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <span>
              If this brand is associated with existing products, catalog SKUs, or invoices, deletion may be rejected by the server to preserve audit integrity.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-base-200 bg-base-200/30">
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
            variant="destructive"
            size="sm"
            loading={isDeleting}
            icon={Trash2}
            onClick={onConfirm}
          >
            Permanently Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

