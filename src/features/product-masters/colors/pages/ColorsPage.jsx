import { useState, useMemo, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Palette,
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
  Layers,
  Hash,
  X,
} from "lucide-react";
import PageHeader from "../../../../common/components/PageHeader.jsx";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import Pagination from "../../../../common/components/ui/pagination/Pagination.jsx";
import { toast } from "../../../../common/components/toast/index.js";
import { SlidingTabs, AnimatedTabContent } from "../../../../common/components/tabs/index.js";
import {
  useColors,
  useColorStats,
  useCreateColor,
  useUpdateColor,
  useUpdateColorStatus,
  useSeedDefaultColors,
  useDeleteColor,
} from "../hooks/useColors.js";
import {
  ColorTableView,
  ColorCardsView,
  ColorFilterDropdown,
  ColorRecentSearches,
  ColorsSkeleton,
  ColorFormModal,
  ColorDetailsModal,
  ColorDeleteModal,
  ColorSeedDefaultsModal,
} from "../components/index.js";

const RECENT_SEARCHES_KEY = "pooja_colors_recent_searches";

export default function ColorsPage() {
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

  // Close recent searches popover on outside click
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
    if (type === "success") toast.success(message);
    else if (type === "error") toast.error(message);
    else if (type === "warning") toast.warning(message);
    else toast.help(message);
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

  // Main colors query
  const {
    data: colorsResponse,
    isLoading,
    isFetching,
    refetch,
  } = useColors(queryParams);

  // Query color stats
  const statsParams = useMemo(() => {
    const p = {};
    if (canSelectCompany && companyFilter) {
      p.company_id = Number(companyFilter);
    } else if (userCompanyId) {
      p.company_id = Number(userCompanyId);
    }
    return p;
  }, [canSelectCompany, companyFilter, userCompanyId]);

  const { data: statsResponse } = useColorStats(statsParams);

  // Mutations
  const createMutation = useCreateColor();
  const updateMutation = useUpdateColor();
  const updateStatusMutation = useUpdateColorStatus();
  const seedDefaultsMutation = useSeedDefaultColors();
  const deleteMutation = useDeleteColor();

  // Normalize data
  const colors = useMemo(() => {
    const list = colorsResponse?.data || colorsResponse?.colors || colorsResponse || [];
    return Array.isArray(list) ? list : [];
  }, [colorsResponse]);

  const paginationMeta = colorsResponse?.meta || {
    page: 1,
    limit: 10,
    total: colors.length,
    totalPages: 1,
  };

  const stats = statsResponse?.data || statsResponse || {};
  const counts = {
    total: stats.totalColors ?? stats.total_colors ?? paginationMeta.total ?? colors.length,
    active: stats.activeColors ?? stats.active_colors ?? 0,
    inactive: stats.inactiveColors ?? stats.inactive_colors ?? 0,
    withHex: stats.withHex ?? stats.with_hex ?? colors.filter((c) => Boolean(c.hexCode || c.hex_code)).length,
  };

  // Company options for filter
  const companyOptions = useMemo(() => {
    const map = new Map();
    colors.forEach((c) => {
      const cId = c.companyId || c.company_id;
      const cName = c.companyName || c.company_name;
      if (cId && cName && !map.has(cId)) {
        map.set(cId, { value: String(cId), label: cName });
      }
    });
    return Array.from(map.values());
  }, [colors]);

  // Status options for filter dropdown
  const statusOptions = useMemo(
    () => [
      { value: "", label: "All Statuses" },
      { value: "active", label: "Active", dotColor: "bg-emerald-500" },
      { value: "inactive", label: "Inactive", dotColor: "bg-rose-500" },
    ],
    []
  );

  // Handle Copy Text
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
        color_name: values.color_name,
        color_code: values.color_code || undefined,
        hex_code: values.hex_code ? String(values.hex_code).trim() : null,
        description: values.description ? String(values.description).trim() : null,
        display_order: Number(values.display_order ?? 0),
        is_active: values.is_active,
      };

      if (isEdit) {
        await updateMutation.mutateAsync({ id: formModal.data.id, data: payload });
        showNotification("success", `Color "${values.color_name}" updated successfully.`);
      } else {
        await createMutation.mutateAsync(payload);
        showNotification("success", `Color "${values.color_name}" created successfully.`);
        handleAddRecentSearch(values.color_name);
      }
      setFormModal({ open: false, mode: "add", data: null });
      refetch();
    } catch (err) {
      showNotification(
        "error",
        err.response?.data?.message || err.message || "Failed to save color record."
      );
    } finally {
      setSaving(false);
    }
  };

  // Toggle Active Status Handler
  const handleToggleStatus = async (color) => {
    const newStatus = !(color.isActive !== undefined ? color.isActive : color.is_active);
    setStatusPendingId(color.id);
    try {
      await updateStatusMutation.mutateAsync({
        id: color.id,
        is_active: newStatus,
      });
      showNotification(
        "success",
        `Color "${color.colorName || color.color_name}" set to ${newStatus ? "Active" : "Inactive"}.`
      );
      refetch();
    } catch (err) {
      showNotification(
        "error",
        err.response?.data?.message || "Failed to update color status."
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
      showNotification("success", "Standard fashion retail color palette seeded successfully.");
      setSeedModalOpen(false);
      refetch();
    } catch (err) {
      showNotification(
        "error",
        err.response?.data?.message || "Failed to seed standard color palette."
      );
    }
  };

  // Delete Handler
  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteMutation.mutateAsync(toDelete.id);
      showNotification("success", `Color "${toDelete.colorName || toDelete.color_name}" deleted.`);
      setToDelete(null);
      refetch();
    } catch (err) {
      showNotification(
        "error",
        err.response?.data?.message || "Cannot delete color referenced by product variants."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Colors Master"
        description="Manage apparel color variants, digital hex swatches, and multicolor textiles for fashion items."
        actions={
          <div className="flex items-center gap-2">
            <div className="tooltip tooltip-bottom" data-tip="Refresh Colors">
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
              Seed Palette
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
              New Color
            </Button>
          </div>
        }
      />

      {/* Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Colors */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-xs hover:border-primary/40 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider">
              Total Colors
            </span>
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600">
              <Palette className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
              {counts.total}
            </span>
          </div>
          <span className="text-[11px] text-base-content/50 mt-1 block">
            Across active fashion catalog
          </span>
        </div>

        {/* Active Colors */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-xs hover:border-emerald-500/40 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider">
              Active Swatches
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
            Selectable in POS & variant matrix
          </span>
        </div>

        {/* Inactive Colors */}
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
            Temporarily archived variants
          </span>
        </div>

        {/* Digital Swatches */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-xs hover:border-purple-500/40 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider">
              Digital Swatches
            </span>
            <div className="w-9 h-9 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600">
              <Hash className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
              {counts.withHex}
            </span>
          </div>
          <span className="text-[11px] text-base-content/50 mt-1 block">
            Hexadecimal codes mapped
          </span>
        </div>
      </div>

      {/* Search, Filter & Controls Toolbar */}
      <div className="rounded-3xl border border-base-300 bg-base-100 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Top line: Search Bar + Filter Dropdowns + View Mode Tabs */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search box with Recent Searches */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 min-w-0 max-w-2xl">
            <div ref={searchBoxRef} className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-base-content/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search color by name, code or hex..."
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
                <ColorRecentSearches
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
            <ColorFilterDropdown
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
              <ColorFilterDropdown
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
            <ColorFilterDropdown
              label="Sort By"
              value={sortBy}
              options={[
                { value: "display_order", label: "Display Order" },
                { value: "color_name", label: "Color Name" },
                { value: "color_code", label: "Color Code" },
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
        <ColorsSkeleton viewMode={viewMode} />
      ) : (
        <AnimatedTabContent activeTab={viewMode}>
          {viewMode === "table" ? (
            <ColorTableView
              colors={colors}
              page={page}
              limit={limit}
              totalItems={paginationMeta.total}
              setPage={setPage}
              setLimit={setLimit}
              onViewDetails={(c) => setDetailsModal({ isOpen: true, data: c })}
              onEdit={(c) => setFormModal({ open: true, mode: "edit", data: c })}
              onDelete={(c) => setToDelete(c)}
              onToggleStatus={handleToggleStatus}
              onCopyText={handleCopyText}
              copiedKey={copiedKey}
              statusUpdatingId={statusPendingId}
            />
          ) : (
            <ColorCardsView
              colors={colors}
              onViewDetails={(c) => setDetailsModal({ isOpen: true, data: c })}
              onEdit={(c) => setFormModal({ open: true, mode: "edit", data: c })}
              onDelete={(c) => setToDelete(c)}
              onToggleStatus={handleToggleStatus}
              onCopyText={handleCopyText}
              copiedKey={copiedKey}
              statusUpdatingId={statusPendingId}
            />
          )}
        </AnimatedTabContent>
      )}

      {/* Pagination Bar */}
      {!isLoading && colors.length > 0 && (
        <div className="pt-2">
          <Pagination
            currentPage={Number(paginationMeta.page) || page}
            totalPages={Number(paginationMeta.totalPages) || 1}
            totalItems={Number(paginationMeta.total) || colors.length}
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
      <ColorFormModal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, mode: "add", data: null })}
        onSubmit={handleFormSubmit}
        initialData={formModal.data}
        isEdit={formModal.mode === "edit"}
        isLoading={saving}
      />

      {/* Details Modal */}
      <ColorDetailsModal
        isOpen={detailsModal.isOpen}
        onClose={() => setDetailsModal({ isOpen: false, data: null })}
        color={detailsModal.data}
        onEdit={(c) => {
          setDetailsModal({ isOpen: false, data: null });
          setFormModal({ open: true, mode: "edit", data: c });
        }}
        onDelete={(c) => {
          setDetailsModal({ isOpen: false, data: null });
          setToDelete(c);
        }}
      />

      {/* Delete Confirmation Modal */}
      <ColorDeleteModal
        isOpen={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        color={toDelete}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleting}
      />

      {/* Seed Defaults Modal */}
      <ColorSeedDefaultsModal
        isOpen={seedModalOpen}
        onClose={() => setSeedModalOpen(false)}
        onSeed={handleSeedDefaults}
        isSeeding={seedDefaultsMutation.isPending}
      />
    </div>
  );
}
