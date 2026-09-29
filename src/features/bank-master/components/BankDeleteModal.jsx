import React from "react";
import { AlertTriangle, Trash2, X, Landmark } from "lucide-react";
import { Button } from "../../../common/components/ui/buttons/index.js";

export default function BankDeleteModal({
  isOpen = false,
  onClose,
  bank = null,
  onConfirm,
  isDeleting = false,
}) {
  if (!isOpen || !bank) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-300 bg-rose-500/10">
          <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold leading-tight">Delete Bank Institution</h3>
              <p className="text-xs opacity-80">Permanent master removal</p>
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

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs sm:text-sm text-base-content/75 leading-relaxed">
            Are you sure you want to remove <strong className="text-base-content font-bold">{bank.bankName || bank.bank_name}</strong> ({bank.bankCode || bank.bank_code}) from the Bank Master directory?
          </p>

          <div className="p-4 rounded-2xl bg-base-200/60 border border-base-300 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-base-content font-semibold">
              <Landmark className="w-4 h-4 text-primary" />
              <span>{bank.bankName}</span>
              <span className="px-2 py-0.5 rounded-md bg-base-300 text-[10px] font-mono font-bold">
                {bank.bankCode}
              </span>
            </div>
            {bank.legalName && (
              <p className="text-base-content/60 text-[11px] truncate">
                Legal: {bank.legalName}
              </p>
            )}
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium pt-1 border-t border-base-300">
              Note: Deletion will be rejected by the server if active company accounts or clearing branch identifiers are attached to this bank.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-base-300 bg-base-200/50 flex items-center justify-end gap-2.5">
          <Button variant="secondary" size="md" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="group inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl text-white bg-rose-600 hover:bg-rose-700 active:scale-95 shadow-sm shadow-rose-600/30 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            <Trash2 className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>{isDeleting ? "Deleting..." : "Delete Institution"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
