import React, { useState, useMemo, useEffect } from "react";
import {
  Landmark,
  Plus,
  RefreshCw,
  Search,
  Filter,
  ShieldCheck,
  Building,
  Globe,
  Phone,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MapPin,
  Hash,
  LayoutGrid,
  Table as TableIcon,
  Copy,
  Check,
  X,
  RotateCcw,
} from "lucide-react";
import PageHeader from "../../../common/components/PageHeader.jsx";
import { Button } from "../../../common/components/ui/buttons/index.js";
import { DropdownSelect } from "../../../common/components/ui/select/index.js";
import Pagination from "../../../common/components/ui/pagination/Pagination.jsx";
import {
  useBanks,
  useCreateBank,
  useUpdateBank,
  useDeleteBank,
} from "../../company/hooks/useBanks.js";
import {
  BankModal,
  BankDeleteModal,
  BankIdentifiersModal,
  BankLogo,
} from "../components/index.js";

const BASE_TYPE_FILTER_OPTIONS = [
  { value: "", label: "All Categories" },
  { value: "commercial", label: "Commercial Banks" },
  { value: "cooperative", label: "Cooperative Banks" },
  { value: "regional_rural", label: "Regional Rural (RRB)" },
  { value: "small_finance", label: "Small Finance Banks" },
  { value: "payments", label: "Payments Banks" },
  { value: "foreign", label: "Foreign Banks" },
  { value: "other", label: "Other Institutions" },
];

const BASE_STATUS_FILTER_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "true", label: "Active Only" },
  { value: "false", label: "Inactive Only" },
];

/**
 * Shimmering Loading Skeleton for Bank Master Directory
 * Matches both Table and Card layouts with pulsating placeholder elements.
 */
