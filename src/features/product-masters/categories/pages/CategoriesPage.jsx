import React, { useState, useMemo, useEffect } from "react";
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
} from "lucide-react";
import PageHeader from "../../../../common/components/PageHeader.jsx";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import Pagination from "../../../../common/components/ui/pagination/Pagination.jsx";
import ImageViewerModal from "../../../../common/components/ui/ImageViewerModal.jsx";
import { useCompanies } from "../../../company/hooks/useCompanies.js";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useUpdateCategoryStatus,
  useDeleteCategory,
  useDeleteCategoryImage,
} from "../hooks/useCategories.js";
import CategoryFormModal from "../components/CategoryFormModal.jsx";
import CategoryDetailsModal from "../components/CategoryDetailsModal.jsx";
import CategoryDeleteModal from "../components/CategoryDeleteModal.jsx";
import CategoryFilterDropdown from "../components/CategoryFilterDropdown.jsx";

/**
 * Shimmering Loading Skeleton for Categories
 * Matches both Table and Card layouts with smooth pulsating placeholder elements.
 */
function CategoriesSkeleton({ viewMode = "table" }) {
  if (viewMode === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl p-5 bg-base-100 border border-base-300 space-y-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="h-6 w-20 bg-base-300/70 animate-pulse rounded-lg" />
              <div className="h-6 w-16 bg-base-300/70 animate-pulse rounded-lg" />
            </div>
            <div className="h-36 w-full bg-base-300/60 animate-pulse rounded-xl" />
            <div className="space-y-2">
              <div className="h-5 w-3/4 bg-base-300/80 animate-pulse rounded" />
              <div className="h-3.5 w-full bg-base-300/50 animate-pulse rounded" />
            </div>
            <div className="pt-3 border-t border-base-200 flex items-center justify-between">
              <div className="h-4 w-24 bg-base-300/60 animate-pulse rounded" />
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-base-300/70 animate-pulse rounded-lg" />
                <div className="h-8 w-8 bg-base-300/70 animate-pulse rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Table Skeleton
  return (
    <div className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-base-300 bg-base-200/50 text-[11px] font-semibold uppercase tracking-wider text-base-content/60">
              <th className="py-3 px-5 w-20 text-center">Order</th>
              <th className="py-3 px-4">Category Details</th>
              <th className="py-3 px-4 hidden lg:table-cell">Description</th>
              <th className="py-3 px-4">Catalog Status</th>
              <th className="py-3 px-4 hidden md:table-cell">Last Updated</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200">
            {[...Array(6)].map((_, idx) => (
              <tr key={idx} className="hover:bg-base-200/30 transition-colors">
                <td className="py-4 px-5 text-center">
                  <div className="h-6 w-10 bg-base-300/70 animate-pulse rounded-lg mx-auto" />
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-base-300/80 animate-pulse shrink-0" />
                    <div className="space-y-1.5 flex-1 min-w-[140px]">
                      <div className="h-4 w-36 bg-base-300/80 animate-pulse rounded" />
                      <div className="h-3.5 w-20 bg-base-300/50 animate-pulse rounded" />
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 hidden lg:table-cell">
                  <div className="h-3.5 w-64 bg-base-300/60 animate-pulse rounded" />
                </td>
                <td className="py-4 px-4">
                  <div className="h-6 w-24 bg-base-300/70 animate-pulse rounded-lg" />
                </td>
                <td className="py-4 px-4 hidden md:table-cell">
                  <div className="h-3.5 w-28 bg-base-300/60 animate-pulse rounded" />
                </td>
                <td className="py-4 px-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-8 w-8 bg-base-300/70 animate-pulse rounded-lg" />
                    <div className="h-8 w-8 bg-base-300/70 animate-pulse rounded-lg" />
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

/**
 * Thumbnail component with fallback icon and interactive high-res preview trigger
 */
function CategoryThumb({ url, name, size = "md", onImageClick }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [url]);

  const sizeClasses =
    size === "lg"
      ? "w-full h-44 rounded-xl"
      : size === "sm"
      ? "w-9 h-9 rounded-lg"
      : "w-12 h-12 rounded-xl";

  const isClickable = Boolean(url && !hasError && onImageClick);

  if (url && !hasError) {
    return (
      <div
        className={`relative group/thumb overflow-hidden shrink-0 border border-base-300 bg-base-200/60 ${sizeClasses} ${
          isClickable ? "cursor-pointer hover:border-primary/50" : ""
        }`}
        onClick={isClickable ? (e) => { e.stopPropagation(); onImageClick(url, name); } : undefined}
        title={isClickable ? "Click to view full image in high quality" : undefined}
      >
        <img
          src={url}
          alt={name}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
        />
        {isClickable && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-2xs">
            <Maximize2 className={size === "lg" ? "size-6 drop-shadow-md" : "size-4 drop-shadow-md"} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center shrink-0 border border-primary/20 bg-gradient-to-br from-primary/10 via-base-200 to-base-300/40 text-primary ${sizeClasses}`}
    >
      <Tags className={size === "lg" ? "w-10 h-10 opacity-70" : size === "sm" ? "w-4 h-4" : "w-5 h-5"} />
    </div>
  );
}

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
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [notification, setNotification] = useState(null);

  // High-Quality Image Viewer Modal state
  const [imageViewer, setImageViewer] = useState({ isOpen: false, src: "", title: "" });

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
      { value: "", label: "All Statuses", icon: Filter },
      {
        value: "active",
        label: "Active Catalog",
        dotColor: "bg-emerald-500",
        badge: `${counts.active}`,
      },
      {
        value: "inactive",
        label: "Inactive Catalog",
        dotColor: "bg-rose-500",
        badge: `${counts.inactive}`,
      },
    ],
    [counts.active, counts.inactive]
  );

  const mediaOptions = useMemo(
    () => [
      { value: "", label: "All Media", icon: ImageIcon },
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
    search.trim() ||
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
  const openEdit = (cat) => setModal({ open: true, mode: "edit", data: cat });
  const openDetails = (cat) => setDetailsModal({ isOpen: true, data: cat });
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
                aria-label="Table View"
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
                aria-label="Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={() => {
                refetch();
                refetchMaster();
              }}
              loading={isFetching && !isLoading}
              title="Refresh Categories"
            />

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
          {/* Search box */}
          <div className="relative flex-1 min-w-[240px] max-w-lg">
            <Search className="w-4 h-4 text-base-content/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search category by name or code..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-9 py-2 rounded-xl bg-base-200/60 border border-base-300 text-xs sm:text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content p-0.5 rounded cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Luxury Dropdowns & Filter Controls Cluster */}
          <div className="flex flex-wrap items-center gap-2">
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
                minWidth="min-w-[155px]"
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
              icon={Filter}
              minWidth="min-w-[130px]"
            />

            {/* Media / Imagery Filter */}
            <CategoryFilterDropdown
              label="All Media"
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
              minWidth="min-w-[145px]"
            />

            {/* Sort Direction Toggle Button */}
            <button
              type="button"
              onClick={() => {
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                setPage(1);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer select-none ${
                sortOrder === "desc"
                  ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/30"
                  : "border-base-300 bg-base-100 text-base-content/70 hover:border-primary/40 hover:bg-base-200/50"
              }`}
              title={`Switch to ${sortOrder === "asc" ? "Descending (Z-A / High-Low)" : "Ascending (A-Z / Low-High)"}`}
            >
              {sortOrder === "asc" ? (
                <>
                  <ArrowUp className="w-3.5 h-3.5 text-primary" />
                  <span className="uppercase text-[11px] font-bold">ASC</span>
                </>
              ) : (
                <>
                  <ArrowDown className="w-3.5 h-3.5 text-primary" />
                  <span className="uppercase text-[11px] font-bold">DESC</span>
                </>
              )}
            </button>

            {/* Quick Status Tabs Pills */}
            <div className="flex items-center gap-1 bg-base-200/70 p-1 rounded-xl border border-base-300 overflow-x-auto">
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
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    statusFilter === tab.key
                      ? "bg-base-100 text-primary shadow-2xs font-bold"
                      : "text-base-content/65 hover:text-base-content"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      statusFilter === tab.key
                        ? "bg-primary/10 text-primary"
                        : "bg-base-300/80 text-base-content/60"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-2.5 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between flex-wrap gap-2 pt-2.5 border-t border-base-200 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-base-content/50 uppercase tracking-wider flex items-center gap-1">
                <Filter className="w-3 h-3" /> Active Filters:
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
      ) : viewMode === "table" ? (
        /* TABLE VIEW */
        <div className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto scroll-smooth">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-base-300 bg-base-200/50 text-[11px] font-semibold uppercase tracking-wider text-base-content/60">
                  <th className="py-3 px-5 w-20 text-center">Order</th>
                  <th className="py-3 px-4">Category Details</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Company</th>
                  <th className="py-3 px-4 hidden lg:table-cell">Description</th>
                  <th className="py-3 px-4">Catalog Status</th>
                  <th className="py-3 px-4 hidden md:table-cell">Last Updated</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200 text-sm">
                {currentCategories.map((cat, index) => {
                  const name = cat.categoryName || cat.category_name;
                  const code = cat.categoryCode || cat.category_code;
                  const imageUrl = cat.imageUrl || cat.image_url;
                  const displayOrder = cat.displayOrder ?? cat.display_order ?? 0;
                  const isActive =
                    cat.isActive !== undefined ? cat.isActive : Boolean(cat.is_active);
                  const updatedAt = cat.updatedAt || cat.updated_at;
                  const desc = cat.description;
                  const companyName = cat.companyName || cat.company_name || "Pooja Fashion";
                  const companyCode = cat.companyCode || cat.company_code || null;

                  return (
                    <tr
                      key={cat.id}
                      className="hover:bg-base-200/50 transition-all duration-200 group animate-in fade-in-50 slide-in-from-bottom-2 duration-300 fill-mode-both"
                      style={{ animationDelay: `${Math.min(index * 30, 240)}ms` }}
                    >
                      {/* Order */}
                      <td className="py-3.5 px-5 text-center">
                        <span className="inline-flex items-center justify-center min-w-8 px-2 py-1 rounded-lg bg-base-200 text-xs font-mono font-bold text-base-content/75 border border-base-300/80">
                          #{displayOrder}
                        </span>
                      </td>

                      {/* Category Info with Clickable High-Res Image */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <CategoryThumb
                            url={imageUrl}
                            name={name}
                            size="md"
                            onImageClick={handleOpenImageViewer}
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openDetails(cat)}
                                className="font-bold text-base-content text-sm leading-snug hover:text-primary transition-colors cursor-pointer text-left truncate"
                                title="Click to view category details"
                              >
                                {name}
                              </button>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
                                {code}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyCode(code, cat.id)}
                                className="text-base-content/40 hover:text-primary transition-colors cursor-pointer p-0.5"
                                title="Copy category code"
                              >
                                {copiedKey === cat.id ? (
                                  <Check className="w-3 h-3 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Company Info */}
                      <td className="py-3.5 px-4 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                            <Building className="w-3.5 h-3.5" />
                          </span>
                          <div className="min-w-0">
                            <span className="font-semibold text-xs text-base-content block truncate max-w-[130px]" title={companyName}>
                              {companyName}
                            </span>
                            {companyCode && (
                              <span className="badge badge-xs text-[9px] font-mono uppercase font-bold tracking-wider badge-ghost">
                                {companyCode}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-3.5 px-4 hidden lg:table-cell max-w-sm">
                        <p className="line-clamp-2 text-xs text-base-content/70 leading-relaxed">
                          {desc || <span className="italic text-base-content/40">No description provided</span>}
                        </p>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3.5 px-4">
                        <label className="inline-flex cursor-pointer items-center gap-2">
                          <input
                            type="checkbox"
                            className="toggle toggle-success toggle-sm"
                            checked={isActive}
                            disabled={updateStatusMutation.isPending}
                            onChange={() => handleToggle(cat)}
                            aria-label={`Toggle active status for ${name}`}
                          />
                          <span
                            className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
                              isActive
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : "bg-base-200 text-base-content/50"
                            }`}
                          >
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </label>
                      </td>

                      {/* Updated Date */}
                      <td className="py-3.5 px-4 hidden md:table-cell whitespace-nowrap text-xs text-base-content/65 font-medium">
                        {fmtDate(updatedAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openDetails(cat)}
                            className="p-1.5 rounded-lg text-base-content/60 hover:text-primary hover:bg-base-200 transition-colors cursor-pointer"
                            title="View Category Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEdit(cat)}
                            className="p-1.5 rounded-lg text-base-content/60 hover:text-primary hover:bg-base-200 transition-colors cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setToDelete(cat)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 transition-colors cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer Pagination */}
          <Pagination
            currentPage={page}
            totalItems={totalItems}
            pageSize={limit}
            pageSizeOptions={[6, 10, 20, 50, "All"]}
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
        /* CARDS VIEW - Grid Layout */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentCategories.map((cat, index) => {
              const name = cat.categoryName || cat.category_name;
              const code = cat.categoryCode || cat.category_code;
              const imageUrl = cat.imageUrl || cat.image_url;
              const displayOrder = cat.displayOrder ?? cat.display_order ?? 0;
              const isActive =
                cat.isActive !== undefined ? cat.isActive : Boolean(cat.is_active);
              const updatedAt = cat.updatedAt || cat.updated_at;
              const desc = cat.description;
              const companyName = cat.companyName || cat.company_name || "Pooja Fashion";
              const companyCode = cat.companyCode || cat.company_code || null;

              return (
                <div
                  key={cat.id}
                  className="rounded-2xl p-5 bg-base-100 border border-base-300 hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 shadow-xs group animate-in fade-in-50 slide-in-from-bottom-3 duration-300 fill-mode-both"
                  style={{ animationDelay: `${Math.min(index * 40, 320)}ms` }}
                >
                  <div>
                    {/* Top badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-base-200 text-base-content/75 border border-base-300/80">
                          #{displayOrder}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
                          {code}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-base-200/90 text-base-content/70 border border-base-300" title={`Company: ${companyName}`}>
                          <Building className="w-3 h-3 text-primary shrink-0" />
                          <span className="truncate max-w-[100px]">{companyName}</span>
                        </span>
                      </div>

                      <label className="inline-flex cursor-pointer items-center gap-1.5">
                        <input
                          type="checkbox"
                          className="toggle toggle-success toggle-xs"
                          checked={isActive}
                          disabled={updateStatusMutation.isPending}
                          onChange={() => handleToggle(cat)}
                          aria-label={`Toggle active for ${name}`}
                        />
                        <span
                          className={`text-[11px] font-semibold ${
                            isActive ? "text-emerald-600" : "text-base-content/50"
                          }`}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </label>
                    </div>

                    {/* Image Banner / Media Preview with Click to Full View */}
                    <div className="relative mb-3.5">
                      <CategoryThumb
                        url={imageUrl}
                        name={name}
                        size="lg"
                        onImageClick={handleOpenImageViewer}
                      />
                    </div>

                    {/* Category Title & Description */}
                    <div className="space-y-1">
                      <h3
                        onClick={() => openDetails(cat)}
                        className="text-base font-bold text-base-content leading-snug truncate group-hover:text-primary transition-colors cursor-pointer"
                        title="Click to view details"
                      >
                        {name}
                      </h3>
                      <p className="text-xs text-base-content/65 line-clamp-2 leading-relaxed min-h-[32px]">
                        {desc || <span className="italic text-base-content/40">No description provided</span>}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-base-200 flex items-center justify-between text-xs text-base-content/60">
                    <span className="flex items-center gap-1 font-medium text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-base-content/40" />
                      {fmtDate(updatedAt)}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopyCode(code, cat.id)}
                        className="p-1.5 rounded-lg text-base-content/60 hover:text-primary hover:bg-base-200 transition-colors cursor-pointer"
                        title="Copy code"
                      >
                        {copiedKey === cat.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => openDetails(cat)}
                        className="p-1.5 rounded-lg text-base-content/60 hover:text-primary hover:bg-base-200 transition-colors cursor-pointer"
                        title="View Category Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => openEdit(cat)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-primary hover:bg-primary/10 border border-primary/20 transition-all cursor-pointer shadow-2xs"
                        title="Edit Category"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setToDelete(cat)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cards Footer Pagination */}
          <div className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden shadow-2xs">
            <Pagination
              currentPage={page}
              totalItems={totalItems}
              pageSize={limit}
              pageSizeOptions={[6, 12, 24, 48, "All"]}
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
