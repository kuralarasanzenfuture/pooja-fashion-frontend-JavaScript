import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  User,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  KeyRound,
  Eye,
  RotateCcw,
  LayoutGrid,
  Table as TableIcon,
  Shield,
  Building,
  Mail,
  Phone,
  X,
  Lock,
} from "lucide-react";
import PageHeader from "../../../common/components/PageHeader.jsx";
import { Button } from "../../../common/components/ui/buttons/index.js";
import Pagination from "../../../common/components/ui/pagination/Pagination.jsx";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useChangePassword,
  useUpdateUserStatus,
  useDeleteUser,
} from "../hooks/useUsers.js";
import { useRoles } from "../../roles/hooks/useRoles.js";
import {
  UserFormModal,
  UserDeleteModal,
  UserDetailsModal,
  UserPasswordModal,
} from "../components/index.js";
import {
  selectIsSuperAdmin,
  selectCurrentUserCompanyId,
  selectCurrentUser,
} from "../../../redux/selectors/authSelectors.js";

/**
 * Shimmering Loading Skeleton for Users
 */
function UsersSkeleton({ viewMode = "table" }) {
  if (viewMode === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, idx) => (
          <div
            key={idx}
            className="rounded-3xl p-5 bg-base-100 border border-base-300 space-y-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="h-6 w-20 bg-base-300/70 animate-pulse rounded-lg" />
              <div className="h-6 w-16 bg-base-300/70 animate-pulse rounded-full" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-base-300/70 animate-pulse shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-32 bg-base-300/80 animate-pulse rounded" />
                <div className="h-3 w-40 bg-base-300/50 animate-pulse rounded" />
              </div>
            </div>
            <div className="h-8 w-full bg-base-300/40 animate-pulse rounded-xl" />
            <div className="pt-3 border-t border-base-200 flex items-center justify-between">
              <div className="h-4 w-20 bg-base-300/60 animate-pulse rounded" />
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-base-300/70 animate-pulse rounded-lg" />
                <div className="h-8 w-8 bg-base-300/70 animate-pulse rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-base-300 bg-base-200/50 text-[11px] font-semibold uppercase tracking-wider text-base-content/60">
              <th className="py-3 px-5">User Profile</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 hidden md:table-cell">Contact</th>
              <th className="py-3 px-4 hidden lg:table-cell">Joined</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200">
            {[...Array(6)].map((_, idx) => (
              <tr key={idx} className="hover:bg-base-200/30 transition-colors">
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-base-300/70 animate-pulse shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-4 w-28 bg-base-300/80 animate-pulse rounded" />
                      <div className="h-3 w-36 bg-base-300/50 animate-pulse rounded" />
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="h-6 w-20 bg-base-300/70 animate-pulse rounded-lg" />
                </td>
                <td className="py-3.5 px-4">
                  <div className="h-6 w-16 bg-base-300/70 animate-pulse rounded-full" />
                </td>
                <td className="py-3.5 px-4 hidden md:table-cell">
                  <div className="h-4 w-28 bg-base-300/50 animate-pulse rounded" />
                </td>
                <td className="py-3.5 px-4 hidden lg:table-cell">
                  <div className="h-4 w-20 bg-base-300/50 animate-pulse rounded" />
                </td>
                <td className="py-3.5 px-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-8 w-8 bg-base-300/70 animate-pulse rounded-lg" />
                    <div className="h-8 w-8 bg-base-300/70 animate-pulse rounded-lg" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Users & Access Management Directory Page
 */
export default function UsersPage() {
  const isSuperAdmin = useSelector(selectIsSuperAdmin);
  const userCompanyId = useSelector(selectCurrentUserCompanyId);
  const loggedInUser = useSelector(selectCurrentUser);

  // View & Filter states
  const [viewMode, setViewMode] = useState("table"); // "table" | "cards"
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add" | "edit"
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Notification feedback state
  const [feedback, setFeedback] = useState(null);

  // Roles query for filter dropdown
  const { data: rolesResponse } = useRoles({ limit: 50, is_active: "true" });
  const availableRoles = rolesResponse?.data || rolesResponse?.roles || [];

  // Query Params
  const queryParams = useMemo(() => {
    const params = {
      page,
      limit,
      sortBy: "id",
      sortOrder: "desc",
    };
    if (search.trim()) params.search = search.trim();
    if (statusFilter) params.status = statusFilter;
    if (roleFilter) params.role_id = roleFilter;
    if (!isSuperAdmin && userCompanyId) {
      params.company_id = userCompanyId;
    }
    return params;
  }, [page, limit, search, statusFilter, roleFilter, isSuperAdmin, userCompanyId]);

  // Mutations & Query
  const { data: response, isLoading, isFetching, refetch } = useUsers(queryParams);
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const passwordMutation = useChangePassword();
  const statusMutation = useUpdateUserStatus();
  const deleteMutation = useDeleteUser();

  const users = response?.data || response?.users || [];
  const meta = response?.meta || { total: users.length, page: 1, limit: 10, totalPages: 1 };

  const showNotification = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Handlers for Modals
  const handleOpenAdd = () => {
    setSelectedUser(null);
    setFormMode("add");
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (user, e) => {
    e?.stopPropagation();
    setSelectedUser(user);
    setFormMode("edit");
    setIsFormModalOpen(true);
  };

  const handleOpenDetails = (user, e) => {
    e?.stopPropagation();
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const handleOpenDelete = (user, e) => {
    e?.stopPropagation();
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleOpenResetPassword = (user, e) => {
    e?.stopPropagation();
    setSelectedUser(user);
    setIsPasswordModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (formMode === "add") {
        await createMutation.mutateAsync(formData);
        showNotification("success", `User "${formData.username}" account created successfully.`);
      } else {
        await updateMutation.mutateAsync({ id: selectedUser.id, data: formData });
        showNotification("success", `User "${formData.username}" updated successfully.`);
      }
      setIsFormModalOpen(false);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to save user.";
      showNotification("error", msg);
    }
  };

  const handlePasswordSubmit = async (userId, data) => {
    try {
      await passwordMutation.mutateAsync({ id: userId, data });
      showNotification("success", "Password updated successfully.");
      setIsPasswordModalOpen(false);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to update password.";
      showNotification("error", msg);
    }
  };

  const handleToggleStatus = async (user, newStatus, e) => {
    e?.stopPropagation();
    try {
      await statusMutation.mutateAsync({ id: user.id, status: newStatus });
      showNotification("success", `User "${user.username}" marked as ${newStatus}.`);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to update status.";
      showNotification("error", msg);
    }
  };

  const handleDeleteConfirm = async (userId) => {
    try {
      await deleteMutation.mutateAsync(userId);
      showNotification("success", "User account removed successfully.");
      setIsDeleteModalOpen(false);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to delete user.";
      showNotification("error", msg);
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setRoleFilter("");
    setPage(1);
  };

  const hasActiveFilters = search || statusFilter !== "" || roleFilter !== "";

  const getStatusBadge = (st) => {
    switch (st) {
      case "active":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "inactive":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "blocked":
      case "locked":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      default:
        return "bg-base-200 text-base-content/60 border-base-300";
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Users & Accounts"
        subtitle="Manage employee system logins, credentials, roles, and security permissions."
        actions={
          <div className="flex items-center gap-2">
            {/* Refresh */}
            <Button
              variant="outline"
              size="md"
              onClick={() => refetch()}
              disabled={isFetching}
              title="Refresh user list"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-primary" : ""}`} />
            </Button>

            {/* Add User */}
            <Button variant="clip-six" size="md" onClick={handleOpenAdd}>
              <Plus className="w-4 h-4 mr-1.5" />
              Add User
            </Button>
          </div>
        }
      />

      {/* Floating feedback alert */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-sm animate-in fade-in slide-in-from-top-3 duration-300 shadow-md ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300"
              : "bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-base-content/40 hover:text-base-content"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Control Bar */}
      <div className="p-4 bg-base-100 rounded-2xl border border-base-300 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by username, email, or phone..."
              className="w-full pl-10 pr-9 py-2 text-sm rounded-xl border border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-base-300 bg-base-100 text-base-content focus:outline-none focus:border-primary"
            >
              <option value="">All Roles</option>
              {availableRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.roleName}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-base-300 bg-base-100 text-base-content focus:outline-none focus:border-primary"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
              <option value="locked">Locked</option>
            </select>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="px-2.5 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors flex items-center gap-1"
                title="Reset filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}

            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 bg-base-200 rounded-xl border border-base-300">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === "table"
                    ? "bg-base-100 text-primary shadow-xs"
                    : "text-base-content/50 hover:text-base-content"
                }`}
                title="Table view"
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("cards")}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === "cards"
                    ? "bg-base-100 text-primary shadow-xs"
                    : "text-base-content/50 hover:text-base-content"
                }`}
                title="Grid cards view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <UsersSkeleton viewMode={viewMode} />
      ) : users.length === 0 ? (
        <div className="p-12 text-center bg-base-100 rounded-2xl border border-base-300 space-y-4 shadow-2xs">
          <div className="w-16 h-16 rounded-2xl bg-base-200 border border-base-300 mx-auto flex items-center justify-center text-base-content/40">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-base-content">No Users Found</h3>
            <p className="text-xs text-base-content/60 max-w-sm mx-auto">
              {hasActiveFilters
                ? "No user accounts match your search filters. Try adjusting your query."
                : "No user accounts have been added yet. Create the first user account."}
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-2">
            {hasActiveFilters ? (
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Clear Filters
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={handleOpenAdd}>
                <Plus className="w-4 h-4 mr-1.5" />
                Add First User
              </Button>
            )}
          </div>
        </div>
      ) : viewMode === "table" ? (
        /* Table View */
        <div className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-base-300 bg-base-200/50 text-[11px] font-semibold uppercase tracking-wider text-base-content/60">
                  <th className="py-3 px-5">User Profile</th>
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

                  return (
                    <tr
                      key={u.id}
                      onClick={() => handleOpenDetails(u)}
                      className="hover:bg-base-200/40 transition-colors cursor-pointer group"
                    >
                      {/* User Profile */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                            {(u.username || "U").slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-base-content group-hover:text-primary transition-colors">
                                {u.username}
                              </span>
                              {isSelf && (
                                <span className="px-1.5 py-0.2 rounded-md bg-primary/15 text-primary text-[10px] font-bold">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-base-content/60 block truncate max-w-xs">
                              {u.email || "No email address"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                          <Shield className="w-3 h-3" />
                          {u.roleName || u.roleCode || "User"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border uppercase tracking-wider ${getStatusBadge(
                            u.status
                          )}`}
                        >
                          {u.status}
                        </span>
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
                          className="flex items-center justify-end gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={(e) => handleOpenDetails(u, e)}
                            className="p-1.5 rounded-lg text-base-content/50 hover:text-base-content hover:bg-base-200 transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleOpenResetPassword(u, e)}
                            className="p-1.5 rounded-lg text-base-content/50 hover:text-amber-500 hover:bg-base-200 transition-colors"
                            title="Reset password"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleOpenEdit(u, e)}
                            className="p-1.5 rounded-lg text-base-content/50 hover:text-primary hover:bg-base-200 transition-colors"
                            title="Edit user"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {!isSelf && (
                            <button
                              type="button"
                              onClick={(e) => handleOpenDelete(u, e)}
                              className="p-1.5 rounded-lg text-base-content/50 hover:text-rose-500 hover:bg-base-200 transition-colors"
                              title="Delete user"
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
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {users.map((u) => {
            const isSelf = loggedInUser && Number(loggedInUser.id) === Number(u.id);

            return (
              <div
                key={u.id}
                onClick={() => handleOpenDetails(u)}
                className="group relative bg-base-100 rounded-3xl border border-base-300 p-5 space-y-4 hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer shadow-xs"
              >
                {/* Top Row: Role & Status */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                    <Shield className="w-3 h-3" />
                    {u.roleName || u.roleCode || "User"}
                  </span>

                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getStatusBadge(
                      u.status
                    )}`}
                  >
                    {u.status}
                  </span>
                </div>

                {/* User Info */}
                <div className="flex items-start gap-3.5 pt-1">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-base shrink-0">
                    {(u.username || "U").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm text-base-content group-hover:text-primary transition-colors truncate">
                        {u.username}
                      </h3>
                      {isSelf && (
                        <span className="px-1.5 py-0.2 rounded-md bg-primary/15 text-primary text-[10px] font-bold">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-base-content/60 truncate flex items-center gap-1">
                      <Mail className="w-3 h-3 shrink-0" />
                      {u.email || "No email address"}
                    </p>
                    {u.phone && (
                      <p className="text-xs text-base-content/60 truncate flex items-center gap-1">
                        <Phone className="w-3 h-3 shrink-0" />
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

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={(e) => handleOpenDetails(u, e)}
                      className="p-1.5 rounded-lg text-base-content/50 hover:text-base-content hover:bg-base-200 transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleOpenResetPassword(u, e)}
                      className="p-1.5 rounded-lg text-base-content/50 hover:text-amber-500 hover:bg-base-200 transition-colors"
                      title="Reset password"
                    >
                      <KeyRound className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleOpenEdit(u, e)}
                      className="p-1.5 rounded-lg text-base-content/50 hover:text-primary hover:bg-base-200 transition-colors"
                      title="Edit user"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {!isSelf && (
                      <button
                        type="button"
                        onClick={(e) => handleOpenDelete(u, e)}
                        className="p-1.5 rounded-lg text-base-content/50 hover:text-rose-500 hover:bg-base-200 transition-colors"
                        title="Delete user"
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
      )}

      {/* Pagination */}
      {!isLoading && users.length > 0 && (
        <Pagination
          currentPage={meta.page || page}
          totalPages={meta.totalPages || Math.ceil((meta.total || users.length) / limit)}
          totalItems={meta.total || users.length}
          itemsPerPage={limit}
          onPageChange={(newPage) => setPage(newPage)}
          onItemsPerPageChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
        />
      )}

      {/* User Form Modal (Add / Edit) */}
      <UserFormModal
        isOpen={isFormModalOpen}
        mode={formMode}
        initialData={selectedUser}
        saving={createMutation.isPending || updateMutation.isPending}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* User Delete Modal */}
      <UserDeleteModal
        isOpen={isDeleteModalOpen}
        user={selectedUser}
        isDeleting={deleteMutation.isPending}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={isDetailsModalOpen}
        user={selectedUser}
        onClose={() => setIsDetailsModalOpen(false)}
        onEdit={(user) => handleOpenEdit(user)}
        onResetPassword={(user) => handleOpenResetPassword(user)}
      />

      {/* User Password Reset Modal */}
      <UserPasswordModal
        isOpen={isPasswordModalOpen}
        user={selectedUser}
        isChanging={passwordMutation.isPending}
        onClose={() => setIsPasswordModalOpen(false)}
        onConfirm={handlePasswordSubmit}
      />
    </div>
  );
}
