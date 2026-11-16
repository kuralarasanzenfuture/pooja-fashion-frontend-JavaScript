import { useState, useMemo, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Layers,
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
  useMaterials,
  useMaterialStats,
  useCreateMaterial,
  useUpdateMaterial,
  useUpdateMaterialStatus,
  useSeedDefaultMaterials,
  useDeleteMaterial,
} from "../hooks/useMaterials.js";
import {
  MaterialTableView,
  MaterialCardsView,
  MaterialFilterDropdown,
  MaterialRecentSearches,
  MaterialsSkeleton,
  MaterialFormModal,
  MaterialDetailsModal,
  MaterialDeleteModal,
  MaterialSeedDefaultsModal,
} from "../components/index.js";

const RECENT_SEARCHES_KEY = "pooja_materials_recent_searches";

export default function MaterialsPage() {
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
  const [sortBy, setSortBy] = useState("material_name");
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

  // Main materials query
  const {
    data: materialsResponse,
    isLoading,
    isFetching,
    refetch,
  } = useMaterials(queryParams);

  // Query material stats
  const statsParams = useMemo(() => {
    const p = {};
    if (canSelectCompany && companyFilter) {
      p.company_id = Number(companyFilter);
    } else if (userCompanyId) {
      p.company_id = Number(userCompanyId);
    }
    return p;
  }, [canSelectCompany, companyFilter, userCompanyId]);

  const { data: statsResponse } = useMaterialStats(statsParams);

  // Mutations
  const createMutation = useCreateMaterial();
  const updateMutation = useUpdateMaterial();
  const updateStatusMutation = useUpdateMaterialStatus();
  const seedDefaultsMutation = useSeedDefaultMaterials();
  const deleteMutation = useDeleteMaterial();

  // Normalize data
  const materials = useMemo(() => {
    const list = materialsResponse?.data?.materials || materialsResponse?.materials || materialsResponse?.data || [];
    return Array.isArray(list) ? list : [];
  }, [materialsResponse]);

  const paginationMeta = materialsResponse?.data?.meta || materialsResponse?.meta || {
    page: 1,
    limit: 10,
    total: materials.length,
    totalPages: 1,
  };

  const stats = statsResponse?.data || statsResponse || {};
  const counts = {
    total: stats.totalMaterials ?? stats.total_materials ?? paginationMeta.total ?? materials.length,
    active: stats.activeMaterials ?? stats.active_materials ?? 0,
    inactive: stats.inactiveMaterials ?? stats.inactive_materials ?? 0,
  };

  // Company options for filter
  const companyOptions = useMemo(() => {
    const map = new Map();
    materials.forEach((m) => {
      const cId = m.companyId || m.company_id;
      const cName = m.companyName || m.company_name;
      if (cId && cName && !map.has(cId)) {
        map.set(cId, { value: String(cId), label: cName });
      }
    });
    return Array.from(map.values());
  }, [materials]);

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
        material_name: values.material_name,
        material_code: values.material_code || undefined,
        description: values.description ? String(values.description).trim() : null,
        is_active: values.is_active,
      };

      if (isEdit) {
        await updateMutation.mutateAsync({ id: formModal.data.id, data: payload });
        showNotification("success", `Material "${values.material_name}" updated successfully.`);
      } else {
        await createMutation.mutateAsync(payload);
        showNotification("success", `Material "${values.material_name}" created successfully.`);
        handleAddRecentSearch(values.material_name);
      }
      setFormModal({ open: false, mode: "add", data: null });
      refetch();
    } catch (err) {
      showNotification(
        "error",
        err.response?.data?.message || err.message || "Failed to save material record."
      );
    } finally {
      setSaving(false);
    }
  };

  // Toggle Active Status Handler
  const handleToggleStatus = async (mat) => {
    const newStatus = !(mat.isActive !== undefined ? mat.isActive : mat.is_active);
    setStatusPendingId(mat.id);
    try {
      await updateStatusMutation.mutateAsync({
        id: mat.id,
        is_active: newStatus,
      });
      showNotification(
        "success",
        `Material "${mat.materialName || mat.material_name}" set to ${newStatus ? "Active" : "Inactive"}.`
      );
      refetch();
    } catch (err) {
      showNotification(
        "error",
        err.response?.data?.message || "Failed to update material status."
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
      showNotification("success", "Standard fashion retail materials seeded successfully.");
      setSeedModalOpen(false);
      refetch();
    } catch (err) {
      showNotification(
        "error",
        err.response?.data?.message || "Failed to seed standard materials."
      );
    }
  };

  // Delete Handler
  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteMutation.mutateAsync(toDelete.id);
      showNotification("success", `Material "${toDelete.materialName || toDelete.material_name}" deleted.`);
      setToDelete(null);
      refetch();
    } catch (err) {
      showNotification(
        "error",
        err.response?.data?.message || "Cannot delete material referenced by product variants."
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
        title="Materials Master"
        description="Configure apparel fabrics and textile materials (Cotton, Silk, Denim, Linen, Banarasi) for garments and sarees."
        actions={
          <div className="flex items-center gap-2">
            <div className="tooltip tooltip-bottom" data-tip="Refresh Materials">
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
              New Material
            </Button>
          </div>
        }
      />

      {/* Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Materials */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-xs hover:border-primary/40 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider">
              Total Materials
            </span>
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
              {counts.total}
            </span>
          </div>
          <span className="text-[11px] text-base-content/50 mt-1 block">
            Fabrics across apparel catalog
          </span>
        </div>

        {/* Active Materials */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-xs hover:border-emerald-500/40 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider">
              Active Fabrics
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
            Selectable in POS & products
          </span>
        </div>

        {/* Inactive Materials */}
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
            Temporarily archived fabrics
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
              40
            </span>
          </div>
          <span className="text-[11px] text-base-content/50 mt-1 block">
            Pre-configured textile palette
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
                placeholder="Search material by name or code..."
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
                <MaterialRecentSearches
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
            <MaterialFilterDropdown
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
              <MaterialFilterDropdown
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
            <MaterialFilterDropdown
              label="Sort By"
              value={sortBy}
              options={[
                { value: "material_name", label: "Material Name" },
                { value: "material_code", label: "Material Code" },
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
        <MaterialsSkeleton viewMode={viewMode} />
      ) : (
        <AnimatedTabContent activeTab={viewMode}>
          {viewMode === "table" ? (
            <MaterialTableView
              materials={materials}
              onViewDetails={(m) => setDetailsModal({ isOpen: true, data: m })}
              onEdit={(m) => setFormModal({ open: true, mode: "edit", data: m })}
              onDelete={(m) => setToDelete(m)}
              onToggleStatus={handleToggleStatus}
              onCopyText={handleCopyText}
              copiedKey={copiedKey}
              statusUpdatingId={statusPendingId}
            />
          ) : (
            <MaterialCardsView
              materials={materials}
              onViewDetails={(m) => setDetailsModal({ isOpen: true, data: m })}
              onEdit={(m) => setFormModal({ open: true, mode: "edit", data: m })}
              onDelete={(m) => setToDelete(m)}
              onToggleStatus={handleToggleStatus}
              onCopyText={handleCopyText}
              copiedKey={copiedKey}
              statusUpdatingId={statusPendingId}
            />
          )}
        </AnimatedTabContent>
      )}

      {/* Pagination Bar */}
      {!isLoading && materials.length > 0 && (
        <div className="pt-2">
          <Pagination
            currentPage={Number(paginationMeta.page) || page}
            totalPages={Number(paginationMeta.totalPages) || 1}
            totalItems={Number(paginationMeta.total) || materials.length}
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
      <MaterialFormModal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, mode: "add", data: null })}
        onSubmit={handleFormSubmit}
        initialData={formModal.data}
        isEdit={formModal.mode === "edit"}
        isLoading={saving}
      />

      {/* Details Modal */}
      <MaterialDetailsModal
        isOpen={detailsModal.isOpen}
        onClose={() => setDetailsModal({ isOpen: false, data: null })}
        material={detailsModal.data}
        onEdit={(m) => {
          setDetailsModal({ isOpen: false, data: null });
          setFormModal({ open: true, mode: "edit", data: m });
        }}
        onDelete={(m) => {
          setDetailsModal({ isOpen: false, data: null });
          setToDelete(m);
        }}
      />

      {/* Delete Confirmation Modal */}
      <MaterialDeleteModal
        isOpen={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        material={toDelete}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleting}
      />

      {/* Seed Defaults Modal */}
      <MaterialSeedDefaultsModal
        isOpen={seedModalOpen}
        onClose={() => setSeedModalOpen(false)}
        onSeed={handleSeedDefaults}
        isSeeding={seedDefaultsMutation.isPending}
      />
    </div>
  );
}

