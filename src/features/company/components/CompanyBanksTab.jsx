import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Landmark,
  Plus,
  Star,
  Copy,
  Check,
  Edit2,
  Trash2,
  Power,
  CreditCard,
  Building,
  Wallet,
  PiggyBank,
  CheckCircle2,
  ExternalLink,
  LayoutGrid,
  Table as TableIcon,
  FileCheck,
  Eye,
  X,
} from "lucide-react";
import { Button } from "../../../common/components/ui/buttons/index.js";
import {
  useCompanyBanksByCompany,
  useCreateCompanyBank,
  useUpdateCompanyBank,
  useUpdateCompanyBankStatus,
  useSetPrimaryCompanyBank,
  useDeleteCompanyBank,
} from "../hooks/useCompanyBanks.js";
import CompanyBankModal from "./CompanyBankModal.jsx";
import CompanyBankDeleteModal from "./CompanyBankDeleteModal.jsx";
import BankLogo from "../../bank-master/components/BankLogo.jsx";

const ACCOUNT_TYPE_CONFIG = {
  current: {
    label: "Current Account",
    icon: Landmark,
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  savings: {
    label: "Savings Account",
    icon: PiggyBank,
    badgeClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
  cash_credit: {
    label: "CC Credit Facility",
    icon: Wallet,
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  overdraft: {
    label: "Overdraft (OD)",
    icon: CreditCard,
    badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  other: {
    label: "Special Account",
    icon: Building,
    badgeClass: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  },
};

/**
 * Company Banks Tab Component for CompanyViewPage
 * Features both Table & Card views with typography matching the main application design system.
 */
export default function CompanyBanksTab({ companyId, companyName }) {
  const navigate = useNavigate();
  const { data: banksResponse, isLoading } = useCompanyBanksByCompany(companyId);
  const bankAccounts = banksResponse?.data || [];

  const [viewMode, setViewMode] = useState("cards"); // 'cards' | 'table'

  const createMutation = useCreateCompanyBank();
  const updateMutation = useUpdateCompanyBank();
  const statusMutation = useUpdateCompanyBankStatus();
  const primaryMutation = useSetPrimaryCompanyBank();
  const deleteMutation = useDeleteCompanyBank();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [deletingAccount, setDeletingAccount] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [viewingDocUrl, setViewingDocUrl] = useState(null);

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleOpenCreate = () => {
    setEditingAccount(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (acc) => {
    setEditingAccount(acc);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (editingAccount?.id) {
      await updateMutation.mutateAsync({ id: editingAccount.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    setIsModalOpen(false);
    setEditingAccount(null);
  };

  const handleToggleStatus = async (acc) => {
    const currentActive = Boolean(acc.isActive ?? acc.is_active);
    await statusMutation.mutateAsync({ id: acc.id, isActive: !currentActive });
  };

  const handleSetPrimary = async (acc) => {
    await primaryMutation.mutateAsync(acc.id);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAccount?.id) return;
    await deleteMutation.mutateAsync({ id: deletingAccount.id, companyId });
    setDeletingAccount(null);
  };

  const formatCurrency = (val) => {
    const num = Number(val || 0);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(num);
  };

  if (isLoading) {
    return (
      <div className="py-14 flex flex-col items-center justify-center space-y-3">
        <span className="loading loading-spinner loading-md text-primary"></span>
        <p className="text-xs text-base-content/60 font-medium">Loading commercial bank accounts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-base-content tracking-tight mb-1">
            Commercial Bank Accounts & Settlement Ledgers
          </h3>
          <p className="text-xs sm:text-sm text-base-content/65">
            Business checking accounts, IFSC routing details, and financial reconciliation ledgers.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View mode toggle */}
          {bankAccounts.length > 0 && (
            <div className="flex items-center bg-base-200/80 rounded-xl p-1 border border-base-300">
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === "cards"
                    ? "bg-base-100 text-primary shadow-2xs font-semibold"
                    : "text-base-content/60 hover:text-base-content"
                }`}
                title="Card View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-base-100 text-primary shadow-2xs font-semibold"
                    : "text-base-content/60 hover:text-base-content"
                }`}
                title="Table View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            icon={Landmark}
            onClick={() => navigate("/bank-master")}
          >
            Bank Master Directory
          </Button>

          <Button
            variant="clip-six"
            size="sm"
            icon={Plus}
            onClick={handleOpenCreate}
          >
            Add Bank Account
          </Button>
        </div>
      </div>

      {/* Accounts List (Empty / Cards / Table) */}
      {bankAccounts.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-2xl bg-base-200/40 border border-base-300 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-xs">
            <Landmark className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h4 className="text-base font-bold text-base-content">No Bank Accounts Configured</h4>
            <p className="text-xs text-base-content/65 leading-relaxed">
              There are no commercial bank accounts recorded for {companyName || "this company"}. Configure your primary banking institution to enable automated invoice bank footers and payment reconciliation.
            </p>
          </div>
          <Button variant="primary" size="md" icon={Plus} onClick={handleOpenCreate}>
            Register First Bank Account
          </Button>
        </div>
      ) : viewMode === "table" ? (
        /* TABLE VIEW */
        <div className="bg-base-100 rounded-xl border border-base-300 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-base-300 bg-base-200/40 text-[11px] font-semibold uppercase tracking-wide text-base-content/60">
                  <th className="py-3 px-5">Institution & Holder</th>
                  <th className="py-3 px-4">Account Number</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4">Branch & Routing</th>
                  <th className="py-3 px-4">Balances</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200 text-sm">
                {bankAccounts.map((acc) => {
                  const isPrimary = Boolean(acc.isPrimary ?? acc.is_primary);
                  const isActive = Boolean(acc.isActive ?? acc.is_active);
                  const typeKey = (acc.accountType || acc.account_type || "current").toLowerCase();
                  const typeInfo = ACCOUNT_TYPE_CONFIG[typeKey] || ACCOUNT_TYPE_CONFIG.current;
                  const TypeIcon = typeInfo.icon;

                  return (
                    <tr
                      key={acc.id}
                      className={`hover:bg-base-200/40 transition-colors ${
                        isPrimary ? "bg-primary/[0.02]" : ""
                      } ${!isActive ? "opacity-70 bg-base-200/20" : ""}`}
                    >
                      {/* Bank & Holder */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <BankLogo
                            bank={{
                              bankName: acc.bankName,
                              bankCode: acc.bankCode,
                              logoUrl: acc.logoUrl || acc.logo_url,
                            }}
                            size="sm"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-base-content hover:text-primary transition-colors text-sm">
                                {acc.bankName || "Commercial Bank"}
                              </span>
                              {acc.bankCode && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-base-200 border border-base-300 text-base-content/80">
                                  {acc.bankCode}
                                </span>
                              )}
                              {isPrimary && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  <Star className="w-3 h-3 fill-current" /> Primary
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-base-content/65 font-medium truncate mt-0.5">
                              {acc.accountName || "Account Holder"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Account Number */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-base-content text-sm tracking-wide">
                            {acc.accountNumber}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(acc.accountNumber, `tbl_acc_${acc.id}`)}
                            className="p-1 rounded text-base-content/40 hover:text-primary cursor-pointer"
                            title="Copy number"
                          >
                            {copiedKey === `tbl_acc_${acc.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${typeInfo.badgeClass}`}
                        >
                          <TypeIcon className="w-3 h-3" />
                          {typeInfo.label}
                        </span>
                      </td>

                      {/* Branch & IFSC */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs text-base-content">
                          <div className="font-medium truncate max-w-[170px]">
                            {acc.branchName || "—"} {acc.branchCode ? `(#${acc.branchCode})` : ""}
                          </div>
                          {acc.ifscCode && (
                            <div className="flex items-center gap-1 text-[11px] text-base-content/60 mt-0.5">
                              <span className="font-semibold text-base-content/75">{acc.ifscCode}</span>
                              <button
                                type="button"
                                onClick={() => handleCopy(acc.ifscCode, `tbl_ifsc_${acc.id}`)}
                                className="p-0.5 rounded text-base-content/40 hover:text-primary cursor-pointer"
                              >
                                {copiedKey === `tbl_ifsc_${acc.id}` ? (
                                  <Check className="w-3 h-3 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Balances */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs space-y-0.5">
                          <div className="font-bold text-primary text-sm">
                            {formatCurrency(acc.currentBalance)}
                          </div>
                          <div className="text-[11px] text-base-content/50">
                            Op: {formatCurrency(acc.openingBalance)}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(acc)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                            isActive
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-500/20"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500/20"
                          }`}
                          title="Click to toggle status"
                        >
                          <Power className="w-3 h-3" />
                          <span>{isActive ? "Active" : "Inactive"}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isPrimary && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(acc)}
                              className="p-1.5 rounded-lg text-base-content/50 hover:text-primary hover:bg-base-200 transition-colors cursor-pointer"
                              title="Make primary settlement account"
                            >
                              <Star className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(acc)}
                            className="group inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-base-content/75 hover:text-primary bg-base-200/80 hover:bg-primary/10 border border-base-300 hover:border-primary/30 transition-all cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
                            title="Edit Account"
                          >
                            <Edit2 className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingAccount(acc)}
                            className="group inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-600 hover:text-white border border-rose-500/20 hover:border-rose-600 transition-all cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
                            title="Delete Account"
                          >
                            <Trash2 className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARDS VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {bankAccounts.map((acc) => {
            const isPrimary = Boolean(acc.isPrimary ?? acc.is_primary);
            const isActive = Boolean(acc.isActive ?? acc.is_active);
            const typeKey = (acc.accountType || acc.account_type || "current").toLowerCase();
            const typeInfo = ACCOUNT_TYPE_CONFIG[typeKey] || ACCOUNT_TYPE_CONFIG.current;
            const TypeIcon = typeInfo.icon;

            return (
              <div
                key={acc.id}
                className={`relative rounded-2xl p-5 sm:p-6 border transition-all duration-200 flex flex-col justify-between ${
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
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${typeInfo.badgeClass}`}
                      >
                        <TypeIcon className="w-3.5 h-3.5" />
                        {typeInfo.label}
                      </span>

                      {acc.bankCode && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold bg-base-200 border border-base-300 text-base-content/80">
                          {acc.bankCode}
                        </span>
                      )}

                      {isPrimary && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
                          <Star className="w-3.5 h-3.5 fill-current" /> Primary Settlement
                        </span>
                      )}

                      {!isActive && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bank & Account Title with BankLogo */}
                  <div className="flex items-center gap-3 mb-3.5">
                    <BankLogo
                      bank={{
                        bankName: acc.bankName,
                        bankCode: acc.bankCode,
                        logoUrl: acc.logoUrl || acc.logo_url,
                      }}
                      size="md"
                    />
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="text-base font-bold text-base-content leading-snug truncate">
                        {acc.bankName || "Commercial Bank"}
                      </h4>
                      <p className="text-xs font-medium text-base-content/70 truncate">
                        {acc.accountName || "Account Holder"}
                      </p>
                    </div>
                  </div>

                  {/* Account Number Box */}
                  <div className="p-3.5 rounded-xl bg-base-200/50 border border-base-300 flex items-center justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-semibold text-base-content/50 uppercase tracking-wider block">
                        Account Number
                      </span>
                      <span className="font-semibold text-base-content text-sm sm:text-base tracking-wide">
                        {acc.accountNumber}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(acc.accountNumber, `acc_${acc.id}`)}
                      className="p-1.5 rounded-xl text-base-content/50 hover:text-primary hover:bg-base-200 transition-colors cursor-pointer"
                      title="Copy account number"
                    >
                      {copiedKey === `acc_${acc.id}` ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Branch & IFSC Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-base-200/40 border border-base-300">
                      <span className="text-[10px] font-semibold text-base-content/50 uppercase tracking-wider block">
                        IFSC Code
                      </span>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="font-medium text-base-content">
                          {acc.ifscCode || "—"}
                        </span>
                        {acc.ifscCode && (
                          <button
                            type="button"
                            onClick={() => handleCopy(acc.ifscCode, `ifsc_${acc.id}`)}
                            className="p-1 rounded-md text-base-content/50 hover:text-primary cursor-pointer"
                            title="Copy IFSC"
                          >
                            {copiedKey === `ifsc_${acc.id}` ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-base-200/40 border border-base-300">
                      <span className="text-[10px] font-semibold text-base-content/50 uppercase tracking-wider block">
                        Branch
                      </span>
                      <span className="font-medium text-base-content truncate block mt-0.5">
                        {acc.branchName || "—"} {acc.branchCode ? `(#${acc.branchCode})` : ""}
                      </span>
                    </div>
                  </div>

                  {/* Balances Section */}
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-base-200/60 text-xs">
                    <div>
                      <span className="text-[10px] font-semibold text-base-content/50 uppercase tracking-wider block">
                        Opening Balance
                      </span>
                      <span className="font-medium text-base-content/80 text-xs">
                        {formatCurrency(acc.openingBalance)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-base-content/50 uppercase tracking-wider block">
                        Current Book Balance
                      </span>
                      <span className="font-bold text-primary text-sm sm:text-base">
                        {formatCurrency(acc.currentBalance)}
                      </span>
                    </div>
                  </div>

                  {/* Cheque / Document Proof Attachment Badge */}
                  {(acc.chequeImageUrl || acc.cheque_image_url || acc.document_url) && (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-base-200/50 border border-base-300 mt-2 text-xs">
                      <span className="flex items-center gap-1.5 text-base-content/75 font-medium">
                        <FileCheck className="w-3.5 h-3.5 text-emerald-500" /> Cheque / Document Attached
                      </span>
                      <button
                        type="button"
                        onClick={() => setViewingDocUrl(acc.chequeImageUrl || acc.cheque_image_url || acc.document_url)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-base-100 hover:bg-primary/10 text-primary border border-base-300 hover:border-primary/30 transition-colors font-semibold cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3 h-3" /> View
                      </button>
                    </div>
                  )}

                  {acc.notes && (
                    <p className="text-[11.5px] text-base-content/60 italic pt-2.5">
                      Note: {acc.notes}
                    </p>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="pt-4 mt-5 border-t border-base-300 flex items-center justify-between gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-3">
                    {!isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(acc)}
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5" /> Set as Primary
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(acc)}
                      className={`text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors ${
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
                      onClick={() => handleOpenEdit(acc)}
                      className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-base-content/75 hover:text-primary bg-base-200/80 hover:bg-primary/10 border border-base-300 hover:border-primary/30 transition-all duration-150 cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
                      title="Edit Bank Account"
                    >
                      <Edit2 className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingAccount(acc)}
                      className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-600 hover:text-white border border-rose-500/20 hover:border-rose-600 transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs hover:scale-[1.02] active:scale-[0.98]"
                      title="Delete this account"
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

      {/* Account Create / Edit Modal */}
      <CompanyBankModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAccount(null);
        }}
        bankAccount={editingAccount}
        companyId={companyId}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <CompanyBankDeleteModal
        isOpen={Boolean(deletingAccount)}
        onClose={() => setDeletingAccount(null)}
        bankAccount={deletingAccount}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />

      {/* Cheque / Document Lightbox Preview Modal */}
      {viewingDocUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 transition-opacity duration-200 select-none animate-in fade-in"
          onClick={() => setViewingDocUrl(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-2xl w-full bg-base-100 rounded-3xl p-4 overflow-hidden border border-base-300 shadow-2xl transition-all duration-200 transform scale-100 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-base-200">
              <h4 className="text-sm font-bold text-base-content flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-500" /> Account Proof / Cheque Preview
              </h4>
              <button
                type="button"
                onClick={() => setViewingDocUrl(null)}
                className="p-1 rounded-xl hover:bg-base-200 text-base-content/60 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center max-h-[70vh] overflow-auto">
              <img
                src={viewingDocUrl}
                alt="Account Proof"
                className="max-h-[60vh] max-w-full rounded-xl object-contain shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
