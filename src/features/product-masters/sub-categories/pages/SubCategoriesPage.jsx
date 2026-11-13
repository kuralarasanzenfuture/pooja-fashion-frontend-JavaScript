import { useState, useMemo, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Layers,
  Plus,
  RefreshCw,
  RotateCw,
  Search,
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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Clock,
  Building,
  Image as ImageIcon,
  FolderTree,
  Eye,
  Maximize2,
} from "lucide-react";
import PageHeader from "../../../../common/components/PageHeader.jsx";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import Pagination from "../../../../common/components/ui/pagination/Pagination.jsx";
import ImageViewerModal from "../../../../common/components/ui/ImageViewerModal.jsx";
import { useCompanies } from "../../../company/hooks/useCompanies.js";
import { useCategories } from "../../categories/hooks/useCategories.js";
import {
  useSubcategories,
  useCreateSubcategory,
  useUpdateSubcategory,
  useUpdateSubcategoryStatus,
  useDeleteSubcategory,
} from "../hooks/useSubCategories.js";
import SubCategoryFormModal from "../components/SubCategoryFormModal.jsx";
import SubCategoryDetailsModal from "../components/SubCategoryDetailsModal.jsx";
import SubCategoryDeleteModal from "../components/SubCategoryDeleteModal.jsx";
import SubCategoryFilterDropdown from "../components/SubCategoryFilterDropdown.jsx";
import SubCategoryRecentSearches from "../components/SubCategoryRecentSearches.jsx";
import { formatCategoryName } from "../../categories/utils/categoryImageHelper.js";
import { SlidingTabs, AnimatedTabContent } from "../../../../common/components/tabs/index.js";

/**
 * Shimmering Loading Skeleton for Subcategories
 */
