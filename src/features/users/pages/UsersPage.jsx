import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  User,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  LayoutGrid,
  Table as TableIcon,
  Shield,
  Building,
  Filter,
  X,
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
import { useCompanies } from "../../company/hooks/useCompanies.js";
import {
  UserFormModal,
  UserDeleteModal,
  UserDetailsModal,
  UserPasswordModal,
  UserFilterDropdown,
  UsersTable,
  UserCardsView,
} from "../components/index.js";
import UserViewPage from "./UserViewPage.jsx";
import {
  selectIsSuperAdmin,
  selectIsAdmin,
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
              <div className="h-6 w-24 bg-base-300/70 animate-pulse rounded-lg" />
              <div className="h-6 w-16 bg-base-300/70 animate-pulse rounded-full" />
            </div>
            <div className="h-6 w-32 bg-base-300/50 animate-pulse rounded-xl" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-base-300/70 animate-pulse shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-32 bg-base-300/80 animate-pulse rounded" />
                <div className="h-3 w-40 bg-base-300/50 animate-pulse rounded" />
              </div>
            </div>
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
              <th className="py-3 px-4">Company</th>
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
                  <div className="h-6 w-24 bg-base-300/60 animate-pulse rounded-lg" />
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
  const isAdmin = useSelector(selectIsAdmin);
  const userCompanyId = useSelector(selectCurrentUserCompanyId);
  const loggedInUser = useSelector(selectCurrentUser);
  const isPrivilegedAdmin = isSuperAdmin || isAdmin;

  // View & Filter states
  const [viewMode, setViewMode] = useState("table"); // "table" | "cards"
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
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

  // Roles query for filter dropdown (active roles)
  const { data: rolesResponse } = useRoles({ limit: 100, is_active: "true" });
  const rawRoles = rolesResponse?.data || rolesResponse?.roles || [];
  const availableRoles = rawRoles.filter(
    (r) => r.isActive !== false && r.is_active !== false
  );

  // Companies query for SuperAdmin / Admin company filter
  const { data: companiesResponse } = useCompanies({ limit: 100, status: "active" });
  const companies = companiesResponse?.data || [];

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
    if (companyFilter) {
      params.company_id = companyFilter;
    } else if (!isSuperAdmin && userCompanyId) {
      params.company_id = userCompanyId;
    }
    return params;
  }, [page, limit, search, statusFilter, roleFilter, companyFilter, isSuperAdmin, userCompanyId]);

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
    setCompanyFilter("");
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    search || statusFilter !== "" || roleFilter !== "" || companyFilter !== ""
  );

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

  // Dropdown options
  const companyOptions = useMemo(
    () => [
      { value: "", label: "All Companies" },
      ...companies.map((c) => ({
        value: String(c.id),
        label: c.companyName || c.company_name,
        badge: c.companyCode || c.company_code || null,
        icon: Building,
      })),
    ],
    [companies]
  );

  const roleOptions = useMemo(
    () => [
      { value: "", label: "All Roles" },
      ...availableRoles.map((r) => ({
        value: String(r.id),
        label: r.roleName || r.role_name,
        badge: r.isSystemRole || r.is_system_role ? "System" : null,
        icon: Shield,
      })),
    ],
    [availableRoles]
  );

  const statusOptions = useMemo(
    () => [
      { value: "", label: "All Statuses" },
      { value: "active", label: "Active", dotColor: "bg-emerald-500" },
      { value: "inactive", label: "Inactive", dotColor: "bg-amber-500" },
      { value: "blocked", label: "Blocked", dotColor: "bg-rose-500" },
      { value: "locked", label: "Locked", dotColor: "bg-purple-500" },
    ],
    []
  );

  const activeCompanyName = useMemo(() => {
    if (!companyFilter) return "";
    const found = companies.find((c) => String(c.id) === String(companyFilter));
    return found?.companyName || found?.company_name || `Company #${companyFilter}`;
  }, [companyFilter, companies]);

  const activeRoleName = useMemo(() => {
    if (!roleFilter) return "";
    const found = availableRoles.find((r) => String(r.id) === String(roleFilter));
    return found?.roleName || found?.role_name || `Role #${roleFilter}`;
  }, [roleFilter, availableRoles]);

  // If user details view is open, render as Full Page View (not modal style!)
  if (isDetailsModalOpen && selectedUser) {
    return (
      <UserViewPage
        userId={selectedUser.id}
        initialUser={selectedUser}
        onBack={() => setIsDetailsModalOpen(false)}
        onEdit={(user) => handleOpenEdit(user)}
        onResetPassword={(user) => handleOpenResetPassword(user)}
      />
    );
  }

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
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by username, email, or phone..."
              className="w-full pl-10 pr-9 py-2 text-xs rounded-xl border border-base-300 bg-base-200/40 text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            {/* Company Filter (for SuperAdmin and Admin across companies) */}
            {isPrivilegedAdmin && (isSuperAdmin || !userCompanyId) && companies.length > 0 && (
              <UserFilterDropdown
                label="All Companies"
                value={companyFilter}
                options={companyOptions}
                onChange={(val) => {
                  setCompanyFilter(val);
                  setPage(1);
                }}
                icon={Building}
                minWidth="min-w-[150px]"
              />
            )}

            {/* Role Filter */}
            <UserFilterDropdown
              label="All Roles"
              value={roleFilter}
              options={roleOptions}
              onChange={(val) => {
                setRoleFilter(val);
                setPage(1);
              }}
              icon={Shield}
              minWidth="min-w-[130px]"
            />

            {/* Status Filter */}
            <UserFilterDropdown
              label="All Statuses"
              value={statusFilter}
              options={statusOptions}
              onChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
              icon={Filter}
              minWidth="min-w-[125px]"
            />

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="px-2.5 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors flex items-center gap-1 shrink-0"
                title="Reset filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}

            <div className="w-px h-6 bg-base-300 hidden sm:block shrink-0" />

            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 bg-base-200 rounded-xl border border-base-300 shrink-0">
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

        {/* Active Filter Chips / Badges Row */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-base-200/80 text-xs">
            <span className="text-[11px] font-semibold text-base-content/50 uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3 h-3" /> Active Filters:
            </span>

            {search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-[11px] font-medium">
                Search: "{search}"
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="hover:text-primary-focus ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {companyFilter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-[11px] font-medium">
                <Building className="w-3 h-3" />
                Company: {activeCompanyName}
                <button
                  type="button"
                  onClick={() => setCompanyFilter("")}
                  className="hover:text-primary-focus ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {roleFilter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-[11px] font-medium">
                <Shield className="w-3 h-3" />
                Role: {activeRoleName}
                <button
                  type="button"
                  onClick={() => setRoleFilter("")}
                  className="hover:text-primary-focus ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {statusFilter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-[11px] font-medium capitalize">
                Status: {statusFilter}
                <button
                  type="button"
                  onClick={() => setStatusFilter("")}
                  className="hover:text-primary-focus ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[11px] font-medium text-rose-500 hover:underline ml-1"
            >
              Clear all
            </button>
          </div>
        )}
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
        <UsersTable
          users={users}
          loggedInUser={loggedInUser}
          onOpenDetails={handleOpenDetails}
          onOpenEdit={handleOpenEdit}
          onOpenResetPassword={handleOpenResetPassword}
          onOpenDelete={handleOpenDelete}
          onToggleStatus={handleToggleStatus}
          getStatusBadge={getStatusBadge}
        />
      ) : (
        <UserCardsView
          users={users}
          loggedInUser={loggedInUser}
          onOpenDetails={handleOpenDetails}
          onOpenEdit={handleOpenEdit}
          onOpenResetPassword={handleOpenResetPassword}
          onOpenDelete={handleOpenDelete}
          onToggleStatus={handleToggleStatus}
          getStatusBadge={getStatusBadge}
        />
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
        existingUsers={users}
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
