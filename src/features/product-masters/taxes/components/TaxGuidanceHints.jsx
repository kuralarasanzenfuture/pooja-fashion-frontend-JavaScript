import React, { useState } from "react";
import { HelpCircle, ChevronDown, Sparkles, CheckCircle2 } from "lucide-react";

/**
 * Sample table data matching user specification
 */
export const SAMPLE_TAXES_TABLE_DATA = [
  {
    id: 601,
    tax_code: "GST_0",
    tax_name: "GST 0%",
    rate: "0%",
    cgst: "0%",
    sgst: "0%",
    igst: "0%",
    active: "Active",
    usage: "Raw cotton, silk yarn, khadi, unstitched cloth, handloom fabrics",
  },
  {
    id: 602,
    tax_code: "GST_5",
    tax_name: "GST 5%",
    rate: "5%",
    cgst: "2.5%",
    sgst: "2.5%",
    igst: "5%",
    active: "Active",
    usage: "Apparel, sarees & clothing accessories ≤ ₹1,000, cotton yarn",
  },
  {
    id: 603,
    tax_code: "GST_12",
    tax_name: "GST 12%",
    rate: "12%",
    cgst: "6%",
    sgst: "6%",
    igst: "12%",
    active: "Active",
    usage: "Readymade garments & designer sarees > ₹1,000, synthetic fabrics",
  },
  {
    id: 604,
    tax_code: "GST_18",
    tax_name: "GST 18%",
    rate: "18%",
    cgst: "9%",
    sgst: "9%",
    igst: "18%",
    active: "Active",
    usage: "Branded footwear > ₹1,000, stitching, boutique alteration charges",
  },
  {
    id: 605,
    tax_code: "GST_28",
    tax_name: "GST 28%",
    rate: "28%",
    cgst: "14%",
    sgst: "14%",
    igst: "28%",
    active: "Active",
    usage: "Luxury designer wear, premium leather apparel, high-end accessories",
  },
];

/**
 * TaxGuidanceHints Component
 * Provides sample table data reference and "Why these settings?" operational guidance,
 * matching the product-types reference pattern.
 */
export default function TaxGuidanceHints({
  defaultOpen = true,
  collapsible = true,
  compact = false,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-3xl border border-primary/20 bg-primary/5 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-base-content tracking-tight uppercase">
              Taxes – Sample Table Data & Operational Guidance
            </h4>
            <p className="text-[11px] text-base-content/60 font-medium">
              Official Indian GST slab matrix and operational billing settings
            </p>
          </div>
        </div>

        {collapsible && (
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-1.5 rounded-xl hover:bg-primary/10 text-primary transition-colors cursor-pointer"
            aria-label="Toggle guidance"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="space-y-4 pt-1 animate-in fade-in-50 duration-150">
          {/* Sample Table Data */}
          <div className="overflow-x-auto rounded-2xl border border-base-300 bg-base-100 shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-base-200 bg-base-200/60 text-[11px] font-bold uppercase tracking-wider text-base-content/70">
                  <th className="py-2.5 px-3 text-center w-14">ID</th>
                  <th className="py-2.5 px-3">Tax code</th>
                  <th className="py-2.5 px-3">Tax name</th>
                  <th className="py-2.5 px-3 text-center">Rate</th>
                  <th className="py-2.5 px-3 text-center">CGST</th>
                  <th className="py-2.5 px-3 text-center">SGST</th>
                  <th className="py-2.5 px-3 text-center">IGST</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  {!compact && <th className="py-2.5 px-3">Typical Fashion Usage</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200 font-mono text-[11px]">
                {SAMPLE_TAXES_TABLE_DATA.map((row) => (
                  <tr key={row.id} className="hover:bg-base-200/40 transition-colors">
                    <td className="py-2.5 px-3 text-center font-bold text-base-content/60">
                      {row.id}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-base-content bg-base-200/80 px-2 py-0.5 rounded border border-base-300">
                        {row.tax_code}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-sans font-bold text-base-content">
                      {row.tax_name}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-primary">
                      {row.rate}
                    </td>
                    <td className="py-2.5 px-3 text-center text-base-content/80">
                      {row.cgst}
                    </td>
                    <td className="py-2.5 px-3 text-center text-base-content/80">
                      {row.sgst}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-indigo-600">
                      {row.igst}
                    </td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/25">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {row.active}
                      </span>
                    </td>
                    {!compact && (
                      <td className="py-2.5 px-3 font-sans text-base-content/75 text-[11px]">
                        {row.usage}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Why these settings? Grid */}
          <div className="space-y-2">
            <span className="text-xs font-black text-base-content uppercase tracking-wider block">
              Why these settings?
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-base-100 border border-base-200 space-y-1">
                <strong className="text-base-content font-mono font-bold block text-[11px]">
                  Rate:
                </strong>
                <p className="text-[11px] text-base-content/75 leading-relaxed">
                  Total tax percentage levied on the product base taxable value.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-base-100 border border-base-200 space-y-1">
                <strong className="text-base-content font-mono font-bold block text-[11px]">
                  CGST & SGST (Intra-State):
                </strong>
                <p className="text-[11px] text-base-content/75 leading-relaxed">
                  Split equally (50% Central + 50% State) when selling within the same state.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-base-100 border border-base-200 space-y-1">
                <strong className="text-indigo-600 font-mono font-bold block text-[11px]">
                  IGST (Inter-State):
                </strong>
                <p className="text-[11px] text-base-content/75 leading-relaxed">
                  Full tax rate (100% Integrated GST) when selling to a customer in another state.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-base-100 border border-base-200 space-y-1">
                <strong className="text-emerald-600 font-mono font-bold block text-[11px]">
                  Active (Yes / No):
                </strong>
                <p className="text-[11px] text-base-content/75 leading-relaxed">
                  Whether you can apply this tax slab on POS checkouts and invoice generation.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-base-100 border border-base-200 space-y-1">
                <strong className="text-primary font-mono font-bold block text-[11px]">
                  GST 0% (Nil-Rated):
                </strong>
                <p className="text-[11px] text-base-content/75 leading-relaxed">
                  Zero tax for essential textile items like raw cotton, silk yarn, khadi, and unstitched cloth.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-base-100 border border-base-200 space-y-1">
                <strong className="text-amber-600 font-mono font-bold block text-[11px]">
                  Price Inclusive (MRP):
                </strong>
                <p className="text-[11px] text-base-content/75 leading-relaxed">
                  When enabled, tax is reverse-calculated from MRP without adding extra at checkout.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

