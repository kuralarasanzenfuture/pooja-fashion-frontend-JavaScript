import React from "react";
import { Sparkles, X, ShieldCheck, Tag } from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";
import ProductTypeThumb from "./ProductTypeThumb.jsx";
import { POPULAR_PRODUCT_TYPES } from "../data/index.js";

/**
 * Seed Default Standard Product Types Modal
 */
export default function ProductTypeSeedDefaultsModal({
  isOpen = false,
  onClose,
  onSeed,
  isSeeding = false,
  totalPresets = 5,
}) {
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isOpen,
    onClose
  );

  if (!isRendered) return null;

  return (
    <div
      className={backdropClasses}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full max-w-md bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden ${cardClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-base-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-base-content tracking-tight">
                Seed Standard Product Types
              </h3>
              <p className="text-xs text-base-content/60">
                Populate standard ERP product classifications into your catalog.
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
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-base-content/70">
              Standard Types Included
            </label>
            <div className="p-3 bg-base-200/50 rounded-2xl border border-base-300/70">
              <div className="flex flex-wrap gap-2 justify-center">
                {POPULAR_PRODUCT_TYPES.slice(0, 5).map((preset) => (
                  <div
                    key={preset.code}
                    className="tooltip tooltip-top"
                    data-tip={`${preset.name} (${preset.code})`}
                  >
                    <ProductTypeThumb
                      code={preset.code}
                      name={preset.name}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-center text-base-content/50 mt-2 font-medium">
                Includes Ready Made Garments, Fabric & Textiles, Fashion Accessories, Footwear, and Tailoring Services.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-base-200/40 border border-base-300/80 text-xs text-base-content/70 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>
              Safe Operation: Existing product types with matching codes will be preserved and not overwritten.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-base-200 bg-base-200/30">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={isSeeding}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="clip-six"
            size="sm"
            onClick={onSeed}
            loading={isSeeding}
            icon={Sparkles}
          >
            Seed Standard Types
          </Button>
        </div>
      </div>
    </div>
  );
}
