import React from "react";
import {
  Eye,
  Edit2,
  Trash2,
  Copy,
  Check,
  Receipt,
  Calculator,
  CheckCircle2,
} from "lucide-react";
import { formatTaxRate } from "../utils/taxHelper.js";

/**
 * TaxTableView Component
 * Displays Tax Master slabs matching exact table columns:
 * ID | Tax code | Tax name | Rate | CGST | SGST | IGST | Cess | Included Price | Status | Actions
 */
export default function TaxTableView({
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

  return (
    <div className="bg-base-100 rounded-2xl border border-base-200 overflow-hidden shadow-xs">
      <div className="overflow-x-auto scrollbar-none lg:overflow-x-visible">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="border-b border-base-200 bg-base-200/50 text-[11px] font-bold uppercase tracking-wider text-base-content/60 select-none">
              <th className="py-3.5 px-3 text-center w-14">ID</th>
              <th className="py-3.5 px-3">Tax code</th>
              <th className="py-3.5 px-3">Tax name</th>
              <th className="py-3.5 px-3 text-center">Rate</th>
              <th className="py-3.5 px-3 text-center">CGST</th>
              <th className="py-3.5 px-3 text-center">SGST</th>
              <th className="py-3.5 px-3 text-center">IGST</th>
              <th className="py-3.5 px-3 text-center">Cess</th>
              <th className="py-3.5 px-3 text-center whitespace-nowrap">Included Price</th>
              <th className="py-3.5 px-3 text-center whitespace-nowrap">Status</th>
              <th className="py-3.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200 text-xs">
            {taxes.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-base-content/50">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Receipt className="w-8 h-8 text-base-content/30" />
                    <p className="font-semibold text-sm">No tax slabs found</p>
                    <p className="text-xs text-base-content/40">
                      Try adjusting your search or filters, or register a new tax slab.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              taxes.map((t) => {
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
                const isCopied = activeCopiedKey === `code-${id}` || activeCopiedKey === code;

                return (
                  <tr
                    key={id}
                    className="hover:bg-base-200/40 transition-colors group"
                  >
                    {/* ID */}
                    <td className="py-3.5 px-3 text-center font-mono text-[11px] font-bold text-base-content/60">
                      {id}
                    </td>

                    {/* Tax code */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs text-base-content bg-base-200/70 px-2 py-0.5 rounded-md border border-base-300">
                          {code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(code, `code-${id}`)}
                          className="p-1 hover:bg-base-200 rounded text-base-content/40 hover:text-primary transition-colors tooltip tooltip-top cursor-pointer"
                          data-tip={isCopied ? "Copied!" : "Copy Tax Code"}
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Tax name (clean without redundant 0% badge) */}
                    <td className="py-3.5 px-3">
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => handleInspect && handleInspect(t)}
                          className="font-bold text-base-content hover:text-primary text-left transition-colors truncate block max-w-[260px] cursor-pointer"
                        >
                          {name}
                        </button>
                        <span className="text-[10px] text-base-content/50 block font-mono">
                          {t.company_name || t.companyName || `Company #${t.company_id || 1}`}
                        </span>
                      </div>
                    </td>

                    {/* Rate */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="font-black font-mono text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                        {formatTaxRate(rate)}
                      </span>
                    </td>

                    {/* CGST */}
                    <td className="py-3.5 px-3 text-center font-mono font-semibold text-base-content/80">
                      {formatTaxRate(cgst)}
                    </td>

                    {/* SGST */}
                    <td className="py-3.5 px-3 text-center font-mono font-semibold text-base-content/80">
                      {formatTaxRate(sgst)}
                    </td>

                    {/* IGST */}
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-indigo-600">
                      {formatTaxRate(igst)}
                    </td>

                    {/* CESS */}
                    <td className="py-3.5 px-3 text-center">
                      {cess > 0 ? (
                        <span className="font-bold font-mono text-xs text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                          {formatTaxRate(cess)}
                        </span>
                      ) : (
                        <span className="text-xs text-base-content/40 font-mono font-medium">0%</span>
                      )}
                    </td>

                    {/* Included Price */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <div
                        className="tooltip tooltip-top"
                        data-tip={
                          isInclusive
                            ? "MRP Inclusive: Tax is already included in retail price"
                            : "Exclusive: Tax is added over the base item price"
                        }
                      >
                        {isInclusive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Yes</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-base-200 text-base-content/60 border border-base-300">
                            <span>No</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Catalog Status (Matching Units Module) */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div
                        className="tooltip tooltip-top"
                        data-tip={
                          isActive
                            ? "Active: Click to disable in billing"
                            : "Inactive: Click to enable in billing"
                        }
                      >
                        <label className="inline-flex cursor-pointer items-center gap-2 select-none">
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
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {handleCalculate && (
                          <div className="tooltip tooltip-left" data-tip="Test in Calculator">
                            <button
                              type="button"
                              onClick={() => handleCalculate(t)}
                              className="p-1.5 rounded-lg hover:bg-primary/10 text-base-content/60 hover:text-primary transition-colors cursor-pointer"
                            >
                              <Calculator className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {handleInspect && (
                          <div className="tooltip tooltip-left" data-tip="View Details">
                            <button
                              type="button"
                              onClick={() => handleInspect(t)}
                              className="p-1.5 rounded-lg hover:bg-base-200 text-base-content/60 hover:text-primary transition-colors cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {onEdit && (
                          <div className="tooltip tooltip-left" data-tip="Edit Tax Slab">
                            <button
                              type="button"
                              onClick={() => onEdit(t)}
                              className="p-1.5 rounded-lg hover:bg-base-200 text-base-content/60 hover:text-primary transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {onDelete && (
                          <div className="tooltip tooltip-left tooltip-error" data-tip="Delete Tax Slab">
                            <button
                              type="button"
                              onClick={() => onDelete(t)}
                              className="p-1.5 rounded-lg hover:bg-rose-500/10 text-base-content/60 hover:text-rose-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
