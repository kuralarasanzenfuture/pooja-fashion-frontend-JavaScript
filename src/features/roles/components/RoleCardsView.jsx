import React from "react";
import {
  Shield,
  ShieldCheck,
  Building,
  Check,
  Copy,
  Eye,
  Edit2,
  Trash2,
  Lock,
} from "lucide-react";

/**
 * RoleCardsView - Modular Grid Cards component for role listings
 */
export default function RoleCardsView({
  roles = [],
  copiedCode = null,
  onCopyCode,
  onOpenDetails,
  onOpenEdit,
  onOpenDelete,
  onToggleStatus,
  getRoleCompanyName,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {roles.map((role) => {
        const isSystem = Boolean(
          role.isSystemRole ||
          role.is_system_role ||
          ["SUPERADMIN", "ADMIN"].includes(String(role.roleCode || role.role_code).toUpperCase())
        );
        const isActive = Boolean(role.isActive ?? role.is_active);
        const companyDisplayName = getRoleCompanyName
          ? getRoleCompanyName(role)
          : (role.companyName || role.company_name || (role.companyId ? `Company #${role.companyId}` : "Company Custom"));

        return (
          <div
            key={role.id}
            onClick={() => onOpenDetails(role)}
            className="group relative bg-base-100 rounded-3xl border border-base-300 p-5 space-y-4 hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer shadow-xs"
          >
            {/* Top Row: Scope & Status */}
            <div className="flex items-center justify-between">
              {isSystem ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  System Global
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 max-w-[180px]"
                  title={companyDisplayName}
                >
                  <Building className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="truncate">{companyDisplayName}</span>
                </span>
              )}

              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                {isSystem ? (
                  <div
                    className="flex items-center gap-1 opacity-70 cursor-not-allowed"
                    title="System role is permanently active and cannot be deactivated"
                  >
                    <input
                      type="checkbox"
                      checked={true}
                      disabled={true}
                      readOnly
                      className="toggle toggle-success toggle-xs cursor-not-allowed opacity-60"
                    />
                    <Lock className="w-3 h-3 text-base-content/40" />
                  </div>
                ) : (
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => onToggleStatus(role, e)}
                    className="toggle toggle-success toggle-xs"
                    title={isActive ? "Active - click to deactivate" : "Inactive - click to activate"}
                  />
                )}
              </div>
            </div>

            {/* Role Info */}
            <div className="flex items-start gap-3.5 pt-1">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${isSystem
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-600"
                    : "bg-primary/10 border-primary/20 text-primary"
                  }`}
              >
                <Shield className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <h3 className="font-bold text-sm text-base-content group-hover:text-primary transition-colors truncate">
                  {role.roleName || role.role_name}
                </h3>
                <div className="flex items-center gap-1.5">
                  <code className="text-[11px] font-mono font-medium px-1.5 py-0.5 rounded bg-base-200 text-base-content/80">
                    {role.roleCode || role.role_code}
                  </code>
                  <button
                    type="button"
                    onClick={(e) => onCopyCode(role.roleCode || role.role_code, e)}
                    className="text-base-content/40 hover:text-base-content transition-colors p-0.5"
                    title="Copy code"
                  >
                    {copiedCode === (role.roleCode || role.role_code) ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-base-content/65 line-clamp-2 min-h-[2rem] leading-relaxed">
              {role.description || "No description specified for this role."}
            </p>

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-base-200/80">
              <span className="text-[11px] text-base-content/50 font-medium">
                {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : ""}
              </span>

              <div
                className="flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={(e) => onOpenDetails(role, e)}
                  className="p-1.5 rounded-lg text-base-content/50 hover:text-base-content hover:bg-base-200 transition-colors"
                  title="View details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                {isSystem ? (
                  <span
                    className="p-1.5 text-base-content/30 cursor-not-allowed"
                    title="System roles are protected and cannot be edited"
                  >
                    <Lock className="w-4 h-4" />
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => onOpenEdit(role, e)}
                    className="p-1.5 rounded-lg text-base-content/50 hover:text-primary hover:bg-base-200 transition-colors"
                    title="Edit role"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                {!isSystem && (
                  <button
                    type="button"
                    onClick={(e) => onOpenDelete(role, e)}
                    className="p-1.5 rounded-lg text-base-content/50 hover:text-rose-500 hover:bg-base-200 transition-colors"
                    title="Delete role"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                {isSystem && (
                  <span
                    className="p-1.5 text-base-content/30 cursor-not-allowed"
                    title="System roles cannot be deleted"
                  >
                    <Lock className="w-4 h-4" />
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
