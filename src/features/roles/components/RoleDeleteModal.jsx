import React from "react";
import { Trash2, AlertTriangle, ShieldCheck, X, ShieldAlert } from "lucide-react";
import { Button } from "../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../common/hooks/useModalAnimation.js";

/**
 * Role Delete Confirmation Modal
 * Strictly blocks deletion of protected system roles with an informative security notice.
 */
export default function RoleDeleteModal({
  isOpen = false,
  onClose,
  role = null,
  onConfirm,
  isDeleting = false,
}) {
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isOpen && Boolean(role),
    onClose
  );

  if (!isRendered || !role) return null;

  const roleName = role.roleName || role.role_name || "Unnamed Role";
  const roleCode = role.roleCode || role.role_code || "—";
  const isSystem = Boolean(role.isSystemRole || role.is_system_role);

  return (
    <div className={backdropClasses} onClick={handleClose} role="dialog" aria-modal="true">
      <div
        className={`relative w-full max-w-md bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden ${cardClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-base-200">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs ${
                isSystem
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
              }`}
            >
              {isSystem ? <ShieldAlert className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-base-content tracking-tight">
                {isSystem ? "Protected System Role" : "Delete Role"}
              </h2>
              <p className="text-xs text-base-content/60">
                {isSystem ? "Cannot be removed" : "Permanent removal action"}
              </p>
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

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {isSystem ? (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 leading-relaxed space-y-2">
                <p className="font-semibold text-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  System Role Safeguard Active
                </p>
                <p>
                  <strong className="underline">{roleName}</strong> (<code>{roleCode}</code>) is a core system role required for fundamental access control and platform operations. System roles cannot be deleted.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-base-content/75 leading-relaxed">
                Are you sure you want to permanently delete the custom role{" "}
                <span className="font-bold text-base-content">{roleName}</span>{" "}
                (<code className="text-xs font-mono px-1.5 py-0.5 rounded bg-base-200">{roleCode}</code>)?
              </p>
              <div className="p-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/15 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Any users currently assigned to this role will lose their associated privileges.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="px-6 py-4 border-t border-base-200 flex items-center justify-end gap-2.5 bg-base-100">
          <Button variant="outline" size="md" onClick={handleClose} disabled={isDeleting}>
            {isSystem ? "Close" : "Cancel"}
          </Button>
          {!isSystem && (
            <Button
              variant="danger"
              size="md"
              loading={isDeleting}
              disabled={isDeleting}
              onClick={() => onConfirm(role.id)}
            >
              Confirm Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
