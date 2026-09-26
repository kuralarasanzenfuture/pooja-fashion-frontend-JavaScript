import React, { useState } from "react";
import {
  MapPin,
  Plus,
  Star,
  Copy,
  Check,
  Edit2,
  Trash2,
  Power,
  Building,
  Building2,
  FileText,
  Package,
  Navigation,
} from "lucide-react";
import { Button } from "../../../common/components/ui/buttons/index.js";
import {
  useCompanyAddressesByCompany,
  useCreateCompanyAddress,
  useUpdateCompanyAddress,
  useUpdateCompanyAddressStatus,
  useSetPrimaryCompanyAddress,
  useDeleteCompanyAddress,
} from "../hooks/useCompanyAddresses.js";
import CompanyAddressModal from "./CompanyAddressModal.jsx";
import CompanyAddressDeleteModal from "./CompanyAddressDeleteModal.jsx";

const ADDRESS_TYPE_CONFIG = {
  registered: {
    label: "Registered Office",
    icon: Building2,
    badgeClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
  head_office: {
    label: "Headquarters (HQ)",
    icon: Building,
    badgeClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  },
  billing: {
    label: "Billing & Accounts",
    icon: FileText,
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  warehouse: {
    label: "Warehouse & Hub",
    icon: Package,
    badgeClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  },
  other: {
    label: "Branch / Establishment",
    icon: MapPin,
    badgeClass: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  },
};

/**
 * Company Addresses Tab Component for CompanyViewPage
 * Formatted with professional enterprise typography matching the application theme.
 */
export default function CompanyAddressesTab({ companyId, companyName }) {
  const { data: addressesResponse, isLoading } = useCompanyAddressesByCompany(companyId);
  const addresses = addressesResponse?.data || [];

  const createMutation = useCreateCompanyAddress();
  const updateMutation = useUpdateCompanyAddress();
  const statusMutation = useUpdateCompanyAddressStatus();
  const primaryMutation = useSetPrimaryCompanyAddress();
  const deleteMutation = useDeleteCompanyAddress();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deletingAddress, setDeletingAddress] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyAddress = (addr) => {
    const formatted = [
      addr.addressLine1 || addr.address_line_1,
      addr.addressLine2 || addr.address_line_2,
      addr.landmark,
      [addr.city, addr.district, addr.state, addr.postalCode || addr.postal_code].filter(Boolean).join(", "),
      addr.country || "India",
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(formatted);
    setCopiedId(addr.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenCreate = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr) => {
    setEditingAddress(addr);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (editingAddress?.id) {
      await updateMutation.mutateAsync({ id: editingAddress.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleToggleStatus = async (addr) => {
    const currentActive = Boolean(addr.isActive ?? addr.is_active);
    await statusMutation.mutateAsync({ id: addr.id, isActive: !currentActive });
  };

  const handleSetPrimary = async (addr) => {
    await primaryMutation.mutateAsync(addr.id);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAddress?.id) return;
    await deleteMutation.mutateAsync({ id: deletingAddress.id, companyId });
    setDeletingAddress(null);
  };

  if (isLoading) {
    return (
      <div className="py-14 flex flex-col items-center justify-center space-y-3">
        <span className="loading loading-spinner loading-md text-primary"></span>
        <p className="text-xs text-base-content/60 font-medium">Loading registered addresses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-base-content tracking-tight mb-1">
            Registered Addresses & Branch Facilities
          </h3>
          <p className="text-xs sm:text-sm text-base-content/65 font-normal">
            Physical premises, official registered offices, warehouse distribution hubs, and billing destinations.
          </p>
        </div>

        <Button
          variant="clip-six"
          size="sm"
          icon={Plus}
          onClick={handleOpenCreate}
        >
          Add Address
        </Button>
      </div>

      {/* Address Cards Grid */}
      {addresses.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-base-200/40 border border-base-300 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-xs">
            <MapPin className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h4 className="text-base font-extrabold text-base-content">No Addresses Registered</h4>
            <p className="text-xs text-base-content/65 leading-relaxed">
              There are no physical or registered addresses recorded for {companyName || "this company"}. Add the registered office or primary billing address now.
            </p>
          </div>
          <Button variant="primary" size="md" icon={Plus} onClick={handleOpenCreate}>
            Register First Address
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {addresses.map((addr) => {
            const isPrimary = Boolean(addr.isPrimary ?? addr.is_primary);
            const isActive = Boolean(addr.isActive ?? addr.is_active);
            const typeKey = (addr.addressType || addr.address_type || "other").toLowerCase();
            const typeInfo = ADDRESS_TYPE_CONFIG[typeKey] || ADDRESS_TYPE_CONFIG.other;
            const TypeIcon = typeInfo.icon;

            return (
              <div
                key={addr.id}
                className={`relative rounded-3xl p-5 sm:p-6 border transition-all duration-200 flex flex-col justify-between ${
                  isPrimary
                    ? "bg-base-100 border-primary/40 shadow-sm ring-1 ring-primary/20"
                    : "bg-base-100/70 border-base-300 hover:border-base-content/25 hover:shadow-xs"
                } ${!isActive ? "opacity-70 bg-base-200/40" : ""}`}
              >
                {/* Header row of card */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold tracking-wide border ${typeInfo.badgeClass}`}
                      >
                        <TypeIcon className="w-3.5 h-3.5" />
                        {typeInfo.label}
                      </span>

                      {isPrimary && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
                          <Star className="w-3 h-3 fill-current" /> Primary Official
                        </span>
                      )}

                      {!isActive && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          Inactive
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyAddress(addr)}
                      className="p-1.5 rounded-xl text-base-content/50 hover:text-primary hover:bg-base-200 transition-colors cursor-pointer"
                      title="Copy formatted address"
                    >
                      {copiedId === addr.id ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Address Body */}
                  <div className="space-y-1.5">
                    <h4 className="text-sm sm:text-base font-bold text-base-content leading-snug">
                      {addr.addressLine1 || addr.address_line_1}
                    </h4>

                    {(addr.addressLine2 || addr.address_line_2) && (
                      <p className="text-xs text-base-content/75 font-normal">
                        {addr.addressLine2 || addr.address_line_2}
                      </p>
                    )}

                    {addr.landmark && (
                      <p className="text-xs text-base-content/60 italic flex items-center gap-1 pt-0.5">
                        <Navigation className="w-3 h-3 shrink-0 text-base-content/40" />
                        <span>Ref: {addr.landmark}</span>
                      </p>
                    )}

                    <div className="pt-2 text-xs font-medium text-base-content/85 flex items-center gap-1.5 flex-wrap">
                      <span>
                        {[addr.city, addr.district, addr.state].filter(Boolean).join(", ")}
                      </span>
                      {(addr.postalCode || addr.postal_code) && (
                        <span className="font-semibold px-2 py-0.5 rounded-md bg-base-200 border border-base-300 text-base-content/80 text-[11.5px]">
                          {addr.postalCode || addr.postal_code}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] font-semibold text-base-content/50 uppercase tracking-wider pt-0.5">
                      {addr.country || "India"}
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-4 mt-5 border-t border-base-300 flex items-center justify-between gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-3">
                    {!isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(addr)}
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5" /> Set as Primary
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(addr)}
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
                      onClick={() => handleOpenEdit(addr)}
                      className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-base-content/75 hover:text-primary bg-base-200/80 hover:bg-primary/10 border border-base-300 hover:border-primary/30 transition-all duration-150 cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
                      title="Edit Address Details"
                    >
                      <Edit2 className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingAddress(addr)}
                      className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-600 hover:text-white border border-rose-500/20 hover:border-rose-600 transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs hover:scale-[1.02] active:scale-[0.98]"
                      title="Delete this address"
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

      {/* Address Create / Edit Modal */}
      <CompanyAddressModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAddress(null);
        }}
        address={editingAddress}
        companyId={companyId}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <CompanyAddressDeleteModal
        isOpen={Boolean(deletingAddress)}
        onClose={() => setDeletingAddress(null)}
        address={deletingAddress}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
