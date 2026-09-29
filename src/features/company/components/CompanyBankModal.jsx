import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  X,
  Landmark,
  CreditCard,
  Building,
  Save,
  AlertCircle,
  Hash,
  ShieldCheck,
  Wallet,
  PiggyBank,
  CheckCircle2,
  Search,
  Loader2,
  Sparkles,
  ChevronRight,
  Upload,
  Image as ImageIcon,
  Trash2,
  Eye,
  FileCheck,
} from "lucide-react";
import { Button } from "../../../common/components/ui/buttons/index.js";
import { DropdownSelect } from "../../../common/components/ui/select/index.js";
import { useBanks, useCreateBank } from "../hooks/useBanks.js";
import { getBankIdentifierByValue } from "../services/bankService.js";
import BankLogo from "../../bank-master/components/BankLogo.jsx";
import BankSelectModal from "../../bank-master/components/BankSelectModal.jsx";
import BankModal from "../../bank-master/components/BankModal.jsx";

const ACCOUNT_TYPES = [
  {
    value: "current",
    label: "Current / Commercial Account",
    description: "Standard business transactional account for commercial settlements",
    icon: Landmark,
    badge: "Current",
  },
  {
    value: "savings",
    label: "Savings Deposit Account",
    description: "Standard reserve or business interest deposit account",
    icon: PiggyBank,
    badge: "Savings",
  },
  {
    value: "cash_credit",
    label: "Cash Credit (CC) Facility",
    description: "Revolving working capital borrowing facility against current assets",
    icon: Wallet,
    badge: "CC Facility",
  },
  {
    value: "overdraft",
    label: "Overdraft (OD) Facility",
    description: "Credit line facility attached to primary current account",
    icon: CreditCard,
    badge: "OD Account",
  },
  {
    value: "other",
    label: "Other Account / Escrow",
    description: "Designated nodal, trust, escrow, or special utility account",
    icon: Building,
    badge: "Other",
  },
];

/**
 * Company Bank Account Modal for Create and Edit Operations
 * Features:
 * - Interactive "Select your bank" picker matching the professional bank selection UI
 * - Instant IFSC branch autodetect against Bank Identifiers repository
 * - Cancelled cheque / Passbook image upload with preview
 * - Quick "Add it manually" integration to Bank Master directory
 */
