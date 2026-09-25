import React, { useState, useEffect } from "react";
import { X, ShieldCheck, CheckCircle2, PauseCircle, Ban, AlertCircle } from "lucide-react";
import { Button } from "../../../common/components/ui/buttons/index.js";

/**
 * Company Status Toggle / Update Modal
 */
export default function CompanyStatusModal({
  isOpen = false,
  onClose,
  company = null,
  onSubmit,
  isSubmitting = false,
}) {
  const [selectedStatus, setSelectedStatus] = useState("active");

  useEffect(() => {
    if (company) {
      setSelectedStatus(company.status || "active");
    }
  }, [company, isOpen]);

  if (!isOpen || !company) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ id: company.id, status: selectedStatus });
  };

  const statusOptions = [
    {
      id: "active",
      label: "Active (Operational)",
      description: "Company is fully active. Billing, inventory sync, and orders can be processed normally.",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-100 border-emerald-300",
      activeBg: "bg-emerald-50/80 border-emerald-500",
    },
    {
      id: "inactive",
      label: "Inactive (Dormant)",
      description: "Company operations are temporarily paused. Existing data is preserved, but no new transactions are allowed.",
      icon: PauseCircle,
      color: "text-amber-600 bg-amber-100 border-amber-300",
      activeBg: "bg-amber-50/80 border-amber-500",
    },
    {
      id: "suspended",
      label: "Suspended (Locked)",
      description: "Compliance or administrative review lock. All POS counters and associate logins are prevented.",
      icon: Ban,
      color: "text-rose-600 bg-rose-100 border-rose-300",
      activeBg: "bg-rose-50/80 border-rose-500",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden flex flex-col text-base-content">
        {/* Header */}
        <div className="px-6 py-4 border-b border-base-300 flex items-center justify-between bg-base-200/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-content flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base-content text-base leading-tight">
                Update Company Status
              </h3>
              <p className="text-xs text-base-content/60 mt-0.5">
                {company.companyName} ({company.companyCode})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-base-content/50 hover:text-base-content hover:bg-base-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-base-content/60 leading-relaxed">
            Select the new operational status for this company. Changing status immediately affects store POS terminals and active inventory ledgers.
          </p>

          <div className="space-y-3">
            {statusOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedStatus === opt.id;

              return (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3.5 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected ? opt.activeBg + " shadow-xs font-bold" : "border-base-300 hover:bg-base-200/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={opt.id}
                    checked={isSelected}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${opt.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-base-content">
                        {opt.label}
                      </span>
                      {isSelected && (
                        <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-base-content/60 mt-1 leading-relaxed font-normal">
                      {opt.description}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-base-300 flex items-center justify-end gap-2.5">
            <Button
              variant="secondary"
              size="md"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="clip-six"
              size="md"
              loading={isSubmitting}
            >
              Confirm Status Change
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
