import { useState, useMemo, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Ruler,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Building,
  Layers,
  ArrowUpDown,
  LayoutGrid,
  Table as TableIcon,
  Sparkles,
  X,
} from "lucide-react";
import PageHeader from "../../../../common/components/PageHeader.jsx";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import Pagination from "../../../../common/components/ui/pagination/Pagination.jsx";
import { SlidingTabs, AnimatedTabContent } from "../../../../common/components/tabs/index.js";
import {
  useSizes,
  useSizeStats,
  useCreateSize,
  useUpdateSize,
  useUpdateSizeStatus,
  useSeedDefaultSizes,
  useDeleteSize,
} from "../hooks/useSizes.js";
import { useAllSizeGroups } from "../../size_groups/hooks/useSizeGroups.js";
import {
  SizeTableView,
  SizeCardsView,
  SizeFilterDropdown,
  SizeRecentSearches,
  SizesSkeleton,
  SizeFormModal,
  SizeDetailsModal,
  SizeDeleteModal,
  SizeSeedDefaultsModal,
} from "../components/index.js";

const RECENT_SEARCHES_KEY = "pooja_sizes_recent_searches";

export default function SizesPage() {
  const navigate = useNavigate();

  // Authentication & multi-tenancy context
  const currentUser = useSelector((state) => state.auth?.user);
  const roleCode = String(currentUser?.roleCode || currentUser?.role || "").toUpperCase();
  const userCompanyId = currentUser?.companyId || currentUser?.company_id;
  const isSuperAdminOrAdmin = roleCode === "SUPERADMIN" || roleCode === "ADMIN";
  const canSelectCompany = isSuperAdminOrAdmin && !userCompanyId;

  // Search, filtering, sorting, pagination state
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState(""); // "" | "active" | "inactive"
  const [companyFilter, setCompanyFilter] = useState("");
  const [sizeGroupFilter, setSizeGroupFilter] = useState("");
  const [sortBy, setSortBy] = useState("display_order");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("table");
  const [copiedKey, setCopiedKey] = useState(null);

  // Modals state
  const [formModal, setFormModal] = useState({ open: false, mode: "add", data: null });
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, data: null });
  const [seedModalOpen, setSeedModalOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusPendingId, setStatusPendingId] = useState(null);
  const [notification, setNotification] = useState(null);

  // Recent Searches state
  const [recentSearches, setRecentSearches] = useState([]);
  const [isRecentSearchesOpen, setIsRecentSearchesOpen] = useState(false);
  const searchBoxRef = useRef(null);

  // Load recent searches on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  // Close recent searches dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setIsRecentSearchesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAddRecentSearch = (queryOrItem) => {
    const text = typeof queryOrItem === "string" ? queryOrItem.trim() : queryOrItem.name || queryOrItem.query;
    if (!text) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => {
        const itemText = typeof item === "string" ? item : item.name || item.query;
        return itemText.toLowerCase() !== text.toLowerCase();
      });
      const updated = [queryOrItem, ...filtered].slice(0, 8);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // ignore
    }
  };

  const handleRemoveRecentItem = (itemToRemove) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => {
        if (typeof item === "string" && typeof itemToRemove === "string") {
          return item !== itemToRemove;
        }
        return item.id !== itemToRemove.id && item.name !== itemToRemove.name;
      });
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Build query params
  const isAll = limit === "all";
  const queryParams = useMemo(() => {
    const params = {
      page: isAll ? 1 : page,
      limit: isAll ? 100 : Math.min(Number(limit) || 10, 100),
      sortBy,
      sortOrder,
    };

    if (canSelectCompany) {
      if (companyFilter) {
        params.company_id = Number(companyFilter);
      }
    } else if (userCompanyId) {
      params.company_id = Number(userCompanyId);
    }

    if (sizeGroupFilter) {
      params.size_group_id = Number(sizeGroupFilter);
    }

    if (statusFilter === "active") {
      params.is_active = true;
    } else if (statusFilter === "inactive") {
      params.is_active = false;
    }

    if (search.trim()) {
      params.search = search.trim();
    }

    return params;
  }, [page, limit, canSelectCompany, companyFilter, userCompanyId, sizeGroupFilter, search, statusFilter, sortBy, sortOrder]);

  // Query server for paginated sizes
  const {
    data: sizesResponse,
    isLoading,
    isFetching,
    isError,
    error: apiError,
    refetch,
  } = useSizes(queryParams);

  // Query size stats
  const statsParams = useMemo(() => {
    const p = {};
    if (canSelectCompany && companyFilter) {
      p.company_id = Number(companyFilter);
    } else if (userCompanyId) {
      p.company_id = Number(userCompanyId);
    }
    if (sizeGroupFilter) {
      p.size_group_id = Number(sizeGroupFilter);
    }
    return p;
  }, [canSelectCompany, companyFilter, userCompanyId, sizeGroupFilter]);

  const { data: statsResponse } = useSizeStats(statsParams);

  // Fetch size groups for dropdown filtering & creation
  const groupsParams = useMemo(() => {
    const p = {};
    if (canSelectCompany && companyFilter) {
      p.company_id = Number(companyFilter);
    } else if (userCompanyId) {
      p.company_id = Number(userCompanyId);
    }
    return p;
  }, [canSelectCompany, companyFilter, userCompanyId]);

  const { data: sizeGroupsResponse } = useAllSizeGroups(groupsParams);

  const sizeGroups = useMemo(() => {
    const list = sizeGroupsResponse?.data || sizeGroupsResponse || [];
    return Array.isArray(list) ? list : [];
  }, [sizeGroupsResponse]);

  // Mutations
  const createMutation = useCreateSize();
  const updateMutation = useUpdateSize();
  const updateStatusMutation = useUpdateSizeStatus();
  const seedDefaultsMutation = useSeedDefaultSizes();
  const deleteMutation = useDeleteSize();

  // Normalize data
  const sizes = useMemo(() => {
    const list = sizesResponse?.data || sizesResponse?.sizes || sizesResponse || [];
    return Array.isArray(list) ? list : [];
  }, [sizesResponse]);

  const paginationMeta = sizesResponse?.meta || {
    page: 1,
    limit: 10,
    total: sizes.length,
    totalPages: 1,
  };

  const stats = statsResponse?.data || statsResponse || {};
  const counts = {
    total: stats.totalSizes ?? stats.total_sizes ?? paginationMeta.total ?? sizes.length,
    active: stats.activeSizes ?? stats.active_sizes ?? 0,
    inactive: stats.inactiveSizes ?? stats.inactive_sizes ?? 0,
    sizeGroupsCount: sizeGroups.length,
  };

  // Company options for filter
  const companyOptions = useMemo(() => {
    const map = new Map();
    sizes.forEach((s) => {
      const cId = s.companyId || s.company_id;
      const cName = s.companyName || s.company_name;
      if (cId && cName && !map.has(cId)) {
        map.set(cId, { value: String(cId), label: cName });
      }
    });
    return Array.from(map.values());
  }, [sizes]);

  // Size group options for filter
  const sizeGroupOptions = useMemo(() => {
    return sizeGroups.map((g) => ({
      value: String(g.id),
      label: g.sizeGroupName || g.size_group_name || `Group #${g.id}`,
    }));
  }, [sizeGroups]);

  // Status options for filter dropdown
  const statusOptions = useMemo(
    () => [
      { value: "", label: "All Statuses" },
      { value: "active", label: "Active", dotColor: "bg-emerald-500" },
      { value: "inactive", label: "Inactive", dotColor: "bg-rose-500" },
    ],
    []
  );

  // Handle Copy Code
  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(`size-${id}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Form Submit Handler (Add / Edit)
  const handleFormSubmit = async ({ values, isEdit }) => {
    setSaving(true);
    try {
      const payload = {
        company_id: Number(values.company_id || userCompanyId),
        size_group_id: Number(values.size_group_id),
        size_name: values.size_name,
        size_code: values.size_code || undefined,
        display_order: Number(values.display_order ?? 0),
        is_active: values.is_active,
      };

      if (isEdit) {
        await updateMutation.mutateAsync({ id: formModal.data.id, data: payload });
        showNotification("success", `Size "${values.size_name}" updated successfully.`);
      } else {
        await createMutation.mutateAsync(payload);
        showNotification("success", `Size "${values.size_name}" created successfully.`);
      }

      setFormModal({ open: false, mode: "add", data: null });
      refetch();
      return { success: true };
    } catch (err) {
      const respData = err.response?.data;
      const errorMsg =
        respData?.message ||
        respData?.error ||
        err.message ||
        "Could not save size. Please check fields.";

      if (errorMsg.toLowerCase().includes("size code")) {
        return { errors: { size_code: errorMsg } };
      }
      if (errorMsg.toLowerCase().includes("size name")) {
        return { errors: { size_name: errorMsg } };
      }

      showNotification("error", errorMsg);
      return { errors: { size_name: errorMsg } };
    } finally {
      setSaving(false);
    }
  };

  // Status Toggle Handler
  const handleToggleStatus = async (size) => {
    const name = size.sizeName || size.size_name;
    const currentStatus =
      size.isActive !== undefined ? size.isActive : Boolean(size.is_active);
    const nextStatus = !currentStatus;

    setStatusPendingId(size.id);
    try {
      await updateStatusMutation.mutateAsync({
        id: size.id,
        isActive: nextStatus,
      });
      showNotification(
        "success",
        `Size "${name}" is now ${nextStatus ? "Active" : "Inactive"}.`
      );
    } catch (err) {
      showNotification(
        "error",
        err.response?.data?.message || `Failed to update status for ${name}.`
      );
    } finally {
      setStatusPendingId(null);
    }
  };

  // Seed standard default sizes handler
  const handleSeedDefaults = async (sizeGroupId) => {
    try {
      const payload = {
        size_group_id: Number(sizeGroupId),
        ...(canSelectCompany && companyFilter ? { company_id: Number(companyFilter) } : {}),
      };

      const result = await seedDefaultsMutation.mutateAsync(payload);
      const count = result?.data?.length || result?.length || 0;
      showNotification(
        "success",
        `Standard default sizes seeded successfully (${count} sizes added).`
      );
      setSeedModalOpen(false);
      refetch();
    } catch (err) {
      showNotification(
        "error",
        err.response?.data?.message || "Failed to seed default sizes. Check if sizes already exist."
      );
    }
  };

  // Delete Handler
  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteMutation.mutateAsync(toDelete.id);
      showNotification("success", `Size "${toDelete.sizeName || toDelete.size_name}" deleted.`);
      setToDelete(null);
      refetch();
    } catch (err) {
      showNotification(
        "error",
        err.response?.data?.message || "Cannot delete size referenced by product variants."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-3 fade-in duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold border ${
              notification.type === "success"
                ? "bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/20"
                : "bg-rose-600 text-white border-rose-700 shadow-rose-600/20"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Sizes Master"
        description="Configure apparel measurement sizes (S, M, L, XL, 32, 38) classified by size group."
        actions={
          <div className="flex items-center gap-2">
            <div className="tooltip tooltip-bottom" data-tip="Refresh Sizes">
              <Button
                variant="outline"
                size="sm"
                icon={RefreshCw}
                onClick={() => refetch()}
                loading={isFetching && !isLoading}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={Sparkles}
              onClick={() => setSeedModalOpen(true)}
            >
              Seed Presets
            </Button>
            <Button
              variant="clip-six"
              size="sm"
              icon={Plus}
              onClick={() =>
                setFormModal({
                  open: true,
                  mode: "add",
                  data: null,
                })
              }
            >
              New Size
            </Button>
          </div>
        }
      />

      {/* Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Sizes */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-xs hover:border-primary/40 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider">
              Total Sizes
            </span>
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600">
              <Ruler className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
              {counts.total}
            </span>
          </div>
          <span className="text-[11px] text-base-content/50 mt-1 block">
            Across all measurement groups
          </span>
        </div>

        {/* Active Sizes */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-xs hover:border-emerald-500/40 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider">
              Active in Catalog
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              {counts.active}
            </span>
          </div>
          <span className="text-[11px] text-base-content/50 mt-1 block">
            Selectable in products & billing
          </span>
        </div>

        {/* Inactive Sizes */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-xs hover:border-rose-500/40 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider">
              Hidden / Inactive
            </span>
            <div className="w-9 h-9 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-base-content/80 tracking-tight">
              {counts.inactive}
            </span>
          </div>
          <span className="text-[11px] text-base-content/50 mt-1 block">
            Temporarily archived from POS
          </span>
        </div>

        {/* Size Groups */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-xs hover:border-amber-500/40 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider">
              Size Groups
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
              {counts.sizeGroupsCount}
            </span>
          </div>
          <span className="text-[11px] text-base-content/50 mt-1 block">
            Classification sets configured
          </span>
        </div>
      </div>

      {/* Search, Filter & Controls Toolbar */}
      <div className="rounded-3xl border border-base-300 bg-base-100 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Top line: Search Bar + Status Tabs */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search box & Status pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 min-w-0 max-w-2xl">
            <div ref={searchBoxRef} className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-base-content/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search size by name or code..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                  if (recentSearches.length > 0) {
                    setIsRecentSearchesOpen(true);
                  }
                }}
                onClick={() => {
                  if (recentSearches.length > 0) {
                    setIsRecentSearchesOpen(true);
                  }
                }}
                onFocus={() => {
                  if (recentSearches.length > 0) {
                    setIsRecentSearchesOpen(true);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (search || "").trim()) {
                    handleAddRecentSearch((search || "").trim());
                  }
                }}
                className="w-full pl-9 pr-18 py-2 rounded-xl bg-base-200/60 border border-base-300 text-xs sm:text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {search && (
                  <div className="tooltip tooltip-bottom" data-tip="Clear search">
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setPage(1);
                      }}
                      className="text-base-content/40 hover:text-base-content p-1 rounded-lg hover:bg-base-300/50 transition-colors cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Recent Searches Popover */}
              <div className="relative">
                <SizeRecentSearches
                  isOpen={isRecentSearchesOpen}
                  items={recentSearches}
                  onSelect={(item) => {
                    setSearch(item.name || item.query || item);
                    setPage(1);
                    setIsRecentSearchesOpen(false);
                    handleAddRecentSearch(item);
                  }}
                  onClearAll={handleClearRecentSearches}
                  onRemoveItem={handleRemoveRecentItem}
                />
              </div>
            </div>
          </div>

          {/* Right: Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Parent Size Group Filter */}
            <SizeFilterDropdown
              label="Size Group"
              value={sizeGroupFilter}
              options={sizeGroupOptions}
              onChange={(val) => {
                setSizeGroupFilter(val);
                setPage(1);
              }}
              icon={Layers}
              minWidth="min-w-[150px]"
              searchable={true}
              searchPlaceholder="Search size group..."
            />

            {/* Status Filter */}
            <SizeFilterDropdown
              label="All Statuses"
              value={statusFilter}
              options={statusOptions}
              onChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
              minWidth="min-w-[135px]"
            />

            {/* Company Filter (SuperAdmin / Admin only) */}
            {canSelectCompany && (
              <SizeFilterDropdown
                label="Company"
                value={companyFilter}
                options={companyOptions}
                onChange={(val) => {
                  setCompanyFilter(val);
                  setPage(1);
                }}
                icon={Building}
                minWidth="min-w-[150px]"
                searchable={true}
                searchPlaceholder="Search company..."
              />
            )}

            {/* Sort Field */}
            <SizeFilterDropdown
              label="Sort By"
              value={sortBy}
              options={[
                { value: "display_order", label: "Display Order" },
                { value: "size_name", label: "Size Name" },
                { value: "size_code", label: "Size Code" },
                { value: "created_at", label: "Date Created" },
                { value: "id", label: "ID Sequence" },
              ]}
              onChange={(val) => {
                setSortBy(val);
                setPage(1);
              }}
              icon={ArrowUpDown}
              minWidth="min-w-[140px]"
            />

            {/* Sort Direction Toggle Button */}
            <button
              type="button"
              onClick={() => {
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                setPage(1);
              }}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-base-300 bg-base-100 hover:bg-base-200 text-base-content transition-all cursor-pointer"
              title={`Sort: ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
            >
              <span>{sortOrder === "asc" ? "↑ ASC" : "↓ DESC"}</span>
            </button>

            {/* View Mode Switcher with SlidingTabs */}
            <div className="flex items-center">
              <SlidingTabs
                tabs={[
                  { id: "table", icon: TableIcon, label: "" },
                  { id: "cards", icon: LayoutGrid, label: "" },
                ]}
                activeTab={viewMode}
                onChange={setViewMode}
                variant="segmented"
                size="xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <SizesSkeleton viewMode={viewMode} />
      ) : (
        <AnimatedTabContent activeTab={viewMode}>
          {viewMode === "table" ? (
            <SizeTableView
              sizes={sizes}
              onViewDetails={(sz) => setDetailsModal({ isOpen: true, data: sz })}
              onEdit={(sz) => setFormModal({ open: true, mode: "edit", data: sz })}
              onDelete={(sz) => setToDelete(sz)}
              onToggleStatus={handleToggleStatus}
              onCopyCode={handleCopyCode}
              copiedKey={copiedKey}
              statusPendingId={statusPendingId}
            />
          ) : (
            <SizeCardsView
              sizes={sizes}
              onViewDetails={(sz) => setDetailsModal({ isOpen: true, data: sz })}
              onEdit={(sz) => setFormModal({ open: true, mode: "edit", data: sz })}
              onDelete={(sz) => setToDelete(sz)}
              onToggleStatus={handleToggleStatus}
              onCopyCode={handleCopyCode}
              copiedKey={copiedKey}
              statusPendingId={statusPendingId}
            />
          )}
        </AnimatedTabContent>
      )}

      {/* Pagination Bar */}
      {!isLoading && sizes.length > 0 && (
        <div className="pt-2">
          <Pagination
            currentPage={Number(paginationMeta.page) || page}
            totalPages={Number(paginationMeta.totalPages) || 1}
            totalItems={Number(paginationMeta.total) || sizes.length}
            pageSize={limit}
            onPageChange={setPage}
            onPageSizeChange={(newSize) => {
              setLimit(newSize);
              setPage(1);
            }}
            pageSizeOptions={[10, 25, 50, "All"]}
          />
        </div>
      )}

      {/* Add / Edit Modal */}
      <SizeFormModal
        open={formModal.open}
        mode={formModal.mode}
        initialData={formModal.data}
        initialCompanyId={companyFilter}
        initialSizeGroupId={sizeGroupFilter}
        saving={saving}
        onClose={() => setFormModal({ open: false, mode: "add", data: null })}
        onSubmit={handleFormSubmit}
      />

      {/* Quick View Details Modal */}
      <SizeDetailsModal
        isOpen={detailsModal.isOpen}
        size={detailsModal.data}
        onClose={() => setDetailsModal({ isOpen: false, data: null })}
        onEdit={(sz) => setFormModal({ open: true, mode: "edit", data: sz })}
        onDelete={(sz) => setToDelete(sz)}
        onToggleStatus={handleToggleStatus}
        onNavigateFullPage={(sz) => navigate(`/products/sizes/${sz.id}`)}
      />

      {/* Delete Confirmation Modal */}
      <SizeDeleteModal
        isOpen={Boolean(toDelete)}
        size={toDelete}
        isDeleting={deleting}
        onClose={() => setToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Seed Defaults Modal */}
      <SizeSeedDefaultsModal
        isOpen={seedModalOpen}
        onClose={() => setSeedModalOpen(false)}
        onSeed={handleSeedDefaults}
        isSeeding={seedDefaultsMutation.isPending}
        sizeGroups={sizeGroups}
        initialSizeGroupId={sizeGroupFilter}
      />
    </div>
  );
}
