import React, { useState } from "react";
import {
  X,
  Landmark,
  Plus,
  Copy,
  Check,
  Edit2,
  Trash2,
  Save,
  AlertCircle,
  Hash,
  MapPin,
  Building,
} from "lucide-react";
import { Button } from "../../../common/components/ui/buttons/index.js";
import { DropdownSelect } from "../../../common/components/ui/select/index.js";
import {
  useBankIdentifiersByBank,
  useCreateBankIdentifier,
  useUpdateBankIdentifier,
  useDeleteBankIdentifier,
} from "../../company/hooks/useBankIdentifiers.js";

const IDENTIFIER_TYPES = [
  { value: "IFSC", label: "IFSC Code", badge: "IFSC", description: "Indian Financial System Code (RTGS / NEFT)" },
  { value: "MICR", label: "MICR Code", badge: "MICR", description: "Magnetic Ink Character Recognition (Cheque Clearing)" },
  { value: "SWIFT", label: "SWIFT / BIC", badge: "SWIFT", description: "Society for Worldwide Interbank Financial Telecommunication" },
  { value: "BRANCH_CODE", label: "Branch Code", badge: "Branch", description: "Internal bank branch numbering identifier" },
];

export default function BankIdentifiersModal({
  isOpen = false,
  onClose,
  bank = null,
}) {
  if (!isOpen || !bank) return null;

  const { data: identifiersResponse, isLoading } = useBankIdentifiersByBank(bank.id);
  const identifiers = identifiersResponse?.data || [];

  const createMutation = useCreateBankIdentifier();
  const updateMutation = useUpdateBankIdentifier();
  const deleteMutation = useDeleteBankIdentifier();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const initialFormState = {
    bank_id: bank.id,
    identifier_type: "IFSC",
    identifier_value: "",
    branch_name: "",
    branch_code: "",
    city: "",
    state: "",
    address: "",
    is_active: true,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(key);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      ...initialFormState,
      bank_id: bank.id,
      identifier_value: bank.ifscPrefix ? `${bank.ifscPrefix}0` : "",
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      bank_id: bank.id,
      identifier_type: item.identifierType || item.identifier_type || "IFSC",
      identifier_value: item.identifierValue || item.identifier_value || "",
      branch_name: item.branchName || item.branch_name || "",
      branch_code: item.branchCode || item.branch_code || "",
      city: item.city || "",
      state: item.state || "",
      address: item.address || "",
      is_active: Boolean(item.isActive ?? item.is_active ?? true),
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let nextVal = type === "checkbox" ? checked : value;

    if (["identifier_value", "branch_code"].includes(name) && typeof nextVal === "string") {
      nextVal = nextVal.toUpperCase().trim();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: nextVal,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.identifier_value?.trim()) {
      errs.identifier_value = "Identifier code value is required (e.g. HDFC0000123)";
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      bank_id: Number(bank.id),
      identifier_type: formData.identifier_type,
      identifier_value: formData.identifier_value.trim().toUpperCase(),
      branch_name: formData.branch_name?.trim() || null,
      branch_code: formData.branch_code?.trim() || null,
      city: formData.city?.trim() || null,
      state: formData.state?.trim() || null,
      address: formData.address?.trim() || null,
      is_active: Boolean(formData.is_active),
    };

    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }

    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    await deleteMutation.mutateAsync(id);
    setDeletingId(null);
  };

  const inputClass = (hasError) =>
    `w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border bg-base-100 placeholder:text-base-content/40 transition-all outline-hidden font-medium ${
      hasError
        ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20 text-rose-600"
        : "border-base-300 focus:border-primary focus:ring-1 focus:ring-primary/20 text-base-content"
    }`;

  const labelClass = "block text-xs font-semibold text-base-content/70 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-300 bg-base-200/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-base-content leading-tight">
                  Branch Clearing Codes & Identifiers
                </h2>
                <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  {bank.bankCode}
                </span>
              </div>
              <p className="text-xs text-base-content/60 font-medium">
                {bank.bankName} • Branch routing repository (IFSC / MICR / SWIFT)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-base-content/50 hover:text-base-content hover:bg-base-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Action Row */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
                Registered Codes ({identifiers.length})
              </span>
            </div>
            {!isFormOpen && (
              <Button
                variant="clip-six"
                size="sm"
                icon={Plus}
                onClick={handleOpenAdd}
              >
                Add Identifier
              </Button>
            )}
          </div>

          {/* Add / Edit Inline Card */}
          {isFormOpen && (
            <form onSubmit={handleSubmit} className="p-4 sm:p-5 rounded-2xl bg-base-200/60 border border-base-300 space-y-4">
              <div className="flex items-center justify-between border-b border-base-300/80 pb-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-base-content">
                  {editingId ? "Edit Branch Identifier" : "Register Branch Identifier"}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="text-xs text-base-content/60 hover:text-base-content font-medium cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <DropdownSelect
                    label="Identifier Type"
                    required
                    name="identifier_type"
                    value={formData.identifier_type}
                    onChange={handleChange}
                    options={IDENTIFIER_TYPES}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Code Value <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="identifier_value"
                    value={formData.identifier_value}
                    onChange={handleChange}
                    placeholder="e.g. SBIN0001234"
                    className={`${inputClass(formErrors.identifier_value)} uppercase tracking-wider font-semibold`}
                  />
                  {formErrors.identifier_value && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" /> {formErrors.identifier_value}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Branch Name</label>
                  <input
                    type="text"
                    name="branch_name"
                    value={formData.branch_name}
                    onChange={handleChange}
                    placeholder="e.g. Textile Market Branch"
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
                    placeholder="e.g. 001234"
                    className={inputClass(false)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Surat"
                    className={inputClass(false)}
                  />
                </div>

                <div>
                  <label className={labelClass}>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Gujarat"
                    className={inputClass(false)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="checkbox checkbox-success checkbox-sm rounded-md"
                  />
                  <span className="text-xs font-semibold text-base-content">Active for clearing</span>
                </label>

                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setIsFormOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="clip-six"
                    size="sm"
                    loading={createMutation.isPending || updateMutation.isPending}
                    icon={Save}
                  >
                    {editingId ? "Update Code" : "Save Code"}
                  </Button>
                </div>
              </div>
            </form>
          )}

          {/* Table of Identifiers */}
          {isLoading ? (
            <div className="py-10 text-center space-y-2">
              <span className="loading loading-spinner loading-md text-primary"></span>
              <p className="text-xs text-base-content/60">Loading branch routing records...</p>
            </div>
          ) : identifiers.length === 0 ? (
            <div className="p-8 rounded-2xl bg-base-200/40 border border-base-300 text-center space-y-2">
              <p className="text-xs text-base-content/60">
                No branch identifiers (IFSC/MICR) registered for {bank.bankName} yet.
              </p>
              <Button variant="secondary" size="sm" icon={Plus} onClick={handleOpenAdd}>
                Register Branch Clearing Code
              </Button>
            </div>
          ) : (
            <div className="bg-base-100 rounded-xl border border-base-300 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-base-300 bg-base-200/40 text-[11px] font-semibold uppercase tracking-wide text-base-content/60">
                      <th className="py-2.5 px-4">Type</th>
                      <th className="py-2.5 px-4">Identifier Code</th>
                      <th className="py-2.5 px-4">Branch Details</th>
                      <th className="py-2.5 px-4">Location</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-200 text-sm">
                    {identifiers.map((item) => {
                      const isDeletingThis = deletingId === item.id;
                      const isActive = item.isActive ?? item.is_active ?? true;

                      return (
                        <tr key={item.id} className="hover:bg-base-200/50 transition-colors">
                          {/* Type */}
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-primary/10 text-primary border border-primary/20">
                              {item.identifierType || item.identifier_type}
                            </span>
                          </td>

                          {/* Code */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-base-content text-xs sm:text-sm tracking-wide">
                                {item.identifierValue || item.identifier_value}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopy(item.identifierValue || item.identifier_value, `id_${item.id}`)}
                                className="p-1 rounded text-base-content/40 hover:text-primary cursor-pointer"
                                title="Copy code"
                              >
                                {copiedId === `id_${item.id}` ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Branch */}
                          <td className="py-3 px-4">
                            <div className="text-xs">
                              <span className="font-medium text-base-content">
                                {item.branchName || item.branch_name || "Headquarters"}
                              </span>
                              {item.branchCode && (
                                <span className="text-base-content/50 ml-1">
                                  (#{item.branchCode})
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Location */}
                          <td className="py-3 px-4">
                            <span className="text-xs text-base-content/75 font-medium">
                              {[item.city, item.state].filter(Boolean).join(", ") || "—"}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4">
                            {isActive ? (
                              <span className="px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                Active
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                                Inactive
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(item)}
                                className="p-1.5 rounded-lg text-base-content/60 hover:text-primary hover:bg-base-200 transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {isDeletingThis ? (
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(item.id)}
                                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeletingId(null)}
                                    className="p-1 rounded-lg text-base-content/50 hover:bg-base-200 cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setDeletingId(item.id)}
                                  className="group inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-600 hover:text-white border border-rose-500/20 hover:border-rose-600 transition-all duration-150 cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
                                  title="Delete branch code"
                                >
                                  <Trash2 className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                                  <span>Delete</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-base-300 bg-base-200/50 flex items-center justify-end shrink-0">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