function BankMasterSkeleton({ viewMode = "table" }) {
  if (viewMode === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl p-5 sm:p-6 bg-base-100 border border-base-300 space-y-4 shadow-xs"
          >
            {/* Top badges shimmer */}
            <div className="flex items-center justify-between">
              <div className="h-6 w-16 bg-base-300/70 animate-pulse rounded-lg" />
              <div className="flex items-center gap-1.5">
                <div className="h-5 w-20 bg-base-300/70 animate-pulse rounded-lg" />
                <div className="h-5 w-14 bg-base-300/70 animate-pulse rounded-lg" />
              </div>
            </div>

            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-base-300/80 animate-pulse shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-3/4 bg-base-300/80 animate-pulse rounded" />
                <div className="h-3 w-1/2 bg-base-300/60 animate-pulse rounded" />
              </div>
            </div>

            {/* Key info pills */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-base-200">
              <div className="h-12 bg-base-200/80 animate-pulse rounded-xl" />
              <div className="h-12 bg-base-200/80 animate-pulse rounded-xl" />
            </div>

            {/* Location & support */}
            <div className="space-y-1.5">
              <div className="h-3 w-1/2 bg-base-300/60 animate-pulse rounded" />
              <div className="h-3 w-2/5 bg-base-300/60 animate-pulse rounded" />
            </div>

            {/* Footer buttons */}
            <div className="pt-3 border-t border-base-300 flex items-center justify-between">
              <div className="h-4 w-24 bg-base-300/70 animate-pulse rounded" />
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 bg-base-300/70 animate-pulse rounded-lg" />
                <div className="h-7 w-16 bg-base-300/70 animate-pulse rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Table Skeleton
  return (
    <div className="bg-base-100 rounded-xl border border-base-300 overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-base-300 bg-base-200/40 text-[11px] font-semibold uppercase tracking-wide text-base-content/60">
              <th className="py-3 px-5">Bank Institution</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">IFSC Prefix & SWIFT</th>
              <th className="py-3 px-4">Headquarters & Support</th>
              <th className="py-3 px-4">Verification</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200">
            {[...Array(8)].map((_, idx) => (
              <tr key={idx} className="hover:bg-base-200/30 transition-colors">
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-base-300/80 animate-pulse shrink-0" />
                    <div className="space-y-1.5 flex-1 min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-32 bg-base-300/80 animate-pulse rounded" />
                        <div className="h-4 w-12 bg-base-300/60 animate-pulse rounded" />
                      </div>
                      <div className="h-3 w-44 bg-base-300/50 animate-pulse rounded" />
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="h-6 w-24 bg-base-300/70 animate-pulse rounded-lg" />
                </td>
                <td className="py-3.5 px-4">
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-20 bg-base-300/70 animate-pulse rounded" />
                    <div className="h-3 w-28 bg-base-300/50 animate-pulse rounded" />
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-24 bg-base-300/70 animate-pulse rounded" />
                    <div className="h-3 w-20 bg-base-300/50 animate-pulse rounded" />
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="h-6 w-20 bg-base-300/70 animate-pulse rounded-lg" />
                </td>
                <td className="py-3.5 px-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-7 w-20 bg-base-300/70 animate-pulse rounded-lg" />
                    <div className="h-7 w-7 bg-base-300/70 animate-pulse rounded-lg" />
                    <div className="h-7 w-16 bg-base-300/70 animate-pulse rounded-lg" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function BankMasterPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // Standard application default (10 rows per page)
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'cards'
  const [copiedKey, setCopiedKey] = useState(null);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBank, setEditingBank] = useState(null);
  const [deletingBank, setDeletingBank] = useState(null);
  const [identifiersBank, setIdentifiersBank] = useState(null);
  const [notification, setNotification] = useState(null);

  // Fetch full directory catalog (limit: 100 retrieves all official records in a single query)
  // This guarantees category counts, status badges, and directory statistics always reflect
  // the entire directory, never collapsing to 0 or shrinking when a category filter is active!
  const {
    data: banksResponse,
    isLoading,
    isFetching,
    isError,
    error: banksError,
    refetch,
  } = useBanks({ limit: 100 });

  const createMutation = useCreateBank();
  const updateMutation = useUpdateBank();
  const deleteMutation = useDeleteBank();

  // Normalize raw data from response
  const allBanks = useMemo(() => {
    if (!banksResponse) return [];
    if (Array.isArray(banksResponse)) return banksResponse;
    if (Array.isArray(banksResponse?.data)) return banksResponse.data;
    if (Array.isArray(banksResponse?.banks)) return banksResponse.banks;
    if (Array.isArray(banksResponse?.records)) return banksResponse.records;
    if (Array.isArray(banksResponse?.data?.data)) return banksResponse.data.data;
    return [];
  }, [banksResponse]);

  // Compute live directory category counts from the full catalog
  // This ensures category badges (Commercial, Cooperative, RRB, Payments, etc.) NEVER collapse to 0
  const categoryCounts = useMemo(() => {
    const counts = {
      total: allBanks.length,
      commercial: 0,
      cooperative: 0,
      regional_rural: 0,
      small_finance: 0,
      payments: 0,
      foreign: 0,
      other: 0,
    };

    allBanks.forEach((b) => {
      const rawType = (b.bankType || b.bank_type || "commercial").toLowerCase().trim();
      if (rawType === "commercial" || rawType === "scheduled_commercial") counts.commercial++;
      else if (rawType === "cooperative" || rawType === "coop" || rawType.includes("coop") || rawType.includes("co-operative")) counts.cooperative++;
      else if (rawType === "regional_rural" || rawType === "rrb" || rawType.includes("rural") || rawType.includes("gramin")) counts.regional_rural++;
      else if (rawType === "small_finance" || rawType === "sfb" || rawType.includes("small")) counts.small_finance++;
      else if (rawType === "payments" || rawType === "payment") counts.payments++;
      else if (rawType === "foreign" || (b.countryCode && b.countryCode !== "IN") || (b.country_code && b.country_code !== "IN")) counts.foreign++;
      else counts.other++;
    });

    return counts;
  }, [allBanks]);

  const statusCounts = useMemo(() => {
    let active = 0;
    let inactive = 0;
    allBanks.forEach((b) => {
      const val = b.isActive ?? b.is_active;
      const isAct = val === undefined || val === null ? true : Boolean(val === true || val === 1 || val === "true");
      if (isAct) active++;
      else inactive++;
    });
    return { total: allBanks.length, active, inactive };
  }, [allBanks]);

  // Dynamic dropdown options with counts
  const typeFilterOptions = useMemo(
    () => [
      { value: "", label: "All Categories", badge: String(categoryCounts.total) },
      { value: "commercial", label: "Commercial Banks", badge: String(categoryCounts.commercial) },
      { value: "cooperative", label: "Cooperative Banks", badge: String(categoryCounts.cooperative) },
      { value: "regional_rural", label: "Regional Rural (RRB)", badge: String(categoryCounts.regional_rural) },
      { value: "small_finance", label: "Small Finance Banks", badge: String(categoryCounts.small_finance) },
      { value: "payments", label: "Payments Banks", badge: String(categoryCounts.payments) },
      { value: "foreign", label: "Foreign Banks", badge: String(categoryCounts.foreign) },
      { value: "other", label: "Other Institutions", badge: String(categoryCounts.other) },
    ],
    [categoryCounts],
  );

  const statusFilterOptions = useMemo(
    () => [
      { value: "", label: "All Statuses", badge: String(statusCounts.total) },
      { value: "true", label: "Active Only", badge: String(statusCounts.active) },
      { value: "false", label: "Inactive Only", badge: String(statusCounts.inactive) },
    ],
    [statusCounts],
  );

  // Client-side robust reactive filtering ensuring immediate visual response
  const filteredBanks = useMemo(() => {
    let list = [...allBanks];

    // 1. Text Search Filter
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((b) => {
        const name = (b.bankName || b.bank_name || "").toLowerCase();
        const code = (b.bankCode || b.bank_code || "").toLowerCase();
        const short = (b.shortName || b.short_name || "").toLowerCase();
        const legal = (b.legalName || b.legal_name || "").toLowerCase();
        const ifsc = (b.ifscPrefix || b.ifsc_prefix || "").toLowerCase();
        const swift = (b.swiftCode || b.swift_code || "").toLowerCase();
        const city = (b.headquartersCity || b.headquarters_city || "").toLowerCase();
        const country = (b.countryCode || b.country_code || "").toLowerCase();
        const bType = (b.bankType || b.bank_type || "").toLowerCase();
        return (
          name.includes(q) ||
          code.includes(q) ||
          short.includes(q) ||
          legal.includes(q) ||
          ifsc.includes(q) ||
          swift.includes(q) ||
          city.includes(q) ||
          country.includes(q) ||
          bType.includes(q)
        );
      });
    }

    // 2. Category / Bank Type Filter
    if (typeFilter) {
      const targetType = typeFilter.toLowerCase();
      list = list.filter((b) => {
        const rawType = (b.bankType || b.bank_type || "commercial").toLowerCase().trim();
        if (rawType === targetType) return true;
        if (targetType === "commercial") {
          return rawType === "commercial" || rawType === "scheduled_commercial";
        }
        if (targetType === "cooperative") {
          return rawType === "cooperative" || rawType === "coop" || rawType.includes("coop") || rawType.includes("co-operative");
        }
        if (targetType === "regional_rural") {
          return rawType === "regional_rural" || rawType === "rrb" || rawType.includes("rural") || rawType.includes("gramin");
        }
        if (targetType === "small_finance") {
          return rawType === "small_finance" || rawType === "sfb" || rawType.includes("small");
        }
        if (targetType === "payments") {
          return rawType === "payments" || rawType === "payment";
        }
        if (targetType === "foreign") {
          return rawType === "foreign" || (b.countryCode && b.countryCode !== "IN") || (b.country_code && b.country_code !== "IN");
        }
        if (targetType === "other") {
          const knownTypes = ["commercial", "cooperative", "regional_rural", "small_finance", "payments", "foreign"];
          return rawType === "other" || !knownTypes.includes(rawType);
        }
        return false;
      });
    }

    // 3. Status Filter (Active / Inactive)
    if (statusFilter !== "") {
      const wantActive = statusFilter === "true";
      list = list.filter((b) => {
        const val = b.isActive ?? b.is_active;
        const isActive = val === undefined || val === null ? true : Boolean(val === true || val === 1 || val === "true");
        return isActive === wantActive;
      });
    }

    return list;
  }, [allBanks, search, typeFilter, statusFilter]);

  // Active filter state detection
  const hasActiveFilters = Boolean(search.trim() || typeFilter || statusFilter !== "");

  // Total items and pagination calculations
  const totalFiltered = filteredBanks.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / limit));

  // Reset page if filtered results decrease totalPages or on filter change
  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [page, totalPages]);

  // Paginated banks to display on current page
  const paginatedBanks = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredBanks.slice(start, start + limit);
  }, [filteredBanks, page, limit]);

  const handleResetFilters = () => {
    setSearch("");
    setTypeFilter("");
    setStatusFilter("");
    setPage(1);
  };

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOpenCreate = () => {
    setEditingBank(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setEditingBank(b);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingBank?.id) {
        await updateMutation.mutateAsync({ id: editingBank.id, data: formData });
        showNotification("success", `Updated institution "${formData.bank_name}"`);
      } else {
        await createMutation.mutateAsync(formData);
        showNotification("success", `Registered bank "${formData.bank_name}" successfully`);
      }
      setIsModalOpen(false);
      setEditingBank(null);
    } catch (err) {
      showNotification("error", err?.response?.data?.message || "Failed to save bank institution");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBank?.id) return;
    try {
      await deleteMutation.mutateAsync(deletingBank.id);
      showNotification("success", `Removed bank "${deletingBank.bankName || deletingBank.bank_name}"`);
      setDeletingBank(null);
    } catch (err) {
      showNotification("error", err?.response?.data?.message || "Cannot delete bank with linked accounts");
      setDeletingBank(null);
    }
  };

  // Stats calculation over whole master directory
  const stats = useMemo(() => {
    const total = allBanks.length;
    const commercialCount = allBanks.filter((b) => {
      const rawType = (b.bankType || b.bank_type || "commercial").toLowerCase().trim();
      return rawType === "commercial" || rawType === "scheduled_commercial";
    }).length;
    const activeCount = allBanks.filter((b) => {
      const val = b.isActive ?? b.is_active;
      return val === undefined || val === null ? true : Boolean(val === true || val === 1 || val === "true");
    }).length;
    const verifiedCount = allBanks.filter((b) => Boolean(b.isVerified ?? b.is_verified)).length;
    return { total, commercialCount, activeCount, verifiedCount };
  }, [allBanks]);

  // Labels for active filter chips
  const activeTypeLabel = useMemo(() => {
    const opt = typeFilterOptions.find((o) => o.value === typeFilter);
    return opt?.label || typeFilter;
  }, [typeFilter, typeFilterOptions]);

  const activeStatusLabel = useMemo(() => {
    const opt = statusFilterOptions.find((o) => o.value === statusFilter);
    return opt?.label || statusFilter;
  }, [statusFilter, statusFilterOptions]);

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
              Failed to load banks from server: {banksError?.response?.data?.message || banksError?.message || "Network error. Please verify backend service is running."}
            </span>
          </div>
          <Button variant="outline" size="xs" icon={RefreshCw} onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Bank Master Directory"
        description="Comprehensive repository of Indian scheduled commercial banks, cooperative institutions, and branch routing clearing codes."
        actions={
          <div className="flex items-center gap-2.5">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-base-200/80 rounded-xl p-1 border border-base-300">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-base-100 text-primary shadow-2xs font-semibold"
                    : "text-base-content/60 hover:text-base-content"
                }`}
                title="Table View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === "cards"
                    ? "bg-base-100 text-primary shadow-2xs font-semibold"
                    : "text-base-content/60 hover:text-base-content"
                }`}
                title="Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={() => refetch()}
              loading={isFetching && !isLoading}
            >
              Refresh
            </Button>
            <Button
              variant="clip-six"
              size="sm"
              icon={Plus}
              onClick={handleOpenCreate}
            >
              Add New Bank
            </Button>
          </div>
        }
      />

      {/* Top 4 Metric KPI Cards - Fully reactive to category selection and filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total / Filtered Master Banks */}
        <div className="p-4 sm:p-5 rounded-2xl bg-base-100 border border-base-300 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
              {hasActiveFilters ? "Filtered Results" : "Total Master Banks"}
            </span>
            <Landmark className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-base-content mt-1.5">
            {hasActiveFilters ? filteredBanks.length : stats.total}
          </p>
          <p className="text-xs text-base-content/60 mt-0.5">
            {hasActiveFilters
              ? `Filtered from ${stats.total} total catalog records`
              : "Institutions in system catalog"}
          </p>
        </div>

        {/* 2. Active Routing */}
        <div className="p-4 sm:p-5 rounded-2xl bg-base-100 border border-base-300 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
              Active Routing
            </span>
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-base-content mt-1.5">
            {hasActiveFilters
              ? filteredBanks.filter((b) => {
                  const val = b.isActive ?? b.is_active;
                  return val === undefined || val === null ? true : Boolean(val === true || val === 1 || val === "true");
                }).length
              : stats.activeCount}
          </p>
          <p className="text-xs text-base-content/60 mt-0.5">Available for company bank linkage</p>
        </div>

        {/* 3. Category Count (Dynamic based on selected category) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-base-100 border border-base-300 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-base-content/60 truncate pr-2">
              {typeFilter ? activeTypeLabel : "Commercial Banks"}
            </span>
            <Building className="w-5 h-5 text-indigo-500 shrink-0" />
          </div>
          <p className="text-2xl font-bold text-base-content mt-1.5">
            {typeFilter
              ? (categoryCounts[typeFilter] ?? 0)
              : stats.commercialCount}
          </p>
          <p className="text-xs text-base-content/60 mt-0.5 truncate">
            {typeFilter ? `Total in ${activeTypeLabel}` : "Scheduled commercial entities"}
          </p>
        </div>

        {/* 4. RBI Regulated / Verified */}
        <div className="p-4 sm:p-5 rounded-2xl bg-base-100 border border-base-300 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
              RBI Regulated
            </span>
            <CheckCircle2 className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-base-content mt-1.5">
            {hasActiveFilters
              ? filteredBanks.filter((b) => Boolean(b.isVerified ?? b.is_verified)).length
              : stats.verifiedCount}
          </p>
          <p className="text-xs text-base-content/60 mt-0.5">Verified institution profiles</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-base-100 border border-base-300 shadow-xs space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search Input with quick clear */}
          <div className="sm:col-span-6 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search bank by name, code, SWIFT, IFSC prefix, or city..."
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl border border-base-300 bg-base-200/50 focus:bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary/20 text-base-content outline-hidden transition-all font-medium"
            />
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-base-content/40 hover:text-base-content hover:bg-base-200 cursor-pointer"
                title="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown with dynamic counts */}
          <div className="sm:col-span-3">
            <DropdownSelect
              name="type_filter"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              options={typeFilterOptions}
            />
          </div>

          {/* Status Dropdown with dynamic counts */}
          <div className="sm:col-span-3">
            <DropdownSelect
              name="status_filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              options={statusFilterOptions}
            />
          </div>
        </div>

        {/* Active Filters Row & Quick Reset */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-base-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-base-content/50 uppercase tracking-wider">
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
                    title="Remove Search Filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {typeFilter && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-medium">
                  <span>Category: {activeTypeLabel}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setTypeFilter("");
                      setPage(1);
                    }}
                    className="p-0.5 hover:bg-indigo-500/20 rounded cursor-pointer"
                    title="Remove Category Filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {statusFilter !== "" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
                  <span>Status: {activeStatusLabel}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter("");
                      setPage(1);
                    }}
                    className="p-0.5 hover:bg-emerald-500/20 rounded cursor-pointer"
                    title="Remove Status Filter"
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
              Showing <span className="font-bold text-base-content">{filteredBanks.length}</span> of {allBanks.length} institutions
            </span>
          </div>
        )}
      </div>

      {/* Banks View (Loading Skeleton / Empty / Table / Cards) */}
      {isLoading ? (
        <BankMasterSkeleton viewMode={viewMode} />
      ) : filteredBanks.length === 0 ? (
        <div className="p-12 rounded-2xl bg-base-100 border border-base-300 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            {hasActiveFilters ? <Filter className="w-8 h-8 text-primary" /> : <Landmark className="w-8 h-8" />}
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h4 className="text-base font-bold text-base-content">
              {hasActiveFilters ? "No Institutions Match Filter" : "No Bank Institutions Found"}
            </h4>
            <p className="text-xs text-base-content/60 leading-relaxed">
              {hasActiveFilters
                ? `No banks matched your search criteria (${[
                    search.trim() ? `query: "${search}"` : null,
                    typeFilter ? `category: ${activeTypeLabel}` : null,
                    statusFilter !== "" ? `status: ${activeStatusLabel}` : null,
                  ]
                    .filter(Boolean)
                    .join(", ")}). Try resetting filters or adding a new bank.`
                : "The bank master directory is currently empty. Register your first commercial bank into the directory."}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            {hasActiveFilters ? (
              <>
                <Button variant="outline" size="sm" icon={RotateCcw} onClick={handleResetFilters}>
                  Clear All Filters
                </Button>
                <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenCreate}>
                  Add {typeFilter ? activeTypeLabel.replace(" Banks", "") : "Bank"}
                </Button>
              </>
            ) : (
              <Button variant="primary" size="md" icon={Plus} onClick={handleOpenCreate}>
                Register First Bank
              </Button>
            )}
          </div>
        </div>
      ) : viewMode === "table" ? (
        /* TABLE VIEW - Matching CompanyTable with smooth staggered entrance animation */
        <div className="bg-base-100 rounded-xl border border-base-300 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto scroll-smooth">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-base-300 bg-base-200/40 text-[11px] font-semibold uppercase tracking-wide text-base-content/60">
                  <th className="py-3 px-5">Bank Institution</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">IFSC Prefix & SWIFT</th>
                  <th className="py-3 px-4">Headquarters & Support</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200 text-sm">
                {paginatedBanks.map((bank, index) => {
                  const isActive = Boolean(bank.isActive ?? bank.is_active);
                  const isVerified = Boolean(bank.isVerified ?? bank.is_verified);
                  const bankType = bank.bankType || bank.bank_type || "commercial";

                  return (
                    <tr
                      key={bank.id}
                      className="hover:bg-base-200/50 transition-all duration-200 group animate-in fade-in-50 slide-in-from-bottom-2 duration-300 fill-mode-both"
                      style={{ animationDelay: `${Math.min(index * 30, 240)}ms` }}
                    >
                      {/* Bank Info */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <BankLogo bank={bank} size="sm" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-base-content text-sm">
                                {bank.bankName || bank.bank_name}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                                {bank.bankCode || bank.bank_code}
                              </span>
                              {(bank.shortName || bank.short_name) && (bank.shortName || bank.short_name) !== (bank.bankName || bank.bank_name) && (
                                <span className="text-[10px] text-base-content/50 font-medium">
                                  ({bank.shortName || bank.short_name})
                                </span>
                              )}
                            </div>
                            {bank.legalName && (
                              <p className="text-xs text-base-content/60 font-medium truncate mt-0.5">
                                {bank.legalName}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-base-200 border border-base-300 text-base-content/80 capitalize">
                          {bankType.replace("_", " ")}
                        </span>
                      </td>

                      {/* IFSC & SWIFT */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-base-content/50 text-[10px] uppercase font-semibold">IFSC:</span>
                            <span className="font-medium text-base-content">
                              {bank.ifscPrefix ? `${bank.ifscPrefix}****` : "—"}
                            </span>
                          </div>
                          {bank.swiftCode && (
                            <div className="flex items-center gap-1 text-[11px] text-base-content/65">
                              <span className="text-base-content/50 text-[10px] uppercase font-semibold">SWIFT:</span>
                              <span className="font-medium text-base-content">{bank.swiftCode}</span>
                              <button
                                type="button"
                                onClick={() => handleCopy(bank.swiftCode, `swift_${bank.id}`)}
                                className="p-0.5 rounded text-base-content/40 hover:text-primary cursor-pointer"
                              >
                                {copiedKey === `swift_${bank.id}` ? (
                                  <Check className="w-3 h-3 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Location & Support */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs text-base-content space-y-0.5">
                          {bank.headquartersCity ? (
                            <div className="flex items-center gap-1 font-medium truncate">
                              <MapPin className="w-3 h-3 text-base-content/40 shrink-0" />
                              <span className="truncate">{bank.headquartersCity}</span>
                            </div>
                          ) : (
                            <span className="text-base-content/40">—</span>
                          )}
                          {bank.customerCareNumber && (
                            <div className="flex items-center gap-1 text-[11px] text-base-content/60">
                              <Phone className="w-3 h-3 text-base-content/40 shrink-0" />
                              <span>{bank.customerCareNumber}</span>
                            </div>
                          )}
                          {(bank.websiteUrl || bank.website_url || bank.website) && (
                            <div>
                              <a
                                href={bank.websiteUrl || bank.website_url || bank.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                              >
                                <Globe className="w-3 h-3 text-base-content/40" />
                                <span>Portal</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Verification & Status */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {isVerified ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" /> Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-base-200 text-base-content/60 border border-base-300">
                              Unverified
                            </span>
                          )}

                          {!isActive && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                              Inactive
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setIdentifiersBank(bank)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-primary hover:bg-primary/10 border border-primary/20 transition-all cursor-pointer shadow-2xs"
                            title="Manage branches and clearing identifiers"
                          >
                            <Hash className="w-3 h-3" />
                            <span>Branches</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(bank)}
                            className="p-1.5 rounded-lg text-base-content/60 hover:text-primary hover:bg-base-200 transition-colors cursor-pointer"
                            title="Edit Bank"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingBank(bank)}
                            className="group inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-600 hover:text-white border border-rose-500/20 hover:border-rose-600 transition-all cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
                            title="Delete Institution"
                          >
                            <Trash2 className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer Pagination matching CompanyTable.jsx application standard */}
          <Pagination
            currentPage={page}
            totalItems={totalFiltered}
            pageSize={limit}
            pageSizeOptions={[10, 20, 50, 100]}
            onPageChange={setPage}
            onPageSizeChange={(newSize) => {
              setLimit(newSize);
              setPage(1);
            }}
            showPageSizeSelector={true}
            showFirstLast={true}
          />
        </div>
      ) : (
        /* CARDS VIEW - With clean application font and staggered entry animation */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedBanks.map((bank, index) => {
            const isActive = Boolean(bank.isActive ?? bank.is_active);
            const isVerified = Boolean(bank.isVerified ?? bank.is_verified);
            const bankType = bank.bankType || bank.bank_type || "commercial";

            return (
              <div
                key={bank.id}
                className="rounded-2xl p-5 sm:p-6 bg-base-100 border border-base-300 hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 shadow-xs animate-in fade-in-50 slide-in-from-bottom-3 duration-300 fill-mode-both"
                style={{ animationDelay: `${Math.min(index * 40, 320)}ms` }}
              >
                <div>
                  {/* Top badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                      {bank.bankCode || bank.bank_code}
                    </span>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-base-200 text-base-content/75 capitalize">
                        {bankType.replace("_", " ")}
                      </span>

                      {isVerified && (
                        <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Verified
                        </span>
                      )}

                      {!isActive && (
                        <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-600">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Logo */}
                  <div className="flex items-center gap-3">
                    <BankLogo bank={bank} size="md" />
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-base-content leading-snug truncate">
                        {bank.bankName || bank.bank_name}
                      </h3>
                      {bank.legalName && (
                        <p className="text-xs text-base-content/60 font-medium truncate">
                          {bank.legalName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Key Info Pills */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-base-200 text-xs">
                    <div className="p-2.5 rounded-xl bg-base-200/50 border border-base-300/80">
                      <span className="text-[10px] font-semibold text-base-content/50 uppercase tracking-wider block">
                        IFSC Prefix
                      </span>
                      <span className="font-semibold text-base-content mt-0.5 block">
                        {bank.ifscPrefix || "—"}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-base-200/50 border border-base-300/80">
                      <span className="text-[10px] font-semibold text-base-content/50 uppercase tracking-wider block">
                        SWIFT Code
                      </span>
                      <span className="font-medium text-base-content mt-0.5 block truncate">
                        {bank.swiftCode || "—"}
                      </span>
                    </div>
                  </div>

                  {/* Location & Support */}
                  {(bank.headquartersCity || bank.customerCareNumber) && (
                    <div className="mt-3 space-y-1 text-xs text-base-content/65">
                      {bank.headquartersCity && (
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-base-content/40 shrink-0" />
                          <span className="truncate">HQ: {bank.headquartersCity}</span>
                        </div>
                      )}
                      {bank.customerCareNumber && (
                        <div className="flex items-center gap-1.5 truncate">
                          <Phone className="w-3.5 h-3.5 text-base-content/40 shrink-0" />
                          <span className="truncate">{bank.customerCareNumber}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-base-300 flex items-center justify-between gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setIdentifiersBank(bank)}
                    className="group inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    <Hash className="w-3.5 h-3.5" />
                    <span>Branches & IFSC</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(bank)}
                      className="p-1.5 rounded-xl text-base-content/60 hover:text-primary hover:bg-base-200 transition-colors cursor-pointer"
                      title="Edit Bank"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingBank(bank)}
                      className="group inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-600 hover:text-white border border-rose-500/20 hover:border-rose-600 transition-all duration-150 cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
                      title="Delete Institution"
                    >
                      <Trash2 className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          </div>

          {/* Cards View Bottom Pagination Card matching application standard */}
          <div className="bg-base-100 rounded-xl border border-base-300 overflow-hidden shadow-2xs">
            <Pagination
              currentPage={page}
              totalItems={totalFiltered}
              pageSize={limit}
              pageSizeOptions={[10, 20, 50, 100]}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setLimit(newSize);
                setPage(1);
              }}
              showPageSizeSelector={true}
              showFirstLast={true}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      <BankModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBank(null);
        }}
        bank={editingBank}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <BankDeleteModal
        isOpen={Boolean(deletingBank)}
        onClose={() => setDeletingBank(null)}
        bank={deletingBank}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />

      <BankIdentifiersModal
        isOpen={Boolean(identifiersBank)}
        onClose={() => setIdentifiersBank(null)}
        bank={identifiersBank}
      />
    </div>
  );
}
