import { useState, useMemo, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Scale,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Building,
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
  useUnits,
  useUnitStats,
  useCreateUnit,
  useUpdateUnit,
  useUpdateUnitStatus,
  useSeedDefaultUnits,
  useDeleteUnit,
} from "../hooks/useUnits.js";
import {
  UnitTableView,
  UnitCardsView,
  UnitFilterDropdown,
  UnitRecentSearches,
  UnitsSkeleton,
  UnitFormModal,
  UnitDetailsModal,
  UnitDeleteModal,
  UnitSeedDefaultsModal,
} from "../components/index.js";

const RECENT_SEARCHES_KEY = "pooja_units_recent_searches";

export default function UnitsPage() {
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
  const [sortBy, setSortBy] = useState("unit_name");
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
      const updated = [typeof queryOrItem === "object" ? queryOrItem : { query: text }, ...filtered].slice(0, 10);
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

  const handleRemoveRecentItem = (index) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Build query params
  const queryParams = useMemo(() => {
    const params = {
      page,
      limit,
      search: search.trim() || undefined,
      sortBy,
      sortOrder,
    };

    if (statusFilter === "active") params.is_active = true;
    if (statusFilter === "inactive") params.is_active = false;

    if (canSelectCompany && companyFilter) {
      params.company_id = Number(companyFilter);
    } else if (userCompanyId) {
      params.company_id = Number(userCompanyId);
    }

    return params;
  }, [page, limit, search, statusFilter, sortBy, sortOrder, canSelectCompany, companyFilter, userCompanyId]);

  // Main units query
  const {
    data: unitsResponse,
    isLoading,
    isFetching,
    refetch,
  } = useUnits(queryParams);

  // Query unit stats
  const statsParams = useMemo(() => {
    const p = {};
    if (canSelectCompany && companyFilter) {
      p.company_id = Number(companyFilter);
    } else if (userCompanyId) {
      p.company_id = Number(userCompanyId);
    }
    return p;
  }, [canSelectCompany, companyFilter, userCompanyId]);

  const { data: statsResponse } = useUnitStats(statsParams);

  // Mutations
  const createMutation = useCreateUnit();
  const updateMutation = useUpdateUnit();
  const updateStatusMutation = useUpdateUnitStatus();
  const seedDefaultsMutation = useSeedDefaultUnits();
  const deleteMutation = useDeleteUnit();

  // Normalize data
  const units = useMemo(() => {
    const list = unitsResponse?.data?.units || unitsResponse?.units || unitsResponse?.data || [];
    return Array.isArray(list) ? list : [];
  }, [unitsResponse]);

  const paginationMeta = unitsResponse?.data?.meta || unitsResponse?.meta || {
    page: 1,
    limit: 10,
    total: units.length,
    totalPages: 1,
  };

  const stats = statsResponse?.data || statsResponse || {};
  const counts = {
    total: stats.totalUnits ?? stats.total_units ?? paginationMeta.total ?? units.length,
    active: stats.activeUnits ?? stats.active_units ?? 0,
    inactive: stats.inactiveUnits ?? stats.inactive_units ?? 0,
  };

  // Company options for filter
  const companyOptions = useMemo(() => {
    const map = new Map();
    units.forEach((u) => {
      const cId = u.companyId || u.company_id;
      const cName = u.companyName || u.company_name;
      if (cId && cName && !map.has(cId)) {
        map.set(cId, { value: String(cId), label: cName });
      }
    });
    return Array.from(map.values());
  }, [units]);

  // Status options for filter dropdown
  const statusOptions = useMemo(
    () => [
      { value: "", label: "All Statuses" },
      { value: "active", label: "Active", dotColor: "bg-emerald-500" },
      { value: "inactive", label: "Inactive", dotColor: "bg-rose-500" },
    ],
    []
  );

  const handleCopyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Form Submit Handler (Add / Edit)
  const handleFormSubmit = async ({ values, isEdit }) => {
    setSaving(true);
    try {
      const payload = {
        company_id: Number(values.company_id || userCompanyId),
        unit_name: values.unit_name,
        unit_code: values.unit_code || undefined,
        decimal_places: Number(values.decimal_places) || 0,
        is_active: values.is_active,
      };

      if (isEdit) {
        await updateMutation.mutateAsync({ id: formModal.data.id, data: payload });
        showNotification("success", `Unit "${values.unit_name}" updated successfully.`);
      } else {
        await createMutation.mutateAsync(payload);
        showNotification("success", `Unit "${values.unit_name}" created successfully.`);
        handleAddRecentSearch(values.unit_name);
      }
      setFormModal({ open: false, mode: "add", data: null });
      refetch();
    } catch (err) {
      showNotification(
        "error",
        err.response?.data?.message || err.message || "Failed to save unit record."
      );
    } finally {
      setSaving(false);
    }
  };

  // Toggle Active Status Handler
  const handleToggleStatus = async (u) => {
    const newStatus = !(u.isActive !== undefined ? u.isActive : u.is_active);
    setStatusPendingId(u.id);
    try {
      await updateStatusMutation.mutateAsync({
        id: u.id,
        is_active: newStatus,
      });
      showNotification(
        "success",
        `Unit "${u.unitName || u.unit_name}" set to ${newStatus ? "Active" : "Inactive"}.`
      );
      refetch();
    } catch (err) {
      showNotification(
        "error",
        err.response?.data?.message || "Failed to update unit status."
      );
    } finally {
      setStatusPendingId(null);
    }
  };

  // Seed Presets Handler
  const handleSeedDefaults = async () => {
    try {
      const payload = {};
      if (userCompanyId) payload.company_id = Number(userCompanyId);
      await seedDefaultsMutation.mutateAsync(payload);
      showNotification("success", "Standard retail & textile units seeded successfully.");
      setSeedModalOpen(false);
      refetch();
    } catch (err) {
      showNotification(
        "error",
        err.response?.data?.message || "Failed to seed standard units."
      );
    }
  };

  // Delete Handler
  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteMutation.mutateAsync(toDelete.id);
      showNotification("success", `Unit "${toDelete.unitName || toDelete.unit_name}" deleted.`);
      setToDelete(null);
      refetch();
    } catch (err) {
      showNotification(
        "error",
        err.response?.data?.message || "Cannot delete unit referenced by products."
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
        title="Units Master"
        description="Configure units of measurement (Pieces, Meters, Pairs, Sets, Kilograms, Rolls) for product billing and inventory."
        actions={
          <div className="flex items-center gap-2">
            <div className="tooltip tooltip-bottom" data-tip="Refresh Units">
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
              New Unit
            </Button>
          </div>
        }
      />

      {/* Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Units */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-xs hover:border-primary/40 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider">
              Total Units
            </span>
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
              {counts.total}
            </span>
          </div>
          <span className="text-[11px] text-base-content/50 mt-1 block">
            Measurement units in system
          </span>
        </div>

        {/* Active Units */}
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
            Available in POS & inventory
          </span>
        </div>

        {/* Inactive Units */}
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
            Archived measurement units
          </span>
        </div>

        {/* Industry Presets */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-xs hover:border-amber-500/40 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider">
              Standard Presets
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
              30
            </span>
          </div>
          <span className="text-[11px] text-base-content/50 mt-1 block">
            Pre-configured retail units
          </span>
        </div>
      </div>

      {/* Search, Filter & Controls Toolbar */}
      <div className="rounded-3xl border border-base-300 bg-base-100 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search box with Recent Searches */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 min-w-0 max-w-2xl">
            <div ref={searchBoxRef} className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-base-content/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search unit by name or code..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                onFocus={() => {
                  if (recentSearches.length > 0) {
                    setIsRecentSearchesOpen(true);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && search.trim()) {
                    handleAddRecentSearch(search.trim());
                    setIsRecentSearchesOpen(false);
                  }
                }}
                className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm rounded-xl border border-base-300 bg-base-200/50 hover:bg-base-200 text-base-content focus:outline-none focus:border-primary focus:bg-base-100 transition-all font-medium"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content p-0.5 rounded-full hover:bg-base-300/50 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Recent Searches Popover */}
              <div className="relative">
                <UnitRecentSearches
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

          {/* Right: Filters, Sorting, and View Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <UnitFilterDropdown
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
              <UnitFilterDropdown
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
            <UnitFilterDropdown
              label="Sort By"
              value={sortBy}
              options={[
                { value: "unit_name", label: "Unit Name" },
                { value: "unit_code", label: "Unit Code" },
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
                  { id: "table", icon: TableIcon, label: "Table" },
                  { id: "cards", icon: LayoutGrid, label: "Cards" },
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
        <UnitsSkeleton viewMode={viewMode} />
      ) : (
        <AnimatedTabContent activeTab={viewMode}>
          {viewMode === "table" ? (
            <UnitTableView
              units={units}
              onViewDetails={(u) => setDetailsModal({ isOpen: true, data: u })}
              onEdit={(u) => setFormModal({ open: true, mode: "edit", data: u })}
              onDelete={(u) => setToDelete(u)}
              onToggleStatus={handleToggleStatus}
              onCopyText={handleCopyText}
              copiedKey={copiedKey}
              statusUpdatingId={statusPendingId}
            />
          ) : (
            <UnitCardsView
              units={units}
              onViewDetails={(u) => setDetailsModal({ isOpen: true, data: u })}
              onEdit={(u) => setFormModal({ open: true, mode: "edit", data: u })}
              onDelete={(u) => setToDelete(u)}
              onToggleStatus={handleToggleStatus}
              onCopyText={handleCopyText}
              copiedKey={copiedKey}
              statusUpdatingId={statusPendingId}
            />
          )}
        </AnimatedTabContent>
      )}

      {/* Pagination Bar */}
      {!isLoading && units.length > 0 && (
        <div className="pt-2">
          <Pagination
            currentPage={Number(paginationMeta.page) || page}
            totalPages={Number(paginationMeta.totalPages) || 1}
            totalItems={Number(paginationMeta.total) || units.length}
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

      {/* Form Modal (Add / Edit) */}
      <UnitFormModal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, mode: "add", data: null })}
        onSubmit={handleFormSubmit}
        initialData={formModal.data}
        isEdit={formModal.mode === "edit"}
        isLoading={saving}
      />

      {/* Details Modal */}
      <UnitDetailsModal
        isOpen={detailsModal.isOpen}
        onClose={() => setDetailsModal({ isOpen: false, data: null })}
        unit={detailsModal.data}
        onEdit={(u) => {
          setDetailsModal({ isOpen: false, data: null });
          setFormModal({ open: true, mode: "edit", data: u });
        }}
        onDelete={(u) => {
          setDetailsModal({ isOpen: false, data: null });
          setToDelete(u);
        }}
      />

      {/* Delete Confirmation Modal */}
      <UnitDeleteModal
        isOpen={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        unit={toDelete}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleting}
      />

      {/* Seed Defaults Modal */}
      <UnitSeedDefaultsModal
        isOpen={seedModalOpen}
        onClose={() => setSeedModalOpen(false)}
        onSeed={handleSeedDefaults}
        isSeeding={seedDefaultsMutation.isPending}
      />
    </div>
  );
}
