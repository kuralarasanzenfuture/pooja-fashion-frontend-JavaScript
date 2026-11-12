import { useState } from "react";
import { Sparkles, X, CheckCircle2, Layers } from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";
import SizeGroupSelect from "./SizeGroupSelect.jsx";

/**
 * Seed Default Standard Sizes Modal
 */
export default function SizeSeedDefaultsModal({
  isOpen = false,
  onClose,
  onSeed,
  isSeeding = false,
  sizeGroups = [],
  initialSizeGroupId = "",
}) {
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isOpen,
    onClose
  );

  const [selectedGroupId, setSelectedGroupId] = useState(initialSizeGroupId || "");

  if (!isRendered) return null;

  const handleConfirm = () => {
    if (!selectedGroupId) return;
    onSeed?.(Number(selectedGroupId));
  };

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
                Seed Standard Sizes
              </h3>
              <p className="text-xs text-base-content/60">
                Populate standard industry sizes into a size group.
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
          <SizeGroupSelect
            label="Target Size Group"
            value={selectedGroupId}
            onChange={(val) => setSelectedGroupId(val)}
            sizeGroups={sizeGroups}
            required={true}
            placeholder="-- Choose Target Size Group --"
            helperText="Supported templates: Men (S–3XL), Women (XS–XXL), Kids (24–32), Footwear (UK 6–10)."
            className="w-full"
          />

          <div className="p-3.5 rounded-2xl bg-base-200/40 border border-base-300/80 text-xs text-base-content/70 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>
              Existing sizes with matching codes will be preserved and not duplicated.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-base-200 bg-base-200/30">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={isSeeding}
          >
            Cancel
          </Button>
          <Button
            variant="clip-six"
            size="sm"
            onClick={handleConfirm}
            loading={isSeeding}
            disabled={!selectedGroupId}
          >
            Seed Sizes
          </Button>
        </div>
      </div>
    </div>
  );
}

