import React from "react";
import {
  X,
  Receipt,
  Percent,
  Building,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  Calculator,
  Layers,
  ArrowRight,
  ShieldCheck,
  Edit,
  HelpCircle,
} from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";
import TaxThumb from "./TaxThumb.jsx";
import { formatTaxRate } from "../utils/taxHelper.js";

/**
 * TaxDetailsModal Component
 * Comprehensive inspector view of a single tax slab with rate breakdown and audit metadata.
 */
export default function TaxDetailsModal({
  isOpen = false,
  tax = null,
  onClose,
  onEdit,
  onOpenCalculator,
}) {
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isOpen,
    onClose
  );

  if (!isRendered || !tax) return null;

  const rate = Number(tax.rate) || 0;
  const cgstRate = Number(tax.cgst_rate ?? tax.cgstRate ?? rate / 2) || 0;
  const sgstRate = Number(tax.sgst_rate ?? tax.sgstRate ?? rate / 2) || 0;
  const igstRate = Number(tax.igst_rate ?? tax.igstRate ?? rate) || 0;
  const cessRate = Number(tax.cess_rate ?? tax.cessRate ?? 0) || 0;
  const isInclusive = Boolean(tax.is_inclusive ?? tax.isInclusive);
  const isActive = Boolean(tax.is_active ?? tax.isActive);

  const formatDate = (val) => {
    if (!val) return "—";
    try {
      return new Date(val).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(val);
    }
  };

  return (
    <div
      className={backdropClasses}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full max-w-2xl p-0 rounded-3xl bg-base-100 border border-base-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${cardClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 py-5 border-b border-base-200 bg-gradient-to-r from-base-200/50 via-base-100 to-base-200/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <TaxThumb rate={rate} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-base-content tracking-tight">
                  {tax.tax_name || tax.taxName}
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40"
                      : "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40"
                  }`}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-xs text-base-content/60 font-mono mt-0.5">
                {tax.tax_code || tax.taxCode} · {tax.tax_type || tax.taxType || "GST"}
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Main Key Figures Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-base-200/40 border border-base-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 block">
                Total Tax Rate
              </span>
              <p className="text-2xl font-black text-primary mt-0.5 font-mono">
                {formatTaxRate(rate)}
              </p>
              <span className="text-[10px] text-base-content/40 mt-1 block">
                Applied on taxable amount
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-base-200/40 border border-base-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 block">
                Price Inclusivity
              </span>
              <p className="text-sm font-black text-base-content mt-1.5 flex items-center gap-1.5">
                {isInclusive ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>MRP Inclusive</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-amber-500" />
                    <span>Exclusive (Added)</span>
                  </>
                )}
              </p>
              <span className="text-[10px] text-base-content/40 mt-1 block">
                {isInclusive ? "MRP contains tax" : "Added over base price"}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-base-200/40 border border-base-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 block">
                Tax Regime
              </span>
              <p className="text-base font-black text-base-content mt-1">
                {tax.tax_type || tax.taxType || "GST"}
              </p>
              <span className="text-[10px] text-base-content/40 mt-1 block">
                National Tax Master
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-base-200/40 border border-base-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 block">
                Company ID
              </span>
              <p className="text-base font-black text-base-content mt-1 font-mono">
                #{tax.company_id || tax.companyId || "—"}
              </p>
              <span className="text-[10px] text-base-content/40 mt-1 block">
                {tax.company_name || tax.companyName || "Organization"}
              </span>
            </div>
          </div>

          {/* GST Sub-Component Split Breakdown */}
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-primary" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-primary">
                  Indian GST Split Matrix
                </h4>
              </div>
              <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                100% Taxable Compliance
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Intra-State (CGST + SGST) */}
              <div className="p-3 rounded-xl bg-base-100 border border-base-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-base-content">
                    Intra-State Supply
                  </span>
                  <span className="text-[10px] font-mono font-bold text-primary">
                    Same State
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-base-content/60">CGST (Central):</span>
                    <span className="font-bold text-base-content">{formatTaxRate(cgstRate)}</span>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-base-content/60">SGST (State):</span>
                    <span className="font-bold text-base-content">{formatTaxRate(sgstRate)}</span>
                  </div>
                  <div className="pt-1 border-t border-base-200 flex items-center justify-between font-mono font-bold text-primary">
                    <span>Total Intra:</span>
                    <span>{formatTaxRate(cgstRate + sgstRate)}</span>
                  </div>
                </div>
              </div>

              {/* Inter-State (IGST) */}
              <div className="p-3 rounded-xl bg-base-100 border border-base-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-base-content">
                    Inter-State Supply
                  </span>
                  <span className="text-[10px] font-mono font-bold text-indigo-500">
                    Cross-State
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-base-content/60">IGST (Integrated):</span>
                    <span className="font-bold text-base-content">{formatTaxRate(igstRate)}</span>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-base-content/60">Destination:</span>
                    <span className="text-[11px] text-base-content/50">Receiving State</span>
                  </div>
                  <div className="pt-1 border-t border-base-200 flex items-center justify-between font-mono font-bold text-indigo-600">
                    <span>Total Inter:</span>
                    <span>{formatTaxRate(igstRate)}</span>
                  </div>
                </div>
              </div>

              {/* Additional Cess */}
              <div className="p-3 rounded-xl bg-base-100 border border-base-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-base-content">
                    Compensation Cess
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-500">
                    Additional
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-base-content/60">Cess Rate:</span>
                    <span className="font-bold text-base-content">{formatTaxRate(cessRate)}</span>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-base-content/60">Applies to:</span>
                    <span className="text-[11px] text-base-content/50">
                      {cessRate > 0 ? "Luxury Fashion" : "None (0%)"}
                    </span>
                  </div>
                  <div className="pt-1 border-t border-base-200 flex items-center justify-between font-mono font-bold text-amber-600">
                    <span>Cess Levy:</span>
                    <span>{formatTaxRate(cessRate)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* "Why these settings?" Guidance Callout */}
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-primary font-bold">
              <HelpCircle className="w-4 h-4" />
              <span className="text-[11px] uppercase tracking-wider font-black">
                Why these settings?
              </span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-base-content/75 list-disc pl-4 leading-relaxed">
              <li>
                <strong className="text-base-content font-mono font-bold">Rate:</strong> Total tax percentage applied on the base taxable value.
              </li>
              <li>
                <strong className="text-base-content font-mono font-bold">CGST & SGST:</strong> Equal 50/50 split collected for intra-state sales (same state).
              </li>
              <li>
                <strong className="text-indigo-600 font-mono font-bold">IGST:</strong> Applied at 100% for inter-state deliveries (another state).
              </li>
              <li>
                <strong className="text-emerald-600 font-mono font-bold">Active:</strong> Whether this slab can be applied in POS and sales invoices.
              </li>
            </ul>
          </div>

          {/* Quick Simulation Card */}
          <div className="p-4 rounded-2xl bg-base-200/40 border border-base-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-base-content flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                Live Invoice Calculation Simulator
              </span>
              <p className="text-[11px] text-base-content/50">
                Test tax computation for ₹1,000 billing amount using this slab.
              </p>
            </div>
            {onOpenCalculator && (
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  onOpenCalculator(tax);
                }}
                className="btn btn-xs btn-outline btn-primary rounded-xl text-xs font-bold gap-1 cursor-pointer"
              >
                <Calculator className="w-3 h-3" />
                Launch Calculator
              </button>
            )}
          </div>

          {/* Metadata & Timestamps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-base-content/60 pt-2 border-t border-base-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-base-content/40" />
              <span>Created: {formatDate(tax.created_at || tax.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-base-content/40" />
              <span>Last Modified: {formatDate(tax.updated_at || tax.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-base-200/60 border-t border-base-200 flex items-center justify-between gap-3 shrink-0">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleClose}
            className="rounded-xl text-xs font-semibold px-4 cursor-pointer"
          >
            Close
          </Button>

          {onEdit && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => {
                handleClose();
                onEdit(tax);
              }}
              className="rounded-xl text-xs font-bold px-5 gap-1.5 cursor-pointer shadow-md shadow-primary/20"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit Tax Slab
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

