import { useState, useMemo, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Tag,
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
  Package,
  ShoppingBag,
  Truck,
  Filter,
  Layers,
  Calendar,
} from "lucide-react";
import PageHeader from "../../../../common/components/PageHeader.jsx";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import Pagination from "../../../../common/components/ui/pagination/Pagination.jsx";
import {
  useProductTypes,
  useProductTypeStats,
  useCreateProductType,
  useUpdateProductType,
  useUpdateProductTypeStatus,
  useSeedDefaultProductTypes,
  useDeleteProductType,
} from "../hooks/useProductTypes.js";
import {
  ProductTypeTableView,
  ProductTypeCardsView,
  ProductTypeFilterDropdown,
  ProductTypeRecentSearches,
  ProductTypesSkeleton,
  ProductTypeFormModal,
  ProductTypeDetailsModal,
  ProductTypeDeleteModal,
  ProductTypeSeedDefaultsModal,
} from "../components/index.js";

const RECENT_SEARCHES_KEY = "pooja_product_types_recent_searches";

export default function ProductTypesPage() {
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
  const [stockFilter, setStockFilter] = useState(""); // "" | "true" | "false"
  const [saleableFilter, setSaleableFilter] = useState(""); // "" | "true" | "false"
  const [purchasableFilter, setPurchasableFilter] = useState(""); // "" | "true" | "false"
  const [companyFilter, setCompanyFilter] = useState("");
  const [sortBy, setSortBy] = useState("type_name");
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
    if (stockFilter === "true") params.is_stock_item = true;
    if (stockFilter === "false") params.is_stock_item = false;
    if (saleableFilter === "true") params.is_saleable = true;
    if (saleableFilter === "false") params.is_saleable = false;
    if (purchasableFilter === "true") params.is_purchasable = true;
    if (purchasableFilter === "false") params.is_purchasable = false;

    if (canSelectCompany && companyFilter) {
      params.company_id = Number(companyFilter);
    } else if (userCompanyId) {
      params.company_id = Number(userCompanyId);
    }

    return params;
  }, [
    page,
    limit,
    search,
    statusFilter,
    stockFilter,
    saleableFilter,
    purchasableFilter,
    sortBy,
    sortOrder,
    canSelectCompany,
    companyFilter,
    userCompanyId,
  ]);

  // Main product types query
  const {
    data: productTypesResponse,
    isLoading,
    isFetching,
    refetch,
  } = useProductTypes(queryParams);

  // Query product type stats
  const statsParams = useMemo(() => {
    const p = {};
    if (canSelectCompany && companyFilter) {
      p.company_id = Number(companyFilter);
    } else if (userCompanyId) {
      p.company_id = Number(userCompanyId);
    }
    return p;
  }, [canSelectCompany, companyFilter, userCompanyId]);

  const { data: statsResponse } = useProductTypeStats(statsParams);

  // Mutations
  const createMutation = useCreateProductType();
  const updateMutation = useUpdateProductType();
  const updateStatusMutation = useUpdateProductTypeStatus();
  const seedDefaultsMutation = useSeedDefaultProductTypes();
  const deleteMutation = useDeleteProductType();

  // Normalize data
  const productTypes = useMemo(() => {
    const list =
      productTypesResponse?.data?.productTypes ||
      productTypesResponse?.productTypes ||
      productTypesResponse?.data ||
      [];
    return Array.isArray(list) ? list : [];
  }, [productTypesResponse]);

  const paginationMeta = productTypesResponse?.data?.meta || productTypesResponse?.meta || {
    page: 1,
    limit: 10,
    total: productTypes.length,
    totalPages: 1,
  };

  const stats = statsResponse?.data || statsResponse || {};
  const counts = {
    total: stats.totalTypes ?? stats.total_types ?? paginationMeta.total ?? productTypes.length,
    active: stats.activeTypes ?? stats.active_types ?? 0,
    stock: stats.stockItemTypes ?? stats.stock_item_types ?? 0,
    saleable: stats.saleableTypes ?? stats.saleable_types ?? 0,
    purchasable: stats.purchasableTypes ?? stats.purchasable_types ?? 0,
  };

  // Company options for filter
  const companyOptions = useMemo(() => {
    const map = new Map();
    productTypes.forEach((pt) => {
      const cId = pt.companyId || pt.company_id;
      const cName = pt.companyName || pt.company_name;
      if (cId && cName && !map.has(String(cId))) {
        map.set(String(cId), { value: String(cId), label: cName, icon: Building });
      }
    });
    const list = Array.from(map.values());
    return list.length > 0 ? [{ value: "", label: "All Companies", icon: Building }, ...list] : [];
  }, [productTypes]);

  // Filter options
  const statusOptions = useMemo(
    () => [
      { value: "", label: "All Statuses" },
      { value: "active", label: "Active", dotColor: "bg-emerald-500" },
      { value: "inactive", label: "Inactive", dotColor: "bg-rose-500" },
    ],
    []
  );

  const stockOptions = useMemo(
    () => [
      { value: "", label: "All Inventory", icon: Package },
      { value: "true", label: "Stock Items", dotColor: "bg-indigo-500" },
      { value: "false", label: "Non-Stock Items", dotColor: "bg-base-content/40" },
    ],
    []
  );

  const saleableOptions = useMemo(
    () => [
      { value: "", label: "All Saleable", icon: ShoppingBag },
      { value: "true", label: "Saleable on POS", dotColor: "bg-emerald-500" },
      { value: "false", label: "Non-Saleable", dotColor: "bg-base-content/40" },
    ],
    []
  );

  const sortOptions = useMemo(
    () => [
      { value: "type_name", label: "Type Name", icon: Layers },
      { value: "type_code", label: "Type Code", icon: Tag },
      { value: "created_at", label: "Date Created", icon: Calendar },
      { value: "is_active", label: "Catalog Status", icon: CheckCircle2 },
    ],
    []
  );

  const hasActiveFilters = Boolean(
    (search || "").trim() ||
      statusFilter !== "" ||
      stockFilter !== "" ||
      saleableFilter !== "" ||
      companyFilter !== "" ||
      sortBy !== "type_name" ||
      sortOrder !== "asc"
  );

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setStockFilter("");
    setSaleableFilter("");
    setCompanyFilter("");
    setSortBy("type_name");
    setSortOrder("asc");
    setPage(1);
  };

  const handleCopyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Form Submit Handler (Add / Edit)
  const handleFormSubmit = async ({ values, isEdit }) => {
    setSaving(true);
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: formModal.data.id, data: values });
        showNotification("success", `Product type "${values.type_name}" updated successfully.`);
      } else {
        await createMutation.mutateAsync(values);
        showNotification("success", `Product type "${values.type_name}" created successfully.`);
        handleAddRecentSearch(values.type_name);
      }
      setFormModal({ open: false, mode: "add", data: null });
      refetch();
    } catch (err) {
      showNotification(
        "error",
        err.response?.data?.message || err.message || "Failed to save product type record."
      );
    } finally {
      setSaving(false);
    }
  };

  // Toggle Active Status Handler
  const handleToggleStatus = async (pt) => {
    const currentStatus = Boolean(pt.isActive !== undefined ? pt.isActive : pt.is_active);
    const newStatus = !currentStatus;
    setStatusPendingId(pt.id);
    try {
      await updateStatusMutation.mutateAsync({
        id: pt.id,
        is_active: newStatus,
      });
      showNotification(
        "success",
        `Product type "${pt.typeName || pt.type_name}" set to ${newStatus ? "Active" : "Inactive"}.`
      );
      refetch();
    } catch (err) {
      showNotification(
        "error",
        err.response?.data?.message || "Failed to update product type status."
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
      showNotification("success", "Standard retail & apparel product types seeded successfully.");
      setSeedModalOpen(false);
      refetch();
    } catch (err) {
      showNotification(
        "error",
        err.response?.data?.message || "Failed to seed standard product types."
      );
    }
  };

  // Delete Handler
  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteMutation.mutateAsync(toDelete.id);
      showNotification("success", `Product type "${toDelete.typeName || toDelete.type_name}" deleted.`);
      setToDelete(null);
      refetch();
    } catch (err) {
      showNotification(
        "error",
        err.response?.data?.message || "Cannot delete product type referenced by products."
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
        title="Product Types Master"
        description="Configure high-level classifications (Ready Made Garments, Fabric, Footwear, Fashion Accessories, Services) to govern inventory tracking and billing rules."
        actions={
          <div className="flex items-center gap-2">
            <div className="tooltip tooltip-bottom" data-tip="Refresh Product Types">
              <Button
                variant="outline"
                size="sm"
                icon={RefreshCw}
                onClick={() => refetch()}
                loading={isFetching && !isLoading}
              />
            </div>
            <div className="tooltip tooltip-bottom" data-tip="Load standard retail classifications">
              <Button
                variant="outline"
                size="sm"
                icon={Sparkles}
                onClick={() => setSeedModalOpen(true)}
              >
                Seed Presets
              </Button>
            </div>
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
              New Product Type
            </Button>
          </div>
        }
      />

      {/* Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Types */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-xs hover:border-primary/40 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider">
              Total Types
            </span>
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
              {counts.total}
            </span>
          </div>
          <span className="text-[11px] text-base-content/50 mt-1 block">
            Classifications in system
          </span>
        </div>

        {/* Active in Catalog */}
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
            Live for product creation
          </span>
        </div>

        {/* Stock Items */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-xs hover:border-indigo-500/40 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider">
              Stock Tracked
            </span>
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
              {counts.stock}
            </span>
          </div>
          <span className="text-[11px] text-base-content/50 mt-1 block">
            Inventory stock tracked
          </span>
        </div>

        {/* Saleable on POS */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-xs hover:border-amber-500/40 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider">
              Saleable on POS
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
              {counts.saleable}
            </span>
          </div>
          <span className="text-[11px] text-base-content/50 mt-1 block">
            POS and billable items
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
                placeholder="Search product types by name or code..."
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
                <div className="tooltip tooltip-bottom" data-tip="Clear search">
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content p-0.5 rounded-full hover:bg-base-300/50 transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Recent Searches Popover */}
              <div className="relative">
                <ProductTypeRecentSearches
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
            <ProductTypeFilterDropdown
              label="All Statuses"
              value={statusFilter}
              options={statusOptions}
              onChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
              minWidth="min-w-[135px]"
            />

            {/* Stock Item Filter */}
            <ProductTypeFilterDropdown
              label="All Inventory"
              value={stockFilter}
              options={stockOptions}
              onChange={(val) => {
                setStockFilter(val);
                setPage(1);
              }}
              icon={Package}
              minWidth="min-w-[135px]"
            />

            {/* Saleable Filter */}
            <ProductTypeFilterDropdown
              label="All Saleable"
              value={saleableFilter}
              options={saleableOptions}
              onChange={(val) => {
                setSaleableFilter(val);
                setPage(1);
              }}
              icon={ShoppingBag}
              minWidth="min-w-[135px]"
            />

            {/* Target Company Filter (SuperAdmin / Admin only) */}
            {canSelectCompany && companyOptions.length > 0 && (
              <ProductTypeFilterDropdown
                label="All Companies"
                value={companyFilter}
                options={companyOptions}
                onChange={(val) => {
                  setCompanyFilter(val);
                  setPage(1);
                }}
                icon={Building}
                minWidth="min-w-[150px]"
                searchPlaceholder="Search company..."
              />
            )}

            {/* Sort Dropdown */}
            <ProductTypeFilterDropdown
              label="Sort By"
              value={sortBy}
              options={sortOptions}
              onChange={(val) => {
                setSortBy(val);
                setPage(1);
              }}
              icon={ArrowUpDown}
              minWidth="min-w-[140px]"
            />

            {/* Asc / Desc Sort Order Toggle with Tooltip */}
            <div
              className="tooltip tooltip-bottom"
              data-tip={`Switch to ${sortOrder === "asc" ? "Descending (Z-A)" : "Ascending (A-Z)"}`}
            >
              <button
                type="button"
                onClick={() => {
                  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                  setPage(1);
                }}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-base-300 bg-base-100 hover:bg-base-200 text-base-content transition-all cursor-pointer"
              >
                <span>{sortOrder === "asc" ? "↑ ASC" : "↓ DESC"}</span>
              </button>
            </div>

            {/* View Mode Toggle (Table / Grid Cards) with Tooltips */}
            <div className="flex items-center rounded-xl border border-base-300 p-0.5 bg-base-200/50">
              <div className="tooltip tooltip-bottom" data-tip="Table View">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === "table"
                      ? "bg-base-100 text-primary shadow-xs"
                      : "text-base-content/50 hover:text-base-content"
                  }`}
                  aria-label="Table View"
                >
                  <TableIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="tooltip tooltip-bottom" data-tip="Cards View">
                <button
                  type="button"
                  onClick={() => setViewMode("cards")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === "cards"
                      ? "bg-base-100 text-primary shadow-xs"
                      : "text-base-content/50 hover:text-base-content"
                  }`}
                  aria-label="Cards View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between flex-wrap gap-2 pt-2.5 border-t border-base-200 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-base-content/50 uppercase tracking-wider flex items-center gap-1">
                <Filter className="w-3 h-3" /> Active Filters:
              </span>

              {(search || "").trim() && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 font-medium">
                  <span>Search: &ldquo;{search}&rdquo;</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                    className="p-0.5 hover:bg-primary/20 rounded cursor-pointer"
                    title="Remove Search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {statusFilter && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 font-medium">
                  <span>Status: {statusFilter === "active" ? "Active" : "Inactive"}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter("");
                      setPage(1);
                    }}
                    className="p-0.5 hover:bg-primary/20 rounded cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {stockFilter && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 font-medium">
                  <span>Inventory: {stockFilter === "true" ? "Stock Items" : "Non-Stock Items"}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setStockFilter("");
                      setPage(1);
                    }}
                    className="p-0.5 hover:bg-primary/20 rounded cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {saleableFilter && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 font-medium">
                  <span>POS Saleable: {saleableFilter === "true" ? "Saleable" : "Non-Saleable"}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSaleableFilter("");
                      setPage(1);
                    }}
                    className="p-0.5 hover:bg-primary/20 rounded cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {companyFilter && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 font-medium">
                  <span>Company: #{companyFilter}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCompanyFilter("");
                      setPage(1);
                    }}
                    className="p-0.5 hover:bg-primary/20 rounded cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {(sortBy !== "type_name" || sortOrder !== "asc") && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 font-medium">
                  <span>
                    Sort: {sortOptions.find((s) => s.value === sortBy)?.label || sortBy} (
                    {sortOrder.toUpperCase()})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy("type_name");
                      setSortOrder("asc");
                      setPage(1);
                    }}
                    className="p-0.5 hover:bg-primary/20 rounded cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 hover:underline cursor-pointer flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Main Content: Table or Cards view with Loading Skeletons */}
      {isLoading ? (
        <ProductTypesSkeleton viewMode={viewMode} rows={6} />
      ) : viewMode === "table" ? (
        <ProductTypeTableView
          productTypes={productTypes}
          onViewDetails={(pt) => setDetailsModal({ isOpen: true, data: pt })}
          onEdit={(pt) => setFormModal({ open: true, mode: "edit", data: pt })}
          onDelete={(pt) => setToDelete(pt)}
          onToggleStatus={handleToggleStatus}
          onCopyText={handleCopyText}
          copiedKey={copiedKey}
          statusUpdatingId={statusPendingId}
        />
      ) : (
        <ProductTypeCardsView
          productTypes={productTypes}
          onViewDetails={(pt) => setDetailsModal({ isOpen: true, data: pt })}
          onEdit={(pt) => setFormModal({ open: true, mode: "edit", data: pt })}
          onDelete={(pt) => setToDelete(pt)}
          onToggleStatus={handleToggleStatus}
          onCopyText={handleCopyText}
          copiedKey={copiedKey}
          statusUpdatingId={statusPendingId}
        />
      )}

      {/* Pagination Strip */}
      {!isLoading && productTypes.length > 0 && (
        <div className="pt-2">
          <Pagination
            currentPage={Number(paginationMeta.page) || page}
            totalPages={Number(paginationMeta.totalPages) || 1}
            totalItems={Number(paginationMeta.total) || productTypes.length}
            pageSize={limit}
            onPageChange={setPage}
            onPageSizeChange={(newSize) => {
              setLimit(newSize === "All" ? 1000 : Number(newSize));
              setPage(1);
            }}
            pageSizeOptions={[10, 25, 50, "All"]}
          />
        </div>
      )}

      {/* Add / Edit Form Modal */}
      <ProductTypeFormModal
        open={formModal.open}
        mode={formModal.mode}
        isEdit={formModal.mode === "edit"}
        initialData={formModal.data}
        initialCompanyId={canSelectCompany && companyFilter ? Number(companyFilter) : userCompanyId}
        saving={saving}
        onClose={() => setFormModal({ open: false, mode: "add", data: null })}
        onSubmit={handleFormSubmit}
      />

      {/* View Details Modal */}
      <ProductTypeDetailsModal
        isOpen={detailsModal.isOpen}
        productType={detailsModal.data}
        onClose={() => setDetailsModal({ isOpen: false, data: null })}
        onEdit={(pt) => setFormModal({ open: true, mode: "edit", data: pt })}
        onDelete={(pt) => setToDelete(pt)}
      />

      {/* Delete Confirmation Modal */}
      <ProductTypeDeleteModal
        isOpen={Boolean(toDelete)}
        productType={toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleting}
      />

      {/* Seed Default Standard Presets Modal */}
      <ProductTypeSeedDefaultsModal
        isOpen={seedModalOpen}
        onClose={() => setSeedModalOpen(false)}
        onSeed={handleSeedDefaults}
        isSeeding={seedDefaultsMutation.isLoading}
      />
    </div>
  );
}