function SubCategoriesSkeleton({ viewMode = "table" }) {
  if (viewMode === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, idx) => (
          <div
            key={idx}
            className="rounded-3xl border border-base-300 bg-base-100 p-5 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-base-300 animate-pulse rounded-lg" />
              <div className="h-5 w-16 bg-base-300 animate-pulse rounded-full" />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-base-300 animate-pulse shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-3/4 bg-base-300 animate-pulse rounded" />
                <div className="h-3 w-1/2 bg-base-300 animate-pulse rounded" />
              </div>
            </div>
            <div className="h-3 w-full bg-base-300 animate-pulse rounded" />
            <div className="flex items-center justify-between pt-2 border-t border-base-200">
              <div className="h-4 w-20 bg-base-300 animate-pulse rounded" />
              <div className="h-8 w-16 bg-base-300 animate-pulse rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-base-300 bg-base-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-base-300 bg-base-200/50 text-[11px] font-semibold uppercase tracking-wider text-base-content/60">
              <th className="py-3 px-5 w-16 text-center">Order</th>
              <th className="py-3 px-4">Subcategory Details</th>
              <th className="py-3 px-4">Parent Category</th>
              <th className="py-3 px-4 hidden lg:table-cell">Description</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200">
            {[...Array(6)].map((_, idx) => (
              <tr key={idx}>
                <td className="py-4 px-5 text-center">
                  <div className="h-6 w-8 bg-base-300 animate-pulse rounded-lg mx-auto" />
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-base-300 animate-pulse shrink-0" />
                    <div className="space-y-1.5 flex-1 min-w-[140px]">
                      <div className="h-4 w-36 bg-base-300 animate-pulse rounded" />
                      <div className="h-3 w-20 bg-base-300 animate-pulse rounded" />
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="h-4 w-28 bg-base-300 animate-pulse rounded" />
                </td>
                <td className="py-4 px-4 hidden lg:table-cell">
                  <div className="h-3.5 w-48 bg-base-300 animate-pulse rounded" />
                </td>
                <td className="py-4 px-4">
                  <div className="h-6 w-20 bg-base-300 animate-pulse rounded-lg" />
                </td>
                <td className="py-4 px-5 text-right">
                  <div className="h-8 w-20 bg-base-300 animate-pulse rounded-lg ml-auto" />
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
 * Subcategories Master Management Page
 */
export default function SubCategoriesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCatId = searchParams.get("category_id") || searchParams.get("categoryId") || "";

  const currentUser = useSelector((state) => state.auth?.user);
  const roleCode = String(currentUser?.roleCode || currentUser?.role || "").toUpperCase();
  const userCompanyId = currentUser?.companyId || currentUser?.company_id;
  const isSuperAdminOrAdmin = roleCode === "SUPERADMIN" || roleCode === "ADMIN";
  const canSelectCompany = isSuperAdminOrAdmin && !userCompanyId;

  // Filter & Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(initialCatId);

  useEffect(() => {
    const urlCatId = searchParams.get("category_id") || searchParams.get("categoryId");
    if (urlCatId !== null && urlCatId !== undefined) {
      setCategoryFilter(urlCatId || "");
      setPage(1);
    }
  }, [searchParams]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [mediaFilter, setMediaFilter] = useState("all");
  const [sortBy, setSortBy] = useState("display_order");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("table");

  // Modals & Interactivity State
  const [formModal, setFormModal] = useState({ isOpen: false, mode: "add", data: null });
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, data: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, data: null });
  const [imageViewer, setImageViewer] = useState({ isOpen: false, src: "", title: "" });
  const [notification, setNotification] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  // Queries
  const { data: companiesResponse } = useCompanies({}, { enabled: canSelectCompany });
  const companiesList = useMemo(() => {
    const raw = companiesResponse?.data || companiesResponse?.companies || [];
    return Array.isArray(raw) ? raw : [];
  }, [companiesResponse]);

  // Categories query for filtering
  const categoryParams = useMemo(() => {
    const p = { limit: 100, is_active: true };
    if (canSelectCompany && companyFilter) {
      p.company_id = Number(companyFilter);
    } else if (userCompanyId) {
      p.company_id = Number(userCompanyId);
    }
    return p;
  }, [canSelectCompany, companyFilter, userCompanyId]);

  const { data: categoriesResponse } = useCategories(categoryParams);
  const categoriesList = useMemo(() => {
    const raw = categoriesResponse?.data || categoriesResponse?.categories || [];
    return Array.isArray(raw) ? raw : [];
  }, [categoriesResponse]);

  // Master count / stats query
  const masterParams = useMemo(() => {
    const p = { limit: 100 };
    if (!canSelectCompany && userCompanyId) {
      p.company_id = Number(userCompanyId);
    }
    return p;
  }, [canSelectCompany, userCompanyId]);

  const { data: masterResponse, refetch: refetchMaster } = useSubcategories(
    masterParams,
    { staleTime: 30000 }
  );

  // Main paginated subcategories query
  const queryParams = useMemo(() => {
    const isAll = limit === "All";
    const params = {
      page: isAll ? 1 : page,
      limit: isAll ? 100 : Math.min(Number(limit) || 10, 100),
      sortBy,
      sortOrder,
    };
    if (canSelectCompany) {
      if (companyFilter) params.company_id = Number(companyFilter);
    } else if (userCompanyId) {
      params.company_id = Number(userCompanyId);
    }
    if (categoryFilter) {
      params.category_id = Number(categoryFilter);
    }
    if (search.trim()) {
      params.search = search.trim();
    }
    if (statusFilter === "active") {
      params.is_active = true;
    } else if (statusFilter === "inactive") {
      params.is_active = false;
    }
    if (mediaFilter === "with_image") {
      params.has_image = true;
    } else if (mediaFilter === "without_image") {
      params.has_image = false;
    }
    return params;
  }, [
    page,
    limit,
    canSelectCompany,
    companyFilter,
    userCompanyId,
    categoryFilter,
    search,
    statusFilter,
    mediaFilter,
    sortBy,
    sortOrder,
  ]);

  const {
    data: subcategoriesResponse,
    isLoading,
    isFetching,
    isError,
    error: apiError,
    refetch,
  } = useSubcategories(queryParams);

  // Mutations
  const createMutation = useCreateSubcategory();
  const updateMutation = useUpdateSubcategory();
  const updateStatusMutation = useUpdateSubcategoryStatus();
  const deleteMutation = useDeleteSubcategory();

  // Normalize list data
  const rawList = subcategoriesResponse?.data || subcategoriesResponse?.subcategories || [];
  const currentSubcategories = Array.isArray(rawList) ? rawList : [];

  const masterSubcategories = useMemo(() => {
    const raw = masterResponse?.data || masterResponse?.subcategories || [];
    return Array.isArray(raw) ? raw : [];
  }, [masterResponse]);

  // Summary Metrics
  const stats = useMemo(() => {
    const total = masterSubcategories.length;
    const active = masterSubcategories.filter((s) => {
      return s.isActive !== undefined ? s.isActive : Boolean(s.is_active);
    }).length;
    const inactive = total - active;
    const withImages = masterSubcategories.filter(
      (s) => Boolean(s.imageUrl || s.image_url)
    ).length;
    return { total, active, inactive, withImages };
  }, [masterSubcategories]);

  // Dropdown options
  const companyOptions = useMemo(() => {
    const base = companiesList.map((c) => ({
      value: String(c.id),
      label: c.companyName || c.displayName || `Company #${c.id}`,
      badge: c.companyCode || null,
      icon: Building,
    }));
    return [{ value: "", label: "All Companies", icon: Building }, ...base];
  }, [companiesList]);

  const categoryOptions = useMemo(() => {
    const base = categoriesList.map((c) => ({
      value: String(c.id),
      label: formatCategoryName(c.categoryName || c.category_name),
      badge: c.categoryCode || c.category_code || null,
      icon: FolderTree,
    }));
    return [{ value: "", label: "All Categories", icon: FolderTree }, ...base];
  }, [categoriesList]);

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "active", label: "Active", dotColor: "bg-emerald-500" },
    { value: "inactive", label: "Inactive", dotColor: "bg-rose-500" },
  ];

  const mediaOptions = [
    { value: "all", label: "All Visuals" },
    { value: "with_image", label: "With Image", icon: ImageIcon },
    { value: "without_image", label: "Without Image" },
  ];

  const sortOptions = [
    { value: "display_order", label: "Display Order" },
    { value: "subcategory_name", label: "Subcategory Name" },
    { value: "subcategory_code", label: "Subcategory Code" },
    { value: "created_at", label: "Creation Date" },
    { value: "id", label: "ID Sequence" },
  ];

  const hasActiveFilters =
    Boolean(search) ||
    Boolean(categoryFilter) ||
    (canSelectCompany && Boolean(companyFilter)) ||
    statusFilter !== "all" ||
    mediaFilter !== "all";

  // Storage key for recent subcategory searches (persistent across reloads)
  const RECENT_SEARCHES_STORAGE_KEY = "pooja_fashion_recent_subcategory_searches_v1";

  // Recent searches state
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Recent searches dropdown open/close state
  const [isRecentSearchesOpen, setIsRecentSearchesOpen] = useState(false);
  const searchBoxRef = useRef(null);
  const recentSearchesRef = useRef(null);

  // Close recent searches when clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isInsideSearch =
        searchBoxRef.current && searchBoxRef.current.contains(event.target);
      const isInsideRecent =
        recentSearchesRef.current &&
        recentSearchesRef.current.contains(event.target);

      if (!isInsideSearch && !isInsideRecent) {
        setIsRecentSearchesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Sync / add recent search item (validates against catalog)
  const handleAddRecentSearch = (item) => {
    if (!item) return;
    const name =
      typeof item === "string"
        ? item
        : item.name || item.subcategoryName || item.subcategory_name || item.query;
    if (!name || !name.trim()) return;

    const queryTrim = name.trim();
    const queryLower = queryTrim.toLowerCase();

    // Check if query matches an existing subcategory in catalog
    const pool = [...masterSubcategories, ...currentSubcategories];
    const matchingSubcategory = pool.find((sub) => {
      const sName = (sub.subcategoryName || sub.subcategory_name || "").toLowerCase();
      const sCode = (sub.subcategoryCode || sub.subcategory_code || "").toLowerCase();
      return (
        sName === queryLower ||
        sCode === queryLower ||
        (queryLower.length >= 2 && (sName.includes(queryLower) || sCode.includes(queryLower)))
      );
    });

    if (typeof item === "string" && !matchingSubcategory) {
      return;
    }

    const sub = matchingSubcategory || (typeof item === "object" ? item : null);
    const realName = formatCategoryName(sub ? (sub.subcategoryName || sub.subcategory_name || sub.name || queryTrim) : queryTrim);
    const realCode = sub ? (sub.subcategoryCode || sub.subcategory_code || sub.code || "") : "";
    const parentName = formatCategoryName(sub ? (sub.categoryName || sub.category_name || sub.category?.category_name || "") : "");
    const rawImage = sub ? (sub.imageUrl || sub.image_url || sub.image || null) : null;
    const realImage = rawImage && !rawImage.includes("images.unsplash.com") ? rawImage : null;

    setRecentSearches((prev) => {
      const newEntry = {
        id: sub?.id || `search-${Date.now()}`,
        name: realName,
        code: realCode,
        categoryName: parentName,
        imageUrl: realImage,
        timestamp: Date.now(),
        query: realName || queryTrim,
      };

      const filtered = prev.filter(
        (s) => (s.name || s.query || "").toLowerCase() !== queryLower
      );
      const updated = [newEntry, ...filtered].slice(0, 10);
      try {
        localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to store recent search", e);
      }
      return updated;
    });
  };

  const handleClearRecentSearches = () => {
    setIsRecentSearchesOpen(false);
    setTimeout(() => {
      setRecentSearches([]);
      try {
        localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify([]));
      } catch (e) {
        console.error(e);
      }
    }, 320);
  };

  const handleRemoveRecentSearch = (idOrQuery) => {
    setRecentSearches((prev) => {
      const updated = prev.filter(
        (s) => s.id !== idOrQuery && s.name !== idOrQuery && s.query !== idOrQuery
      );
      try {
        localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleSelectRecentSearch = (item) => {
    if (!item) return;
    const term =
      (typeof item === "string" ? item : null) ||
      item.query ||
      item.name ||
      item.subcategoryName ||
      item.subcategory_name ||
      "";
    const cleanTerm = String(term).trim();
    setSearch(cleanTerm);
    setPage(1);
    if (cleanTerm) {
      handleAddRecentSearch(item);
    }
    setIsRecentSearchesOpen(false);
  };

  // Auto-populate initial recent searches if empty from master catalog
  const hasCheckedInitialRecentRef = useRef(false);
  useEffect(() => {
    if (hasCheckedInitialRecentRef.current) return;
    if (masterSubcategories.length === 0) return;

    try {
      const existingStorage = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
      if (!existingStorage || JSON.parse(existingStorage).length === 0) {
        hasCheckedInitialRecentRef.current = true;
        const sample = masterSubcategories.slice(0, 6).map((sub, i) => ({
          id: sub.id,
          name: formatCategoryName(sub.subcategoryName || sub.subcategory_name),
          code: sub.subcategoryCode || sub.subcategory_code || "",
          categoryName: formatCategoryName(sub.categoryName || sub.category_name || sub.category?.category_name || ""),
          query: sub.subcategoryName || sub.subcategory_name,
          imageUrl: sub.imageUrl || sub.image_url || null,
          timestamp: Date.now() - (i + 1) * 3600000,
        }));
        setRecentSearches(sample);
        localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(sample));
      } else {
        hasCheckedInitialRecentRef.current = true;
      }
    } catch (e) {
      // ignore
    }
  }, [masterSubcategories]);

  const handleResetFilters = () => {
    setSearch("");
    setCategoryFilter("");
    setCompanyFilter("");
    setStatusFilter("all");
    setMediaFilter("all");
    setPage(1);
  };

  const handleCopyCode = (code, id) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  // Handlers for Mutations
  const handleFormSubmit = async ({ values, imageFile, removeImage }) => {
    try {
      if (formModal.mode === "add") {
        await createMutation.mutateAsync({ data: values, imageFile });
        showNotification("success", "Subcategory created successfully!");
      } else {
        const id = formModal.data?.id;
        await updateMutation.mutateAsync({
          id,
          data: values,
          imageFile: removeImage ? null : imageFile,
        });
        showNotification("success", "Subcategory updated successfully!");
      }
      setFormModal({ isOpen: false, mode: "add", data: null });
      refetch();
      refetchMaster();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save subcategory";
      showNotification("error", msg);
    }
  };

  const handleToggleStatus = async (id, newStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id, isActive: newStatus });
      showNotification(
        "success",
        `Subcategory ${newStatus ? "activated" : "deactivated"} successfully!`
      );
      refetch();
      refetchMaster();
    } catch (err) {
      showNotification(
        "error",
        err?.response?.data?.message || "Failed to update subcategory status"
      );
    }
  };

  const handleDeleteConfirm = async (subcategory) => {
    try {
      await deleteMutation.mutateAsync(subcategory.id);
      showNotification("success", `Subcategory "${subcategory.subcategoryName || subcategory.subcategory_name}" deleted.`);
      setDeleteModal({ isOpen: false, data: null });
      refetch();
      refetchMaster();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Cannot delete subcategory with linked products.";
      showNotification("error", msg);
    }
  };

  // Pagination meta from backend
  const meta = subcategoriesResponse?.meta?.pagination || {
    page,
    limit: limit === "All" ? currentSubcategories.length : Number(limit) || 10,
    totalRecords: currentSubcategories.length,
    totalPages: 1,
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200 text-xs sm:text-sm font-semibold ${
            notification.type === "success"
              ? "bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20"
              : "bg-rose-600 text-white border-rose-500 shadow-rose-500/20"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="size-4 shrink-0" />
          ) : (
            <AlertCircle className="size-4 shrink-0" />
          )}
          <span>{notification.message}</span>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors ml-2"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Subcategories Master"
        subtitle="Manage product subcategories, parent category hierarchies, and catalog classifications"
        actions={
          <div className="flex items-center gap-2.5">
            <div className="tooltip tooltip-bottom" data-tip="Refresh subcategories">
              <button
                type="button"
                onClick={() => {
                  refetch();
                  refetchMaster();
                }}
                disabled={isFetching}
                aria-label="Refresh subcategories"
                className="p-2.5 rounded-xl border border-base-300 bg-base-100 hover:bg-base-200 text-base-content/70 hover:text-base-content transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                <RotateCw
                  className={`size-4 ${isFetching ? "animate-spin text-primary" : ""}`}
                />
              </button>
            </div>

            <div className="hidden sm:block">
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

            <Button
              type="button"
              variant="clip-six"
              onClick={() =>
                setFormModal({ isOpen: true, mode: "add", data: null })
              }
              className="gap-2 text-xs font-bold shadow-md shadow-primary/20"
            >
              <Plus className="size-4" />
              <span>New Subcategory</span>
            </Button>
          </div>
        }
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total Card */}
        <div className="p-4 rounded-2xl bg-base-100 border border-base-300 shadow-xs flex items-center gap-3.5">
          <div className="size-11 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
            <Layers className="size-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-base-content/60 block">
              Total Subcategories
            </span>
            <span className="text-xl font-extrabold text-base-content leading-tight">
              {stats.total}
            </span>
          </div>
        </div>

        {/* Active Card */}
        <div
          onClick={() => {
            setStatusFilter("active");
            setPage(1);
          }}
          className="p-4 rounded-2xl bg-base-100 border border-base-300 shadow-xs flex items-center gap-3.5 cursor-pointer hover:border-emerald-500/40 transition-all"
        >
          <div className="size-11 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="size-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-base-content/60 block">
              Active in Catalog
            </span>
            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 leading-tight">
              {stats.active}
            </span>
          </div>
        </div>

        {/* Inactive Card */}
        <div
          onClick={() => {
            setStatusFilter("inactive");
            setPage(1);
          }}
          className="p-4 rounded-2xl bg-base-100 border border-base-300 shadow-xs flex items-center gap-3.5 cursor-pointer hover:border-rose-500/40 transition-all"
        >
          <div className="size-11 rounded-xl bg-rose-500/10 text-rose-600 border border-rose-500/20 flex items-center justify-center shrink-0">
            <AlertCircle className="size-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-base-content/60 block">
              Hidden / Inactive
            </span>
            <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400 leading-tight">
              {stats.inactive}
            </span>
          </div>
        </div>

        {/* Media Card */}
        <div
          onClick={() => {
            setMediaFilter("with_image");
            setPage(1);
          }}
          className="p-4 rounded-2xl bg-base-100 border border-base-300 shadow-xs flex items-center gap-3.5 cursor-pointer hover:border-primary/40 transition-all"
        >
          <div className="size-11 rounded-xl bg-purple-500/10 text-purple-600 border border-purple-500/20 flex items-center justify-center shrink-0">
            <ImageIcon className="size-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-base-content/60 block">
              With Visuals
            </span>
            <span className="text-xl font-extrabold text-base-content leading-tight">
              {stats.withImages}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl p-4 sm:p-5 bg-base-100 border border-base-300 shadow-xs space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            {/* Search Box with Clock Toggle */}
            <div ref={searchBoxRef} className="relative flex-1 min-w-[220px] max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/40 pointer-events-none" />
              <input
                type="text"
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
                placeholder="Search by subcategory name, code..."
                className="w-full pl-9 pr-18 py-2 rounded-xl border border-base-300 bg-base-100 text-xs text-base-content placeholder:text-base-content/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
                      className="text-base-content/40 hover:text-base-content p-1 rounded-lg hover:bg-base-200 transition-colors cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                )}
                {recentSearches.length > 0 && (
                  <div
                    className="tooltip tooltip-bottom"
                    data-tip={isRecentSearchesOpen ? "Hide recent searches" : "Recent searches"}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsRecentSearchesOpen((prev) => !prev);
                      }}
                      className={`p-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                        isRecentSearchesOpen
                          ? "text-primary bg-primary/10 shadow-2xs"
                          : "text-base-content/40 hover:text-base-content hover:bg-base-200"
                      }`}
                      aria-label={isRecentSearchesOpen ? "Hide recent searches" : "Recent searches"}
                    >
                      <Clock className="size-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Company Filter (SuperAdmin) */}
            {canSelectCompany && (
              <SubCategoryFilterDropdown
                label="All Companies"
                value={companyFilter}
                options={companyOptions}
                onChange={(v) => {
                  setCompanyFilter(v);
                  setCategoryFilter("");
                  setPage(1);
                }}
                icon={Building}
                searchable={true}
                searchPlaceholder="Search companies..."
              />
            )}

            {/* Parent Category Filter */}
            <SubCategoryFilterDropdown
              label="All Categories"
              value={categoryFilter}
              options={categoryOptions}
              onChange={(v) => {
                setCategoryFilter(v);
                setPage(1);
              }}
              icon={FolderTree}
              searchable={true}
              searchPlaceholder="Search categories..."
            />

            {/* Status Filter */}
            <SubCategoryFilterDropdown
              label="All Statuses"
              value={statusFilter}
              options={statusOptions}
              onChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
            />

            {/* Media Filter */}
            <SubCategoryFilterDropdown
              label="All Visuals"
              value={mediaFilter}
              options={mediaOptions}
              onChange={(v) => {
                setMediaFilter(v);
                setPage(1);
              }}
              icon={ImageIcon}
            />

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 hover:bg-rose-500/10 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <SubCategoryFilterDropdown
              label="Sort by"
              value={sortBy}
              options={sortOptions}
              onChange={(v) => setSortBy(v)}
              icon={ArrowUpDown}
            />

            <button
              type="button"
              onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-base-300 bg-base-100 hover:bg-base-200 text-base-content transition-all cursor-pointer"
              title={`Sort: ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
            >
              <span>{sortOrder === "asc" ? "↑ ASC" : "↓ DESC"}</span>
            </button>
          </div>
        </div>

        {/* Smooth Animated Collapsible Recent Searches Strip */}
        <div
          ref={recentSearchesRef}
          className={`accordion-grid ${
            isRecentSearchesOpen && recentSearches.length > 0 ? "open" : "closed"
          }`}
        >
          <div className="accordion-inner">
            <div className="pt-2 pb-0.5">
              <SubCategoryRecentSearches
                recentSearches={recentSearches}
                catalog={masterSubcategories}
                onSelectSearch={handleSelectRecentSearch}
                onClearAll={handleClearRecentSearches}
                onRemoveItem={handleRemoveRecentSearch}
                activeQuery={search}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <SubCategoriesSkeleton viewMode={viewMode} />
      ) : isError ? (
        <div className="p-12 rounded-3xl bg-base-100 border border-base-300 text-center space-y-4 shadow-xs">
          <div className="size-16 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="size-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-base-content">
              Failed to load subcategories
            </h3>
            <p className="text-xs text-base-content/60 max-w-sm mx-auto">
              {apiError?.response?.data?.message || apiError?.message || "An unexpected error occurred while communicating with the server."}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => refetch()}
            className="text-xs font-semibold gap-1.5"
          >
            <RefreshCw className="size-3.5" />
            <span>Try Again</span>
          </Button>
        </div>
      ) : currentSubcategories.length === 0 ? (
        <div className="p-12 rounded-3xl bg-base-100 border border-base-300 text-center space-y-4 shadow-xs">
          <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Layers className="size-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-base-content">
              No Subcategories Found
            </h3>
            <p className="text-xs text-base-content/60 max-w-sm mx-auto">
              {hasActiveFilters
                ? "No subcategories matched your filter criteria. Try adjusting or clearing your filters."
                : "Get started by creating your first product subcategory under a parent category."}
            </p>
          </div>
          {hasActiveFilters ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleResetFilters}
              className="text-xs font-semibold gap-1.5"
            >
              <RotateCcw className="size-3.5" />
              <span>Clear All Filters</span>
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={() =>
                setFormModal({ isOpen: true, mode: "add", data: null })
              }
              className="text-xs font-bold gap-1.5"
            >
              <Plus className="size-4" />
              <span>Create Subcategory</span>
            </Button>
          )}
        </div>
      ) : (
        <AnimatedTabContent activeKey={viewMode}>
          {viewMode === "cards" ? (
            /* Card / Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentSubcategories.map((subcat) => {
            const name = formatCategoryName(subcat.subcategoryName || subcat.subcategory_name);
            const code = subcat.subcategoryCode || subcat.subcategory_code;
            const catName = formatCategoryName(
              subcat.categoryName ||
              subcat.category_name ||
              subcat.category?.category_name ||
              "—"
            );
            const imageUrl = subcat.imageUrl || subcat.image_url;
            const isActive =
              subcat.isActive !== undefined
                ? Boolean(subcat.isActive)
                : subcat.is_active !== undefined
                ? Boolean(subcat.is_active)
                : true;
            const displayOrder =
              subcat.displayOrder ?? subcat.display_order ?? 0;

            return (
              <div
                key={subcat.id}
                className="group relative rounded-3xl border border-base-300 bg-base-100 p-5 space-y-4 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  {/* Top Bar: Order, Code & Status Toggle */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-base-200 text-base-content/75 border border-base-300/80">
                        #{displayOrder}
                      </span>
                      {code && (
                        <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
                          {code}
                        </span>
                      )}
                    </div>

                    <label className="inline-flex cursor-pointer items-center gap-1.5 select-none">
                      <input
                        type="checkbox"
                        className="toggle toggle-success toggle-xs"
                        checked={isActive}
                        disabled={updateStatusMutation.isPending}
                        onChange={() => handleToggleStatus(subcat.id, !isActive)}
                        aria-label={`Toggle active status for ${name}`}
                      />
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40"
                            : "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </label>
                  </div>

                  {/* Thumbnail & Title */}
                  <div className="flex items-start gap-3.5">
                    {imageUrl ? (
                      <div className="relative group/thumb size-16 rounded-2xl overflow-hidden border border-base-300 shrink-0 bg-base-200">
                        <img
                          src={imageUrl}
                          alt={name}
                          className="w-full h-full object-cover transition-transform group-hover/thumb:scale-110"
                        />
                        <div className="tooltip tooltip-top tooltip-primary" data-tip="Click to view full image in high quality">
                          <button
                            type="button"
                            onClick={() =>
                              setImageViewer({
                                isOpen: true,
                                src: imageUrl,
                                title: name,
                              })
                            }
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                            aria-label="View High-Resolution Image"
                          >
                            <Maximize2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="size-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-2xs">
                        <Layers className="size-7" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1 space-y-1">
                      <h4
                        onClick={() => navigate(`/products/subcategories/${subcat.id}`)}
                        className="text-sm font-bold text-base-content hover:text-primary transition-colors cursor-pointer truncate"
                        title={name}
                      >
                        {name}
                      </h4>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-base-200 text-base-content/70">
                          {code || "NO_CODE"}
                        </span>
                        {code && (
                          <div className="tooltip tooltip-top" data-tip={copiedCode === subcat.id ? "Copied code!" : "Copy code"}>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(code, subcat.id)}
                              className="text-base-content/40 hover:text-primary transition-colors cursor-pointer"
                              aria-label="Copy Code"
                            >
                              {copiedCode === subcat.id ? (
                                <Check className="size-3 text-emerald-500" />
                              ) : (
                                <Copy className="size-3" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Parent Category Badge */}
                      <div className="flex items-center gap-1 text-[11px] text-base-content/60 truncate pt-0.5">
                        <FolderTree className="size-3 text-primary shrink-0" />
                        <span className="truncate">{catName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {subcat.description && (
                    <p className="text-xs text-base-content/70 line-clamp-2 leading-relaxed">
                      {subcat.description}
                    </p>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-base-200">
                  <div className="tooltip tooltip-top" data-tip="View Details">
                    <button
                      type="button"
                      onClick={() => setDetailsModal({ isOpen: true, data: subcat })}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="size-3.5" />
                      <span>Quick View</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <div className="tooltip tooltip-top" data-tip="Edit Subcategory">
                      <button
                        type="button"
                        onClick={() =>
                          setFormModal({ isOpen: true, mode: "edit", data: subcat })
                        }
                        className="p-1.5 rounded-lg text-base-content/60 hover:text-primary hover:bg-base-200 transition-colors cursor-pointer"
                        aria-label="Edit Subcategory"
                      >
                        <Edit2 className="size-4" />
                      </button>
                    </div>
                    <div className="tooltip tooltip-top tooltip-error" data-tip="Delete Subcategory">
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteModal({ isOpen: true, data: subcat })
                        }
                        className="p-1.5 rounded-lg text-base-content/60 hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        aria-label="Delete Subcategory"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-3xl border border-base-300 bg-base-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-base-300 bg-base-200/50 text-[11px] font-semibold uppercase tracking-wider text-base-content/60">
                  <th className="py-3 px-5 w-16 text-center">Order</th>
                  <th className="py-3 px-4">Subcategory Details</th>
                  <th className="py-3 px-4">Parent Category</th>
                  <th className="py-3 px-4 hidden lg:table-cell">Description</th>
                  <th className="py-3 px-4">Catalog Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {currentSubcategories.map((subcat) => {
                  const name = formatCategoryName(
                    subcat.subcategoryName || subcat.subcategory_name
                  );
                  const code =
                    subcat.subcategoryCode || subcat.subcategory_code;
                  const catName = formatCategoryName(
                    subcat.categoryName ||
                    subcat.category_name ||
                    subcat.category?.category_name ||
                    "—"
                  );
                  const imageUrl = subcat.imageUrl || subcat.image_url;
                  const isActive =
                    subcat.isActive !== undefined
                      ? Boolean(subcat.isActive)
                      : subcat.is_active !== undefined
                      ? Boolean(subcat.is_active)
                      : true;
                  const displayOrder =
                    subcat.displayOrder ?? subcat.display_order ?? 0;

                  return (
                    <tr
                      key={subcat.id}
                      className="hover:bg-base-200/30 transition-colors group"
                    >
                      {/* Sequence Order */}
                      <td className="py-4 px-5 text-center">
                        <span className="font-mono text-xs font-bold text-base-content/60">
                          #{displayOrder}
                        </span>
                      </td>

                      {/* Subcategory Details */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {imageUrl ? (
                            <div className="relative group/thumb size-12 rounded-xl overflow-hidden border border-base-300 shrink-0 bg-base-200">
                              <img
                                src={imageUrl}
                                alt={name}
                                className="w-full h-full object-cover transition-transform group-hover/thumb:scale-110"
                              />
                              <div className="tooltip tooltip-top tooltip-primary" data-tip="Click to view full image in high quality">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setImageViewer({
                                      isOpen: true,
                                      src: imageUrl,
                                      title: name,
                                    })
                                  }
                                  className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                                  aria-label="Expand image"
                                >
                                  <Maximize2 className="size-3.5" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="size-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 shadow-2xs">
                              <Layers className="size-5" />
                            </div>
                          )}

                          <div className="space-y-0.5 min-w-0">
                            <span
                              onClick={() =>
                                navigate(`/products/subcategories/${subcat.id}`)
                              }
                              className="text-xs sm:text-sm font-bold text-base-content hover:text-primary transition-colors cursor-pointer block truncate"
                            >
                              {name}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-base-200 text-base-content/70">
                                {code || "NO_CODE"}
                              </span>
                              {code && (
                                <div className="tooltip tooltip-top" data-tip={copiedCode === subcat.id ? "Copied code!" : "Copy code"}>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyCode(code, subcat.id)}
                                    className="text-base-content/40 hover:text-primary transition-colors cursor-pointer"
                                    aria-label="Copy Code"
                                  >
                                    {copiedCode === subcat.id ? (
                                      <Check className="size-3 text-emerald-500" />
                                    ) : (
                                      <Copy className="size-3" />
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Parent Category */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <FolderTree className="size-3.5 text-primary shrink-0" />
                          <span className="text-xs font-semibold text-base-content">
                            {catName}
                          </span>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <span className="text-xs text-base-content/60 line-clamp-1 max-w-xs">
                          {subcat.description || "—"}
                        </span>
                      </td>

                      {/* Catalog Status Toggle */}
                      <td className="py-3.5 px-4">
                        <label className="inline-flex cursor-pointer items-center gap-2 select-none">
                          <input
                            type="checkbox"
                            checked={isActive}
                            disabled={updateStatusMutation.isPending}
                            onChange={() =>
                              handleToggleStatus(subcat.id, !isActive)
                            }
                            className="toggle toggle-success toggle-sm"
                            aria-label={`Toggle active status for ${name}`}
                          />
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                              isActive
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40"
                                : "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40"
                            }`}
                          >
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </label>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <div className="tooltip tooltip-left" data-tip="View Details">
                            <button
                              type="button"
                              onClick={() =>
                                setDetailsModal({ isOpen: true, data: subcat })
                              }
                              className="p-1.5 rounded-lg text-base-content/50 hover:text-primary hover:bg-base-200 transition-colors cursor-pointer"
                              aria-label="View Details"
                            >
                              <Eye className="size-4" />
                            </button>
                          </div>
                          <div className="tooltip tooltip-left" data-tip="Edit Subcategory">
                            <button
                              type="button"
                              onClick={() =>
                                setFormModal({
                                  isOpen: true,
                                  mode: "edit",
                                  data: subcat,
                                })
                              }
                              className="p-1.5 rounded-lg text-base-content/50 hover:text-primary hover:bg-base-200 transition-colors cursor-pointer"
                              aria-label="Edit Subcategory"
                            >
                              <Edit2 className="size-4" />
                            </button>
                          </div>
                          <div className="tooltip tooltip-left tooltip-error" data-tip="Delete Subcategory">
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteModal({ isOpen: true, data: subcat })
                              }
                              className="p-1.5 rounded-lg text-base-content/50 hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              aria-label="Delete Subcategory"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </AnimatedTabContent>
      )}

      {/* Pagination Footer */}
      {!isLoading && currentSubcategories.length > 0 && (
        <Pagination
          currentPage={meta.page || page}
          totalPages={meta.totalPages || 1}
          totalItems={meta.totalRecords || currentSubcategories.length}
          itemsPerPage={meta.limit || 10}
          onPageChange={(p) => setPage(p)}
          onItemsPerPageChange={(l) => {
            setLimit(l);
            setPage(1);
          }}
        />
      )}

      {/* Modals */}
      <SubCategoryFormModal
        isOpen={formModal.isOpen}
        mode={formModal.mode}
        initialData={formModal.data}
        initialCategoryId={categoryFilter || null}
        initialCompanyId={companyFilter || null}
        saving={createMutation.isPending || updateMutation.isPending}
        onClose={() => setFormModal({ isOpen: false, mode: "add", data: null })}
        onSubmit={handleFormSubmit}
      />

      <SubCategoryDetailsModal
        isOpen={detailsModal.isOpen}
        subcategory={detailsModal.data}
        onClose={() => setDetailsModal({ isOpen: false, data: null })}
        onEdit={(subcat) => {
          setDetailsModal({ isOpen: false, data: null });
          setFormModal({ isOpen: true, mode: "edit", data: subcat });
        }}
        onDelete={(subcat) => {
          setDetailsModal({ isOpen: false, data: null });
          setDeleteModal({ isOpen: true, data: subcat });
        }}
        onToggleStatus={handleToggleStatus}
        onImageClick={(src, title) =>
          setImageViewer({ isOpen: true, src, title })
        }
        onNavigateFullPage={(id) => navigate(`/products/subcategories/${id}`)}
      />

      <SubCategoryDeleteModal
        isOpen={deleteModal.isOpen}
        subcategory={deleteModal.data}
        isDeleting={deleteMutation.isPending}
        onClose={() => setDeleteModal({ isOpen: false, data: null })}
        onConfirm={handleDeleteConfirm}
      />

      <ImageViewerModal
        isOpen={imageViewer.isOpen}
        src={imageViewer.src}
        title={imageViewer.title}
        subtitle="Subcategory High-Resolution Visual"
        onClose={() => setImageViewer({ isOpen: false, src: "", title: "" })}
      />
    </div>
  );
}
