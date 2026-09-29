import React, { useState } from "react";
import {
  UserCheck,
  User,
  Plus,
  Star,
  Copy,
  Check,
  Edit2,
  Trash2,
  Power,
  Briefcase,
  Mail,
  Phone,
  Smartphone,
  ShieldCheck,
  Calculator,
  TrendingUp,
  Headphones,
} from "lucide-react";
import { Button } from "../../../common/components/ui/buttons/index.js";
import {
  useCompanyContactsByCompany,
  useCreateCompanyContact,
  useUpdateCompanyContact,
  useUpdateCompanyContactStatus,
  useSetPrimaryCompanyContact,
  useDeleteCompanyContact,
} from "../hooks/useCompanyContacts.js";
import CompanyContactModal from "./CompanyContactModal.jsx";
import CompanyContactDeleteModal from "./CompanyContactDeleteModal.jsx";

const CONTACT_TYPE_CONFIG = {
  owner: {
    label: "Proprietor / MD",
    icon: ShieldCheck,
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  manager: {
    label: "Operations Manager",
    icon: Briefcase,
    badgeClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
  accountant: {
    label: "Finance & Accounts",
    icon: Calculator,
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  sales: {
    label: "Sales Executive",
    icon: TrendingUp,
    badgeClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  },
  support: {
    label: "Customer Support",
    icon: Headphones,
    badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  other: {
    label: "Associate",
    icon: User,
    badgeClass: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  },
};

/**
 * Company Contacts Tab Component for CompanyViewPage
 */
export default function CompanyContactsTab({ companyId, companyName }) {
  const { data: contactsResponse, isLoading } = useCompanyContactsByCompany(companyId);
  const contacts = contactsResponse?.data || [];

  const createMutation = useCreateCompanyContact();
  const updateMutation = useUpdateCompanyContact();
  const statusMutation = useUpdateCompanyContactStatus();
  const primaryMutation = useSetPrimaryCompanyContact();
  const deleteMutation = useDeleteCompanyContact();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [deletingContact, setDeletingContact] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyContact = (contact) => {
    const formatted = [
      contact.contactName || contact.contact_name,
      contact.designation,
      contact.mobile && `Mobile: ${contact.mobile}`,
      contact.phone && `Phone: ${contact.phone}`,
      contact.email && `Email: ${contact.email}`,
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(formatted);
    setCopiedId(contact.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenCreate = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (editingContact?.id) {
      await updateMutation.mutateAsync({ id: editingContact.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    setIsModalOpen(false);
    setEditingContact(null);
  };

  const handleToggleStatus = async (contact) => {
    const currentActive = Boolean(contact.isActive ?? contact.is_active);
    await statusMutation.mutateAsync({ id: contact.id, isActive: !currentActive });
  };

  const handleSetPrimary = async (contact) => {
    await primaryMutation.mutateAsync(contact.id);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingContact?.id) return;
    await deleteMutation.mutateAsync({ id: deletingContact.id, companyId });
    setDeletingContact(null);
  };

  if (isLoading) {
    return (
      <div className="py-14 flex flex-col items-center justify-center space-y-3">
        <span className="loading loading-spinner loading-md text-primary"></span>
        <p className="text-xs text-base-content/60 font-medium">Loading contact persons...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-base-content tracking-tight mb-1">
            Authorized Personnel & Departmental Contacts
          </h3>
          <p className="text-xs sm:text-sm text-base-content/65 font-normal">
            Key directors, operational managers, finance heads, and primary business liaisons.
          </p>
        </div>

        <Button
          variant="clip-six"
          size="sm"
          icon={Plus}
          onClick={handleOpenCreate}
        >
          Add Contact
        </Button>
      </div>

      {/* Contacts Cards Grid */}
      {contacts.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-base-200/40 border border-base-300 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-xs">
            <UserCheck className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h4 className="text-base font-extrabold text-base-content">No Contact Persons Recorded</h4>
            <p className="text-xs text-base-content/65 leading-relaxed">
              There are no key personnel registered for {companyName || "this company"}. Add the managing director, accounts lead, or sales coordinator now.
            </p>
          </div>
          <Button variant="primary" size="md" icon={Plus} onClick={handleOpenCreate}>
            Register First Contact
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {contacts.map((contact) => {
            const isPrimary = Boolean(contact.isPrimary ?? contact.is_primary);
            const isActive = Boolean(contact.isActive ?? contact.is_active);
            const typeKey = (contact.contactType || contact.contact_type || "other").toLowerCase();
            const typeInfo = CONTACT_TYPE_CONFIG[typeKey] || CONTACT_TYPE_CONFIG.other;
            const TypeIcon = typeInfo.icon;

            return (
              <div
                key={contact.id}
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
                          <Star className="w-3 h-3 fill-current" /> Primary Signatory
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
                      onClick={() => handleCopyContact(contact)}
                      className="p-1.5 rounded-xl text-base-content/50 hover:text-primary hover:bg-base-200 transition-colors cursor-pointer"
                      title="Copy contact card"
                    >
                      {copiedId === contact.id ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Contact Info Body */}
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-base font-extrabold text-base-content leading-snug">
                        {contact.contactName || contact.contact_name}
                      </h4>
                      {contact.designation && (
                        <p className="text-xs font-medium text-base-content/70">
                          {contact.designation}
                        </p>
                      )}
                    </div>

                    {/* Channels: Mobile, Phone, Email */}
                    <div className="pt-2 space-y-1.5 text-xs text-base-content/80">
                      {contact.mobile && (
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded-md bg-base-200 text-primary">
                            <Smartphone className="w-3.5 h-3.5" />
                          </span>
                          <a
                            href={`tel:${contact.mobile}`}
                            className="font-medium hover:text-primary hover:underline"
                          >
                            {contact.mobile}
                          </a>
                          <span className="text-[10px] text-base-content/40 uppercase font-semibold">Mobile</span>
                        </div>
                      )}

                      {contact.phone && (
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded-md bg-base-200 text-primary">
                            <Phone className="w-3.5 h-3.5" />
                          </span>
                          <a
                            href={`tel:${contact.phone}`}
                            className="font-medium hover:text-primary hover:underline"
                          >
                            {contact.phone}
                          </a>
                          <span className="text-[10px] text-base-content/40 uppercase font-semibold">Desk</span>
                        </div>
                      )}

                      {contact.email && (
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded-md bg-base-200 text-primary">
                            <Mail className="w-3.5 h-3.5" />
                          </span>
                          <a
                            href={`mailto:${contact.email}`}
                            className="font-medium hover:text-primary hover:underline truncate"
                          >
                            {contact.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-4 mt-5 border-t border-base-300 flex items-center justify-between gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-3">
                    {!isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(contact)}
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5" /> Set as Primary
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(contact)}
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
                      onClick={() => handleOpenEdit(contact)}
                      className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-base-content/75 hover:text-primary bg-base-200/80 hover:bg-primary/10 border border-base-300 hover:border-primary/30 transition-all duration-150 cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
                      title="Edit Contact Details"
                    >
                      <Edit2 className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingContact(contact)}
                      className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-600 hover:text-white border border-rose-500/20 hover:border-rose-600 transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs hover:scale-[1.02] active:scale-[0.98]"
                      title="Delete this contact"
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

      {/* Contact Create / Edit Modal */}
      <CompanyContactModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingContact(null);
        }}
        contact={editingContact}
        companyId={companyId}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <CompanyContactDeleteModal
        isOpen={Boolean(deletingContact)}
        onClose={() => setDeletingContact(null)}
        contact={deletingContact}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
