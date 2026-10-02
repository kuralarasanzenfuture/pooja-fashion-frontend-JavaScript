import React, { useState, useEffect } from "react";
import { Sparkles, Building, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../common/hooks/useModalAnimation.js";
import { CompanySelect } from "../../company/components/index.js";

/**
 * Super Admin modal to seed default system roles (SUPERADMIN, ADMIN) for a company
 */
export default function RoleSeedModal({
  isOpen = false,
  onClose,
  onConfirm,
  isSeeding = false,
  defaultCompanyId = null,
}) {
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isOpen,
    onClose
  );

  const [companyId, setCompanyId] = useState(defaultCompanyId ? String(defaultCompanyId) : "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setCompanyId(defaultCompanyId ? String(defaultCompanyId) : "");
      setError("");
    }
  }, [isOpen, defaultCompanyId]);

  if (!isRendered) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = Number(companyId);
    if (!id || id <= 0) {
      setError("Please select a target company.");
      return;
    }
    setError("");
    onConfirm(id);
  };

  return (
    <div className={backdropClasses} onClick={handleClose} role="dialog" aria-modal="true">
      <div
        className={`relative w-full max-w-md bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden ${cardClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-base-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-base-content tracking-tight">
                Seed Default System Roles
              </h2>
              <p className="text-xs text-base-content/60">Super Admin Provisioning Tool</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-base-content/50 hover:text-base-content hover:bg-base-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 pb-24">
            <p className="text-xs text-base-content/75 leading-relaxed">
              This will automatically provision standard baseline system roles (<code>SUPERADMIN</code>, <code>ADMIN</code>) for the target company if they are not already initialized.
            </p>

            <CompanySelect
              value={companyId}
              onChange={(id) => {
                setCompanyId(id);
                if (error) setError("");
              }}
              error={error}
              required
              disabled={isSeeding}
              label="Target Company"
              placeholder="-- Select Company to Seed --"
            />
          </div>

          <div className="px-6 py-4 border-t border-base-200 flex items-center justify-end gap-2.5 bg-base-100">
            <Button variant="outline" size="md" onClick={handleClose} disabled={isSeeding}>
              Cancel
            </Button>
            <Button variant="clip-six" size="md" type="submit" loading={isSeeding} disabled={isSeeding}>
              Seed Roles
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
