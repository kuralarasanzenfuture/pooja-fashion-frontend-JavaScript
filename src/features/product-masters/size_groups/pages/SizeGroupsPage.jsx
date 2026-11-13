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
  X,
  LayoutGrid,
  Table as TableIcon,
  Layers,
  ArrowUpDown,
  Building,
  Clock,
  Sparkles,
  Download,
} from "lucide-react";
import PageHeader from "../../../../common/components/PageHeader.jsx";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import Pagination from "../../../../common/components/ui/pagination/Pagination.jsx";
import { SlidingTabs, AnimatedTabContent } from "../../../../common/components/tabs/index.js";
import { useCompanies } from "../../../company/hooks/useCompanies.js";
import {
  useSizeGroups,
  useAllSizeGroups,
  useSizeGroupTree,
  useSizeGroupStats,
  useCreateSizeGroup,
  useUpdateSizeGroup,
  useUpdateSizeGroupStatus,
  useDeleteSizeGroup,
  useSeedDefaultSizeGroups,
} from "../hooks/useSizeGroups.js";
import {
  SizeGroupTableView,
  SizeGroupCardsView,
  SizeGroupFormModal,
  SizeGroupDetailsModal,
  SizeGroupDeleteModal,
  SizeGroupFilterDropdown,
  SizeGroupRecentSearches,
  SizeGroupsSkeleton,
} from "../components/index.js";
import { formatSizeGroupName } from "../utils/sizeGroupHelper.js";

const RECENT_SEARCHES_STORAGE_KEY = "pooja_fashion_recent_sizegroup_searches_v1";

