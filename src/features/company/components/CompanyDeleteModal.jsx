import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Button } from "../../../common/components/ui/buttons/index.js";

/**
 * Company Delete Confirmation Modal
 */
export default function CompanyDeleteModal({
  isOpen = false,
  onClose,
  company = null,
  onConfirm,
  isDeleting = false,
}) {
  if (!isOpen || !company) return null;

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
          <div className="w-14 h-14 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center mx-auto shadow-xs">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-lg font-black text-base-content">
              Delete Company Enterprise?
            </h3>
            <p className="text-xs text-base-content/60 mt-1.5 leading-relaxed">
              Are you sure you want to permanently remove{" "}
              <span className="font-bold text-base-content">
                "{company.companyName}"
              </span>{" "}
              ({company.companyCode})?
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-left">
            <span className="text-[11px] font-bold text-rose-500 block mb-0.5">
              Warning:
            </span>
            <p className="text-[11px] text-rose-400 leading-relaxed">
              This action cannot be undone. Associated branches, counters, and store metadata linked directly to this enterprise ID will be removed.
            </p>
          </div>

          {/* Action Buttons with Global Button */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={onClose}
              disabled={isDeleting}
            >
              Keep Company
            </Button>

            <Button
              variant="danger"
              size="md"
              loading={isDeleting}
              onClick={() => onConfirm(company.id)}
              icon={Trash2}
            >
              Delete Permanently
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
