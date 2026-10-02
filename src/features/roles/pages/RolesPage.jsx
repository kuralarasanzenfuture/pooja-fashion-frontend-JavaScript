import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Shield,
  ShieldCheck,
  Plus,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  Copy,
  Check,
  X,
  RotateCcw,
  LayoutGrid,
  Table as TableIcon,
  Sparkles,
  Eye,
  Building,
  Lock,
} from "lucide-react";
import PageHeader from "../../../common/components/PageHeader.jsx";
import { Button } from "../../../common/components/ui/buttons/index.js";
import Pagination from "../../../common/components/ui/pagination/Pagination.jsx";
import {
  useRoles,
  useCreateRole,
  useUpdateRole,
  useUpdateRoleStatus,
  useDeleteRole,
  useSeedDefaultRoles,
} from "../hooks/useRoles.js";
import {
  RoleFormModal,
  RoleDeleteModal,
  RoleDetailsModal,
  RoleSeedModal,
  RolesTable,
  RoleCardsView,
  RoleFilterDropdown,
} from "../components/index.js";
import { useCompanies } from "../../company/hooks/useCompanies.js";
import {
  selectIsSuperAdmin,
  selectIsAdmin,
  selectCurrentUserRole,
  selectCurrentUserCompanyId,
} from "../../../redux/selectors/authSelectors.js";

/**
 * Shimmering Loading Skeleton for Roles
 */