export default function SizeGroupsPage() {
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
  const [sortBy, setSortBy] = useState("size_group_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("table");
  const [copiedKey, setCopiedKey] = useState(null);

  // Modals state
  const [formModal, setFormModal] = useState({ open: false, mode: "add", data: null });
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, data: null });
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [notification, setNotification] = useState(null);

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

  // Outside click listener
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

  // Build query params for server-side paginated size groups
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

    return params;
  }, [page, limit, canSelectCompany, companyFilter, userCompanyId, search, statusFilter, sortBy, sortOrder]);

  // Query server for paginated size groups
  const {
    data: sizeGroupsResponse,
    isLoading,
    isFetching,
    isError,
    error: apiError,
    refetch,
  } = useSizeGroups(queryParams);

  // Master params for unpaginated tree and stats
  const masterParams = useMemo(() => {
    const p = {};
    if (canSelectCompany && companyFilter) {
      p.company_id = Number(companyFilter);
    } else if (userCompanyId) {
      p.company_id = Number(userCompanyId);
    }
    return p;
  }, [canSelectCompany, companyFilter, userCompanyId]);

  const { data: treeResponse, refetch: refetchTree } = useSizeGroupTree(masterParams);
  const { data: serverStats } = useSizeGroupStats(masterParams);

  // Mutations
  const createMutation = useCreateSizeGroup();
  const updateMutation = useUpdateSizeGroup();
  const updateStatusMutation = useUpdateSizeGroupStatus();
  const deleteMutation = useDeleteSizeGroup();
  const seedDefaultsMutation = useSeedDefaultSizeGroups();

  // Normalize lists
  const currentGroups = useMemo(() => {
    const raw = sizeGroupsResponse?.data || sizeGroupsResponse?.sizeGroups || [];
    return Array.isArray(raw) ? raw : [];
  }, [sizeGroupsResponse]);

  const treeGroups = useMemo(() => {
    const raw = treeResponse?.data || treeResponse || [];
    return Array.isArray(raw) ? raw : [];
  }, [treeResponse]);

  // Enrich paginated groups with child sizes from tree if available
  const enrichedGroups = useMemo(() => {
    if (!treeGroups.length) return currentGroups;
    const treeMap = new Map();
    treeGroups.forEach((tg) => {
      treeMap.set(Number(tg.id), tg);
    });

    return currentGroups.map((cg) => {
      const match = treeMap.get(Number(cg.id));
      if (match) {
        return {
          ...cg,
          sizes: match.sizes || [],
          sizesCount: match.sizesCount || match.sizes?.length || 0,
        };
      }
      return cg;
    });
  }, [currentGroups, treeGroups]);

  // Pagination metadata
  const paginationMeta = sizeGroupsResponse?.pagination || sizeGroupsResponse?.meta || {
    total: enrichedGroups.length,
    totalPages: 1,
    page: 1,
    limit: 10,
  };
  const totalItems = paginationMeta.total ?? enrichedGroups.length;

  // Aggregate stats calculation
  const counts = useMemo(() => {
    if (serverStats?.data) {
      const s = serverStats.data;
      return {
        total: Number(s.total_size_groups || s.totalSizeGroups || treeGroups.length),
        active: Number(s.active_size_groups || s.activeSizeGroups || 0),
        inactive: Number(s.inactive_size_groups || s.inactiveSizeGroups || 0),
        totalSizes: Number(s.total_sizes || s.totalSizes || 0),
      };
    }

    let active = 0;
    let inactive = 0;
    let totalSizes = 0;
    treeGroups.forEach((g) => {
      const isAct = g.isActive !== undefined ? g.isActive : Boolean(g.is_active);
      if (isAct) active++;
      else inactive++;
      totalSizes += Number(g.sizesCount || g.sizes?.length || 0);
    });

    return {
      total: treeGroups.length,
      active,
      inactive,
      totalSizes,
    };
  }, [serverStats, treeGroups]);

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
    treeGroups.forEach((g) => {
      const cId = g.companyId || g.company_id;
      const cName = g.companyName || (cId ? `Company #${cId}` : null);
      if (cId && cName && !map.has(String(cId))) {
        map.set(String(cId), {
          value: String(cId),
          label: cName,
          badge: g.companyCode || null,
          icon: Building,
        });
      }
    });
    return [{ value: "", label: "All Companies", icon: Building }, ...Array.from(map.values())];
  }, [companiesList, treeGroups]);

  // Status options for filter dropdown
  const statusOptions = useMemo(
    () => [
      { value: "", label: "All Statuses" },
      { value: "active", label: "Active", dotColor: "bg-emerald-500" },
      { value: "inactive", label: "Inactive", dotColor: "bg-rose-500" },
    ],
    []
  );

  // Recent search sync
  const handleAddRecentSearch = (item) => {
    if (!item) return;
    const name =
      typeof item === "string"
        ? item
        : item.name || item.sizeGroupName || item.size_group_name || item.query;
    if (!name || !name.trim()) return;

    const queryTrim = name.trim();
    const queryLower = queryTrim.toLowerCase();

    // Match against catalog
    const pool = [...treeGroups, ...currentGroups];
    const match = pool.find((g) => {
      const gName = (g.sizeGroupName || g.size_group_name || "").toLowerCase();
      const gCode = (g.sizeGroupCode || g.size_group_code || "").toLowerCase();
      return (
        gName === queryLower ||
        gCode === queryLower ||
        (queryLower.length >= 2 && (gName.includes(queryLower) || gCode.includes(queryLower)))
      );
    });

    const targetGroup = match || (typeof item === "object" ? item : null);
    const realName = formatSizeGroupName(
      targetGroup ? (targetGroup.sizeGroupName || targetGroup.size_group_name || targetGroup.name || queryTrim) : queryTrim
    );
    const realCode = targetGroup ? (targetGroup.sizeGroupCode || targetGroup.size_group_code || targetGroup.code || "") : "";

    setRecentSearches((prev) => {
      const newEntry = {
        id: targetGroup?.id || `sg-search-${Date.now()}`,
        name: realName,
        code: realCode,
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
    setCopiedKey(`sizegroup-${id}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Open Form Modal
  const openAdd = () => {
    setFormModal({ open: true, mode: "add", data: null });
  };

  const openEdit = (group) => {
    setFormModal({ open: true, mode: "edit", data: group });
  };

  // Submit Handler
  const handleFormSubmit = async ({ values, isEdit }) => {
    setSaving(true);
    try {
      const targetCompanyId = canSelectCompany
        ? Number(values.company_id || formModal.data?.companyId || companyFilter || 1)
        : Number(userCompanyId);

      const payload = {
        company_id: targetCompanyId,
        size_group_name: values.size_group_name,
        size_group_code: values.size_group_code || undefined,
        description: values.description || null,
        is_active: values.is_active,
      };

      if (isEdit) {
        const id = formModal.data?.id;
        await updateMutation.mutateAsync({ id, data: payload });
        showNotification("success", `Size Group "${values.size_group_name}" updated successfully`);
      } else {
        await createMutation.mutateAsync(payload);
        showNotification("success", `Size Group "${values.size_group_name}" created successfully`);
      }

      setFormModal((m) => ({ ...m, open: false }));
      refetch();
      refetchTree();
      return { success: true };
    } catch (err) {
      const respData = err.response?.data;
      const errorMsg =
        respData?.message ||
        respData?.error ||
        err.message ||
        "Could not save size group. Please try again.";

      if (errorMsg.toLowerCase().includes("size group code")) {
        return { errors: { size_group_code: errorMsg } };
      }
      if (errorMsg.toLowerCase().includes("size group name")) {
        return { errors: { size_group_name: errorMsg } };
      }

      showNotification("error", errorMsg);
      return { errors: { size_group_name: errorMsg } };
    } finally {
      setSaving(false);
    }
  };

  // Status Toggle Handler
  const handleToggleStatus = async (group) => {
    const name = group.sizeGroupName || group.size_group_name;
    const currentActive =
      group.isActive !== undefined ? group.isActive : Boolean(group.is_active);
    const newStatus = !currentActive;

    try {
      await updateStatusMutation.mutateAsync({
        id: group.id,
        isActive: newStatus,
      });
      showNotification(
        "success",
        `Size Group "${name}" is now ${newStatus ? "Active" : "Inactive"}`
      );
      refetch();
      refetchTree();
    } catch (err) {
      showNotification(
        "error",
        err.response?.data?.message || "Failed to update size group status"
      );
    }
  };

  // Delete Handler
  const handleDeleteConfirm = async () => {
    if (!toDelete?.id) return;
    setDeleting(true);
    const name = toDelete.sizeGroupName || toDelete.size_group_name;

    try {
      await deleteMutation.mutateAsync(toDelete.id);
      showNotification("success", `Size Group "${name}" permanently deleted`);
      setToDelete(null);
      refetch();
      refetchTree();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Cannot delete size group with assigned sizes or product variants";
      showNotification("error", msg);
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  // Seed standard defaults handler
  const handleSeedDefaults = async () => {
    setSeeding(true);
    try {
      const targetCompanyId = canSelectCompany
        ? Number(companyFilter || 1)
        : Number(userCompanyId);
      await seedDefaultsMutation.mutateAsync({ company_id: targetCompanyId });
      showNotification("success", "Standard size groups seeded successfully (Men, Women, Kids, Infants, Footwear)");
      refetch();
      refetchTree();
    } catch (err) {
      showNotification("error", err.response?.data?.message || "Failed to seed default size groups");
    } finally {
      setSeeding(false);
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
              Failed to load size groups:{" "}
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
        title="Size Groups Master"
        description="Manage product sizing categories, apparel size sets (S, M, L, XL), numeric waist scales, and catalog hierarchies."
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

            <div className="tooltip tooltip-bottom" data-tip="Refresh Size Groups">
              <Button
                variant="outline"
                size="sm"
                icon={RefreshCw}
                onClick={() => {
                  refetch();
                  refetchTree();
                }}
                loading={isFetching && !isLoading}
              />
            </div>

            {counts.total === 0 && (
              <Button
                variant="outline"
                size="sm"
                icon={Download}
                onClick={handleSeedDefaults}
                loading={seeding}
              >
                Seed Defaults
              </Button>
            )}

            <Button variant="clip-six" size="sm" icon={Plus} onClick={openAdd}>
              Add Size Group
            </Button>
          </div>
        }
      />

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Size Groups */}
        <div className="rounded-3xl p-4 sm:p-5 bg-base-100 border border-base-300 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider block">
              Total Size Groups
            </span>
            <div className="text-2xl font-extrabold text-base-content mt-1">
              {counts.total}
            </div>
            <span className="text-[11px] text-base-content/50 font-medium mt-0.5 block">
              Sizing classifications
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Ruler className="w-5 h-5" />
          </div>
        </div>

        {/* Active Size Groups */}
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

        {/* Inactive Size Groups */}
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

        {/* Total Assigned Sizes */}
        <div className="rounded-3xl p-4 sm:p-5 bg-base-100 border border-base-300 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider block">
              Configured Sizes
            </span>
            <div className="text-2xl font-extrabold text-indigo-600 mt-1">
              {counts.totalSizes}
            </div>
            <span className="text-[11px] text-indigo-600/80 font-medium mt-0.5 block">
              Assigned child sizes
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
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
                placeholder="Search size group by name or code..."
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
                <SizeGroupRecentSearches
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
          </div>

          {/* Right: Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Company Filter (SuperAdmin / Admin only) */}
            {canSelectCompany && (
              <SizeGroupFilterDropdown
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

            {/* Status Filter */}
            <SizeGroupFilterDropdown
              label="All Statuses"
              value={statusFilter}
              options={statusOptions}
              onChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
              minWidth="min-w-[135px]"
            />

            {/* Sort Field */}
            <SizeGroupFilterDropdown
              label="Sort By"
              value={sortBy}
              options={[
                { value: "size_group_name", label: "Group Name" },
                { value: "size_group_code", label: "Group Code" },
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
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <SizeGroupsSkeleton viewMode={viewMode} />
      ) : (
        <AnimatedTabContent activeTab={viewMode}>
          {viewMode === "table" ? (
            <SizeGroupTableView
              sizeGroups={enrichedGroups}
              copiedKey={copiedKey}
              onCopyCode={handleCopyCode}
              onToggleStatus={handleToggleStatus}
              isStatusPending={updateStatusMutation.isPending}
              onViewDetails={(group) => setDetailsModal({ isOpen: true, data: group })}
              onEdit={openEdit}
              onDelete={setToDelete}
              onAddSizeGroup={openAdd}
            />
          ) : (
            <SizeGroupCardsView
              sizeGroups={enrichedGroups}
              copiedKey={copiedKey}
              onCopyCode={handleCopyCode}
              onToggleStatus={handleToggleStatus}
              isStatusPending={updateStatusMutation.isPending}
              onViewDetails={(group) => setDetailsModal({ isOpen: true, data: group })}
              onEdit={openEdit}
              onDelete={setToDelete}
              onAddSizeGroup={openAdd}
            />
          )}
        </AnimatedTabContent>
      )}

      {/* Pagination Strip */}
      {!isLoading && enrichedGroups.length > 0 && (
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
      <SizeGroupFormModal
        isOpen={formModal.open}
        mode={formModal.mode}
        initialData={formModal.data}
        initialCompanyId={companyFilter || userCompanyId}
        saving={saving}
        onClose={() => setFormModal((m) => ({ ...m, open: false }))}
        onSubmit={handleFormSubmit}
      />

      {/* Details Quick View Modal */}
      <SizeGroupDetailsModal
        isOpen={detailsModal.isOpen}
        sizeGroup={detailsModal.data}
        onClose={() => setDetailsModal({ isOpen: false, data: null })}
        onEdit={openEdit}
        onDelete={setToDelete}
        onToggleStatus={handleToggleStatus}
        onNavigateFullPage={(sg) => navigate(`/products/size-groups/${sg.id}`)}
      />

      {/* Delete Confirmation Modal */}
      <SizeGroupDeleteModal
        isOpen={Boolean(toDelete)}
        sizeGroup={toDelete}
        isDeleting={deleting}
        onClose={() => setToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

