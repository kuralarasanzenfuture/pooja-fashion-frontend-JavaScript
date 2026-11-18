import React, { useState, useMemo, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Receipt,
  Plus,
  RefreshCw,
  Sparkles,
  Calculator,
  Search,
  X,
  Building,
  CheckCircle2,
  Percent,
  Layers,
  ArrowUpDown,
  LayoutGrid,
  Table as TableIcon,
  ShieldCheck,
  Tag,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import PageHeader from "../../../../common/components/PageHeader.jsx";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import Pagination from "../../../../common/components/ui/pagination/Pagination.jsx";
import {
  useTaxes,
  useTaxStats,
  useCreateTax,
  useUpdateTax,
  useUpdateTaxStatus,
  useDeleteTax,
  useSeedDefaultTaxes,
} from "../hooks/useTaxes.js";
import {
  TaxTableView,
  TaxCardsView,
  TaxesSkeleton,
  TaxFilterDropdown,
  TaxRecentSearches,
  TaxFormModal,
  TaxDetailsModal,
  TaxDeleteModal,
  TaxCalculatorModal,
  TaxSeedModal,
  TaxGuidanceHints,
} from "../components/index.js";
import { TAX_TYPES, STANDARD_GST_SLABS } from "../utils/taxHelper.js";

const RECENT_SEARCHES_KEY = "pooja_fashion_tax_recent_searches";

/**
 * TaxesPage Component
 * Full-featured Tax Master Dashboard adhering to Pooja Fashion Royal Purple (#2A0081) UI system.
 */
export default function TaxesPage() {
  const user = useSelector((state) => state.auth.user);
  const roleCode = String(user?.roleCode || user?.role || "").toUpperCase();
  const userCompanyId = user?.companyId || user?.company_id;
  const isSuperAdmin = roleCode === "SUPERADMIN";
  const isAdmin = roleCode === "ADMIN";
  const canSelectCompany = (isSuperAdmin || isAdmin) && !userCompanyId;

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState(""); // "" | "active" | "inactive"
  const [taxTypeFilter, setTaxTypeFilter] = useState(""); // "" | "GST" | "VAT" | ...
  const [rateBracketFilter, setRateBracketFilter] = useState(""); // "" | "0" | "5" | "12" | "18" | "28"
  const [inclusiveFilter, setInclusiveFilter] = useState(""); // "" | "true" | "false"
  const [companyFilter, setCompanyFilter] = useState("");
  const [sortBy, setSortBy] = useState("rate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("table");
  const [copiedCode, setCopiedCode] = useState(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  // Modals State
  const [formModal, setFormModal] = useState({ open: false, mode: "add", data: null });
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, data: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, data: null });
  const [calculatorModal, setCalculatorModal] = useState({ isOpen: false, tax: null });
  const [seedModalOpen, setSeedModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Recent Searches State
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAddRecentSearch = (queryOrItem) => {
    const text =
      typeof queryOrItem === "string"
        ? queryOrItem.trim()
        : queryOrItem.name || queryOrItem.query;
    if (!text) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => {
        const itemText =
          typeof item === "string" ? item : item.name || item.query;
        return itemText.toLowerCase() !== text.toLowerCase();
      });
      const updated = [
        typeof queryOrItem === "object" ? queryOrItem : { query: text },
        ...filtered,
      ].slice(0, 8);
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

  // React Query params
  const queryParams = useMemo(() => {
    const p = {
      page,
      limit,
      sort_by: sortBy,
      sort_order: sortOrder,
    };
    if (search.trim()) p.search = search.trim();
    if (statusFilter === "active") p.is_active = "true";
    if (statusFilter === "inactive") p.is_active = "false";
    if (taxTypeFilter) p.tax_type = taxTypeFilter;
    if (rateBracketFilter !== "") {
      p.min_rate = Number(rateBracketFilter);
      p.max_rate = Number(rateBracketFilter);
    }
    if (inclusiveFilter === "true") p.is_inclusive = "true";
    if (inclusiveFilter === "false") p.is_inclusive = "false";
    if (canSelectCompany && companyFilter) {
      p.company_id = Number(companyFilter);
    } else if (userCompanyId) {
      p.company_id = Number(userCompanyId);
    }
    return p;
  }, [
    page,
    limit,
    sortBy,
    sortOrder,
    search,
    statusFilter,
    taxTypeFilter,
    rateBracketFilter,
    inclusiveFilter,
    canSelectCompany,
    companyFilter,
    userCompanyId,
  ]);

  const {
    data: taxesResponse,
    isLoading,
    isFetching,
    refetch,
  } = useTaxes(queryParams);

  // Query Tax stats
  const statsParams = useMemo(() => {
    const p = {};
    if (canSelectCompany && companyFilter) {
      p.company_id = Number(companyFilter);
    } else if (userCompanyId) {
      p.company_id = Number(userCompanyId);
    }
    return p;
  }, [canSelectCompany, companyFilter, userCompanyId]);

  const { data: statsResponse } = useTaxStats(statsParams);

  // Mutations
  const createMutation = useCreateTax();
  const updateMutation = useUpdateTax();
  const updateStatusMutation = useUpdateTaxStatus();
  const seedDefaultsMutation = useSeedDefaultTaxes();
  const deleteMutation = useDeleteTax();

  // Normalize data
  const taxesList = useMemo(() => {
    const list =
      taxesResponse?.data?.taxes ||
      taxesResponse?.taxes ||
      taxesResponse?.data ||
      [];
    return Array.isArray(list) ? list : [];
  }, [taxesResponse]);

  const paginationMeta = taxesResponse?.data?.meta ||
    taxesResponse?.meta || {
      page: 1,
      limit: 10,
      total: taxesList.length,
      totalPages: Math.ceil(taxesList.length / limit) || 1,
    };

  const stats = statsResponse?.data || statsResponse || {};
  const counts = {
    total: stats.totalTaxes ?? stats.total_taxes ?? paginationMeta.total ?? taxesList.length,
    active: stats.activeTaxes ?? stats.active_taxes ?? 0,
    standardGst: stats.standardGst ?? stats.standard_gst ?? 5,
    inclusive: stats.inclusiveTaxes ?? stats.inclusive_taxes ?? 0,
  };

  // Company options for filter
  const companyOptions = useMemo(() => {
    const map = new Map();
    taxesList.forEach((t) => {
      const cId = t.companyId || t.company_id;
      const cName = t.companyName || t.company_name;
      if (cId && cName && !map.has(String(cId))) {
        map.set(String(cId), { value: String(cId), label: cName, icon: Building });
      }
    });
    const list = Array.from(map.values());
    return list.length > 0
      ? [{ value: "", label: "All Companies", icon: Building }, ...list]
      : [];
  }, [taxesList]);

  // Dropdown options
  const statusOptions = useMemo(
    () => [
      { value: "", label: "All Statuses" },
      { value: "active", label: "Active", dotColor: "bg-emerald-500", dot: "bg-emerald-500" },
      { value: "inactive", label: "Inactive", dotColor: "bg-rose-500", dot: "bg-rose-500" },
    ],
    []
  );

  const regimeOptions = useMemo(
    () => [
      { value: "", label: "All Regimes" },
      { value: "GST", label: "GST (Standard Indian)", badge: "GST" },
      { value: "VAT", label: "VAT (Value Added)", badge: "VAT" },
      { value: "CESS", label: "Compensation CESS", badge: "CESS" },
      { value: "CUSTOM", label: "Custom Duty", badge: "DUTY" },
      { value: "EXEMPT", label: "Exempt / Nil-Rated", badge: "NIL" },
    ],
    []
  );

  const slabOptions = useMemo(
    () => [
      { value: "", label: "All GST Slabs" },
      { value: "0", label: "0% (Nil / Khadi)", badge: "GST_0" },
      { value: "5", label: "5% (Apparel ≤ ₹1k)", badge: "GST_5" },
      { value: "12", label: "12% (Apparel > ₹1k)", badge: "GST_12" },
      { value: "18", label: "18% (Fashion/Tailoring)", badge: "GST_18" },
      { value: "28", label: "28% (Luxury Fashion)", badge: "GST_28" },
    ],
    []
  );

  const inclusiveOptions = useMemo(
    () => [
      { value: "", label: "All Inclusivity" },
      { value: "true", label: "MRP Inclusive", dotColor: "bg-emerald-500", dot: "bg-emerald-500" },
      { value: "false", label: "Exclusive (+Tax)", dotColor: "bg-amber-500", dot: "bg-amber-500" },
    ],
    []
  );

  const sortOptions = useMemo(
    () => [
      { value: "rate", label: "Sort: Tax Rate" },
      { value: "tax_name", label: "Sort: Tax Name" },
      { value: "tax_code", label: "Sort: Tax Code" },
      { value: "created_at", label: "Sort: Created Date" },
    ],
    []
  );

  const activeFiltersCount = [
    statusFilter,
    taxTypeFilter,
    rateBracketFilter,
    inclusiveFilter,
    companyFilter,
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    setStatusFilter("");
    setTaxTypeFilter("");
    setRateBracketFilter("");
    setInclusiveFilter("");
    setCompanyFilter("");
    setSearch("");
    setPage(1);
  };

  // Actions
  const handleCopyCode = (tax) => {
    const code = tax.tax_code || tax.taxCode || "";
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    showNotification("success", `Tax code "${code}" copied to clipboard!`);
  };

  const handleToggleStatus = async (tax) => {
    const id = tax.id || tax.tax_id;
    const currentStatus = Boolean(tax.is_active ?? tax.isActive);
    setStatusUpdatingId(id);
    try {
      await updateStatusMutation.mutateAsync({
        id,
        is_active: !currentStatus,
      });
      showNotification(
        "success",
        `Tax slab "${tax.tax_name}" is now ${!currentStatus ? "Active" : "Inactive"}.`
      );
    } catch (err) {
      showNotification("error", err?.message || "Failed to update tax status");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleSaveForm = async (payload) => {
    try {
      if (formModal.mode === "add") {
        await createMutation.mutateAsync(payload);
        showNotification("success", `Tax slab "${payload.tax_name}" created successfully!`);
      } else {
        const id = formModal.data?.id || formModal.data?.tax_id;
        await updateMutation.mutateAsync({ id, ...payload });
        showNotification("success", `Tax slab "${payload.tax_name}" updated successfully!`);
      }
      setFormModal({ open: false, mode: "add", data: null });
    } catch (err) {
      showNotification("error", err?.message || "Failed to save tax slab");
    }
  };

  const handleDeleteConfirm = async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
      showNotification("success", "Tax slab deleted successfully");
      setDeleteModal({ isOpen: false, data: null });
    } catch (err) {
      showNotification("error", err?.message || "Failed to delete tax slab");
    }
  };

  const handleSeedConfirm = async (targetCompanyId) => {
    try {
      const resp = await seedDefaultsMutation.mutateAsync({
        company_id: targetCompanyId,
      });
      const count = resp?.data?.count || resp?.count || 5;
      showNotification(
        "success",
        `Standard Indian GST slabs initialized successfully! (${count} slabs)`
      );
      setSeedModalOpen(false);
      refetch();
    } catch (err) {
      showNotification("error", err?.message || "Failed to seed default taxes");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-bold ${
              notification.type === "success"
                ? "bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/20"
                : "bg-rose-500 text-white border-rose-600 shadow-rose-500/20"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{notification.message}</span>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="p-1 hover:bg-white/20 rounded-lg ml-2 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Tax Master (GST & Regimes)"
        subtitle="Manage Goods & Services Tax (GST) rate slabs, intra/inter-state component split, and invoice calculation rules."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Product Master", href: "/products" },
          { label: "Taxes", active: true },
        ]}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <div className="tooltip tooltip-bottom" data-tip="Refresh table">
              <Button
                variant="secondary"
                size="sm"
                icon={RefreshCw}
                onClick={() => refetch()}
                loading={isFetching && !isLoading}
              />
            </div>

            <div className="tooltip tooltip-bottom" data-tip="Seed 0%, 5%, 12%, 18%, 28% GST slabs">
              <Button
                variant="outline"
                size="sm"
                icon={Sparkles}
                onClick={() => setSeedModalOpen(true)}
              >
                Seed Default Slabs
              </Button>
            </div>

            <div className="tooltip tooltip-bottom" data-tip="Launch POS & Billing Tax Calculator">
              <Button
                variant="outline"
                size="sm"
                icon={Calculator}
                onClick={() => setCalculatorModal({ isOpen: true, tax: null })}
              >
                Tax Calculator
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
              Add Tax Slab
            </Button>
          </div>
        }
      />

      {/* Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Slabs */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-xs hover:border-primary/40 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider">
              Total Tax Slabs
            </span>
            <div className="w-9 h-9 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
              {counts.total}
            </span>
          </div>
          <span className="text-[11px] text-base-content/50 mt-1 block">
            Configured tax rate slabs
          </span>
        </div>

        {/* Active in POS */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-xs hover:border-emerald-500/40 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider">
              Active in Billing
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
            Available on invoices and checkouts
          </span>
        </div>

        {/* Standard GST */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-xs hover:border-indigo-500/40 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider">
              Standard GST
            </span>
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
              {counts.standardGst}
            </span>
          </div>
          <span className="text-[11px] text-base-content/50 mt-1 block">
            Official slabs (0, 5, 12, 18, 28%)
          </span>
        </div>

        {/* MRP Inclusive */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-xs hover:border-amber-500/40 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider">
              MRP Inclusive
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
              {counts.inclusive}
            </span>
          </div>
          <span className="text-[11px] text-base-content/50 mt-1 block">
            Tax included in retail price
          </span>
        </div>
      </div>

      {/* Operational Guidance & Sample Table Reference */}
      <TaxGuidanceHints defaultOpen={false} collapsible={true} />

      {/* Main Filter Toolbar */}
      <div className="rounded-3xl border border-base-300 bg-base-100 p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Left: Search Box */}
          <div className="relative flex-1 min-w-[240px] max-w-lg" ref={searchBoxRef}>
            <div className="relative">
              <Search className="w-4 h-4 text-base-content/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search tax slabs by name or code (e.g. GST 18%, GST_5)..."
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
                <TaxRecentSearches
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

          {/* Right: Inline Filter Dropdowns (Matching Image 4) */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <TaxFilterDropdown
              label="All Statuses"
              value={statusFilter}
              options={statusOptions}
              onChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
              minWidth="min-w-[135px]"
            />

            {/* Regime / Type Filter */}
            <TaxFilterDropdown
              label="All Regimes"
              value={taxTypeFilter}
              options={regimeOptions}
              onChange={(val) => {
                setTaxTypeFilter(val);
                setPage(1);
              }}
              icon={Receipt}
              minWidth="min-w-[140px]"
            />

            {/* GST Slab Bracket Filter */}
            <TaxFilterDropdown
              label="All GST Slabs"
              value={rateBracketFilter}
              options={slabOptions}
              onChange={(val) => {
                setRateBracketFilter(val);
                setPage(1);
              }}
              icon={Percent}
              minWidth="min-w-[140px]"
            />

            {/* Inclusivity Filter */}
            <TaxFilterDropdown
              label="All Inclusivity"
              value={inclusiveFilter}
              options={inclusiveOptions}
              onChange={(val) => {
                setInclusiveFilter(val);
                setPage(1);
              }}
              icon={ShieldCheck}
              minWidth="min-w-[140px]"
            />

            {/* Target Company Filter (SuperAdmin) */}
            {canSelectCompany && companyOptions.length > 0 && (
              <TaxFilterDropdown
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
            <TaxFilterDropdown
              label="Sort By"
              value={sortBy}
              options={sortOptions}
              onChange={(val) => {
                setSortBy(val);
                setPage(1);
              }}
              icon={ArrowUpDown}
              minWidth="min-w-[145px]"
            />

            {/* Asc / Desc Sort Order Toggle */}
            <div
              className="tooltip tooltip-bottom"
              data-tip={`Switch to ${sortOrder === "asc" ? "Descending (High to Low)" : "Ascending (Low to High)"}`}
            >
              <button
                type="button"
                onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                className="h-9 px-2.5 rounded-xl border border-base-300 bg-base-100 hover:bg-base-200/60 text-xs font-bold text-base-content/80 flex items-center gap-1 transition-all cursor-pointer"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-primary" />
                <span className="uppercase text-[11px]">{sortOrder}</span>
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center p-0.5 rounded-xl border border-base-300 bg-base-200/50">
              <div className="tooltip tooltip-bottom" data-tip="Table View">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === "table"
                      ? "bg-primary text-primary-content shadow-xs"
                      : "text-base-content/60 hover:text-base-content"
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
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === "cards"
                      ? "bg-primary text-primary-content shadow-xs"
                      : "text-base-content/60 hover:text-base-content"
                  }`}
                  aria-label="Cards View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Summary Chips Bar */}
        {(activeFiltersCount > 0 || search) && (
          <div className="pt-2.5 border-t border-base-200 flex items-center justify-between gap-2 flex-wrap text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/50 mr-1">
                Active Filters:
              </span>

              {search.trim() && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 font-medium">
                  <span>Search: &ldquo;{search}&rdquo;</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                    className="p-0.5 hover:bg-primary/20 rounded cursor-pointer"
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

              {taxTypeFilter && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 font-medium">
                  <span>Regime: {taxTypeFilter}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setTaxTypeFilter("");
                      setPage(1);
                    }}
                    className="p-0.5 hover:bg-primary/20 rounded cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {rateBracketFilter && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 font-medium">
                  <span>Slab: {rateBracketFilter}%</span>
                  <button
                    type="button"
                    onClick={() => {
                      setRateBracketFilter("");
                      setPage(1);
                    }}
                    className="p-0.5 hover:bg-primary/20 rounded cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {inclusiveFilter && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 font-medium">
                  <span>Pricing: {inclusiveFilter === "true" ? "Inclusive" : "Exclusive"}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setInclusiveFilter("");
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

      {/* Main Content Area */}
      {isLoading ? (
        <TaxesSkeleton viewMode={viewMode} count={limit} />
      ) : taxesList.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-base-300 bg-base-100 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto">
            <Receipt className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-base-content">
              No tax slabs found
            </h3>
            <p className="text-xs text-base-content/60 max-w-md mx-auto">
              {search || activeFiltersCount > 0
                ? "No tax rate slabs matched your current search and filter criteria. Try resetting filters."
                : "Initialize standard Indian GST slabs (0%, 5%, 12%, 18%, 28%) with one click."}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            {search || activeFiltersCount > 0 ? (
              <Button variant="secondary" size="sm" onClick={handleResetFilters}>
                Clear All Filters
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                icon={Sparkles}
                onClick={() => setSeedModalOpen(true)}
              >
                Seed Default GST Slabs
              </Button>
            )}
            <Button
              variant="outline"
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
              Create Custom Slab
            </Button>
          </div>
        </div>
      ) : viewMode === "table" ? (
        <TaxTableView
          taxes={taxesList}
          onInspect={(tax) => setDetailsModal({ isOpen: true, data: tax })}
          onEdit={(tax) =>
            setFormModal({
              open: true,
              mode: "edit",
              data: tax,
            })
          }
          onDelete={(tax) => setDeleteModal({ isOpen: true, data: tax })}
          onToggleStatus={handleToggleStatus}
          onCopyCode={handleCopyCode}
          onOpenCalculator={(tax) => setCalculatorModal({ isOpen: true, tax })}
          copiedCode={copiedCode}
          statusUpdatingId={statusUpdatingId || (updateStatusMutation.isPending ? updateStatusMutation.variables?.id : null)}
          statusPendingId={statusUpdatingId || (updateStatusMutation.isPending ? updateStatusMutation.variables?.id : null)}
        />
      ) : (
        <TaxCardsView
          taxes={taxesList}
          onInspect={(tax) => setDetailsModal({ isOpen: true, data: tax })}
          onEdit={(tax) =>
            setFormModal({
              open: true,
              mode: "edit",
              data: tax,
            })
          }
          onDelete={(tax) => setDeleteModal({ isOpen: true, data: tax })}
          onToggleStatus={handleToggleStatus}
          onCopyCode={handleCopyCode}
          onOpenCalculator={(tax) => setCalculatorModal({ isOpen: true, tax })}
          copiedCode={copiedCode}
          statusUpdatingId={statusUpdatingId || (updateStatusMutation.isPending ? updateStatusMutation.variables?.id : null)}
          statusPendingId={statusUpdatingId || (updateStatusMutation.isPending ? updateStatusMutation.variables?.id : null)}
        />
      )}

      {/* Pagination Strip (Matching Brand & Product Types) */}
      {!isLoading && taxesList.length > 0 && (
        <div className="pt-2">
          <Pagination
            currentPage={Number(paginationMeta.page) || page}
            totalPages={Number(paginationMeta.totalPages) || 1}
            totalItems={Number(paginationMeta.total) || taxesList.length}
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

      {/* Form Modal (Create / Edit) */}
      <TaxFormModal
        isOpen={formModal.open}
        mode={formModal.mode}
        initialData={formModal.data}
        onClose={() => setFormModal({ open: false, mode: "add", data: null })}
        onSubmit={handleSaveForm}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Details Inspector Modal */}
      <TaxDetailsModal
        isOpen={detailsModal.isOpen}
        tax={detailsModal.data}
        onClose={() => setDetailsModal({ isOpen: false, data: null })}
        onEdit={(tax) =>
          setFormModal({
            open: true,
            mode: "edit",
            data: tax,
          })
        }
        onOpenCalculator={(tax) => setCalculatorModal({ isOpen: true, tax })}
      />

      {/* Delete Confirmation Modal */}
      <TaxDeleteModal
        isOpen={deleteModal.isOpen}
        tax={deleteModal.data}
        onClose={() => setDeleteModal({ isOpen: false, data: null })}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />

      {/* Interactive Billing Tax Calculator Modal */}
      <TaxCalculatorModal
        isOpen={calculatorModal.isOpen}
        initialTax={calculatorModal.tax}
        onClose={() => setCalculatorModal({ isOpen: false, tax: null })}
      />

      {/* Seed Default GST Slabs Modal */}
      <TaxSeedModal
        isOpen={seedModalOpen}
        onClose={() => setSeedModalOpen(false)}
        onConfirm={handleSeedConfirm}
        isSeeding={seedDefaultsMutation.isPending}
      />
    </div>
  );
}
