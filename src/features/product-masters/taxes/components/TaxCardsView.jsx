import React from "react";
import {
  Eye,
  Edit2,
  Trash2,
  Copy,
  Check,
  Receipt,
  Percent,
  Calculator,
  Building,
} from "lucide-react";
import TaxThumb from "./TaxThumb.jsx";
import { formatTaxRate } from "../utils/taxHelper.js";

/**
 * Usage hint lookup for standard Indian apparel & fashion slabs
 */
const GET_TAX_USAGE_HINT = (rate, code) => {
  const r = Number(rate);
  if (r === 0) return "Raw cotton, silk yarn, khadi, unstitched cloth";
  if (r === 5) return "Apparel, sarees & clothing ≤ ₹1,000, cotton yarn";
  if (r === 12) return "Readymade garments & designer sarees > ₹1,000";
  if (r === 18) return "Branded footwear > ₹1,000, tailoring & boutique charges";
  if (r === 28) return "Luxury designer wear, premium leather, high-end accessories";
  return "Apparel, textile, and accessory retail transactions";
};

/**
 * TaxCardsView Component
 * Displays Tax Master records in responsive card grid layout matching:
 * ID | Tax code | Tax name | Rate | CGST | SGST | IGST | Active (Yes/No)
 */
export default function TaxCardsView({
  taxes = [],
  onViewDetails,
  onInspect,
  onEdit,
  onDelete,
  onToggleStatus,
  onCalculate,
  onOpenCalculator,
  onCopyText,
  onCopyCode,
  copiedKey,
  copiedCode,
  statusUpdatingId = null,
  statusPendingId = null,
}) {
  const handleInspect = onViewDetails || onInspect;
  const handleCalculate = onCalculate || onOpenCalculator;
  const handleCopy = (code, key) => {
    if (onCopyText) onCopyText(code, key);
    else if (onCopyCode) onCopyCode({ tax_code: code, taxCode: code });
  };
  const activeCopiedKey = copiedKey || copiedCode;
  const updatingId = statusUpdatingId || statusPendingId;

  if (taxes.length === 0) {
    return (
      <div className="bg-base-100 rounded-2xl border border-base-200 p-12 text-center text-base-content/50">
        <div className="flex flex-col items-center justify-center gap-2">
          <Receipt className="w-8 h-8 text-base-content/30" />
          <p className="font-semibold text-sm">No tax slabs found</p>
          <p className="text-xs text-base-content/40">
            Try adjusting your search or filters, or register a new tax slab.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {taxes.map((t) => {
        const id = t.id || t.tax_id;
        const code = t.tax_code || t.taxCode || "—";
        const name = t.tax_name || t.taxName || "Unnamed Tax";
        const rate = Number(t.rate ?? 0);
        const cgst =
          t.cgst_rate !== undefined && t.cgst_rate !== null
            ? Number(t.cgst_rate)
            : rate / 2;
        const sgst =
          t.sgst_rate !== undefined && t.sgst_rate !== null
            ? Number(t.sgst_rate)
            : rate / 2;
        const igst =
          t.igst_rate !== undefined && t.igst_rate !== null
            ? Number(t.igst_rate)
            : rate;
        const cess = Number(t.cess_rate ?? t.cessRate ?? 0);
        const isInclusive = Boolean(
          t.is_inclusive !== undefined ? t.is_inclusive : t.isInclusive
        );
        const isActive =
          t.is_active !== undefined ? Boolean(t.is_active) : Boolean(t.isActive);
        const isUpdating = updatingId === id;
        const isCopied = activeCopiedKey === `code-card-${id}` || activeCopiedKey === code;
        const usageHint = GET_TAX_USAGE_HINT(rate, code);

        return (
          <div
            key={id}
            className="p-5 rounded-3xl bg-base-100 border border-base-200 hover:border-primary/40 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group space-y-4"
          >
            {/* Top Row: Thumb, ID, Code & Active Status */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <TaxThumb tax={t} size="md" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono text-[10px] font-bold text-base-content/50">
                      #{id}
                    </span>
                    <span className="font-mono font-bold text-xs text-base-content bg-base-200/80 px-2 py-0.5 rounded border border-base-300">
                      {code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(code, `code-card-${id}`)}
                      className="p-1 hover:bg-base-200 rounded text-base-content/40 hover:text-primary transition-colors tooltip tooltip-top cursor-pointer"
                      data-tip={isCopied ? "Copied!" : "Copy Code"}
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <h4
                    onClick={() => handleInspect && handleInspect(t)}
                    className="font-bold text-sm text-base-content hover:text-primary transition-colors truncate mt-1 cursor-pointer"
                  >
                    {name}
                  </h4>
                </div>
              </div>

              {/* Catalog Status (Matching Units Module) */}
              <label className="inline-flex cursor-pointer items-center gap-2 select-none shrink-0">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => onToggleStatus && onToggleStatus(t)}
                  disabled={isUpdating}
                  className="toggle toggle-success toggle-sm cursor-pointer"
                  aria-label={`Toggle active status for ${name}`}
                />
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40"
                      : "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40"
                  }`}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
              </label>
            </div>

            {/* Rates Bento: Rate | CGST | SGST | IGST (+ Cess if applicable) */}
            <div className="p-3 rounded-2xl bg-base-200/40 border border-base-200 space-y-2">
              <div className={`grid ${cess > 0 ? "grid-cols-5" : "grid-cols-4"} gap-1 text-center font-mono`}>
                <div className="p-1.5 rounded-xl bg-primary/10 border border-primary/20">
                  <span className="text-[9px] font-bold text-primary uppercase block">Rate</span>
                  <span className="text-xs font-black text-primary">{formatTaxRate(rate)}</span>
                </div>
                <div className="p-1.5 rounded-xl bg-base-100 border border-base-200">
                  <span className="text-[9px] font-bold text-base-content/50 uppercase block">CGST</span>
                  <span className="text-xs font-bold text-base-content/80">{formatTaxRate(cgst)}</span>
                </div>
                <div className="p-1.5 rounded-xl bg-base-100 border border-base-200">
                  <span className="text-[9px] font-bold text-base-content/50 uppercase block">SGST</span>
                  <span className="text-xs font-bold text-base-content/80">{formatTaxRate(sgst)}</span>
                </div>
                <div className="p-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <span className="text-[9px] font-bold text-indigo-600 uppercase block">IGST</span>
                  <span className="text-xs font-bold text-indigo-600">{formatTaxRate(igst)}</span>
                </div>
                {cess > 0 && (
                  <div className="p-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <span className="text-[9px] font-bold text-amber-600 uppercase block">Cess</span>
                    <span className="text-xs font-bold text-amber-600">{formatTaxRate(cess)}</span>
                  </div>
                )}
              </div>

              {/* Usage hint */}
              <div className="pt-2 border-t border-base-200/80 text-[11px] text-base-content/65 line-clamp-2">
                <span className="font-bold text-base-content/80">Usage: </span>
                {usageHint}
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-base-200/60 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border ${
                  isInclusive
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                    : "bg-base-200 text-base-content/60 border-base-300"
                }`}>
                  {isInclusive ? "MRP Inclusive" : "Exclusive (+Tax)"}
                </span>
                {cess > 0 && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20">
                    +{formatTaxRate(cess)} Cess
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {handleCalculate && (
                  <div className="tooltip tooltip-top" data-tip="Calculate Tax">
                    <button
                      type="button"
                      onClick={() => handleCalculate(t)}
                      className="p-1.5 rounded-lg hover:bg-primary/10 text-base-content/60 hover:text-primary transition-colors cursor-pointer"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {handleInspect && (
                  <div className="tooltip tooltip-top" data-tip="View Details">
                    <button
                      type="button"
                      onClick={() => handleInspect(t)}
                      className="p-1.5 rounded-lg hover:bg-base-200 text-base-content/60 hover:text-primary transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {onEdit && (
                  <div className="tooltip tooltip-top" data-tip="Edit Slab">
                    <button
                      type="button"
                      onClick={() => onEdit(t)}
                      className="p-1.5 rounded-lg hover:bg-base-200 text-base-content/60 hover:text-primary transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {onDelete && (
                  <div className="tooltip tooltip-top tooltip-error" data-tip="Delete Slab">
                    <button
                      type="button"
                      onClick={() => onDelete(t)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-base-content/60 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