function RolesSkeleton({ viewMode = "table" }) {
  if (viewMode === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl p-5 bg-base-100 border border-base-300 space-y-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="h-6 w-28 bg-base-300/70 animate-pulse rounded-lg" />
              <div className="h-6 w-16 bg-base-300/70 animate-pulse rounded-lg" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-base-300/70 animate-pulse shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-3/4 bg-base-300/80 animate-pulse rounded" />
                <div className="h-3 w-1/2 bg-base-300/50 animate-pulse rounded" />
              </div>
            </div>
            <div className="h-10 w-full bg-base-300/40 animate-pulse rounded-xl" />
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

  // Table Skeleton
  return (
    <div className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-base-300 bg-base-200/50 text-[11px] font-semibold uppercase tracking-wider text-base-content/60">
              <th className="py-3 px-5">Role Information</th>
              <th className="py-3 px-4">Scope</th>
              <th className="py-3 px-4 hidden md:table-cell">Description</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 hidden lg:table-cell">Created</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200">
            {[...Array(6)].map((_, idx) => (
              <tr key={idx} className="hover:bg-base-200/30 transition-colors">
                <td className="py-4 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-base-300/70 animate-pulse shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-4 w-32 bg-base-300/80 animate-pulse rounded" />
                      <div className="h-3 w-20 bg-base-300/50 animate-pulse rounded" />
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="h-6 w-24 bg-base-300/70 animate-pulse rounded-lg" />
                </td>
                <td className="py-4 px-4 hidden md:table-cell">
                  <div className="h-4 w-48 bg-base-300/50 animate-pulse rounded" />
                </td>
                <td className="py-4 px-4">
                  <div className="h-6 w-14 bg-base-300/70 animate-pulse rounded-full" />
                </td>
                <td className="py-4 px-4 hidden lg:table-cell">
                  <div className="h-4 w-20 bg-base-300/50 animate-pulse rounded" />
                </td>
                <td className="py-4 px-5 text-right">
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
 * Roles & Permissions Management Page
 */
export default function RolesPage() {
  const isSuperAdmin = useSelector(selectIsSuperAdmin);
  const isAdmin = useSelector(selectIsAdmin);
  const currentUserRole = useSelector(selectCurrentUserRole);
  const userCompanyId = useSelector(selectCurrentUserCompanyId);
  const isPrivilegedAdmin = isSuperAdmin || isAdmin;

  // View & Filter States
  const [viewMode, setViewMode] = useState("table"); // "table" | "cards"
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // "" | "true" | "false"
  const [scopeFilter, setScopeFilter] = useState(""); // "" | "system" | "custom"
  const [companyFilter, setCompanyFilter] = useState(""); // "" | companyId
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [copiedCode, setCopiedCode] = useState(null);

  // Companies for admin filtering
  const { data: companiesResponse } = useCompanies({ limit: 100, status: "active" });
  const companies = companiesResponse?.data || [];

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add" | "edit"
  const [selectedRole, setSelectedRole] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isSeedModalOpen, setIsSeedModalOpen] = useState(false);

  // Feedback banner state
  const [feedback, setFeedback] = useState(null);

  // Query Params
  const queryParams = useMemo(() => {
    const params = {
      page,
      limit,
      sortBy: "id",
      sortOrder: "desc",
    };
    if (search.trim()) params.search = search.trim();
    if (statusFilter !== "") params.is_active = statusFilter;
    if (scopeFilter === "system") params.is_system_role = "true";
    if (scopeFilter === "custom") params.is_system_role = "false";
    if (companyFilter) {
      params.company_id = Number(companyFilter);
      if (!scopeFilter) params.include_global = "false";
    } else if (!isSuperAdmin && userCompanyId) {
      params.company_id = userCompanyId;
    }
    return params;
  }, [page, limit, search, statusFilter, scopeFilter, companyFilter, isSuperAdmin, userCompanyId]);

  // React Query Hooks
  const { data: response, isLoading, isFetching, refetch } = useRoles(queryParams);
  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const statusMutation = useUpdateRoleStatus();
  const deleteMutation = useDeleteRole();
  const seedMutation = useSeedDefaultRoles();

  const roles = response?.data || response?.roles || [];
  const meta = response?.meta || { total: roles.length, page: 1, limit: 10, totalPages: 1 };

  const showNotification = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleCopyCode = (code, e) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  // Handlers for Modals
  const handleOpenAdd = () => {
    setSelectedRole(null);
    setFormMode("add");
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (role, e) => {
    e?.stopPropagation();
    setSelectedRole(role);
    setFormMode("edit");
    setIsFormModalOpen(true);
  };

  const handleOpenDetails = (role, e) => {
    e?.stopPropagation();
    setSelectedRole(role);
    setIsDetailsModalOpen(true);
  };

  const handleOpenDelete = (role, e) => {
    e?.stopPropagation();
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (formMode === "add") {
        await createMutation.mutateAsync(formData);
        showNotification("success", `Role "${formData.role_name}" created successfully.`);
      } else {
        await updateMutation.mutateAsync({ id: selectedRole.id, data: formData });
        showNotification("success", `Role "${formData.role_name}" updated successfully.`);
      }
      setIsFormModalOpen(false);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to save role.";
      showNotification("error", msg);
      throw err;
    }
  };

  const handleToggleStatus = async (role, e) => {
    e?.stopPropagation();
    const newStatus = !role.isActive;
    try {
      await statusMutation.mutateAsync({ id: role.id, isActive: newStatus });
      showNotification(
        "success",
        `Role "${role.roleName}" marked as ${newStatus ? "Active" : "Inactive"}.`
      );
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to update status.";
      showNotification("error", msg);
    }
  };

  const handleDeleteConfirm = async (roleId) => {
    try {
      await deleteMutation.mutateAsync(roleId);
      showNotification("success", "Role removed successfully.");
      setIsDeleteModalOpen(false);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to delete role.";
      showNotification("error", msg);
    }
  };

  const handleSeedConfirm = async (companyId) => {
    try {
      const result = await seedMutation.mutateAsync(companyId);
      showNotification(
        "success",
        result?.message || `Default system roles verified & seeded for company #${companyId}.`
      );
      setIsSeedModalOpen(false);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to seed default roles.";
      showNotification("error", msg);
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setScopeFilter("");
    setCompanyFilter("");
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    search || statusFilter !== "" || scopeFilter !== "" || companyFilter !== ""
  );

  const getRoleCompanyName = (r) => {
    if (r.companyName) return r.companyName;
    if (r.company_name) return r.company_name;
    const cId = r.companyId || r.company_id;
    if (!cId) return null;
    const match = companies.find((c) => Number(c.id) === Number(cId));
    return match?.company_name || match?.displayName || match?.companyName || `Company #${cId}`;
  };

  // Dropdown options
  const companyOptions = useMemo(
    () => [
      { value: "", label: "All Companies" },
      ...companies.map((c) => ({
        value: String(c.id),
        label: c.companyName,
        badge: c.companyCode || null,
        icon: Building,
      })),
    ],
    [companies]
  );

  const scopeOptions = useMemo(
    () => [
      { value: "", label: "All Scopes" },
      { value: "system", label: "Global System", icon: ShieldCheck },
      { value: "custom", label: "Company Custom", icon: Building },
    ],
    []
  );

  const statusOptions = useMemo(
    () => [
      { value: "", label: "All Statuses" },
      { value: "true", label: "Active Only", icon: CheckCircle2 },
      { value: "false", label: "Inactive Only", icon: AlertCircle },
    ],
    []
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Roles & Access Control"
        subtitle="Manage system permissions, authorization levels, and company role hierarchies."
        actions={
          <div className="flex items-center gap-2">
            {/* Super Admin Seed Defaults Button */}
            {isSuperAdmin && (
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsSeedModalOpen(true)}
                className="hidden sm:inline-flex"
              >
                <Sparkles className="w-4 h-4 mr-1.5 text-amber-500" />
                Seed Defaults
              </Button>
            )}

            {/* Refresh */}
            <Button
              variant="outline"
              size="md"
              onClick={() => refetch()}
              disabled={isFetching}
              title="Refresh roles"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-primary" : ""}`} />
            </Button>

            {/* Add New Role */}
            <Button variant="clip-six" size="md" onClick={handleOpenAdd}>
              <Plus className="w-4 h-4 mr-1.5" />
              Add Role
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
              placeholder="Search by role name or code (e.g. Cashier, ADMIN)..."
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
              <RoleFilterDropdown
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

            {/* Scope Filter */}
            <RoleFilterDropdown
              label="All Scopes"
              value={scopeFilter}
              options={scopeOptions}
              onChange={(val) => {
                setScopeFilter(val);
                setPage(1);
              }}
              icon={Shield}
              minWidth="min-w-[130px]"
            />

            {/* Status Filter */}
            <RoleFilterDropdown
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
                  className="hover:text-primary/70 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {companyFilter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 text-[11px] font-medium">
                <Building className="w-3 h-3 text-indigo-500" />
                Company: {companies.find((c) => String(c.id) === String(companyFilter))?.companyName || `#${companyFilter}`}
                <button
                  type="button"
                  onClick={() => setCompanyFilter("")}
                  className="hover:opacity-70 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {scopeFilter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-[11px] font-medium">
                <ShieldCheck className="w-3 h-3 text-amber-500" />
                Scope: {scopeFilter === "system" ? "Global System" : "Company Custom"}
                <button
                  type="button"
                  onClick={() => setScopeFilter("")}
                  className="hover:opacity-70 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {statusFilter !== "" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[11px] font-medium">
                Status: {statusFilter === "true" ? "Active Only" : "Inactive Only"}
                <button
                  type="button"
                  onClick={() => setStatusFilter("")}
                  className="hover:opacity-70 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[11px] font-semibold text-rose-500 hover:underline ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <RolesSkeleton viewMode={viewMode} />
      ) : roles.length === 0 ? (
        <div className="p-12 text-center bg-base-100 rounded-2xl border border-base-300 space-y-4 shadow-2xs">
          <div className="w-16 h-16 rounded-2xl bg-base-200 border border-base-300 mx-auto flex items-center justify-center text-base-content/40">
            <Shield className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-base-content">No Roles Found</h3>
            <p className="text-xs text-base-content/60 max-w-sm mx-auto">
              {hasActiveFilters
                ? "No roles match your current search query and filters. Try adjusting or clearing your filters."
                : "No roles have been created yet. Add a new role or seed default system roles."}
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
                Create First Role
              </Button>
            )}
          </div>
        </div>
      ) : viewMode === "table" ? (
        <RolesTable
          roles={roles}
          copiedCode={copiedCode}
          onCopyCode={handleCopyCode}
          onOpenDetails={handleOpenDetails}
          onOpenEdit={handleOpenEdit}
          onOpenDelete={handleOpenDelete}
          onToggleStatus={handleToggleStatus}
          getRoleCompanyName={getRoleCompanyName}
        />
      ) : (
        <RoleCardsView
          roles={roles}
          copiedCode={copiedCode}
          onCopyCode={handleCopyCode}
          onOpenDetails={handleOpenDetails}
          onOpenEdit={handleOpenEdit}
          onOpenDelete={handleOpenDelete}
          onToggleStatus={handleToggleStatus}
          getRoleCompanyName={getRoleCompanyName}
        />
      )}

      {/* Pagination */}
      {!isLoading && roles.length > 0 && (
        <Pagination
          currentPage={meta.page || page}
          totalPages={meta.totalPages || Math.ceil((meta.total || roles.length) / limit)}
          totalItems={meta.total || roles.length}
          itemsPerPage={limit}
          onPageChange={(newPage) => setPage(newPage)}
          onItemsPerPageChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
        />
      )}

      {/* Role Form Modal (Add / Edit) */}
      <RoleFormModal
        isOpen={isFormModalOpen}
        mode={formMode}
        initialData={selectedRole}
        saving={createMutation.isPending || updateMutation.isPending}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Role Delete Modal */}
      <RoleDeleteModal
        isOpen={isDeleteModalOpen}
        role={selectedRole}
        isDeleting={deleteMutation.isPending}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Role Details Modal */}
      <RoleDetailsModal
        isOpen={isDetailsModalOpen}
        role={selectedRole}
        canEdit={true}
        onClose={() => setIsDetailsModalOpen(false)}
        onEdit={(role) => handleOpenEdit(role)}
      />

      {/* Super Admin Seed Defaults Modal */}
      <RoleSeedModal
        isOpen={isSeedModalOpen}
        isSeeding={seedMutation.isPending}
        defaultCompanyId={userCompanyId || 1}
        onClose={() => setIsSeedModalOpen(false)}
        onConfirm={handleSeedConfirm}
      />
    </div>
  );
}
