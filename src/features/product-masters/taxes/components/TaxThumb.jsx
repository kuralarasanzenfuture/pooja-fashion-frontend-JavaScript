import React from "react";
import { Receipt, Percent } from "lucide-react";

/**
 * TaxThumb Component
 * Avatar display for tax master records, highlighting the percentage slab and tax type.
 */
export default function TaxThumb({ tax = {}, size = "md", className = "" }) {
  const rate = Number(tax.rate ?? 0);
  const isInclusive = Boolean(tax.is_inclusive ?? tax.isInclusive);

  // Dynamic palette based on standard Indian GST brackets
  const getPalette = (r) => {
    if (r === 0) return { bg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" };
    if (r <= 5) return { bg: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30" };
    if (r <= 12) return { bg: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30" };
    if (r <= 18) return { bg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30" };
    return { bg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30" };
  };

  const sizeStyles = {
    sm: "w-8 h-8 rounded-lg text-[10px]",
    md: "w-10 h-10 rounded-xl text-xs",
    lg: "w-12 h-12 rounded-2xl text-sm",
    xl: "w-16 h-16 rounded-3xl text-base",
  };

  const dim = sizeStyles[size] || sizeStyles.md;
  const palette = getPalette(rate);

  return (
    <div className={`relative shrink-0 ${className}`}>
      <div
        className={`${dim} ${palette.bg} flex flex-col items-center justify-center font-black tracking-tight border shadow-xs transition-transform duration-200 group-hover:scale-105 select-none`}
      >
        <span className="leading-none">{rate % 1 === 0 ? rate : rate.toFixed(1)}%</span>
        <span className="text-[8px] font-bold uppercase tracking-wider opacity-70 leading-none mt-0.5">
          {tax.tax_type || "GST"}
        </span>
      </div>

      {isInclusive && (
        <span
          className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary text-primary-content text-[8px] font-black flex items-center justify-center border border-base-100 shadow-xs tooltip tooltip-top"
          data-tip="Price Inclusive Tax"
        >
          i
        </span>
      )}
    </div>
  );
}

