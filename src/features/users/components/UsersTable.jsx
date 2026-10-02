import React from "react";
import {
  Eye,
  KeyRound,
  Edit2,
  Trash2,
  Shield,
  Building,
  Lock,
} from "lucide-react";

/**
 * Enhanced Users Table View
 * Displays user accounts with company context, role badges, status, and guarded actions.
 */
export default function UsersTable({
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
    <div className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-base-300 bg-base-200/50 text-[11px] font-semibold uppercase tracking-wider text-base-content/60">
              <th className="py-3 px-5">User Profile</th>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 hidden md:table-cell">Contact</th>
              <th className="py-3 px-4 hidden lg:table-cell">Joined</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200">
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
                <tr
                  key={u.id}
                  onClick={() => onOpenDetails(u)}
                  className="hover:bg-base-200/50 transition-colors cursor-pointer group"
                >
                  {/* User Profile */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                        {(u.username || "U").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-sm text-base-content group-hover:text-primary transition-colors truncate">
                            {u.username}
                          </span>
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
                        <span className="text-xs text-base-content/60 block truncate max-w-[200px] sm:max-w-xs">
                          {u.email || "No email address"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Company Column */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-base-content/80">
                      <Building className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                      <span className="truncate max-w-[140px]">{companyDisplayName}</span>
                    </div>
                  </td>

                  {/* Role Badge */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                        <Shield className="w-3 h-3" />
                        {u.roleName || u.role?.role_name || u.roleCode || "User"}
                      </span>
                    </div>
                  </td>

                  {/* Status Toggle */}
                  <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      {isSystemRoleAccount || isSelf ? (
                        <div
                          className="flex items-center gap-1.5 opacity-70 cursor-not-allowed"
                          title={
                            isSelf
                              ? "You cannot deactivate your own account"
                              : "System role users are permanently active and cannot be deactivated"
                          }
                        >
                          <input
                            type="checkbox"
                            checked={u.status === "active"}
                            disabled={true}
                            readOnly
                            className="toggle toggle-success toggle-sm cursor-not-allowed opacity-60"
                          />
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            {u.status === "active" ? "Active" : "Inactive"}
                            {isSystemRoleAccount && <Lock className="w-3 h-3 text-base-content/40" />}
                          </span>
                        </div>
                      ) : (
                        <>
                          <input
                            type="checkbox"
                            checked={u.status === "active"}
                            onChange={(e) =>
                              onToggleStatus && onToggleStatus(u, u.status === "active" ? "inactive" : "active", e)
                            }
                            onClick={(e) => e.stopPropagation()}
                            className="toggle toggle-success toggle-sm"
                            title={u.status === "active" ? "Active - click to deactivate" : "Inactive - click to activate"}
                          />
                          <span
                            className={`text-xs font-semibold hidden sm:inline ${
                              u.status === "active" ? "text-emerald-600 dark:text-emerald-400" : "text-base-content/40"
                            }`}
                          >
                            {u.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Phone / Branch */}
                  <td className="py-3.5 px-4 hidden md:table-cell text-xs text-base-content/70">
                    {u.phone || "—"}
                  </td>

                  {/* Created */}
                  <td className="py-3.5 px-4 hidden lg:table-cell text-xs text-base-content/55">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-5 text-right">
                    <div
                      className="flex items-center justify-end gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
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
