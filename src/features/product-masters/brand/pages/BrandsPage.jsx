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
  X,
  LayoutGrid,
  Table as TableIcon,
  Layers,
  ArrowUpDown,
  Building,
  Image as ImageIcon,
  Clock,
  Sparkles,
} from "lucide-react";
import PageHeader from "../../../../common/components/PageHeader.jsx";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import Pagination from "../../../../common/components/ui/pagination/Pagination.jsx";
import ImageViewerModal from "../../../../common/components/ui/ImageViewerModal.jsx";
import { SlidingTabs, AnimatedTabContent } from "../../../../common/components/tabs/index.js";
import { useCompanies } from "../../../company/hooks/useCompanies.js";
import {
  useBrands,
  useAllBrands,
  useBrandStats,
  useCreateBrand,
  useUpdateBrand,
  useUpdateBrandStatus,
  useDeleteBrand,
  useDeleteBrandLogo,
} from "../hooks/useBrands.js";
import {
  BrandTableView,
  BrandCardsView,
  BrandFormModal,
  BrandDetailsModal,
  BrandDeleteModal,
  BrandFilterDropdown,
  BrandRecentSearches,
  BrandsSkeleton,
} from "../components/index.js";
import { formatBrandName } from "../utils/brandHelper.js";

const RECENT_SEARCHES_STORAGE_KEY = "pooja_fashion_recent_brand_searches_v1";

