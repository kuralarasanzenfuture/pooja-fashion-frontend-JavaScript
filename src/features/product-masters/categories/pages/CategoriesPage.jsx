import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Tags,
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
  Layers,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar,
  Sparkles,
  Eye,
  Maximize2,
  ExternalLink,
  Building,
  Image as ImageIcon,
  ImageOff,
  FolderTree,
  Clock,
} from "lucide-react";
import PageHeader from "../../../../common/components/PageHeader.jsx";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import Pagination from "../../../../common/components/ui/pagination/Pagination.jsx";
import ImageViewerModal from "../../../../common/components/ui/ImageViewerModal.jsx";
import { SlidingTabs, AnimatedTabContent } from "../../../../common/components/tabs/index.js";
import { useCompanies } from "../../../company/hooks/useCompanies.js";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useUpdateCategoryStatus,
  useDeleteCategory,
  useDeleteCategoryImage,
} from "../hooks/useCategories.js";
import {
  SubCategoryFormModal,
  useCreateSubcategory,
} from "../../sub-categories/index.js";
import {
  CategoryFormModal,
  CategoryDetailsModal,
  CategoryDeleteModal,
  CategoryFilterDropdown,
  CategoryRecentSearches,
  CategoryThumb,
  CategoriesSkeleton,
  CategoryTableView,
  CategoryCardsView,
  CategoryAddSubcategoryModal,
} from "../components/index.js";
import { formatCategoryName } from "../utils/categoryImageHelper.js";


