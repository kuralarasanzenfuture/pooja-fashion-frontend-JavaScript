import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Sparkles, Building, CheckCircle2, X, AlertCircle, HelpCircle } from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";
import { useCompanies } from "../../../company/hooks/useCompanies.js";
import { SAMPLE_TAXES_TABLE_DATA } from "./TaxGuidanceHints.jsx";
import TaxThumb from "./TaxThumb.jsx";

/**
 * TaxSeedModal Component
 * One-click initialization dialog for standard Indian GST slabs (0%, 5%, 12%, 18%, 28%).
 */
export default function TaxSeedModal({
  isOpen = false,
  onClose,
  onConfirm,
  isSeeding = false,
}) {
  const user = useSelector((state) => state.auth.user);
  const roleCode = String(user?.roleCode || user?.role || "").toUpperCase();
  const userCompanyId = user?.companyId || user?.company_id;
  const isSuperAdmin = roleCode === "SUPERADMIN";
  const isAdmin = roleCode === "ADMIN";
  const canSelectCompany = (isSuperAdmin || isAdmin) && !userCompanyId;

  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isOpen,
    onClose
  );

  const { data: companiesResponse } = useCompanies({ limit: 100, status: "active" });
  const companiesList = companiesResponse?.data || [];

  const [companyId, setCompanyId] = useState(userCompanyId || "");

  if (!isRendered) return null;

  const handleSeed = () => {
    const targetCompanyId = canSelectCompany ? companyId : userCompanyId || null;
    onConfirm(targetCompanyId ? Number(targetCompanyId) : undefined);
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
        <div className="relative px-6 py-5 border-b border-base-200 bg-gradient-to-r from-primary/10 via-base-100 to-base-200/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="text-base font-black text-base-content tracking-tight">
                Seed Standard GST Slabs
              </h3>
              <p className="text-xs text-base-content/60 font-medium">
                Populate verified Indian apparel & textile tax slabs
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <p className="text-xs text-base-content/80 leading-relaxed">
            This will automatically register the 5 official Indian Goods & Services Tax (GST)
            slabs into your company catalog with pre-configured CGST, SGST, and IGST rates:
          </p>

          {/* Slabs Sample Table */}
          <div className="overflow-x-auto rounded-2xl border border-base-300 bg-base-100 shadow-xs">
            <table className="w-full text-left text-xs border-collapse font-mono text-[11px]">
              <thead>
                <tr className="border-b border-base-200 bg-base-200/60 font-sans text-[10px] font-bold uppercase tracking-wider text-base-content/70">
                  <th className="py-2 px-2.5 text-center w-12">ID</th>
                  <th className="py-2 px-2.5">Tax code</th>
                  <th className="py-2 px-2.5">Tax name</th>
                  <th className="py-2 px-2.5 text-center">Rate</th>
                  <th className="py-2 px-2.5 text-center">CGST</th>
                  <th className="py-2 px-2.5 text-center">SGST</th>
                  <th className="py-2 px-2.5 text-center">IGST</th>
                  <th className="py-2 px-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {SAMPLE_TAXES_TABLE_DATA.map((row) => (
                  <tr key={row.id} className="hover:bg-base-200/40">
                    <td className="py-2 px-2.5 text-center font-bold text-base-content/60">
                      {row.id}
                    </td>
                    <td className="py-2 px-2.5 font-bold text-base-content">
                      <span className="bg-base-200 px-1.5 py-0.5 rounded border border-base-300">
                        {row.tax_code}
                      </span>
                    </td>
                    <td className="py-2 px-2.5 font-sans font-bold text-base-content">
                      {row.tax_name}
                    </td>
                    <td className="py-2 px-2.5 text-center font-bold text-primary">
                      {row.rate}
                    </td>
                    <td className="py-2 px-2.5 text-center text-base-content/80">
                      {row.cgst}
                    </td>
                    <td className="py-2 px-2.5 text-center text-base-content/80">
                      {row.sgst}
                    </td>
                    <td className="py-2 px-2.5 text-center font-bold text-indigo-600">
                      {row.igst}
                    </td>
                    <td className="py-2 px-2.5 text-center font-sans">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/25">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {row.active}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                <strong className="text-base-content font-mono font-bold">Rate:</strong> Total tax rate applied on the product base taxable value.
              </li>
              <li>
                <strong className="text-base-content font-mono font-bold">CGST & SGST:</strong> Equal 50/50 split collected for intra-state sales within the same state.
              </li>
              <li>
                <strong className="text-indigo-600 font-mono font-bold">IGST:</strong> Applied at full rate (100%) when selling to a customer in another state.
              </li>
              <li>
                <strong className="text-emerald-600 font-mono font-bold">Active:</strong> Whether this tax slab can be applied in POS checkouts and invoice generation.
              </li>
            </ul>
          </div>

          {/* Target Company selection if superadmin */}
          {canSelectCompany && (
            <div className="pt-2 border-t border-base-200">
              <label className="text-[11px] font-bold uppercase tracking-wider text-base-content/70 block mb-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-primary" />
                Select Target Company
              </label>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="select select-bordered select-xs w-full rounded-xl text-xs"
              >
                <option value="">Default Company</option>
                {companiesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company_name || c.companyName} (#{c.id})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="p-3 rounded-xl bg-primary/5 border border-primary/15 text-[11px] text-base-content/70 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span>Existing duplicate codes will not be overwritten.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-base-200/60 border-t border-base-200 flex items-center justify-end gap-3 shrink-0">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleClose}
            disabled={isSeeding}
            className="rounded-xl text-xs font-semibold px-4 cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSeed}
            loading={isSeeding}
            className="rounded-xl text-xs font-bold px-5 gap-1.5 cursor-pointer shadow-md shadow-primary/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isSeeding ? "Seeding Slabs..." : "Seed Default Slabs"}
          </Button>
        </div>
      </div>
    </div>
  );
}
