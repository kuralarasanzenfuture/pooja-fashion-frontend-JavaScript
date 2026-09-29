import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Button } from "../../../common/components/ui/buttons/index.js";

/**
 * Company Contact Delete Confirmation Modal
 */
export default function CompanyContactDeleteModal({
  isOpen = false,
  onClose,
  contact = null,
  onConfirm,
  isDeleting = false,
}) {
  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden flex flex-col text-base-content">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-base-content/50 hover:text-base-content hover:bg-base-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 ring-8 ring-rose-500/10 flex items-center justify-center mx-auto shadow-sm">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-base-content">
              Delete Contact Person?
            </h3>
            <p className="text-xs sm:text-sm text-base-content/60 mt-1.5 leading-relaxed">
              Are you sure you want to remove this contact profile from the company directory?
            </p>
          </div>

          {/* Target Contact Card Preview */}
          <div className="p-4 rounded-2xl bg-base-200/60 border border-base-300 text-left text-xs space-y-1">
            <div className="font-bold text-base-content uppercase tracking-wider text-[11px] text-primary">
              {contact.contactType || contact.contact_type}
            </div>
            <div className="font-bold text-base-content text-sm">
              {contact.contactName || contact.contact_name}
            </div>
            {(contact.designation) && (
              <div className="text-base-content/70 font-medium text-xs">
                {contact.designation}
              </div>
            )}
            {(contact.mobile || contact.email) && (
              <div className="text-base-content/60 font-mono text-[11px] pt-1">
                {[contact.mobile, contact.email].filter(Boolean).join(" • ")}
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-left text-[11.5px] leading-relaxed">
            <strong>Note:</strong> This action cannot be undone. Any operational logs referencing this contact will display historical information.
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-base-300 bg-base-200/50 flex items-center justify-end gap-3">
          <Button variant="secondary" size="md" onClick={onClose} disabled={isDeleting}>
            Keep Contact
          </Button>
          <Button
            variant="danger"
            size="md"
            icon={Trash2}
            loading={isDeleting}
            onClick={onConfirm}
            className="shadow-md shadow-rose-600/25"
          >
            Confirm & Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
