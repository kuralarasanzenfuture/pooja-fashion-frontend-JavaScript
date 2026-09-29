import React, { useState } from "react";
import {
  Receipt,
  Plus,
  Star,
  Copy,
  Check,
  Edit2,
  Trash2,
  Power,
  ShieldCheck,
  FileText,
  Building,
  CreditCard,
  Hash,
  Landmark,
} from "lucide-react";
import { Button } from "../../../common/components/ui/buttons/index.js";
import {
  useCompanyTaxDetailsByCompany,
  useCreateCompanyTaxDetail,
  useUpdateCompanyTaxDetail,
  useUpdateCompanyTaxDetailStatus,
  useSetPrimaryCompanyTaxDetail,
  useDeleteCompanyTaxDetail,
} from "../hooks/useCompanyTaxDetails.js";
import CompanyTaxDetailModal from "./CompanyTaxDetailModal.jsx";
import CompanyTaxDetailDeleteModal from "./CompanyTaxDetailDeleteModal.jsx";

const GST_TYPE_CONFIG = {
  regular: {
    label: "Regular GST Taxpayer",
    icon: ShieldCheck,
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  composition: {
    label: "Composition Scheme",
    icon: Receipt,
    badgeClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
  unregistered: {
    label: "Unregistered Entity",
    icon: FileText,
    badgeClass: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  },
  other: {
    label: "Special Category",
    icon: Building,
    badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
};

/**
 * Company Tax Details Tab Component for CompanyViewPage
 */
export default function CompanyTaxDetailsTab({ companyId, companyName }) {
  const { data: taxDetailsResponse, isLoading } = useCompanyTaxDetailsByCompany(companyId);
  const taxDetails = taxDetailsResponse?.data || [];

  const createMutation = useCreateCompanyTaxDetail();
  const updateMutation = useUpdateCompanyTaxDetail();
  const statusMutation = useUpdateCompanyTaxDetailStatus();
  const primaryMutation = useSetPrimaryCompanyTaxDetail();
  const deleteMutation = useDeleteCompanyTaxDetail();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaxDetail, setEditingTaxDetail] = useState(null);
  const [deletingTaxDetail, setDeletingTaxDetail] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleOpenCreate = () => {
    setEditingTaxDetail(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (taxRecord) => {
    setEditingTaxDetail(taxRecord);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (editingTaxDetail?.id) {
      await updateMutation.mutateAsync({ id: editingTaxDetail.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    setIsModalOpen(false);
    setEditingTaxDetail(null);
  };

  const handleToggleStatus = async (taxRecord) => {
    const currentActive = Boolean(taxRecord.isActive ?? taxRecord.is_active);
    await statusMutation.mutateAsync({ id: taxRecord.id, isActive: !currentActive });
  };

  const handleSetPrimary = async (taxRecord) => {
    await primaryMutation.mutateAsync(taxRecord.id);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTaxDetail?.id) return;
    await deleteMutation.mutateAsync({ id: deletingTaxDetail.id, companyId });
    setDeletingTaxDetail(null);
  };

  if (isLoading) {
    return (
      <div className="py-14 flex flex-col items-center justify-center space-y-3">
        <span className="loading loading-spinner loading-md text-primary"></span>
        <p className="text-xs text-base-content/60 font-medium">Loading statutory tax registrations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-base-content tracking-tight mb-1">
            Statutory Tax Registrations & GST Identification
          </h3>
          <p className="text-xs sm:text-sm text-base-content/65 font-normal">
            Goods and Services Tax (GSTIN), Permanent Account Numbers (PAN), and Tax Deduction Accounts (TAN).
          </p>
        </div>

        <Button
          variant="clip-six"
          size="sm"
          icon={Plus}
          onClick={handleOpenCreate}
        >
          Add Tax Profile
        </Button>
      </div>

      {/* Tax Records Cards Grid */}
      {taxDetails.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-base-200/40 border border-base-300 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-xs">
            <Receipt className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h4 className="text-base font-extrabold text-base-content">No Tax Profiles Configured</h4>
            <p className="text-xs text-base-content/65 leading-relaxed">
              There are no GSTIN or statutory tax records on file for {companyName || "this company"}. Configure your primary tax registration to enable compliance and billing.
            </p>
          </div>
          <Button variant="primary" size="md" icon={Plus} onClick={handleOpenCreate}>
            Register First Tax Profile
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {taxDetails.map((tax) => {
            const isPrimary = Boolean(tax.isPrimary ?? tax.is_primary);
            const isActive = Boolean(tax.isActive ?? tax.is_active);
            const typeKey = (tax.gstRegistrationType || tax.gst_registration_type || "regular").toLowerCase();
            const typeInfo = GST_TYPE_CONFIG[typeKey] || GST_TYPE_CONFIG.regular;
            const TypeIcon = typeInfo.icon;
            const gstinVal = tax.gstin;
            const panVal = tax.panNumber || tax.pan_number;
            const tanVal = tax.tanNumber || tax.tan_number;
            const stateCode = tax.gstStateCode || tax.gst_state_code;
            const registeredName = tax.taxRegisteredName || tax.tax_registered_name;

            return (
              <div
                key={tax.id}
                className={`relative rounded-3xl p-5 sm:p-6 border transition-all duration-200 flex flex-col justify-between ${
                  isPrimary
                    ? "bg-base-100 border-primary/40 shadow-sm ring-1 ring-primary/20"
                    : "bg-base-100/70 border-base-300 hover:border-base-content/25 hover:shadow-xs"
                } ${!isActive ? "opacity-70 bg-base-200/40" : ""}`}
              >
                {/* Header row of card */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold tracking-wide border ${typeInfo.badgeClass}`}
                      >
                        <TypeIcon className="w-3.5 h-3.5" />
                        {typeInfo.label}
                      </span>

                      {isPrimary && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
                          <Star className="w-3 h-3 fill-current" /> Primary Tax Identification
                        </span>
                      )}

                      {stateCode && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-mono font-semibold bg-base-200 border border-base-300 text-base-content/75">
                          State: {stateCode}
                        </span>
                      )}

                      {!isActive && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Registered Name if available */}
                  {registeredName && (
                    <div className="mb-3">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/50">
                        Registered Entity Name
                      </p>
                      <h4 className="text-sm sm:text-base font-extrabold text-base-content leading-snug">
                        {registeredName}
                      </h4>
                    </div>
                  )}

                  {/* Tax Identifiers Grid */}
                  <div className="space-y-2 pt-1">
                    {/* GSTIN Row */}
                    <div className="p-3 rounded-2xl bg-base-200/50 border border-base-300 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-base-content/50 uppercase tracking-wider block">
                          GST Identification Number (GSTIN)
                        </span>
                        <span className="font-mono font-bold text-base-content text-sm sm:text-base tracking-wider">
                          {gstinVal || "Not Provided"}
                        </span>
                      </div>
                      {gstinVal && (
                        <button
                          type="button"
                          onClick={() => handleCopy(gstinVal, `gstin_${tax.id}`)}
                          className="p-1.5 rounded-xl text-base-content/50 hover:text-primary hover:bg-base-200 transition-colors cursor-pointer"
                          title="Copy GSTIN"
                        >
                          {copiedKey === `gstin_${tax.id}` ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* PAN & TAN Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-xl bg-base-200/40 border border-base-300 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-base-content/50 uppercase tracking-wider block">
                            PAN Number
                          </span>
                          <span className="font-mono font-semibold text-base-content text-xs sm:text-sm tracking-wide">
                            {panVal || "—"}
                          </span>
                        </div>
                        {panVal && (
                          <button
                            type="button"
                            onClick={() => handleCopy(panVal, `pan_${tax.id}`)}
                            className="p-1 rounded-lg text-base-content/50 hover:text-primary hover:bg-base-200 transition-colors cursor-pointer"
                            title="Copy PAN"
                          >
                            {copiedKey === `pan_${tax.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>

                      <div className="p-2.5 rounded-xl bg-base-200/40 border border-base-300 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-base-content/50 uppercase tracking-wider block">
                            TAN Number
                          </span>
                          <span className="font-mono font-semibold text-base-content text-xs sm:text-sm tracking-wide">
                            {tanVal || "—"}
                          </span>
                        </div>
                        {tanVal && (
                          <button
                            type="button"
                            onClick={() => handleCopy(tanVal, `tan_${tax.id}`)}
                            className="p-1 rounded-lg text-base-content/50 hover:text-primary hover:bg-base-200 transition-colors cursor-pointer"
                            title="Copy TAN"
                          >
                            {copiedKey === `tan_${tax.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-4 mt-5 border-t border-base-300 flex items-center justify-between gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-3">
                    {!isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(tax)}
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5" /> Set as Primary
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(tax)}
                      className={`text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                        isActive
                          ? "text-base-content/55 hover:text-amber-500"
                          : "text-emerald-600 hover:underline"
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      {isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(tax)}
                      className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-base-content/75 hover:text-primary bg-base-200/80 hover:bg-primary/10 border border-base-300 hover:border-primary/30 transition-all duration-150 cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
                      title="Edit Tax Details"
                    >
                      <Edit2 className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingTaxDetail(tax)}
                      className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-600 hover:text-white border border-rose-500/20 hover:border-rose-600 transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs hover:scale-[1.02] active:scale-[0.98]"
                      title="Delete this tax record"
                    >
                      <Trash2 className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tax Create / Edit Modal */}
      <CompanyTaxDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTaxDetail(null);
        }}
        taxDetail={editingTaxDetail}
        companyId={companyId}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <CompanyTaxDetailDeleteModal
        isOpen={Boolean(deletingTaxDetail)}
        onClose={() => setDeletingTaxDetail(null)}
        taxDetail={deletingTaxDetail}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
