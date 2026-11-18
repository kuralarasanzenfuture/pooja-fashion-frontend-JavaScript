import React, { useState, useEffect } from "react";
import {
  X,
  Calculator,
  Percent,
  Receipt,
  ArrowRight,
  ShieldCheck,
  Building,
  RefreshCw,
  Coins,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";
import { useCalculateTax, useAllTaxes } from "../hooks/useTaxes.js";
import { calculateTaxLocal, formatCurrency, formatTaxRate } from "../utils/taxHelper.js";
import TaxThumb from "./TaxThumb.jsx";

/**
 * TaxCalculatorModal Component
 * Interactive Billing / POS Tax Engine testing POST /api/taxes/calculate.
 */
export default function TaxCalculatorModal({
  isOpen = false,
  initialTax = null,
  onClose,
}) {
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isOpen,
    onClose
  );

  const { data: allTaxesResponse } = useAllTaxes();
  const taxesList = allTaxesResponse?.data || [];

  const calculateMutation = useCalculateTax();

  // Calculator Form State
  const [amount, setAmount] = useState("1000");
  const [selectedTaxId, setSelectedTaxId] = useState("");
  const [customRate, setCustomRate] = useState("18");
  const [isInterState, setIsInterState] = useState(false);
  const [isInclusive, setIsInclusive] = useState(false);
  const [result, setResult] = useState(null);

  // Set initial selected tax when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialTax) {
        setSelectedTaxId(String(initialTax.id || initialTax.tax_id || ""));
        setCustomRate(String(initialTax.rate || 18));
        setIsInclusive(Boolean(initialTax.is_inclusive ?? initialTax.isInclusive));
      } else if (taxesList.length > 0 && !selectedTaxId) {
        setSelectedTaxId(String(taxesList[0].id));
        setCustomRate(String(taxesList[0].rate));
        setIsInclusive(Boolean(taxesList[0].is_inclusive));
      }
    }
  }, [isOpen, initialTax, taxesList]);

  // When selected tax changes in dropdown
  const handleTaxSelect = (id) => {
    setSelectedTaxId(id);
    if (id === "custom") return;
    const found = taxesList.find((t) => String(t.id) === String(id));
    if (found) {
      setCustomRate(String(found.rate));
      setIsInclusive(Boolean(found.is_inclusive));
    }
  };

  // Perform calculation
  const runCalculation = async () => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < 0) return;

    const payload = {
      amount: numAmount,
      is_inter_state: Boolean(isInterState),
      is_inclusive: Boolean(isInclusive),
    };

    if (selectedTaxId && selectedTaxId !== "custom") {
      payload.tax_id = Number(selectedTaxId);
    } else {
      payload.rate = Number(customRate) || 0;
    }

    try {
      const resp = await calculateMutation.mutateAsync(payload);
      if (resp?.data) {
        setResult(resp.data);
        return;
      }
    } catch {
      // Fallback to local calculation if offline or backend route error
    }

    // Local fallback calculation
    const rateToUse =
      selectedTaxId && selectedTaxId !== "custom"
        ? Number(taxesList.find((t) => String(t.id) === String(selectedTaxId))?.rate || customRate)
        : Number(customRate);

    const localRes = calculateTaxLocal(numAmount, rateToUse, isInclusive, isInterState);
    setResult(localRes);
  };

  // Auto-run calculation when parameters change
  useEffect(() => {
    if (isOpen && amount !== "") {
      const timer = setTimeout(() => {
        runCalculation();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, amount, selectedTaxId, customRate, isInterState, isInclusive]);

  if (!isRendered) return null;

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
            <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-base-content tracking-tight">
                POS & Invoice Tax Calculator
              </h3>
              <p className="text-xs text-base-content/60 font-medium">
                Real-time tax calculation simulation via POST /api/taxes/calculate
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
          {/* Controls Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Amount Input */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-1.5">
                Billing / Invoice Amount (₹) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g. 1000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input input-bordered input-sm w-full rounded-xl font-mono text-sm font-bold pl-7 pr-3 focus:border-primary"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-base-content/50">
                  ₹
                </span>
              </div>
              <span className="text-[11px] text-base-content/50 mt-1 block">
                {isInclusive ? "MRP including tax" : "Base price before tax"}
              </span>
            </div>

            {/* Tax Slab Picker */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-1.5">
                Tax Slab *
              </label>
              <select
                value={selectedTaxId}
                onChange={(e) => handleTaxSelect(e.target.value)}
                className="select select-bordered select-sm w-full rounded-xl text-xs font-semibold focus:border-primary"
              >
                {taxesList.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.tax_name || t.taxName} ({formatTaxRate(t.rate)})
                  </option>
                ))}
                <option value="custom">-- Custom Tax Rate --</option>
              </select>
              <span className="text-[11px] text-base-content/50 mt-1 block">
                Select registered slab or specify rate
              </span>
            </div>
          </div>

          {/* Custom Rate input when custom selected */}
          {selectedTaxId === "custom" && (
            <div className="p-3.5 rounded-2xl bg-base-200/40 border border-base-200">
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-1.5">
                Custom Tax Rate (%)
              </label>
              <div className="relative max-w-xs">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={customRate}
                  onChange={(e) => setCustomRate(e.target.value)}
                  className="input input-bordered input-sm w-full rounded-xl font-mono text-xs pr-8"
                />
                <Percent className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              </div>
            </div>
          )}

          {/* Quick GST Preset Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-base-content/50 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Quick Slabs:
            </span>
            {[0, 5, 12, 18, 28].map((slabRate) => (
              <button
                key={slabRate}
                type="button"
                onClick={() => {
                  setSelectedTaxId("custom");
                  setCustomRate(String(slabRate));
                }}
                className={`text-[11px] px-2.5 py-0.5 rounded-lg border font-semibold transition-all cursor-pointer ${
                  Number(customRate) === slabRate
                    ? "bg-primary text-primary-content border-primary"
                    : "bg-base-200/60 hover:bg-base-200 text-base-content/80 border-base-300"
                }`}
              >
                {slabRate}%
              </button>
            ))}
          </div>

          {/* Interactive Calculation Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Supply Type */}
            <div className="p-3.5 rounded-2xl border border-base-200 bg-base-100 space-y-2">
              <span className="text-xs font-bold text-base-content block">
                Supply Destination
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsInterState(false)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                    !isInterState
                      ? "bg-primary/10 border-primary text-primary shadow-xs"
                      : "bg-base-200/50 border-base-200 text-base-content/60 hover:bg-base-200"
                  }`}
                >
                  <span>Intra-State</span>
                  <span className="text-[10px] font-normal opacity-70">CGST + SGST</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsInterState(true)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                    isInterState
                      ? "bg-indigo-500/10 border-indigo-500 text-indigo-600 shadow-xs"
                      : "bg-base-200/50 border-base-200 text-base-content/60 hover:bg-base-200"
                  }`}
                >
                  <span>Inter-State</span>
                  <span className="text-[10px] font-normal opacity-70">IGST</span>
                </button>
              </div>
            </div>

            {/* Inclusivity Mode */}
            <div className="p-3.5 rounded-2xl border border-base-200 bg-base-100 space-y-2">
              <span className="text-xs font-bold text-base-content block">
                Tax Treatment Mode
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsInclusive(false)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                    !isInclusive
                      ? "bg-primary/10 border-primary text-primary shadow-xs"
                      : "bg-base-200/50 border-base-200 text-base-content/60 hover:bg-base-200"
                  }`}
                >
                  <span>Exclusive</span>
                  <span className="text-[10px] font-normal opacity-70">+ Added Tax</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsInclusive(true)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                    isInclusive
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 shadow-xs"
                      : "bg-base-200/50 border-base-200 text-base-content/60 hover:bg-base-200"
                  }`}
                >
                  <span>Inclusive</span>
                  <span className="text-[10px] font-normal opacity-70">Inside MRP</span>
                </button>
              </div>
            </div>
          </div>

          {/* Results Receipt Card */}
          {result && (
            <div className="p-5 rounded-3xl bg-gradient-to-br from-base-200/80 to-base-100 border border-base-300 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-base-300/80">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-primary" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-base-content">
                    Calculation Breakdown
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                  {formatTaxRate(customRate)} Slab
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {/* Taxable Amount */}
                <div className="flex items-center justify-between">
                  <span className="text-base-content/70">Taxable Base Amount:</span>
                  <span className="font-mono font-bold text-base-content">
                    {formatCurrency(result.taxable_amount ?? result.taxableAmount)}
                  </span>
                </div>

                {/* CGST */}
                {!isInterState && (
                  <div className="flex items-center justify-between">
                    <span className="text-base-content/60 pl-2">
                      CGST ({formatTaxRate(Number(customRate) / 2)}):
                    </span>
                    <span className="font-mono font-semibold text-base-content">
                      {formatCurrency(result.cgst_amount ?? result.cgstAmount ?? 0)}
                    </span>
                  </div>
                )}

                {/* SGST */}
                {!isInterState && (
                  <div className="flex items-center justify-between">
                    <span className="text-base-content/60 pl-2">
                      SGST ({formatTaxRate(Number(customRate) / 2)}):
                    </span>
                    <span className="font-mono font-semibold text-base-content">
                      {formatCurrency(result.sgst_amount ?? result.sgstAmount ?? 0)}
                    </span>
                  </div>
                )}

                {/* IGST */}
                {isInterState && (
                  <div className="flex items-center justify-between">
                    <span className="text-base-content/60 pl-2">
                      IGST ({formatTaxRate(customRate)}):
                    </span>
                    <span className="font-mono font-semibold text-indigo-600">
                      {formatCurrency(result.igst_amount ?? result.igstAmount ?? 0)}
                    </span>
                  </div>
                )}

                {/* Cess if any */}
                {(Number(result.cess_amount ?? result.cessAmount) > 0) && (
                  <div className="flex items-center justify-between">
                    <span className="text-base-content/60 pl-2">Compensation Cess:</span>
                    <span className="font-mono font-semibold text-amber-600">
                      {formatCurrency(result.cess_amount ?? result.cessAmount)}
                    </span>
                  </div>
                )}

                {/* Total Tax */}
                <div className="pt-2 border-t border-dashed border-base-300 flex items-center justify-between font-semibold">
                  <span className="text-primary">Total Tax Levied:</span>
                  <span className="font-mono font-bold text-primary">
                    {formatCurrency(result.total_tax ?? result.totalTax ?? result.tax_amount ?? 0)}
                  </span>
                </div>

                {/* Total Final Invoice Amount */}
                <div className="pt-2 border-t border-base-300 flex items-center justify-between">
                  <span className="text-sm font-black text-base-content">
                    Total Invoice Amount:
                  </span>
                  <span className="text-lg font-black text-primary font-mono">
                    {formatCurrency(result.total_amount ?? result.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          )}
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

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={runCalculation}
            loading={calculateMutation.isPending}
            className="rounded-xl text-xs font-bold px-5 gap-1.5 cursor-pointer shadow-md shadow-primary/20"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Recalculate
          </Button>
        </div>
      </div>
    </div>
  );
}

