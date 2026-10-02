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
 * RolesTable - Modular Table component for role listings
 */
export default function RolesTable({
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
    <div className="bg-base-100 rounded-3xl border border-base-300 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-base-300 bg-base-200/50 text-[11px] font-semibold uppercase tracking-wider text-base-content/60">
              <th className="py-3 px-5">Role Information</th>
              <th className="py-3 px-4">Scope / Company</th>
              <th className="py-3 px-4 hidden md:table-cell">Description</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 hidden lg:table-cell">Created</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200">
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
                <tr
                  key={role.id}
                  onClick={() => onOpenDetails(role)}
                  className="hover:bg-base-200/40 transition-colors cursor-pointer group"
                >
                  {/* Name & Code */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${isSystem
                            ? "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
                            : "bg-primary/10 border-primary/20 text-primary"
                          }`}
                      >
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-base-content group-hover:text-primary transition-colors">
                            {role.roleName || role.role_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
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
                  </td>

                  {/* Scope Badge */}
                  <td className="py-3.5 px-4">
                    {isSystem ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                        <ShieldCheck className="w-3 h-3 text-amber-600" />
                        System Global
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 max-w-[220px]"
                        title={companyDisplayName}
                      >
                        <Building className="w-3 h-3 text-indigo-600 shrink-0" />
                        <span className="truncate">{companyDisplayName}</span>
                      </span>
                    )}
                  </td>

                  {/* Description */}
                  <td className="py-3.5 px-4 hidden md:table-cell max-w-xs truncate text-xs text-base-content/65">
                    {role.description || "—"}
                  </td>

                  {/* Status Toggle */}
                  <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      {isSystem ? (
                        <div
                          className="flex items-center gap-1.5 opacity-70 cursor-not-allowed"
                          title="System roles are permanent and cannot be deactivated"
                        >
                          <input
                            type="checkbox"
                            checked={true}
                            disabled={true}
                            readOnly
                            className="toggle toggle-success toggle-sm cursor-not-allowed opacity-60"
                          />
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            Active
                            <Lock className="w-3 h-3 text-base-content/40" />
                          </span>
                        </div>
                      ) : (
                        <>
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => onToggleStatus(role, e)}
                            onClick={(e) => e.stopPropagation()}
                            className="toggle toggle-success toggle-sm"
                            title={isActive ? "Active - click to deactivate" : "Inactive - click to activate"}
                          />
                          <span
                            className={`text-xs font-semibold hidden sm:inline ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-base-content/40"
                              }`}
                          >
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Created Date */}
                  <td className="py-3.5 px-4 hidden lg:table-cell text-xs text-base-content/55">
                    {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : "—"}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-5 text-right">
                    <div
                      className="flex items-center justify-end gap-1"
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