export default function CategoriesPage() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const roleCode = String(user?.roleCode || user?.role || "").toUpperCase();
  const userCompanyId = user?.companyId || user?.company_id;
  const isSuperAdmin = roleCode === "SUPERADMIN";
  const isAdmin = roleCode === "ADMIN";
  // "superadmin" and "admin" user only don't have company id; this user only company to select
  const canSelectCompany = (isSuperAdmin || isAdmin) && !userCompanyId;

  // Active companies directory from API master
  const { data: companiesResponse } = useCompanies({ limit: 100, status: "active" });
  const companiesList = companiesResponse?.data || [];

  // UI state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // "" | "active" | "inactive"
  const [companyFilter, setCompanyFilter] = useState(""); // "" for all companies (SuperAdmin/Admin)
  const [mediaFilter, setMediaFilter] = useState(""); // "" | "with_image" | "without_image"
  const [sortBy, setSortBy] = useState("display_order"); // "display_order" | "category_name" | "category_code" | "created_at" | "updated_at"
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" | "desc"
  const [viewMode, setViewMode] = useState("table"); // "table" | "cards"
  const [copiedKey, setCopiedKey] = useState(null);

  // Modals state
  const [modal, setModal] = useState({ open: false, mode: "add", data: null });
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, data: null });
  const [subcategoryModal, setSubcategoryModal] = useState({ isOpen: false, category: null });
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [notification, setNotification] = useState(null);

  // High-Quality Image Viewer Modal state
  const [imageViewer, setImageViewer] = useState({ isOpen: false, src: "", title: "" });

  // Storage key for recent category searches (persistent across reloads)
  const RECENT_SEARCHES_STORAGE_KEY = "pooja_fashion_recent_category_searches_v1";

  // Recent searches state
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  // Recent searches state (closed by default; opens on search click, closes on outside click)
  const [isRecentSearchesOpen, setIsRecentSearchesOpen] = useState(false);
  const searchBoxRef = useRef(null);
  const recentSearchesRef = useRef(null);

  // Smoothly close recent searches when clicking anywhere outside the search box and recent searches
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

  // Sync / add recent search item (validates query against catalog)
  const handleAddRecentSearch = (item) => {
    if (!item) return;
    const name =
      typeof item === "string"
        ? item
        : item.name || item.categoryName || item.category_name || item.query;
    if (!name || !name.trim()) return;

    const queryTrim = name.trim();
    const queryLower = queryTrim.toLowerCase();

    // 1. Check if the query matches an existing category in catalog
    const masterList = Array.isArray(allCategoriesResponse?.data)
      ? allCategoriesResponse.data
      : (allCategoriesResponse?.categories || []);
    const currentList = Array.isArray(categoriesResponse?.data)
      ? categoriesResponse.data
      : (categoriesResponse?.categories || []);
    const pool = [...masterList, ...currentList];

    const matchingCategory = pool.find((cat) => {
      const cName = (cat.categoryName || cat.category_name || "").toLowerCase();
      const cCode = (cat.categoryCode || cat.category_code || "").toLowerCase();
      return (
        cName === queryLower ||
        cCode === queryLower ||
        (queryLower.length >= 2 && (cName.includes(queryLower) || cCode.includes(queryLower)))
      );
    });

    // CRITICAL (User Request 2): Unmatched search (e.g. "sareesscsdc") that matches 0 categories MUST NOT be added!
    if (typeof item === "string" && !matchingCategory) {
      return;
    }

    // 2. Extract actual category details & its REAL photo from database (e.g. green saree)
    const cat = matchingCategory || (typeof item === "object" ? item : null);
    const realName = formatCategoryName(cat ? (cat.categoryName || cat.category_name || cat.name || queryTrim) : queryTrim);
    const realCode = cat ? (cat.categoryCode || cat.category_code || cat.code || "") : "";
    const rawImage = cat ? (cat.imageUrl || cat.image_url || cat.image || null) : null;
    const realImage = rawImage && !rawImage.includes("images.unsplash.com") ? rawImage : null;

    setRecentSearches((prev) => {
      const newEntry = {
        id: cat?.id || `search-${Date.now()}`,
        name: realName,
        code: realCode,
        imageUrl: realImage, // Real photo from database or null if none
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
      item.categoryName ||
      item.category_name ||
      "";
    const cleanTerm = String(term).trim();
    setSearch(cleanTerm);
    setPage(1);
    if (cleanTerm) {
      handleAddRecentSearch(item);
    }
    setIsRecentSearchesOpen(false);
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOpenImageViewer = (src, title) => {
    if (!src) return;
    setImageViewer({ isOpen: true, src, title });
  };

  // Master directory query for persistent, non-collapsing category counts (limit <= 100)
  const masterParams = useMemo(() => {
    const p = { limit: 100 };
    if (!canSelectCompany && userCompanyId) {
      p.company_id = Number(userCompanyId);
    }
    return p;
  }, [canSelectCompany, userCompanyId]);

  const {
    data: allCategoriesResponse,
    refetch: refetchMaster,
  } = useCategories(
    masterParams,
    { staleTime: 30000 }
  );

  // Auto-populate initial recent searches from catalog or reference set with real images
  const hasCheckedInitialRecentRef = useRef(false);
  useEffect(() => {
    if (hasCheckedInitialRecentRef.current) return;

    try {
      const existingStorage = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
      // Case 1: First visit - seed with database categories that actually have images
      if (existingStorage === null) {
        hasCheckedInitialRecentRef.current = true;
        const backendWithImages = (allCategoriesResponse?.data || []).filter(
          (c) => Boolean(c.imageUrl || c.image_url)
        );
        let sample = [];
        if (backendWithImages.length >= 2) {
          sample = backendWithImages.slice(0, 8).map((cat) => ({
            id: cat.id,
            name: formatCategoryName(cat.categoryName || cat.category_name),
            code: cat.categoryCode || cat.category_code,
            imageUrl: cat.imageUrl || cat.image_url || null,
            timestamp: Date.now(),
            query: formatCategoryName(cat.categoryName || cat.category_name),
          }));
        }
        setRecentSearches(sample);
        localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(sample));
      } else if (existingStorage !== null) {
        hasCheckedInitialRecentRef.current = true;
        // Case 2: Existing storage - repair and enrich any entries with their REAL database images or null
        try {
          const parsed = JSON.parse(existingStorage);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const masterList = Array.isArray(allCategoriesResponse?.data)
              ? allCategoriesResponse.data
              : (allCategoriesResponse?.categories || []);
            const enriched = parsed.map((item) => {
              const match = masterList.find(
                (c) =>
                  (c.categoryName || c.category_name || "").toLowerCase() ===
                  (item.name || item.query || "").toLowerCase()
              );
              const realImg = match?.imageUrl || match?.image_url;
              return {
                ...item,
                name: match?.categoryName || match?.category_name || item.name,
                code: match?.categoryCode || match?.category_code || item.code,
                query: match?.categoryName || match?.category_name || item.query || item.name,
                // Only keep real uploaded database image; do not retain fake unsplash fallback images
                imageUrl: realImg || (item.imageUrl && !item.imageUrl.includes("unsplash.com") ? item.imageUrl : null),
              };
            });
            setRecentSearches(enriched);
            localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(enriched));
          }
        } catch (parseErr) {
          console.error("Failed to parse existing recent searches", parseErr);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [allCategoriesResponse]);

  // Main list query with server pagination, search & status filter
  const queryParams = useMemo(() => {
    const isAll = limit === "All";
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
    if ((search || "").trim()) {
      params.search = (search || "").trim();
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
  }, [page, limit, canSelectCompany, companyFilter, userCompanyId, search, statusFilter, mediaFilter, sortBy, sortOrder]);

  const {
    data: categoriesResponse,
    isLoading,
    isFetching,
    isError,
    error: apiError,
    refetch,
  } = useCategories(queryParams);

  // Mutations
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const updateStatusMutation = useUpdateCategoryStatus();
  const deleteMutation = useDeleteCategory();
  const deleteImageMutation = useDeleteCategoryImage();
  const createSubcategoryMutation = useCreateSubcategory();

  // Normalize list data
  const rawList = categoriesResponse?.data || categoriesResponse?.categories || [];
  const currentCategories = Array.isArray(rawList) ? rawList : [];

  const rawMaster = allCategoriesResponse?.data || allCategoriesResponse?.categories || [];
  const masterCategories = Array.isArray(rawMaster) ? rawMaster : [];

  // Company options for filter
  const companyOptions = useMemo(() => {
    const baseList =
      companiesList.length > 0
        ? companiesList.map((c) => ({
            value: String(c.id),
            label: c.companyName || c.displayName || `Company #${c.id}`,
            badge: c.companyCode || null,
            icon: Building,
          }))
        : [];
    if (baseList.length > 0) {
      return [{ value: "", label: "All Companies", icon: Building }, ...baseList];
    }
    const map = new Map();
    masterCategories.forEach((c) => {
      const cId = c.companyId || c.company_id;
      const cName = c.companyName || (cId ? `Company #${cId}` : null);
      if (cId && cName && !map.has(String(cId))) {
        map.set(String(cId), {
          value: String(cId),
          label: cName,
          badge: c.companyCode || null,
          icon: Building,
        });
      }
    });
    return [{ value: "", label: "All Companies", icon: Building }, ...Array.from(map.values())];
  }, [companiesList, masterCategories]);

  // Summary counts over the full catalog or active company selection
  const counts = useMemo(() => {
    const list = canSelectCompany
      ? (companyFilter
          ? masterCategories.filter(
              (c) => String(c.companyId || c.company_id) === String(companyFilter)
            )
          : masterCategories)
      : (userCompanyId
          ? masterCategories.filter(
              (c) => String(c.companyId || c.company_id) === String(userCompanyId)
            )
          : masterCategories);

    const total = list.length;
    let active = 0;
    let inactive = 0;
    let withImage = 0;
    let withoutImage = 0;
    list.forEach((cat) => {
      const isAct = cat.isActive !== undefined ? cat.isActive : Boolean(cat.is_active);
      if (isAct) active++;
      else inactive++;

      const img = cat.imageUrl || cat.image_url;
      if (img && typeof img === "string" && img.trim() !== "") {
        withImage++;
      } else {
        withoutImage++;
      }
    });
    return { total, active, inactive, withImage, withoutImage };
  }, [masterCategories, companyFilter]);

  const statusOptions = useMemo(
    () => [
      { value: "", label: "All Statuses" },
      {
        value: "active",
        label: "Active",
        dotColor: "bg-emerald-500",
      },
      {
        value: "inactive",
        label: "Inactive",
        dotColor: "bg-rose-500",
      },
    ],
    []
  );

  const mediaOptions = useMemo(
    () => [
      { value: "", label: "All Visuals", icon: ImageIcon },
      {
        value: "with_image",
        label: "With Visual Asset",
        icon: ImageIcon,
        badge: `${counts.withImage}`,
      },
      {
        value: "without_image",
        label: "No Visual Asset",
        icon: ImageOff,
        badge: `${counts.withoutImage}`,
      },
    ],
    [counts.withImage, counts.withoutImage]
  );

  const sortOptions = useMemo(
    () => [
      { value: "display_order", label: "Display Order", icon: Layers },
      { value: "category_name", label: "Category Name", icon: Tags },
      { value: "category_code", label: "Category Code", icon: Tags },
      { value: "created_at", label: "Recently Created", icon: Calendar },
      { value: "updated_at", label: "Recently Updated", icon: Calendar },
    ],
    []
  );

  const activeCompanyName = useMemo(() => {
    if (!companyFilter) return "";
    const found = companyOptions.find((c) => String(c.value) === String(companyFilter));
    return found?.label || `Company #${companyFilter}`;
  }, [companyFilter, companyOptions]);

  const activeSortLabel = useMemo(() => {
    const found = sortOptions.find((s) => s.value === sortBy);
    return found?.label || "Display Order";
  }, [sortBy, sortOptions]);

  // Pagination metadata
  const meta = categoriesResponse?.meta || {};
  const totalItems = meta.total ?? currentCategories.length;
  const isAllSelected = limit === "All";
  const totalPages = isAllSelected
    ? 1
    : Math.max(1, meta.totalPages ?? Math.ceil(totalItems / (Number(limit) || 10)));

  // Reset page when search or filter reduces total pages
  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [page, totalPages]);

  const hasActiveFilters = Boolean(
    (search || "").trim() ||
      statusFilter !== "" ||
      companyFilter !== "" ||
      mediaFilter !== "" ||
      sortBy !== "display_order" ||
      sortOrder !== "asc"
  );

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setCompanyFilter("");
    setMediaFilter("");
    setSortBy("display_order");
    setSortOrder("asc");
    setPage(1);
  };

  const handleCopyCode = (code, id) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedKey(id);
    showNotification("success", `Copied code "${code}" to clipboard`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Open modals
  const openAdd = () => setModal({ open: true, mode: "add", data: null });
  const openEdit = (cat) => {
    handleAddRecentSearch(cat);
    setModal({ open: true, mode: "edit", data: cat });
  };
  const openAddSubcategory = (cat) => {
    setSubcategoryModal({ isOpen: true, category: cat });
  };

  const handleCreateSubcategory = async ({ values, imageFile }) => {
    try {
      await createSubcategoryMutation.mutateAsync({ data: values, imageFile });
      showNotification("success", `Subcategory "${values.subcategory_name}" created successfully!`);
      setSubcategoryModal({ isOpen: false, category: null });
    } catch (err) {
      showNotification(
        "error",
        err?.response?.data?.message || err?.message || "Failed to create subcategory"
      );
    }
  };
  const openDetails = (cat) => {
    handleAddRecentSearch(cat);
    setDetailsModal({ isOpen: true, data: cat });
  };
  const closeModal = () => !saving && setModal((m) => ({ ...m, open: false }));

  // Form submit handler
  const handleFormSubmit = async ({ values, imageFile, removeImage }) => {
    setSaving(true);
    try {
      const editing = modal.mode === "edit";
      const id = modal.data?.id;

      const targetCompanyId = canSelectCompany
        ? Number(
            values.company_id ||
            modal.data?.companyId ||
            modal.data?.company_id ||
            companyFilter ||
            1
          )
        : Number(userCompanyId);

      const payload = {
        company_id: targetCompanyId,
        category_name: values.category_name,
        category_code: values.category_code || undefined,
        description: values.description || null,
        display_order: values.display_order,
        is_active: values.is_active,
      };

      if (editing) {
        if (removeImage && !imageFile && (modal.data.imageUrl || modal.data.image_url)) {
          await deleteImageMutation.mutateAsync(id);
        }
        await updateMutation.mutateAsync({ id, data: payload, imageFile });
        showNotification("success", `Category "${values.category_name}" updated successfully`);
      } else {
        await createMutation.mutateAsync({ data: payload, imageFile });
        showNotification("success", `Category "${values.category_name}" created successfully`);
      }

      setModal((m) => ({ ...m, open: false }));
      refetch();
      refetchMaster();
      return { success: true };
    } catch (err) {
      const respData = err.response?.data;
      const errorMsg =
        respData?.message ||
        respData?.error ||
        err.message ||
        "Could not save the category. Please try again.";

      if (errorMsg.toLowerCase().includes("category code")) {
        return { errors: { category_code: errorMsg } };
      }
      if (errorMsg.toLowerCase().includes("category name")) {
        return { errors: { category_name: errorMsg } };
      }

      showNotification("error", errorMsg);
      return { errors: { category_name: errorMsg } };
    } finally {
      setSaving(false);
    }
  };

  // Status toggle handler
  const handleToggle = async (cat) => {
    const name = cat.categoryName || cat.category_name;
    const currentActive = cat.isActive !== undefined ? cat.isActive : Boolean(cat.is_active);
    const newStatus = !currentActive;
    try {
      await updateStatusMutation.mutateAsync({
        id: cat.id,
        isActive: newStatus,
      });
      showNotification(
        "success",
        `Category "${name}" is now ${newStatus ? "Active" : "Inactive"}`
      );
      refetch();
      refetchMaster();
    } catch (err) {
      showNotification(
        "error",
        err.response?.data?.message || "Failed to update category status"
      );
    }
  };

  // Delete handler
  const handleDeleteConfirm = async () => {
    if (!toDelete?.id) return;
    setDeleting(true);
    const name = toDelete.categoryName || toDelete.category_name;
    try {
      await deleteMutation.mutateAsync(toDelete.id);
      showNotification("success", `Category "${name}" permanently deleted`);
      setToDelete(null);
      refetch();
      refetchMaster();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Cannot delete category with linked subcategories or products";
      showNotification("error", msg);
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const fmtDate = (iso) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
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

      {/* Backend API Error Banner */}
      {isError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 flex items-center justify-between gap-3 text-xs sm:text-sm font-medium animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>
              Failed to load categories:{" "}
              {apiError?.response?.data?.message || apiError?.message || "Service error"}
            </span>
          </div>
          <Button variant="outline" size="xs" icon={RefreshCw} onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Product Categories"
        description="Comprehensive catalog classification for sarees, dress materials, fabrics, POS sequence ordering, and imagery."
        actions={
          <div className="flex items-center gap-2.5">
            {/* View Mode Toggle with Code & Chill Fluid Sliding Tabs */}
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

            <div className="tooltip tooltip-bottom" data-tip="Refresh Categories">
              <Button
                variant="outline"
                size="sm"
                icon={RefreshCw}
                onClick={() => {
                  refetch();
                  refetchMaster();
                }}
                loading={isFetching && !isLoading}
              />
            </div>

            <Button variant="clip-six" size="sm" icon={Plus} onClick={openAdd}>
              Add Category
            </Button>
          </div>
        }
      />

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Categories */}
        <div className="rounded-2xl p-4 sm:p-5 bg-base-100 border border-base-300 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider block">
              Total Categories
            </span>
            <div className="text-2xl font-extrabold text-base-content mt-1">
              {counts.total}
            </div>
            <span className="text-[11px] text-base-content/50 font-medium mt-0.5 block">
              Master catalog entries
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Tags className="w-5 h-5" />
          </div>
        </div>

        {/* Active Categories */}
        <div className="rounded-2xl p-4 sm:p-5 bg-base-100 border border-base-300 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider block">
              Active Catalog
            </span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">
              {counts.active}
            </div>
            <span className="text-[11px] text-emerald-600/80 font-medium mt-0.5 block">
              Live on POS & billing
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Inactive Categories */}
        <div className="rounded-2xl p-4 sm:p-5 bg-base-100 border border-base-300 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider block">
              Inactive
            </span>
            <div className="text-2xl font-extrabold text-rose-600 mt-1">
              {counts.inactive}
            </div>
            <span className="text-[11px] text-rose-600/80 font-medium mt-0.5 block">
              Hidden from catalog
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Sequenced Display */}
        <div className="rounded-2xl p-4 sm:p-5 bg-base-100 border border-base-300 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider block">
              Sequencing
            </span>
            <div className="text-2xl font-extrabold text-indigo-600 mt-1 capitalize">
              {sortOrder === "asc" ? "Ascending" : "Descending"}
            </div>
            <span className="text-[11px] text-indigo-600/80 font-medium mt-0.5 block truncate max-w-[140px]" title={activeSortLabel}>
              By {activeSortLabel}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="rounded-2xl p-4 sm:p-5 bg-base-100 border border-base-300 shadow-xs space-y-3.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Left: Search box + Quick Status Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 min-w-0 max-w-2xl">
            <div ref={searchBoxRef} className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-base-content/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search category by name or code..."
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
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                    className="text-base-content/40 hover:text-base-content p-1 rounded-lg hover:bg-base-300/50 transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                {recentSearches.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsRecentSearchesOpen((prev) => !prev);
                    }}
                    className={`p-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                      isRecentSearchesOpen
                        ? "text-primary bg-primary/10 shadow-2xs"
                        : "text-base-content/40 hover:text-base-content hover:bg-base-300/50"
                    }`}
                    title={isRecentSearchesOpen ? "Hide recent searches" : "Show recent searches"}
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right: Dropdowns & Filter Controls Cluster */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Company Filter (Only SuperAdmin and Admin without fixed company_id can select) */}
            {canSelectCompany && companyOptions.length > 1 && (
              <CategoryFilterDropdown
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

            {/* Status Filter */}
            <CategoryFilterDropdown
              label="All Statuses"
              value={statusFilter}
              options={statusOptions}
              onChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
              minWidth="min-w-[135px]"
            />

            {/* Media / Imagery Filter */}
            <CategoryFilterDropdown
              label="All Visuals"
              value={mediaFilter}
              options={mediaOptions}
              onChange={(val) => {
                setMediaFilter(val);
                setPage(1);
              }}
              icon={ImageIcon}
              minWidth="min-w-[130px]"
            />

            {/* Sort Criteria Dropdown */}
            <CategoryFilterDropdown
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
              <CategoryRecentSearches
                recentSearches={recentSearches}
                catalog={masterCategories}
                onSelectSearch={handleSelectRecentSearch}
                onClearAll={handleClearRecentSearches}
                onRemoveItem={handleRemoveRecentSearch}
                activeQuery={search}
              />
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

              {companyFilter !== "" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-medium">
                  <Building className="w-3 h-3" />
                  <span>Company: {activeCompanyName}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCompanyFilter("");
                      setPage(1);
                    }}
                    className="p-0.5 hover:bg-indigo-500/20 rounded cursor-pointer"
                    title="Remove Company Filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {statusFilter !== "" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
                  <span>Status: {statusFilter === "active" ? "Active Catalog" : "Inactive Catalog"}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter("");
                      setPage(1);
                    }}
                    className="p-0.5 hover:bg-emerald-500/20 rounded cursor-pointer"
                    title="Remove Status"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {mediaFilter !== "" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-medium">
                  {mediaFilter === "with_image" ? <ImageIcon className="w-3 h-3" /> : <ImageOff className="w-3 h-3" />}
                  <span>Media: {mediaFilter === "with_image" ? "With Visual Asset" : "No Visual Asset"}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMediaFilter("");
                      setPage(1);
                    }}
                    className="p-0.5 hover:bg-purple-500/20 rounded cursor-pointer"
                    title="Remove Media Filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {(sortBy !== "display_order" || sortOrder !== "asc") && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-medium">
                  <ArrowUpDown className="w-3 h-3" />
                  <span>
                    Sort: {activeSortLabel} ({sortOrder.toUpperCase()})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy("display_order");
                      setSortOrder("asc");
                      setPage(1);
                    }}
                    className="p-0.5 hover:bg-blue-500/20 rounded cursor-pointer"
                    title="Reset Sort"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-rose-600 hover:bg-rose-500/10 font-semibold cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            </div>

            <span className="text-base-content/60 font-medium">
              Showing <span className="font-bold text-base-content">{totalItems}</span> matching categories
            </span>
          </div>
        )}
      </div>

      {/* Main View: Loading / Empty / Table / Cards */}
      {isLoading ? (
        <CategoriesSkeleton viewMode={viewMode} />
      ) : currentCategories.length === 0 ? (
        <div className="p-12 rounded-2xl bg-base-100 border border-base-300 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            {hasActiveFilters ? <Filter className="w-8 h-8 text-primary" /> : <Tags className="w-8 h-8" />}
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h4 className="text-base font-bold text-base-content">
              {hasActiveFilters ? "No Categories Match Criteria" : "No Product Categories Found"}
            </h4>
            <p className="text-xs text-base-content/60 leading-relaxed">
              {hasActiveFilters
                ? `No categories match your filters (${[
                    search.trim() ? `query: "${search}"` : null,
                    statusFilter ? `status: ${statusFilter}` : null,
                  ]
                    .filter(Boolean)
                    .join(", ")}). Try resetting filters or adding a new category.`
                : "Your catalog category master is currently empty. Create your first category to organize sarees, fabrics, and apparel."}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            {hasActiveFilters ? (
              <Button variant="outline" size="sm" icon={RotateCcw} onClick={handleResetFilters}>
                Clear All Filters
              </Button>
            ) : null}
            <Button variant="primary" size="sm" icon={Plus} onClick={openAdd}>
              Add Category
            </Button>
          </div>
        </div>
      ) : (
        <AnimatedTabContent activeKey={viewMode}>
          {viewMode === "table" ? (
            <CategoryTableView
              categories={currentCategories}
              totalItems={totalItems}
              page={page}
              limit={limit}
              setPage={setPage}
              setLimit={setLimit}
              copiedKey={copiedKey}
              onCopyCode={handleCopyCode}
              onToggleStatus={handleToggle}
              isStatusPending={updateStatusMutation.isPending}
              onImageClick={handleOpenImageViewer}
              onViewDetails={openDetails}
              onEdit={openEdit}
              onAddSubcategory={openAddSubcategory}
              onDelete={setToDelete}
              fmtDate={fmtDate}
            />
          ) : (
            <CategoryCardsView
              categories={currentCategories}
              totalItems={totalItems}
              page={page}
              limit={limit}
              setPage={setPage}
              setLimit={setLimit}
              copiedKey={copiedKey}
              onCopyCode={handleCopyCode}
              onToggleStatus={handleToggle}
              isStatusPending={updateStatusMutation.isPending}
              onImageClick={handleOpenImageViewer}
              onViewDetails={openDetails}
              onEdit={openEdit}
              onAddSubcategory={openAddSubcategory}
              onDelete={setToDelete}
              fmtDate={fmtDate}
            />
          )}
        </AnimatedTabContent>
      )}

      {/* Add / Edit Category Modal */}
      <CategoryFormModal
        open={modal.open}
        mode={modal.mode}
        initialData={modal.data}
        initialCompanyId={companyFilter ? Number(companyFilter) : (user?.companyId || user?.company_id || 1)}
        saving={saving}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
      />

      {/* Category Quick Details Modal */}
      <CategoryDetailsModal
        isOpen={detailsModal.isOpen}
        category={detailsModal.data}
        onClose={() => setDetailsModal({ isOpen: false, data: null })}
        onEdit={(cat) => openEdit(cat)}
        onDelete={(cat) => setToDelete(cat)}
        onToggleStatus={(cat) => handleToggle(cat)}
        onImageClick={handleOpenImageViewer}
        onNavigateFullPage={(catId) => navigate(`/products/categories/${catId}`)}
        onAddSubcategory={(cat) => openAddSubcategory(cat)}
      />

      {/* Dedicated Add Subcategory Modal directly for selected Category (Locked Parent Category) */}
      <CategoryAddSubcategoryModal
        isOpen={subcategoryModal.isOpen}
        category={subcategoryModal.category}
        saving={createSubcategoryMutation.isPending}
        onClose={() => setSubcategoryModal({ isOpen: false, category: null })}
        onSubmit={handleCreateSubcategory}
      />

      {/* High-Quality Image Viewer Modal */}
      <ImageViewerModal
        isOpen={imageViewer.isOpen}
        onClose={() => setImageViewer({ isOpen: false, src: "", title: "" })}
        src={imageViewer.src}
        title={imageViewer.title}
        subtitle="Category Master Visual Asset"
      />

      {/* Modern Luxury Delete Confirmation Modal */}
      <CategoryDeleteModal
        isOpen={Boolean(toDelete)}
        category={toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleting}
      />
    </div>
  );
}