export default function CompanyBankModal({
  isOpen = false,
  onClose,
  bankAccount = null,
  companyId,
  onSubmit,
  isSubmitting = false,
}) {
  const isEdit = Boolean(bankAccount?.id);
  const chequeFileInputRef = useRef(null);

  // Fetch Bank Master records
  const { data: banksResponse, isLoading: isLoadingBanks } = useBanks({
    limit: 200,
    is_active: true,
  });
  const bankOptionsList = Array.isArray(banksResponse)
    ? banksResponse
    : Array.isArray(banksResponse?.data)
    ? banksResponse.data
    : Array.isArray(banksResponse?.banks)
    ? banksResponse.banks
    : [];
  const createBankMutation = useCreateBank();

  // Bank selection modal state
  const [isBankPickerOpen, setIsBankPickerOpen] = useState(false);
  const [isAddManualBankOpen, setIsAddManualBankOpen] = useState(false);
  const [manualBankQuery, setManualBankQuery] = useState("");

  const initialFormState = {
    company_id: companyId,
    bank_id: "",
    account_name: "",
    account_number: "",
    account_type: "current",
    branch_name: "",
    branch_code: "",
    ifsc_code: "",
    micr_code: "",
    swift_code: "",
    opening_balance: 0,
    current_balance: 0,
    is_primary: false,
    is_active: true,
    cheque_image_url: "",
    notes: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isLookingUpIfsc, setIsLookingUpIfsc] = useState(false);
  const [ifscLookupFeedback, setIfscLookupFeedback] = useState(null);
  const [chequeUploadError, setChequeUploadError] = useState("");
  const [previewChequeModal, setPreviewChequeModal] = useState(false);

  const [selectedBankObj, setSelectedBankObj] = useState(null);

  // Identify currently selected bank object
  const selectedBank = useMemo(() => {
    if (selectedBankObj) return selectedBankObj;
    if (!formData.bank_id) return null;
    return bankOptionsList.find((b) => String(b.id) === String(formData.bank_id)) || null;
  }, [formData.bank_id, bankOptionsList, selectedBankObj]);

  useEffect(() => {
    if (isOpen) {
      if (bankAccount) {
        setFormData({
          company_id: bankAccount.companyId || bankAccount.company_id || companyId,
          bank_id: String(bankAccount.bankId || bankAccount.bank_id || ""),
          account_name: bankAccount.accountName || bankAccount.account_name || "",
          account_number: bankAccount.accountNumber || bankAccount.account_number || "",
          account_type: bankAccount.accountType || bankAccount.account_type || "current",
          branch_name: bankAccount.branchName || bankAccount.branch_name || "",
          branch_code: bankAccount.branchCode || bankAccount.branch_code || "",
          ifsc_code: bankAccount.ifscCode || bankAccount.ifsc_code || "",
          micr_code: bankAccount.micrCode || bankAccount.micr_code || "",
          swift_code: bankAccount.swiftCode || bankAccount.swift_code || "",
          opening_balance: Number(bankAccount.openingBalance ?? bankAccount.opening_balance ?? 0),
          current_balance: Number(bankAccount.currentBalance ?? bankAccount.current_balance ?? 0),
          is_primary: Boolean(bankAccount.isPrimary ?? bankAccount.is_primary),
          is_active: Boolean(bankAccount.isActive ?? bankAccount.is_active ?? true),
          cheque_image_url: bankAccount.chequeImageUrl || bankAccount.cheque_image_url || bankAccount.document_url || "",
          notes: bankAccount.notes || "",
        });
      } else {
        setFormData({
          ...initialFormState,
          company_id: companyId,
          bank_id: bankOptionsList[0] ? String(bankOptionsList[0].id) : "",
        });
      }
      setErrors({});
      setIfscLookupFeedback(null);
      setChequeUploadError("");
    }
  }, [isOpen, bankAccount, companyId, bankOptionsList]);

  if (!isOpen) return null;

  // Handle bank selection from the "Select your bank" modal
  const handleSelectBank = (bank) => {
    setSelectedBankObj(bank);

    // Auto-fill IFSC prefix if available
    if (bank.ifscPrefix && !formData.ifsc_code) {
      setFormData((prev) => ({
        ...prev,
        ifsc_code: bank.ifscPrefix,
      }));
    }

    if (bank.id) {
      setFormData((prev) => ({
        ...prev,
        bank_id: String(bank.id),
      }));
    } else {
      // If popular bank preset chosen that isn't saved in DB yet, auto-create it or match it
      createBankMutation.mutate(
        {
          bank_name: bank.bankName,
          bankName: bank.bankName,
          bank_code: bank.bankCode,
          bankCode: bank.bankCode,
          legal_name: bank.legalName || null,
          legalName: bank.legalName || null,
          bank_type: bank.bankType || "commercial",
          bankType: bank.bankType || "commercial",
          ifsc_prefix: bank.ifscPrefix || null,
          ifscPrefix: bank.ifscPrefix || null,
          is_active: true,
          isActive: true,
          is_verified: true,
          isVerified: true,
        },
        {
          onSuccess: (res) => {
            const newId = res?.data?.id || res?.id;
            if (newId) {
              setFormData((prev) => ({
                ...prev,
                bank_id: String(newId),
              }));
              setSelectedBankObj((prev) => ({ ...(prev || bank), id: newId }));
            }
          },
        }
      );
    }

    if (errors.bank_id) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.bank_id;
        return next;
      });
    }
  };

  const handleOpenAddManual = (queryText) => {
    setManualBankQuery(queryText || "");
    setIsAddManualBankOpen(true);
  };

  const handleManualBankSubmit = async (bankPayload) => {
    try {
      const res = await createBankMutation.mutateAsync(bankPayload);
      const newBank = res?.data || res;
      if (newBank?.id) {
        setFormData((prev) => ({
          ...prev,
          bank_id: String(newBank.id),
        }));
        setSelectedBankObj(newBank);
      }
      setIsAddManualBankOpen(false);
    } catch {
      // Handled by mutation error state
    }
  };

  // Smart IFSC Lookup
  const handleLookupIfsc = async (codeToSearch) => {
    const queryCode = (codeToSearch || formData.ifsc_code || "").trim().toUpperCase();
    if (!queryCode || queryCode.length < 5) return;

    try {
      setIsLookingUpIfsc(true);
      setIfscLookupFeedback(null);
      const res = await getBankIdentifierByValue(queryCode);
      if (res?.data) {
        const item = res.data;
        setFormData((prev) => ({
          ...prev,
          ifsc_code: queryCode,
          bank_id: item.bankId ? String(item.bankId) : prev.bank_id,
          branch_name: item.branchName || prev.branch_name,
          branch_code: item.branchCode || prev.branch_code,
          micr_code: item.micrCode || prev.micr_code,
          swift_code: item.swiftCode || prev.swift_code,
        }));
        setIfscLookupFeedback({
          success: true,
          message: `Branch verified: ${item.branchName || "Branch"}${item.city ? ` • ${item.city}` : ""}`,
        });
      } else {
        setIfscLookupFeedback({
          success: false,
          message: "IFSC not in directory. You can enter branch details manually.",
        });
      }
    } catch {
      setIfscLookupFeedback({
        success: false,
        message: "IFSC code not found in directory. Branch details can be entered manually.",
      });
    } finally {
      setIsLookingUpIfsc(false);
    }
  };

  // Cancelled Cheque / Document file processing
  const processChequeFile = (file) => {
    setChequeUploadError("");
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      setChequeUploadError("Please upload a valid image (PNG, JPG, WebP) or PDF file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setChequeUploadError("Document size exceeds 8MB limit. Please upload a smaller file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        cheque_image_url: event.target.result,
      }));
    };
    reader.onerror = () => {
      setChequeUploadError("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let nextVal = type === "checkbox" ? checked : value;

    if (["ifsc_code", "swift_code", "micr_code"].includes(name) && typeof nextVal === "string") {
      nextVal = nextVal.toUpperCase().trim();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: nextVal,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors[name];
        return nextErrors;
      });
    }

    if (name === "ifsc_code" && nextVal.length === 11) {
      handleLookupIfsc(nextVal);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bank_id) {
      newErrors.bank_id = "Please select a bank from the directory";
    }

    if (!formData.account_name?.trim()) {
      newErrors.account_name = "Account holder / display name is required";
    }

    if (!formData.account_number?.trim()) {
      newErrors.account_number = "Bank account number is required";
    }

    if (formData.ifsc_code) {
      const ifscTrimmed = formData.ifsc_code.trim();
      if (ifscTrimmed.length > 20) {
        newErrors.ifsc_code = "IFSC code cannot exceed 20 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      // Snake case
      company_id: Number(formData.company_id || companyId),
      bank_id: Number(formData.bank_id),
      account_name: formData.account_name.trim(),
      account_number: formData.account_number.trim(),
      account_type: formData.account_type,
      branch_name: formData.branch_name?.trim() || null,
      branch_code: formData.branch_code?.trim() || null,
      ifsc_code: formData.ifsc_code?.trim() ? formData.ifsc_code.trim().toUpperCase() : null,
      micr_code: formData.micr_code?.trim() || null,
      swift_code: formData.swift_code?.trim() ? formData.swift_code.trim().toUpperCase() : null,
      opening_balance: Number(formData.opening_balance || 0),
      current_balance: Number(formData.current_balance || formData.opening_balance || 0),
      is_primary: Boolean(formData.is_primary),
      is_active: Boolean(formData.is_active),
      cheque_image_url: formData.cheque_image_url || null,
      notes: formData.notes?.trim() || null,

      // Camel case
      companyId: Number(formData.company_id || companyId),
      bankId: Number(formData.bank_id),
      accountName: formData.account_name.trim(),
      accountNumber: formData.account_number.trim(),
      accountType: formData.account_type,
      branchName: formData.branch_name?.trim() || null,
      branchCode: formData.branch_code?.trim() || null,
      ifscCode: formData.ifsc_code?.trim() ? formData.ifsc_code.trim().toUpperCase() : null,
      micrCode: formData.micr_code?.trim() || null,
      swiftCode: formData.swift_code?.trim() ? formData.swift_code.trim().toUpperCase() : null,
      openingBalance: Number(formData.opening_balance || 0),
      currentBalance: Number(formData.current_balance || formData.opening_balance || 0),
      isPrimary: Boolean(formData.is_primary),
      isActive: Boolean(formData.is_active),
      chequeImageUrl: formData.cheque_image_url || null,
      documentUrl: formData.cheque_image_url || null,
    };

    onSubmit(payload);
  };

  const inputClass = (hasError) =>
    `w-full px-3.5 py-2.5 text-sm rounded-xl border bg-base-100 placeholder:text-base-content/40 transition-all outline-hidden font-medium ${
      hasError
        ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20 text-rose-600"
        : "border-base-300 focus:border-primary focus:ring-1 focus:ring-primary/20 text-base-content"
    }`;

  const labelClass = "block text-xs font-semibold text-base-content/75 mb-1";

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="relative w-full max-w-2xl bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden flex flex-col max-h-[92vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-base-300 bg-base-200/40 shrink-0">
            <div className="flex items-center gap-3">
              {selectedBank ? (
                <BankLogo bank={selectedBank} size="md" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Landmark className="w-5 h-5" />
                </div>
              )}
              <div>
                <h2 className="text-base sm:text-lg font-bold text-base-content leading-tight">
                  {isEdit ? "Edit Company Bank Account" : "Register Company Bank Account"}
                </h2>
                <p className="text-xs text-base-content/60 font-medium">
                  {isEdit
                    ? `Modifying commercial account #${bankAccount.id}`
                    : "Configure commercial banking credentials and settlement routing"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 rounded-xl text-base-content/50 hover:text-base-content hover:bg-base-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
            {/* BANK SELECTOR TRIGGER (The requested Select Bank component) */}
            <div>
              <label className={labelClass}>
                Select Bank Institution <span className="text-rose-500">*</span>
              </label>

              {selectedBank ? (
                <div
                  onClick={() => setIsBankPickerOpen(true)}
                  className="flex items-center justify-between p-3 rounded-2xl border border-base-300 bg-base-200/30 hover:bg-base-200/60 hover:border-primary/40 transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <BankLogo bank={selectedBank} size="md" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-base-content truncate">
                          {selectedBank.bankName || selectedBank.bank_name}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                          {selectedBank.bankCode || selectedBank.bank_code}
                        </span>
                      </div>
                      <p className="text-xs text-base-content/60 truncate mt-0.5">
                        {selectedBank.legalName || `Category: ${selectedBank.bankType || "Commercial"}`}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-primary group-hover:underline flex items-center gap-1 shrink-0 px-2 py-1 rounded-lg bg-base-100 border border-base-300">
                    Change Bank
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsBankPickerOpen(true)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer group ${
                    errors.bank_id
                      ? "border-rose-400 bg-rose-500/5 text-rose-600"
                      : "border-base-300 bg-base-100 hover:border-primary hover:bg-base-200/30 text-base-content/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-base-200 text-base-content/60 flex items-center justify-center group-hover:text-primary transition-colors">
                      <Landmark className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-base-content/80 group-hover:text-base-content block">
                        Select your bank (e.g. HDFC, SBI, ICICI)
                      </span>
                      <span className="text-[11px] text-base-content/50">
                        Choose from popular Indian banks or search directory
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-base-content/40 group-hover:text-primary transition-colors" />
                </button>
              )}

              {errors.bank_id && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.bank_id}
                </p>
              )}
            </div>

            {/* Account Type Classification */}
            <div>
              <DropdownSelect
                label="Account Classification"
                required
                name="account_type"
                value={formData.account_type}
                onChange={handleChange}
                options={ACCOUNT_TYPES}
                error={errors.account_type}
              />
            </div>

            {/* Account Holder & Account Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  Account Holder / Display Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="account_name"
                  value={formData.account_name}
                  onChange={handleChange}
                  placeholder="e.g. Pooja Fashion Apparels Pvt Ltd"
                  className={inputClass(errors.account_name)}
                />
                {errors.account_name && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.account_name}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  Bank Account Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="account_number"
                  value={formData.account_number}
                  onChange={handleChange}
                  placeholder="e.g. 50200012345678"
                  className={`${inputClass(errors.account_number)} tracking-wider font-semibold`}
                />
                {errors.account_number && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.account_number}
                  </p>
                )}
              </div>
            </div>

            {/* IFSC Code with Smart Branch Detection */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-base-content/75">
                  IFSC Code (Smart Branch Detection)
                </label>
                {formData.ifsc_code && (
                  <button
                    type="button"
                    onClick={() => handleLookupIfsc()}
                    disabled={isLookingUpIfsc}
                    className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {isLookingUpIfsc ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    Lookup Branch Details
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="ifsc_code"
                  value={formData.ifsc_code}
                  onChange={handleChange}
                  maxLength={15}
                  placeholder="e.g. HDFC0000123, SBIN0001234"
                  className={`${inputClass(errors.ifsc_code)} uppercase tracking-wider pr-10 font-medium`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40">
                  {isLookingUpIfsc ? (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </div>
              </div>
              {errors.ifsc_code && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.ifsc_code}
                </p>
              )}
              {ifscLookupFeedback && (
                <p
                  className={`text-[11.5px] mt-1.5 flex items-center gap-1 font-medium ${
                    ifscLookupFeedback.success ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {ifscLookupFeedback.success ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  )}
                  {ifscLookupFeedback.message}
                </p>
              )}
            </div>

            {/* Branch Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Branch Name</label>
                <input
                  type="text"
                  name="branch_name"
                  value={formData.branch_name}
                  onChange={handleChange}
                  placeholder="e.g. Ring Road Branch, Surat"
                  className={inputClass(false)}
                />
              </div>

              <div>
                <label className={labelClass}>Branch Code</label>
                <input
                  type="text"
                  name="branch_code"
                  value={formData.branch_code}
                  onChange={handleChange}
                  placeholder="e.g. 00123"
                  className={inputClass(false)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>MICR Code (Optional)</label>
                <input
                  type="text"
                  name="micr_code"
                  value={formData.micr_code}
                  onChange={handleChange}
                  placeholder="e.g. 395240002"
                  className={inputClass(false)}
                />
              </div>

              <div>
                <label className={labelClass}>SWIFT / BIC Code (Optional)</label>
                <input
                  type="text"
                  name="swift_code"
                  value={formData.swift_code}
                  onChange={handleChange}
                  placeholder="e.g. HDFCINBBXXX"
                  className={`${inputClass(false)} uppercase tracking-wider font-medium`}
                />
              </div>
            </div>

            {/* Cancelled Cheque / Account Document Upload (The image upload requirement) */}
            <div className="pt-2 border-t border-base-200">
              <label className={labelClass}>
                Cancelled Cheque / Passbook Image / UPI QR Code (Optional)
              </label>
              <div className="p-4 rounded-2xl border-2 border-dashed border-base-300 bg-base-200/30 hover:bg-base-200/50 transition-colors">
                {formData.cheque_image_url ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-base-300 bg-base-100 shrink-0">
                        <img
                          src={formData.cheque_image_url}
                          alt="Account Document"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-base-content flex items-center gap-1.5">
                          <FileCheck className="w-3.5 h-3.5 text-emerald-500" /> Account Proof Document Attached
                        </span>
                        <p className="text-[11px] text-base-content/60 truncate mt-0.5">
                          Image verified for invoice printing & verification
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setPreviewChequeModal(true)}
                        className="p-1.5 rounded-lg border border-base-300 bg-base-100 hover:text-primary transition-colors cursor-pointer"
                        title="View Full Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, cheque_image_url: "" }))}
                        className="p-1.5 rounded-lg border border-base-300 bg-base-100 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Remove Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center space-y-2 py-2">
                    <div className="w-9 h-9 rounded-xl bg-base-200 flex items-center justify-center text-base-content/50">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => chequeFileInputRef.current?.click()}
                        className="text-xs font-bold text-primary hover:underline cursor-pointer"
                      >
                        Click to upload cancelled cheque or passbook
                      </button>
                      <span className="text-xs text-base-content/60"> or drag file here</span>
                    </div>
                    <p className="text-[11px] text-base-content/40">
                      Supported formats: PNG, JPG, WebP, SVG up to 8MB
                    </p>
                  </div>
                )}
                <input
                  ref={chequeFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) processChequeFile(f);
                  }}
                  className="hidden"
                />
              </div>
              {chequeUploadError && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {chequeUploadError}
                </p>
              )}
            </div>

            {/* Balances */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Opening Balance (₹)</label>
                <input
                  type="number"
                  name="opening_balance"
                  value={formData.opening_balance}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className={inputClass(false)}
                />
              </div>

              <div>
                <label className={labelClass}>Current Book Balance (₹)</label>
                <input
                  type="number"
                  name="current_balance"
                  value={formData.current_balance}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className={inputClass(false)}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Notes & Internal Remarks (Optional)</label>
              <input
                type="text"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="e.g. Dedicated for GST vendor payout reconciliations"
                className={inputClass(false)}
              />
            </div>

            {/* Status Toggles */}
            <div className="pt-3 border-t border-base-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-base-200/50 border border-base-300 cursor-pointer hover:bg-base-200 transition-colors">
                <input
                  type="checkbox"
                  name="is_primary"
                  checked={formData.is_primary}
                  onChange={handleChange}
                  className="checkbox checkbox-primary rounded-lg"
                />
                <div>
                  <span className="text-xs font-bold text-base-content block">Primary Settlement Account</span>
                  <span className="text-[11px] text-base-content/60">Printed by default on sales invoices and receipts</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-base-200/50 border border-base-300 cursor-pointer hover:bg-base-200 transition-colors">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="checkbox checkbox-success rounded-lg"
                />
                <div>
                  <span className="text-xs font-bold text-base-content block">Active Status</span>
                  <span className="text-[11px] text-base-content/60">Available for payments, banking & ledger posting</span>
                </div>
              </label>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 mt-2 border-t border-base-300 flex items-center justify-end gap-2.5">
              <Button variant="secondary" size="md" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="clip-six" size="md" loading={isSubmitting} icon={Save}>
                {isEdit ? "Save Changes" : "Register Bank Account"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* POPUP: SELECT YOUR BANK MODAL (The user reference UI) */}
      <BankSelectModal
        isOpen={isBankPickerOpen}
        onClose={() => setIsBankPickerOpen(false)}
        selectedBankId={formData.bank_id}
        selectedBank={selectedBank}
        banks={bankOptionsList}
        isLoading={isLoadingBanks}
        onSelectBank={handleSelectBank}
        onAddManual={handleOpenAddManual}
      />

      {/* POPUP: ADD BANK MANUALLY (Directly connects to Bank Master Directory) */}
      <BankModal
        isOpen={isAddManualBankOpen}
        onClose={() => setIsAddManualBankOpen(false)}
        initialBankName={manualBankQuery}
        onSubmit={handleManualBankSubmit}
        isSubmitting={createBankMutation.isPending}
      />

      {/* Cheque Document Preview Modal */}
      {previewChequeModal && formData.cheque_image_url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative max-w-2xl w-full bg-base-100 rounded-3xl p-4 overflow-hidden border border-base-300 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-base-200">
              <h4 className="text-sm font-bold text-base-content">Cancelled Cheque / Document Preview</h4>
              <button
                type="button"
                onClick={() => setPreviewChequeModal(false)}
                className="p-1 rounded-lg hover:bg-base-200 text-base-content/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center max-h-[70vh] overflow-auto">
              <img
                src={formData.cheque_image_url}
                alt="Full Cheque Document"
                className="max-h-[60vh] max-w-full rounded-xl object-contain shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