export default function BrandsPage() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth?.user);
  const roleCode = String(user?.roleCode || user?.role || "").toUpperCase();
  const userCompanyId = user?.companyId || user?.company_id;
  const isSuperAdmin = roleCode === "SUPERADMIN";
  const isAdmin = roleCode === "ADMIN";
  const canSelectCompany = (isSuperAdmin || isAdmin) && !userCompanyId;

  // Active companies directory
  const { data: companiesResponse } = useCompanies({ limit: 100, status: "active" });
  const companiesList = companiesResponse?.data || [];

  // Filter & UI State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // "" | "active" | "inactive"
  const [companyFilter, setCompanyFilter] = useState(""); // "" for all
  const [mediaFilter, setMediaFilter] = useState(""); // "" | "with_logo" | "without_logo"
  const [sortBy, setSortBy] = useState("display_order");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("table");
  const [copiedKey, setCopiedKey] = useState(null);

  // Modals state
  const [formModal, setFormModal] = useState({ open: false, mode: "add", data: null });
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, data: null });
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [imageViewer, setImageViewer] = useState({ isOpen: false, src: "", title: "" });

  // Recent Searches State
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isRecentSearchesOpen, setIsRecentSearchesOpen] = useState(false);
  const searchBoxRef = useRef(null);
  const recentSearchesRef = useRef(null);

  // Handle outside clicks for recent searches dropdown
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

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  // Build query params for server-side paginated brands
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

    if (mediaFilter === "with_logo") {
      params.has_logo = true;
    } else if (mediaFilter === "without_logo") {
      params.has_logo = false;
    }

    return params;
  }, [page, limit, canSelectCompany, companyFilter, userCompanyId, search, statusFilter, mediaFilter, sortBy, sortOrder]);

  // Query server for paginated brands
  const {
    data: brandsResponse,
    isLoading,
    isFetching,
    isError,
    error: apiError,
    refetch,
  } = useBrands(queryParams);

  // Master all brands for counts and recent search matching
  const masterParams = useMemo(() => {
    const p = {};
    if (canSelectCompany && companyFilter) {
      p.company_id = Number(companyFilter);
    } else if (userCompanyId) {
      p.company_id = Number(userCompanyId);
    }
    return p;
  }, [canSelectCompany, companyFilter, userCompanyId]);

  const { data: allBrandsResponse, refetch: refetchMaster } = useAllBrands(masterParams);
  const { data: serverStats } = useBrandStats(masterParams);

  // Mutations
  const createMutation = useCreateBrand();
  const updateMutation = useUpdateBrand();
  const updateStatusMutation = useUpdateBrandStatus();
  const deleteMutation = useDeleteBrand();
  const deleteLogoMutation = useDeleteBrandLogo();

  // Normalize data lists
  const currentBrands = useMemo(() => {
    const raw = brandsResponse?.data || brandsResponse?.brands || [];
    return Array.isArray(raw) ? raw : [];
  }, [brandsResponse]);

  const masterBrands = useMemo(() => {
    const raw = allBrandsResponse?.data || allBrandsResponse?.brands || [];
    return Array.isArray(raw) ? raw : [];
  }, [allBrandsResponse]);

  // Pagination metadata
  const paginationMeta = brandsResponse?.pagination || brandsResponse?.meta || {
    total: currentBrands.length,
    totalPages: 1,
    page: 1,
    limit: 10,
  };
  const totalItems = paginationMeta.total ?? currentBrands.length;

  // Aggregate stats calculation
  const counts = useMemo(() => {
    if (serverStats?.data) {
      const s = serverStats.data;
      return {
        total: Number(s.total_brands || s.totalBrands || masterBrands.length),
        active: Number(s.active_brands || s.activeBrands || 0),
        inactive: Number(s.inactive_brands || s.inactiveBrands || 0),
        withLogo: Number(s.brands_with_logos || s.brandsWithLogos || 0),
      };
    }

    let active = 0;
    let inactive = 0;
    let withLogo = 0;
    masterBrands.forEach((b) => {
      const isActive = b.isActive !== undefined ? b.isActive : Boolean(b.is_active);
      if (isActive) active++;
      else inactive++;
      const hasLogo = Boolean(b.logoUrl || b.logo_url);
      if (hasLogo) withLogo++;
    });

    return {
      total: masterBrands.length,
      active,
      inactive,
      withLogo,
    };
  }, [serverStats, masterBrands]);

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
    masterBrands.forEach((b) => {
      const cId = b.companyId || b.company_id;
      const cName = b.companyName || (cId ? `Company #${cId}` : null);
      if (cId && cName && !map.has(String(cId))) {
        map.set(String(cId), {
          value: String(cId),
          label: cName,
          badge: b.companyCode || null,
          icon: Building,
        });
      }
    });
    return [{ value: "", label: "All Companies", icon: Building }, ...Array.from(map.values())];
  }, [companiesList, masterBrands]);

  // Recent search sync
  const handleAddRecentSearch = (item) => {
    if (!item) return;
    const name =
      typeof item === "string"
        ? item
        : item.name || item.brandName || item.brand_name || item.query;
    if (!name || !name.trim()) return;

    const queryTrim = name.trim();
    const queryLower = queryTrim.toLowerCase();

    // Match against catalog
    const pool = [...masterBrands, ...currentBrands];
    const match = pool.find((b) => {
      const bName = (b.brandName || b.brand_name || "").toLowerCase();
      const bCode = (b.brandCode || b.brand_code || "").toLowerCase();
      return (
        bName === queryLower ||
        bCode === queryLower ||
        (queryLower.length >= 2 && (bName.includes(queryLower) || bCode.includes(queryLower)))
      );
    });

    const targetBrand = match || (typeof item === "object" ? item : null);
    const realName = formatBrandName(
      targetBrand ? (targetBrand.brandName || targetBrand.brand_name || targetBrand.name || queryTrim) : queryTrim
    );
    const realCode = targetBrand ? (targetBrand.brandCode || targetBrand.brand_code || targetBrand.code || "") : "";
    const realLogo = targetBrand ? (targetBrand.logoUrl || targetBrand.logo_url || null) : null;

    setRecentSearches((prev) => {
      const newEntry = {
        id: targetBrand?.id || `brand-search-${Date.now()}`,
        name: realName,
        code: realCode,
        logoUrl: realLogo,
        timestamp: Date.now(),
        query: realName || queryTrim,
      };

      const filtered = prev.filter(
        (s) => (s.name || s.query || "").toLowerCase() !== queryLower
      );
      const updated = [newEntry, ...filtered].slice(0, 10);
      try {
        localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error(err);
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
      } catch (err) {
        console.error(err);
      }
    }, 200);
  };

  const handleRemoveRecentItem = (item) => {
    const queryLower = (item.name || item.query || "").toLowerCase();
    setRecentSearches((prev) => {
      const updated = prev.filter(
        (s) => (s.name || s.query || "").toLowerCase() !== queryLower
      );
      try {
        localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  const handleCopyCode = (code, id) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedKey(`brand-${id}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Open Form Modal
  const openAdd = () => {
    setFormModal({ open: true, mode: "add", data: null });
  };

  const openEdit = (brand) => {
    setFormModal({ open: true, mode: "edit", data: brand });
  };

  // Submit Handler
  const handleFormSubmit = async ({ values, logoFile, removeLogo, isEdit }) => {
    setSaving(true);
    try {
      const targetCompanyId = canSelectCompany
        ? Number(values.company_id || formModal.data?.companyId || companyFilter || 1)
        : Number(userCompanyId);

      const payload = {
        company_id: targetCompanyId,
        brand_name: values.brand_name,
        brand_code: values.brand_code || undefined,
        description: values.description || null,
        website_url: values.website_url || null,
        display_order: values.display_order,
        is_active: values.is_active,
      };

      if (isEdit) {
        const id = formModal.data?.id;
        if (removeLogo && !logoFile && (formModal.data.logoUrl || formModal.data.logo_url)) {
          await deleteLogoMutation.mutateAsync(id);
        }
        await updateMutation.mutateAsync({ id, data: payload, logoFile });
        showNotification("success", `Brand "${values.brand_name}" updated successfully`);
      } else {
        await createMutation.mutateAsync({ data: payload, logoFile });
        showNotification("success", `Brand "${values.brand_name}" created successfully`);
      }

      setFormModal((m) => ({ ...m, open: false }));
      refetch();
      refetchMaster();
      return { success: true };
    } catch (err) {
      const respData = err.response?.data;
      const errorMsg =
        respData?.message ||
        respData?.error ||
        err.message ||
        "Could not save brand. Please try again.";

      if (errorMsg.toLowerCase().includes("brand code")) {
        return { errors: { brand_code: errorMsg } };
      }
      if (errorMsg.toLowerCase().includes("brand name")) {
        return { errors: { brand_name: errorMsg } };
      }

      showNotification("error", errorMsg);
      return { errors: { brand_name: errorMsg } };
    } finally {
      setSaving(false);
    }
  };

  // Status Toggle Handler
  const handleToggleStatus = async (brand) => {
    const name = brand.brandName || brand.brand_name;
    const currentActive =
      brand.isActive !== undefined ? brand.isActive : Boolean(brand.is_active);
    const newStatus = !currentActive;

    try {
      await updateStatusMutation.mutateAsync({
        id: brand.id,
        isActive: newStatus,
      });
      showNotification(
        "success",
        `Brand "${name}" is now ${newStatus ? "Active" : "Inactive"}`
      );
      refetch();
      refetchMaster();
    } catch (err) {
      showNotification(
        "error",
        err.response?.data?.message || "Failed to update brand status"
      );
    }
  };

  // Delete Handler
  const handleDeleteConfirm = async () => {
    if (!toDelete?.id) return;
    setDeleting(true);
    const name = toDelete.brandName || toDelete.brand_name;

    try {
      await deleteMutation.mutateAsync(toDelete.id);
      showNotification("success", `Brand "${name}" permanently deleted`);
      setToDelete(null);
      refetch();
      refetchMaster();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Cannot delete brand with associated products or stock items";
      showNotification("error", msg);
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const activeSortLabel = useMemo(() => {
    const labels = {
      display_order: "Display Order",
      brand_name: "Brand Name",
      brand_code: "Brand Code",
      created_at: "Date Created",
    };
    return labels[sortBy] || "Display Order";
  }, [sortBy]);

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
              Failed to load brands:{" "}
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
        title="Brands Master"
        description="Manage apparel brands, designer labels, fabric mills, manufacturer trademarks, and catalog logos."
        actions={
          <div className="flex items-center gap-2.5">
            {/* View Mode Toggle with Fluid SlidingTabs */}
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

            <div className="tooltip tooltip-bottom" data-tip="Refresh Brands">
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
              Add Brand
            </Button>
          </div>
        }
      />

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Brands */}
        <div className="rounded-3xl p-4 sm:p-5 bg-base-100 border border-base-300 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider block">
              Total Brands
            </span>
            <div className="text-2xl font-extrabold text-base-content mt-1">
              {counts.total}
            </div>
            <span className="text-[11px] text-base-content/50 font-medium mt-0.5 block">
              Registered catalog brands
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5" />
          </div>
        </div>

        {/* Active Brands */}
        <div className="rounded-3xl p-4 sm:p-5 bg-base-100 border border-base-300 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider block">
              Active in Catalog
            </span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">
              {counts.active}
            </div>
            <span className="text-[11px] text-emerald-600/80 font-medium mt-0.5 block">
              Live on POS & products
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Inactive Brands */}
        <div className="rounded-3xl p-4 sm:p-5 bg-base-100 border border-base-300 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider block">
              Hidden / Inactive
            </span>
            <div className="text-2xl font-extrabold text-rose-600 mt-1">
              {counts.inactive}
            </div>
            <span className="text-[11px] text-rose-600/80 font-medium mt-0.5 block">
              Hidden from billing
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        {/* With Visuals */}
        <div className="rounded-3xl p-4 sm:p-5 bg-base-100 border border-base-300 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider block">
              With Visuals
            </span>
            <div className="text-2xl font-extrabold text-indigo-600 mt-1">
              {counts.withLogo}
            </div>
            <span className="text-[11px] text-indigo-600/80 font-medium mt-0.5 block">
              With uploaded brand logo
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="rounded-3xl p-4 sm:p-5 bg-base-100 border border-base-300 shadow-xs space-y-3.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Left: Search box + Quick Status Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 min-w-0 max-w-2xl">
            <div ref={searchBoxRef} className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-base-content/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search brand by name, code, or website..."
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
                          : "text-base-content/40 hover:text-base-content hover:bg-base-300/50"
                      }`}
                      aria-label="Recent searches"
                    >
                      <Clock className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Recent searches dropdown */}
              <div ref={recentSearchesRef}>
                <BrandRecentSearches
                  isOpen={isRecentSearchesOpen}
                  recentSearches={recentSearches}
                  onSelectSearch={(item) => {
                    setSearch(item.name || item.query);
                    setPage(1);
                    setIsRecentSearchesOpen(false);
                    handleAddRecentSearch(item);
                  }}
                  onClearAll={handleClearRecentSearches}
                  onRemoveItem={handleRemoveRecentItem}
                />
              </div>
            </div>

            {/* Quick Status Tabs Pills */}
            <div className="flex items-center gap-1 bg-base-200/70 p-1 rounded-xl border border-base-300 shrink-0">
              {[
                { key: "", label: "All", count: counts.total },
                { key: "active", label: "Active", count: counts.active },
                { key: "inactive", label: "Inactive", count: counts.inactive },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setStatusFilter(tab.key);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    statusFilter === tab.key
                      ? "bg-base-100 text-primary shadow-xs"
                      : "text-base-content/60 hover:text-base-content hover:bg-base-100/50"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      statusFilter === tab.key
                        ? "bg-primary/10 text-primary"
                        : "bg-base-300/50 text-base-content/50"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Company Filter (SuperAdmin / Admin only) */}
            {canSelectCompany && (
              <BrandFilterDropdown
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

            {/* Visuals Filter */}
            <BrandFilterDropdown
              label="Visuals"
              value={mediaFilter}
              options={[
                { value: "", label: "All Visuals", icon: ImageIcon },
                { value: "with_logo", label: "With Logo", badge: `${counts.withLogo}` },
                { value: "without_logo", label: "No Logo" },
              ]}
              onChange={(val) => {
                setMediaFilter(val);
                setPage(1);
              }}
              icon={ImageIcon}
              minWidth="min-w-[130px]"
            />

            {/* Sort Field */}
            <BrandFilterDropdown
              label="Sort By"
              value={sortBy}
              options={[
                { value: "display_order", label: "Display Order", icon: Layers },
                { value: "brand_name", label: "Brand Name" },
                { value: "brand_code", label: "Brand Code" },
                { value: "created_at", label: "Date Created" },
              ]}
              onChange={(val) => {
                setSortBy(val);
                setPage(1);
              }}
              icon={ArrowUpDown}
              minWidth="min-w-[140px]"
            />

            {/* Sort Order Direction Toggle */}
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
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <BrandsSkeleton viewMode={viewMode} />
      ) : (
        <AnimatedTabContent activeTab={viewMode}>
          {viewMode === "table" ? (
            <BrandTableView
              brands={currentBrands}
              copiedKey={copiedKey}
              onCopyCode={handleCopyCode}
              onToggleStatus={handleToggleStatus}
              isStatusPending={updateStatusMutation.isPending}
              onImageClick={setImageViewer}
              onViewDetails={(brand) => setDetailsModal({ isOpen: true, data: brand })}
              onEdit={openEdit}
              onDelete={setToDelete}
              onAddBrand={openAdd}
            />
          ) : (
            <BrandCardsView
              brands={currentBrands}
              copiedKey={copiedKey}
              onCopyCode={handleCopyCode}
              onToggleStatus={handleToggleStatus}
              isStatusPending={updateStatusMutation.isPending}
              onImageClick={setImageViewer}
              onViewDetails={(brand) => setDetailsModal({ isOpen: true, data: brand })}
              onEdit={openEdit}
              onDelete={setToDelete}
              onAddBrand={openAdd}
            />
          )}
        </AnimatedTabContent>
      )}

      {/* Pagination Strip */}
      {!isLoading && currentBrands.length > 0 && (
        <div className="pt-2">
          <Pagination
            currentPage={Number(paginationMeta.page) || page}
            totalPages={Number(paginationMeta.totalPages) || 1}
            totalItems={totalItems}
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
      <BrandFormModal
        isOpen={formModal.open}
        mode={formModal.mode}
        initialData={formModal.data}
        initialCompanyId={companyFilter || userCompanyId}
        saving={saving}
        onClose={() => setFormModal((m) => ({ ...m, open: false }))}
        onSubmit={handleFormSubmit}
      />

      {/* Details Quick View Modal */}
      <BrandDetailsModal
        isOpen={detailsModal.isOpen}
        brand={detailsModal.data}
        onClose={() => setDetailsModal({ isOpen: false, data: null })}
        onEdit={openEdit}
        onDelete={setToDelete}
        onToggleStatus={handleToggleStatus}
        onImageClick={setImageViewer}
        onNavigateFullPage={(b) => navigate(`/products/brands/${b.id}`)}
      />

      {/* Delete Confirmation Modal */}
      <BrandDeleteModal
        isOpen={Boolean(toDelete)}
        brand={toDelete}
        isDeleting={deleting}
        onClose={() => setToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* High-Resolution Image Viewer Modal */}
      <ImageViewerModal
        isOpen={imageViewer.isOpen}
        src={imageViewer.src}
        title={imageViewer.title}
        onClose={() => setImageViewer({ isOpen: false, src: "", title: "" })}
      />
    </div>
  );
}

