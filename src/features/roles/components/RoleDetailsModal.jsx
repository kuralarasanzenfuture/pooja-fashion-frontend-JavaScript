import React, { useState } from "react";
import {
  Shield,
  ShieldCheck,
  Building,
  Calendar,
  Clock,
  User,
  Copy,
  Check,
  X,
  Edit2,
  Lock,
} from "lucide-react";
import { Button } from "../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../common/hooks/useModalAnimation.js";
import { useCompanies } from "../../company/hooks/useCompanies.js";

/**
 * Role Details Drawer/Modal
 */
export default function RoleDetailsModal({
  isOpen = false,
  onClose,
  role = null,
  onEdit,
  canEdit = true,
}) {
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isOpen && Boolean(role),
    onClose
  );
  const [copied, setCopied] = useState(false);

  // Fetch companies for lookup in case companyName isn't directly loaded on role
  const { data: companiesResponse } = useCompanies({ limit: 100 });
  const companies = companiesResponse?.data || [];

  if (!isRendered || !role) return null;

  const roleName = role.roleName || role.role_name || "—";
  const roleCode = role.roleCode || role.role_code || "—";
  const description = role.description || "No description provided for this role.";
  const isSystem = Boolean(
    role.isSystemRole ||
    role.is_system_role ||
    ["SUPERADMIN", "ADMIN"].includes(String(role.roleCode || role.role_code).toUpperCase())
  );
  const isActive = Boolean(role.isActive ?? role.is_active);
  const companyId = role.companyId ?? role.company_id ?? null;
  const createdAt = role.createdAt ? new Date(role.createdAt).toLocaleString() : "—";
  const updatedAt = role.updatedAt ? new Date(role.updatedAt).toLocaleString() : "—";

  const matchedCompany = companyId
    ? companies.find((c) => Number(c.id) === Number(companyId))
    : null;

  const companyName =
    role.companyName ||
    role.company_name ||
    matchedCompany?.company_name ||
    matchedCompany?.displayName ||
    matchedCompany?.companyName ||
    null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roleCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={backdropClasses} onClick={handleClose} role="dialog" aria-modal="true">
      <div
        className={`relative w-full max-w-lg bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden ${cardClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-base-200">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-base-content tracking-tight">
                  {roleName}
                </h2>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-base-200 text-base-content/60 border-base-300"
                  }`}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-xs text-base-content/60">Role Definition & Metadata</p>
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

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[calc(85vh-140px)] overflow-y-auto">
          {/* Quick Badges Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* System vs Company Scope Badge */}
            {isSystem ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                Global System Role
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                <Building className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-semibold">{companyName || (companyId ? `Company #${companyId}` : "Company Custom Role")}</span>
                {companyId && (
                  <span className="text-[10px] opacity-60 font-mono">#{companyId}</span>
                )}
              </span>
            )}

            {/* Role Code Chip with Copy */}
            <button
              onClick={handleCopyCode}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-medium bg-base-200/80 hover:bg-base-200 border border-base-300 text-base-content transition-colors"
              title="Click to copy role code"
            >
              <code>{roleCode}</code>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3 h-3 text-base-content/50" />
              )}
            </button>
          </div>

          {/* Assigned Company Card for Custom Roles */}
          {!isSystem && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
                Assigned Company
              </h3>
              <div className="p-3.5 rounded-2xl bg-base-200/40 border border-base-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 shrink-0">
                    <Building className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-base-content block text-sm truncate">
                      {companyName || (companyId ? `Company #${companyId}` : "Company Specific")}
                    </span>
                    <span className="text-[11px] text-base-content/60">
                      Scoped exclusively to this enterprise company
                    </span>
                  </div>
                </div>
                {companyId && (
                  <span className="px-2.5 py-1 rounded-lg bg-base-300/60 text-base-content/80 font-mono font-semibold text-xs shrink-0">
                    ID #{companyId}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
              Description
            </h3>
            <div className="p-4 rounded-2xl bg-base-200/40 border border-base-200 text-sm text-base-content/80 leading-relaxed">
              {description}
            </div>
          </div>

          {/* Scope and Security Notice */}
          {isSystem && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
              <Lock className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span>
                Core system roles are built into the platform architecture. Editing, deactivation, and deletion are permanently protected.
              </span>
            </div>
          )}

          {/* Metadata Audit Grid */}
          <div className="space-y-2 pt-2 border-t border-base-200">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
              Audit & Timeline
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-base-200/30 border border-base-200 space-y-1">
                <span className="text-[11px] text-base-content/50 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Created At
                </span>
                <p className="text-xs font-medium text-base-content truncate">{createdAt}</p>
              </div>
              <div className="p-3 rounded-xl bg-base-200/30 border border-base-200 space-y-1">
                <span className="text-[11px] text-base-content/50 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Last Updated
                </span>
                <p className="text-xs font-medium text-base-content truncate">{updatedAt}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-base-200 flex items-center justify-between bg-base-100">
          <Button variant="outline" size="md" onClick={handleClose}>
            Close
          </Button>
          {canEdit && !isSystem && (
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                handleClose();
                setTimeout(() => onEdit(role), 200);
              }}
            >
              <Edit2 className="w-4 h-4 mr-1.5" />
              Edit Role
            </Button>
          )}
          {isSystem && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
              <Lock className="w-3.5 h-3.5" />
              Protected System Role
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
