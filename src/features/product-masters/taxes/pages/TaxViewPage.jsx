import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Receipt,
  Percent,
  Building,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  Calculator,
  ShieldCheck,
  Edit,
  Trash2,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";
import PageHeader from "../../../../common/components/PageHeader.jsx";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useTax, useDeleteTax, useUpdateTax } from "../hooks/useTaxes.js";
import {
  TaxThumb,
  TaxFormModal,
  TaxDeleteModal,
  TaxCalculatorModal,
  TaxGuidanceHints,
} from "../components/index.js";
import { formatTaxRate, formatCurrency } from "../utils/taxHelper.js";
import { ROUTES } from "../../../../constants/routes.js";

/**
 * TaxViewPage Component
 * Dedicated page for inspecting and simulating a single tax rate slab (/products/taxes/:id).
 */
export default function TaxViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: taxResponse, isLoading, isError, refetch } = useTax(id);
  const tax = taxResponse?.data || taxResponse;

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const updateMutation = useUpdateTax();
  const deleteMutation = useDeleteTax();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-base-300/40 rounded-2xl w-1/3" />
        <div className="h-64 bg-base-300/30 rounded-3xl" />
        <div className="h-48 bg-base-300/30 rounded-3xl" />
      </div>
    );
  }

  if (isError || !tax) {
    return (
      <div className="rounded-3xl border border-dashed border-base-300 bg-base-100 p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-600 border border-rose-500/20 flex items-center justify-center mx-auto">
          <Receipt className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-black text-base-content">
            Tax Slab Not Found
          </h3>
          <p className="text-xs text-base-content/60 max-w-md mx-auto">
            The tax rate slab with ID #{id} could not be retrieved from the catalog.
          </p>
        </div>
        <Link to={ROUTES.TAXES || "/products/taxes"}>
          <Button variant="primary" size="sm" icon={ArrowLeft}>
            Back to Tax Master
          </Button>
        </Link>
      </div>
    );
  }

  const rate = Number(tax.rate) || 0;
  const cgstRate = Number(tax.cgst_rate ?? tax.cgstRate ?? rate / 2) || 0;
  const sgstRate = Number(tax.sgst_rate ?? tax.sgstRate ?? rate / 2) || 0;
  const igstRate = Number(tax.igst_rate ?? tax.igstRate ?? rate) || 0;
  const cessRate = Number(tax.cess_rate ?? tax.cessRate ?? 0) || 0;
  const isInclusive = Boolean(tax.is_inclusive ?? tax.isInclusive);
  const isActive = Boolean(tax.is_active ?? tax.isActive);

  const handleCopyCode = () => {
    const code = tax.tax_code || tax.taxCode || "";
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleUpdate = async (payload) => {
    await updateMutation.mutateAsync({ id, ...payload });
    setFormModalOpen(false);
    refetch();
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(id);
    navigate(ROUTES.TAXES || "/products/taxes");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <PageHeader
        title={tax.tax_name || tax.taxName}
        subtitle={`Tax Slab Code: ${tax.tax_code || tax.taxCode} · Regime: ${tax.tax_type || tax.taxType || "GST"}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Product Master", href: "/products" },
          { label: "Taxes", href: ROUTES.TAXES || "/products/taxes" },
          { label: tax.tax_name || `Tax #${id}`, active: true },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link to={ROUTES.TAXES || "/products/taxes"}>
              <Button variant="secondary" size="sm" icon={ArrowLeft}>
                Back to Taxes
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              icon={Calculator}
              onClick={() => setCalculatorOpen(true)}
            >
              Simulate Tax
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={Edit}
              onClick={() => setFormModalOpen(true)}
            >
              Edit Slab
            </Button>

            <Button
              variant="secondary"
              size="sm"
              icon={Trash2}
              onClick={() => setDeleteModalOpen(true)}
              className="text-rose-600 hover:bg-rose-500/10 hover:border-rose-500/30"
            />
          </div>
        }
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Inspector */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-xs space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <TaxThumb rate={rate} size="xl" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-base-content">
                      {tax.tax_name || tax.taxName}
                    </h2>
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

                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                      {tax.tax_code || tax.taxCode}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="text-xs text-base-content/50 hover:text-primary flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? "Copied" : "Copy Code"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Rate Overview Bento */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-base-200/50 border border-base-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 block">
                  Total Tax Rate
                </span>
                <p className="text-2xl font-black text-primary font-mono mt-0.5">
                  {formatTaxRate(rate)}
                </p>
                <span className="text-[10px] text-base-content/40 mt-1 block">
                  Applicable slab
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-base-200/50 border border-base-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 block">
                  Price Mode
                </span>
                <p className="text-sm font-bold text-base-content mt-1 flex items-center gap-1">
                  {isInclusive ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>MRP Inclusive</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-amber-500" />
                      <span>Price Exclusive</span>
                    </>
                  )}
                </p>
                <span className="text-[10px] text-base-content/40 mt-1 block">
                  {isInclusive ? "MRP contains tax" : "Added over base price"}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-base-200/50 border border-base-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 block">
                  Regime
                </span>
                <p className="text-base font-black text-base-content mt-1">
                  {tax.tax_type || tax.taxType || "GST"}
                </p>
                <span className="text-[10px] text-base-content/40 mt-1 block">
                  Tax Structure
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-base-200/50 border border-base-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 block">
                  Company ID
                </span>
                <p className="text-base font-black text-base-content mt-1 font-mono">
                  #{tax.company_id || tax.companyId || "—"}
                </p>
                <span className="text-[10px] text-base-content/40 mt-1 block">
                  Corporate entity
                </span>
              </div>
            </div>

            {/* Split Breakdown */}
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/15 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Calculator className="w-4 h-4" />
                  Statutory GST Breakdown
                </h4>
                <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                  Intra & Inter-State
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-base-100 border border-base-200 space-y-1.5">
                  <span className="text-xs font-bold text-base-content block">CGST (Central)</span>
                  <p className="text-xl font-black text-base-content font-mono">{formatTaxRate(cgstRate)}</p>
                  <span className="text-[11px] text-base-content/50">For intra-state commerce (50%)</span>
                </div>

                <div className="p-3.5 rounded-xl bg-base-100 border border-base-200 space-y-1.5">
                  <span className="text-xs font-bold text-base-content block">SGST (State)</span>
                  <p className="text-xl font-black text-base-content font-mono">{formatTaxRate(sgstRate)}</p>
                  <span className="text-[11px] text-base-content/50">For intra-state commerce (50%)</span>
                </div>

                <div className="p-3.5 rounded-xl bg-base-100 border border-base-200 space-y-1.5">
                  <span className="text-xs font-bold text-base-content block">IGST (Integrated)</span>
                  <p className="text-xl font-black text-indigo-600 font-mono">{formatTaxRate(igstRate)}</p>
                  <span className="text-[11px] text-base-content/50">For inter-state commerce (100%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Guidance Hints Card */}
          <TaxGuidanceHints defaultOpen={true} />
        </div>

        {/* Right Col: Quick Test Simulation Card */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-black text-base-content">
                Simulation on ₹1,000
              </h3>
            </div>
            <p className="text-xs text-base-content/60">
              Standard calculation preview for this tax rate slab on a ₹1,000 retail transaction.
            </p>

            <div className="p-4 rounded-2xl bg-base-200/50 border border-base-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-base-content/60">Invoice Amount:</span>
                <span className="font-mono font-bold text-base-content">₹1,000.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base-content/60">Tax Rate:</span>
                <span className="font-mono font-bold text-primary">{formatTaxRate(rate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base-content/60">Computed Tax:</span>
                <span className="font-mono font-bold text-base-content">
                  ₹{((1000 * rate) / 100).toFixed(2)}
                </span>
              </div>
              <div className="pt-2 border-t border-base-200 flex items-center justify-between font-bold">
                <span className="text-primary">Total with Tax:</span>
                <span className="font-mono text-primary text-sm">
                  ₹{(1000 + (1000 * rate) / 100).toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={Calculator}
              onClick={() => setCalculatorOpen(true)}
              className="w-full"
            >
              Open Interactive Calculator
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TaxFormModal
        isOpen={formModalOpen}
        mode="edit"
        initialData={tax}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleUpdate}
        isSubmitting={updateMutation.isPending}
      />

      <TaxDeleteModal
        isOpen={deleteModalOpen}
        tax={tax}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isDeleting={deleteMutation.isPending}
      />

      <TaxCalculatorModal
        isOpen={calculatorOpen}
        initialTax={tax}
        onClose={() => setCalculatorOpen(false)}
      />
    </div>
  );
}
