import React from "react";
import { Sparkles, X, ShieldCheck, Tag, Check, HelpCircle, Scissors } from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";
import { POPULAR_PRODUCT_TYPES } from "../data/index.js";

/**
 * Seed Default Standard Product Types Modal
 * Shows the exact standard table data preview and operational settings guidance.
 */
export default function ProductTypeSeedDefaultsModal({
  isOpen = false,
  onClose,
  onSeed,
  isSeeding = false,
}) {
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isOpen,
    onClose
  );

  if (!isRendered) return null;

  const defaultTypes = POPULAR_PRODUCT_TYPES.slice(0, 5);

  return (
    <div
      className={backdropClasses}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full max-w-2xl bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden ${cardClasses}`}
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
                Populate standard ERP product classifications into your company catalog.
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
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Sample Table Data Preview */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block">
              Standard Types Table Data
            </label>
            <div className="rounded-2xl border border-base-300 overflow-hidden bg-base-100 shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-base-200/60 border-b border-base-300 text-[10px] font-bold uppercase text-base-content/60 select-none">
                      <th className="py-2.5 px-3 text-center">ID</th>
                      <th className="py-2.5 px-3">Type Code</th>
                      <th className="py-2.5 px-3">Type Name</th>
                      <th className="py-2.5 px-2 text-center">Stock</th>
                      <th className="py-2.5 px-2 text-center">Saleable</th>
                      <th className="py-2.5 px-2 text-center">Purchase</th>
                      <th className="py-2.5 px-3">Usage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-200">
                    {defaultTypes.map((row) => (
                      <tr key={row.code} className="hover:bg-base-200/40">
                        <td className="py-2 px-3 text-center font-mono font-bold text-base-content/60">
                          {row.id}
                        </td>
                        <td className="py-2 px-3 font-mono font-bold text-primary">
                          {row.code}
                        </td>
                        <td className="py-2 px-3 font-semibold text-base-content">
                          {row.name}
                        </td>
                        <td className="py-2 px-2 text-center">
                          {row.is_stock_item ? (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.2 rounded">TRUE</span>
                          ) : (
                            <span className="text-[10px] font-bold text-base-content/40 bg-base-200 px-1.5 py-0.2 rounded">FALSE</span>
                          )}
                        </td>
                        <td className="py-2 px-2 text-center">
                          {row.is_saleable ? (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.2 rounded">TRUE</span>
                          ) : (
                            <span className="text-[10px] font-bold text-base-content/40 bg-base-200 px-1.5 py-0.2 rounded">FALSE</span>
                          )}
                        </td>
                        <td className="py-2 px-2 text-center">
                          {row.is_purchasable ? (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.2 rounded">TRUE</span>
                          ) : (
                            <span className="text-[10px] font-bold text-base-content/40 bg-base-200 px-1.5 py-0.2 rounded">FALSE</span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-[11px] text-base-content/70">
                          {row.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* "Why these settings?" Guidance Card */}
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-primary font-bold">
              <HelpCircle className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-black">
                Why these settings?
              </span>
            </div>
            <ul className="space-y-1.5 text-xs text-base-content/80 list-disc pl-4 leading-relaxed">
              <li>
                <strong className="text-base-content font-mono font-bold">is_stock_item:</strong> Whether the product needs inventory tracking.
              </li>
              <li>
                <strong className="text-base-content font-mono font-bold">is_saleable:</strong> Whether you can sell it to customers.
              </li>
              <li>
                <strong className="text-base-content font-mono font-bold">is_purchasable:</strong> Whether you can purchase it from suppliers.
              </li>
              <li>
                <strong className="text-base-content font-mono font-bold text-primary">SERVICE:</strong> No physical stock, but it can be sold to customers. For example, stitching or alteration charges.
              </li>
            </ul>
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
