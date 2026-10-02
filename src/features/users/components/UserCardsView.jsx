import React from "react";
import {
  Eye,
  KeyRound,
  Edit2,
  Trash2,
  Shield,
  Building,
  Mail,
  Phone,
  Lock,
} from "lucide-react";

/**
 * Enhanced Users Cards Grid View
 * Displays user accounts in responsive modern cards with company badges, role, and actions.
 */
export default function UserCardsView({
  users = [],
  loggedInUser = null,
  onOpenDetails,
  onOpenEdit,
  onOpenResetPassword,
  onOpenDelete,
  onToggleStatus,
  getStatusBadge,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {users.map((u) => {
        const isSelf = loggedInUser && Number(loggedInUser.id) === Number(u.id);
        const isSuperAdminAccount =
          (u.roleCode || "").toUpperCase() === "SUPERADMIN" ||
          (u.role?.role_code || "").toUpperCase() === "SUPERADMIN" ||
          Boolean(u.isSuperAdmin);

        const isSystemRoleAccount =
          Boolean(u.isSystemRole) ||
          Boolean(u.is_system_role) ||
          Boolean(u.role?.is_system_role) ||
          Boolean(u.role?.isSystemRole) ||
          ["SUPERADMIN", "ADMIN"].includes(
            String(u.roleCode || u.role?.role_code || "").toUpperCase()
          ) ||
          isSuperAdminAccount;

        const companyDisplayName =
          u.companyName ||
          u.company?.company_name ||
          u.companyCode ||
          (isSystemRoleAccount ? "System (Global)" : "Default Company");

        return (
          <div
            key={u.id}
            onClick={() => onOpenDetails(u)}
            className="group relative bg-base-100 rounded-3xl border border-base-300 p-5 space-y-4 hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer shadow-xs flex flex-col justify-between"
          >
            {/* Top Row: Role, Company & Status Toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20 shrink-0">
                  <Shield className="w-3 h-3" />
                  {u.roleName || u.role?.role_name || u.roleCode || "User"}
                </span>

                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  {isSystemRoleAccount || isSelf ? (
                    <div
                      className="flex items-center gap-1 opacity-70 cursor-not-allowed"
                      title={
                        isSelf
                          ? "You cannot deactivate your own account"
                          : "System users are permanently active and cannot be deactivated"
                      }
                    >
                      <input
                        type="checkbox"
                        checked={u.status === "active"}
                        disabled={true}
                        readOnly
                        className="toggle toggle-success toggle-xs cursor-not-allowed opacity-60"
                      />
                      {isSystemRoleAccount && <Lock className="w-3 h-3 text-base-content/40" />}
                    </div>
                  ) : (
                    <input
                      type="checkbox"
                      checked={u.status === "active"}
                      onChange={(e) =>
                        onToggleStatus && onToggleStatus(u, u.status === "active" ? "inactive" : "active", e)
                      }
                      className="toggle toggle-success toggle-xs"
                      title={u.status === "active" ? "Active - click to deactivate" : "Inactive - click to activate"}
                    />
                  )}
                </div>
              </div>

              {/* Company context chip */}
              <div className="flex items-center gap-1.5 text-xs text-base-content/70 bg-base-200/50 px-2.5 py-1 rounded-xl w-fit">
                <Building className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate max-w-[200px] font-medium">{companyDisplayName}</span>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-start gap-3.5 pt-1">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-base shrink-0">
                {(u.username || "U").slice(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-bold text-sm text-base-content group-hover:text-primary transition-colors truncate">
                    {u.username}
                  </h3>
                  {isSelf && (
                    <span className="px-1.5 py-0.2 rounded-md bg-primary/15 text-primary text-[10px] font-bold">
                      You
                    </span>
                  )}
                  {isSystemRoleAccount && (
                    <span className="px-1.5 py-0.2 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-bold flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" />
                      System
                    </span>
                  )}
                </div>
                <p className="text-xs text-base-content/60 truncate flex items-center gap-1">
                  <Mail className="w-3 h-3 shrink-0 text-base-content/40" />
                  {u.email || "No email address"}
                </p>
                {u.phone && (
                  <p className="text-xs text-base-content/60 truncate flex items-center gap-1">
                    <Phone className="w-3 h-3 shrink-0 text-base-content/40" />
                    {u.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-3 border-t border-base-200 flex items-center justify-between">
              <span className="text-[11px] text-base-content/50">
                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ""}
              </span>

              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                {/* View Details */}
                <button
                  type="button"
                  onClick={(e) => onOpenDetails(u, e)}
                  className="p-1.5 rounded-lg text-base-content/50 hover:text-base-content hover:bg-base-200 transition-colors"
                  title="View user details"
                >
                  <Eye className="w-4 h-4" />
                </button>

                {/* Reset Password */}
                <button
                  type="button"
                  onClick={(e) => onOpenResetPassword(u, e)}
                  className="p-1.5 rounded-lg text-base-content/50 hover:text-amber-500 hover:bg-base-200 transition-colors"
                  title="Reset password"
                >
                  <KeyRound className="w-4 h-4" />
                </button>

                {/* Edit User */}
                <button
                  type="button"
                  onClick={(e) => onOpenEdit(u, e)}
                  className="p-1.5 rounded-lg text-base-content/50 hover:text-primary hover:bg-base-200 transition-colors"
                  title="Edit user details"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                {/* Delete User */}
                {!isSelf && (
                  <button
                    type="button"
                    onClick={(e) => onOpenDelete(u, e)}
                    disabled={isSystemRoleAccount}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isSystemRoleAccount
                        ? "text-base-content/20 cursor-not-allowed"
                        : "text-base-content/50 hover:text-rose-500 hover:bg-base-200"
                    }`}
                    title={
                      isSystemRoleAccount
                        ? "System role users cannot be deleted"
                        : "Delete user"
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
