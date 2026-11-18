import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft,
  Tags,
  Edit2,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  Calendar,
  Layers,
  Building,
  CheckCircle2,
  AlertCircle,
  Maximize2,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Plus,
  FolderTree,
  ChevronRight,
  Search,
  LayoutGrid,
  Table as TableIcon,
  Eye,
  X,
} from "lucide-react";
import PageHeader from "../../../../common/components/PageHeader.jsx";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import ImageViewerModal from "../../../../common/components/ui/ImageViewerModal.jsx";
import { toast } from "../../../../common/components/toast/index.js";
import {
  useCategory,
  useUpdateCategory,
  useUpdateCategoryStatus,
  useDeleteCategory,
  useDeleteCategoryImage,
} from "../hooks/useCategories.js";
import {
  SubCategoryFormModal,
  SubCategoryDetailsModal,
  SubCategoryDeleteModal,
  useCreateSubcategory,
  useUpdateSubcategory,
  useUpdateSubcategoryStatus,
  useDeleteSubcategory,
  useSubcategories,
} from "../../sub-categories/index.js";
import CategoryFormModal from "../components/CategoryFormModal.jsx";
import CategoryDeleteModal from "../components/CategoryDeleteModal.jsx";
import CategoryAddSubcategoryModal from "../components/CategoryAddSubcategoryModal.jsx";
import { formatCategoryName } from "../utils/categoryImageHelper.js";

export default function CategoryViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth?.user);
  const roleCode = String(currentUser?.roleCode || currentUser?.role || "").toUpperCase();
  const userCompanyId = currentUser?.companyId || currentUser?.company_id;
  // "superadmin" & "admin" user only don't have company id; this user only company to select
  const isSuperAdminOrAdmin = roleCode === "SUPERADMIN" || roleCode === "ADMIN";
  const canSelectCompany = isSuperAdminOrAdmin && !userCompanyId;

  const {
    data: categoryResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useCategory(id);

  const updateMutation = useUpdateCategory();
  const updateStatusMutation = useUpdateCategoryStatus();
  const deleteMutation = useDeleteCategory();
  const deleteImageMutation = useDeleteCategoryImage();

  // Subcategory mutations
  const createSubcategoryMutation = useCreateSubcategory();
  const updateSubcategoryMutation = useUpdateSubcategory();
  const updateSubcategoryStatusMutation = useUpdateSubcategoryStatus();
  const deleteSubcategoryMutation = useDeleteSubcategory();

  // Subcategories query for this category
  const categoryIdNum = Number(id);
  const {
    data: subcategoriesResponse,
    isLoading: isLoadingSubcategories,
    refetch: refetchSubcategories,
  } = useSubcategories(
    { category_id: categoryIdNum || id, limit: 100 },
    { enabled: Boolean(id) }
  );

  const subcategoriesList = useMemo(() => {
    if (!subcategoriesResponse) return [];
    if (Array.isArray(subcategoriesResponse)) return subcategoriesResponse;
    if (Array.isArray(subcategoriesResponse?.data)) return subcategoriesResponse.data;
    if (Array.isArray(subcategoriesResponse?.subcategories)) return subcategoriesResponse.subcategories;
    return [];
  }, [subcategoriesResponse]);

  // Local UI state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageViewer, setImageViewer] = useState({ isOpen: false, src: "", title: "" });

  // Subcategory UI state
  const [subcatSearch, setSubcatSearch] = useState("");
  const [subcatViewMode, setSubcatViewMode] = useState("table"); // "table" | "cards"
  const [subcatFormModal, setSubcatFormModal] = useState({ isOpen: false, mode: "add", data: null });
  const [subcatDetailsModal, setSubcatDetailsModal] = useState({ isOpen: false, data: null });
  const [subcatDeleteModal, setSubcatDeleteModal] = useState({ isOpen: false, data: null });

  const filteredSubcategories = useMemo(() => {
    if (!subcatSearch.trim()) return subcategoriesList;
    const q = subcatSearch.toLowerCase().trim();
    return subcategoriesList.filter((s) => {
      const sName = (s.subcategoryName || s.subcategory_name || "").toLowerCase();
      const sCode = (s.subcategoryCode || s.subcategory_code || "").toLowerCase();
      const sDesc = (s.description || "").toLowerCase();
      return sName.includes(q) || sCode.includes(q) || sDesc.includes(q);
    });
  }, [subcategoriesList, subcatSearch]);

  const showNotification = (type, message) => {
    if (type === "success") toast.success(message);
    else if (type === "error") toast.error(message);
    else if (type === "warning") toast.warning(message);
    else toast.help(message);
  };

  const handleOpenAddSubcategory = () => {
    setSubcatFormModal({ isOpen: true, mode: "add", data: null });
  };

  const handleOpenEditSubcategory = (subcat) => {
    setSubcatFormModal({ isOpen: true, mode: "edit", data: subcat });
  };

  const handleSubcategoryFormSubmit = async ({ values, imageFile, removeImage }) => {
    try {
      if (subcatFormModal.mode === "add") {
        await createSubcategoryMutation.mutateAsync({
          data: {
            ...values,
            category_id: Number(category.id || id),
            company_id: Number(category.companyId || category.company_id || (userCompanyId ? Number(userCompanyId) : 1)),
          },
          imageFile,
        });
        showNotification("success", `Subcategory "${values.subcategory_name}" created successfully!`);
      } else {
        const subcatId = subcatFormModal.data?.id;
        await updateSubcategoryMutation.mutateAsync({
          id: subcatId,
          data: values,
          imageFile: removeImage ? null : imageFile,
        });
        showNotification("success", `Subcategory "${values.subcategory_name}" updated successfully!`);
      }
      setSubcatFormModal({ isOpen: false, mode: "add", data: null });
      refetchSubcategories();
    } catch (err) {
      showNotification(
        "error",
        err?.response?.data?.message || err?.message || "Failed to save subcategory"
      );
    }
  };

  const handleToggleSubcategoryStatus = async (subcat) => {
    const currentActive = subcat.isActive !== undefined ? subcat.isActive : Boolean(subcat.is_active);
    const newStatus = !currentActive;
    try {
      await updateSubcategoryStatusMutation.mutateAsync({
        id: subcat.id,
        isActive: newStatus,
      });
      showNotification(
        "success",
        `Subcategory "${subcat.subcategoryName || subcat.subcategory_name}" is now ${newStatus ? "Active" : "Inactive"}`
      );
      refetchSubcategories();
    } catch (err) {
      showNotification(
        "error",
        err?.response?.data?.message || err?.message || "Failed to update subcategory status"
      );
    }
  };

  const handleDeleteSubcategoryConfirm = async () => {
    if (!subcatDeleteModal.data?.id) return;
    try {
      await deleteSubcategoryMutation.mutateAsync(subcatDeleteModal.data.id);
      showNotification(
        "success",
        `Subcategory "${subcatDeleteModal.data.subcategoryName || subcatDeleteModal.data.subcategory_name}" deleted successfully`
      );
      setSubcatDeleteModal({ isOpen: false, data: null });
      refetchSubcategories();
    } catch (err) {
      showNotification(
        "error",
        err?.response?.data?.message || err?.message || "Failed to delete subcategory"
      );
    }
  };

  const category = categoryResponse?.data || categoryResponse || null;

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12 animate-pulse">
        <div className="h-8 w-48 bg-base-300 rounded-lg" />
        <div className="h-44 w-full bg-base-200 rounded-2xl border border-base-300" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-72 bg-base-200 rounded-2xl border border-base-300" />
          <div className="md:col-span-2 h-72 bg-base-200 rounded-2xl border border-base-300" />
        </div>
      </div>
    );
  }

  if (isError || !category) {
    return (
      <div className="space-y-6 pb-12">
        <Link
          to="/products/categories"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-base-content/60 hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Categories</span>
        </Link>
        <div className="p-12 rounded-2xl bg-base-100 border border-base-300 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h4 className="text-base font-bold text-base-content">
              Category Not Found
            </h4>
            <p className="text-xs text-base-content/60 leading-relaxed">
              {error?.response?.data?.message || "The requested category could not be retrieved from the server."}
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => navigate("/products/categories")}>
            Return to Categories List
          </Button>
        </div>
      </div>
    );
  }

  const name = formatCategoryName(category.categoryName || category.category_name);
  const code = category.categoryCode || category.category_code;
  const imageUrl = category.imageUrl || category.image_url;
  const displayOrder = category.displayOrder ?? category.display_order ?? 0;
  const isActive =
    category.isActive !== undefined ? category.isActive : Boolean(category.is_active);
  const desc = category.description;
  const companyName = category.companyName || "Pooja Fashion";
  const updatedAt = category.updatedAt || category.updated_at;
  const createdAt = category.createdAt || category.created_at;

  const handleCopyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    showNotification("success", `Copied code "${code}" to clipboard`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleStatus = async () => {
    const newStatus = !isActive;
    try {
      await updateStatusMutation.mutateAsync({ id: category.id, isActive: newStatus });
      showNotification("success", `Category "${name}" is now ${newStatus ? "Active" : "Inactive"}`);
      refetch();
    } catch (err) {
      showNotification("error", err?.response?.data?.message || "Failed to update category status");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteMutation.mutateAsync(category.id);
      showNotification("success", `Category "${name}" deleted successfully`);
      navigate("/products/categories");
    } catch (err) {
      showNotification(
        "error",
        err?.response?.data?.message || "Cannot delete category with linked subcategories or products"
      );
      setIsDeleteOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const fmtDate = (iso) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          to="/products/categories"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-base-content/60 hover:text-primary transition-colors group cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Categories Directory</span>
        </Link>
      </div>

      {/* Hero Header Card */}
      <div className="rounded-2xl p-6 sm:p-7 bg-base-100 border border-base-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4.5">
          {/* Avatar Thumbnail with clickable full view */}
          <div
            className="relative group size-20 sm:size-24 rounded-2xl overflow-hidden border border-base-300 bg-base-200/50 shrink-0 cursor-pointer shadow-xs hover:border-primary/60 hover:shadow-md hover:ring-2 hover:ring-primary/20 transition-all duration-300 active:scale-95"
            onClick={() => imageUrl && setImageViewer({ isOpen: true, src: imageUrl, title: name })}
            title={imageUrl ? "Click to view full image in high quality" : "No image"}
          >
            {imageUrl ? (
              <>
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center text-white gap-0.5 backdrop-blur-2xs">
                  <Maximize2 className="size-5 text-amber-300 drop-shadow-md animate-in zoom-in-75 duration-150" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white drop-shadow-xs">Preview</span>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary bg-primary/10">
                <Tags className="size-8" />
              </div>
            )}
          </div>

          {/* Title & Badges */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-base-content tracking-tight leading-tight">
                {name}
              </h1>
              <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-base-200 text-base-content/75 border border-base-300">
                Order #{displayOrder}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              {/* Category Code Pill */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 font-mono font-bold">
                <span>{code}</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="hover:text-primary transition-colors cursor-pointer"
                  title="Copy Code"
                >
                  {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                </button>
              </div>

              {/* Status Pill */}
              <button
                type="button"
                onClick={handleToggleStatus}
                className={`px-2.5 py-1 rounded-lg font-bold inline-flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                }`}
                title="Click to toggle status"
              >
                {isActive ? <CheckCircle2 className="size-3.5" /> : <AlertCircle className="size-3.5" />}
                <span>{isActive ? "Active on POS" : "Inactive (Hidden)"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-start md:self-center flex-wrap">
          {/* <Button
            variant="clip-six"
            size="sm"
            icon={Plus}
            onClick={handleOpenAddSubcategory}
          >
            Add Subcategory
          </Button> */}
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={() => {
              refetch();
              refetchSubcategories();
            }}
            loading={isFetching || isLoadingSubcategories}
            title="Refresh Details"
          />
          <Button
            variant="outline"
            size="sm"
            icon={Edit2}
            onClick={() => setIsEditOpen(true)}
          >
            Edit Category
          </Button>
          <Button
            variant="clip-four"
            size="sm"
            icon={Trash2}
            onClick={() => setIsDeleteOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Main Grid: Visuals & Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Visual Asset Card */}
        <div className="space-y-6">
          <div className="rounded-2xl p-5 bg-base-100 border border-base-300 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-base-content flex items-center gap-2">
                <Tags className="size-4 text-primary" />
                <span>Category Image Asset</span>
              </h3>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageViewer({ isOpen: true, src: imageUrl, title: name })}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Maximize2 className="size-3" /> Full View
                </button>
              )}
            </div>

            {/* Clickable Image Box */}
            <div
              className="relative group aspect-square w-full rounded-2xl overflow-hidden border border-base-300 bg-base-200/50 cursor-pointer shadow-2xs"
              onClick={() => imageUrl && setImageViewer({ isOpen: true, src: imageUrl, title: name })}
            >
              {imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2 backdrop-blur-xs">
                    <div className="p-3 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md">
                      <Maximize2 className="size-6 text-white" />
                    </div>
                    <span className="text-xs font-bold tracking-wide">
                      Click to Inspect High-Resolution
                    </span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-primary/60 bg-gradient-to-br from-primary/10 via-base-200 to-base-300/40 p-6 text-center">
                  <Tags className="size-12 opacity-60" />
                  <span className="text-xs font-bold text-base-content/70 mt-3">
                    No Visual Image Uploaded
                  </span>
                  <span className="text-[11px] text-base-content/50 mt-1">
                    Add a high-res image to enhance touch POS experience.
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(true)}
                    className="btn btn-xs btn-primary mt-3"
                  >
                    Upload Image
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Audit / Metadata Card */}
          <div className="rounded-2xl p-5 bg-base-100 border border-base-300 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-base-content uppercase tracking-wider text-[11px]">
              System Audit Info
            </h3>
            <div className="divide-y divide-base-200">
              <div className="py-2 flex items-center justify-between">
                <span className="text-base-content/60 font-medium">Record ID</span>
                <span className="font-mono font-bold text-base-content">#{category.id}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-base-content/60 font-medium">Created At</span>
                <span className="text-base-content font-medium">{fmtDate(createdAt)}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-base-content/60 font-medium">Last Updated</span>
                <span className="text-base-content font-medium">{fmtDate(updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Specifications & Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Specs Card */}
          <div className="rounded-2xl p-6 bg-base-100 border border-base-300 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-base-content flex items-center gap-2">
              <Layers className="size-4 text-primary" />
              <span>Catalog Specifications</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-base-200/50 border border-base-300/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/50 block">
                  Company Entity
                </span>
                <span className="text-sm font-bold text-base-content mt-1 block">
                  {companyName}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-base-200/50 border border-base-300/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/50 block">
                  Sequence Display Order
                </span>
                <span className="text-sm font-bold text-base-content mt-1 block">
                  Position #{displayOrder}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-base-200/50 border border-base-300/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/50 block">
                  Catalog Code
                </span>
                <span className="text-sm font-mono font-bold text-primary mt-1 block">
                  {code}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-base-200/50 border border-base-300/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/50 block">
                  POS Accessibility
                </span>
                <span
                  className={`text-sm font-bold mt-1 block ${
                    isActive ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {isActive ? "Visible in POS & Billing" : "Hidden from Sales Catalog"}
                </span>
              </div>
            </div>

            {/* Description Card */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-base-content uppercase tracking-wider mb-2">
                Detailed Description
              </h4>
              <div className="p-4 rounded-xl bg-base-200/30 border border-base-300 text-xs sm:text-sm text-base-content/80 leading-relaxed min-h-[90px]">
                {desc ? (
                  <p className="whitespace-pre-line">{desc}</p>
                ) : (
                  <p className="italic text-base-content/40">
                    No description specified for this category. You can add one by editing the category.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Linked Subcategories Section */}
      <div className="rounded-2xl p-6 bg-base-100 border border-base-300 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <FolderTree className="size-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-base-content flex items-center gap-2">
                <span>Subcategories under {name}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                  {subcategoriesList.length}
                </span>
              </h3>
              <p className="text-xs text-base-content/60">
                Child classifications, cuts, and fabric groups assigned directly to this category
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {subcategoriesList.length > 0 && (
              <>
                {/* Search in subcategories */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                  <input
                    type="text"
                    placeholder="Search subcategories..."
                    value={subcatSearch}
                    onChange={(e) => setSubcatSearch(e.target.value)}
                    className="input input-sm pl-8 pr-7 text-xs rounded-xl bg-base-200/50 border-base-300 focus:border-primary w-40 sm:w-48"
                  />
                  {subcatSearch && (
                    <button
                      type="button"
                      onClick={() => setSubcatSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-base-200/60 p-0.5 rounded-xl border border-base-300">
                  <button
                    type="button"
                    onClick={() => setSubcatViewMode("table")}
                    className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      subcatViewMode === "table"
                        ? "bg-base-100 text-primary shadow-2xs font-bold"
                        : "text-base-content/60 hover:text-base-content"
                    }`}
                    title="Table View"
                  >
                    <TableIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubcatViewMode("cards")}
                    className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      subcatViewMode === "cards"
                        ? "bg-base-100 text-primary shadow-2xs font-bold"
                        : "text-base-content/60 hover:text-base-content"
                    }`}
                    title="Card Grid View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}

            <Button
              variant="clip-six"
              size="sm"
              icon={Plus}
              onClick={handleOpenAddSubcategory}
            >
              Add Subcategory
            </Button>

            {subcategoriesList.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                icon={ExternalLink}
                onClick={() => navigate(`/products/subcategories?category_id=${id}`)}
                title="View in Subcategories Master Directory"
              >
                Directory
              </Button>
            )}
          </div>
        </div>

        {/* Content Section */}
        {isLoadingSubcategories ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-base-200/60 animate-pulse border border-base-300" />
            ))}
          </div>
        ) : filteredSubcategories.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-2xl border border-dashed border-base-300 bg-base-200/20 text-center space-y-3">
            <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <FolderTree className="size-7" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-base-content">
                {subcatSearch ? "No Matching Subcategories" : `No Subcategories Yet for "${name}"`}
              </h4>
              <p className="text-xs text-base-content/60 max-w-md mx-auto">
                {subcatSearch
                  ? `No subcategories matched query "${subcatSearch}". Try a different keyword or reset search.`
                  : `Group and classify ${name} into specific fabrics, styles, or cuts for easy discovery on POS.`}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-1">
              {subcatSearch ? (
                <Button variant="outline" size="sm" onClick={() => setSubcatSearch("")}>
                  Clear Search
                </Button>
              ) : null}
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={handleOpenAddSubcategory}
              >
                Add First Subcategory
              </Button>
            </div>
          </div>
        ) : subcatViewMode === "table" ? (
          /* TABLE VIEW */
          <div className="bg-base-100 rounded-xl border border-base-300 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-base-300 bg-base-200/50 text-[11px] font-semibold uppercase tracking-wider text-base-content/60">
                    <th className="py-3 px-4 w-16 text-center">Order</th>
                    <th className="py-3 px-4">Subcategory Details</th>
                    <th className="py-3 px-4 hidden md:table-cell">Description</th>
                    <th className="py-3 px-4">Catalog Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200">
                  {filteredSubcategories.map((subcat) => {
                    const subName = subcat.subcategoryName || subcat.subcategory_name;
                    const subCode = subcat.subcategoryCode || subcat.subcategory_code;
                    const subOrder = subcat.displayOrder ?? subcat.display_order ?? 0;
                    const subActive = subcat.isActive !== undefined ? subcat.isActive : Boolean(subcat.is_active);
                    const subImg = subcat.imageUrl || subcat.image_url;
                    const subDesc = subcat.description;

                    return (
                      <tr key={subcat.id} className="hover:bg-base-200/40 transition-colors group">
                        {/* Order */}
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center justify-center min-w-7 px-2 py-0.5 rounded-md bg-base-200 text-xs font-mono font-bold text-base-content/75 border border-base-300">
                            #{subOrder}
                          </span>
                        </td>

                        {/* Details */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              onClick={() => subImg && setImageViewer({ isOpen: true, src: subImg, title: subName })}
                              className="size-10 rounded-xl bg-base-200 border border-base-300 overflow-hidden flex items-center justify-center shrink-0 cursor-pointer shadow-2xs hover:border-primary/50 transition-colors"
                              title={subImg ? "Click to view full image" : "No image"}
                            >
                              {subImg ? (
                                <img src={subImg} alt={subName} className="w-full h-full object-cover" />
                              ) : (
                                <Layers className="size-5 text-base-content/40" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <button
                                type="button"
                                onClick={() => setSubcatDetailsModal({ isOpen: true, data: subcat })}
                                className="font-bold text-sm text-base-content hover:text-primary transition-colors cursor-pointer text-left block truncate"
                                title="Click to view details"
                              >
                                {subName}
                              </button>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                {subCode && (
                                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                                    {subCode}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Description */}
                        <td className="py-3 px-4 hidden md:table-cell max-w-xs">
                          <p className="line-clamp-2 text-xs text-base-content/70">
                            {subDesc || <span className="italic text-base-content/40">No description</span>}
                          </p>
                        </td>

                        {/* Status Toggle */}
                        <td className="py-3 px-4">
                          <label className="inline-flex cursor-pointer items-center gap-2">
                            <input
                              type="checkbox"
                              className="toggle toggle-success toggle-sm"
                              checked={subActive}
                              disabled={updateSubcategoryStatusMutation.isPending}
                              onChange={() => handleToggleSubcategoryStatus(subcat)}
                              aria-label={`Toggle active status for ${subName}`}
                            />
                            <span
                              className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
                                subActive
                                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                  : "bg-base-200 text-base-content/50"
                              }`}
                            >
                              {subActive ? "Active" : "Inactive"}
                            </span>
                          </label>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setSubcatDetailsModal({ isOpen: true, data: subcat })}
                              className="p-1.5 rounded-lg text-base-content/60 hover:text-primary hover:bg-base-200 transition-colors cursor-pointer"
                              title="View Subcategory Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditSubcategory(subcat)}
                              className="p-1.5 rounded-lg text-base-content/60 hover:text-primary hover:bg-base-200 transition-colors cursor-pointer"
                              title="Edit Subcategory"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setSubcatDeleteModal({ isOpen: true, data: subcat })}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 transition-colors cursor-pointer"
                              title="Delete Subcategory"
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
          </div>
        ) : (
          /* CARDS VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredSubcategories.map((subcat) => {
              const subName = subcat.subcategoryName || subcat.subcategory_name;
              const subCode = subcat.subcategoryCode || subcat.subcategory_code;
              const subOrder = subcat.displayOrder ?? subcat.display_order ?? 0;
              const subActive = subcat.isActive !== undefined ? subcat.isActive : Boolean(subcat.is_active);
              const subImg = subcat.imageUrl || subcat.image_url;
              const subDesc = subcat.description;

              return (
                <div
                  key={subcat.id}
                  className="rounded-2xl bg-base-100 border border-base-300 p-4 space-y-3 shadow-2xs hover:border-primary/50 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        onClick={() => subImg && setImageViewer({ isOpen: true, src: subImg, title: subName })}
                        className="size-11 rounded-xl bg-base-200 border border-base-300 overflow-hidden flex items-center justify-center shrink-0 cursor-pointer shadow-2xs"
                      >
                        {subImg ? (
                          <img src={subImg} alt={subName} className="w-full h-full object-cover" />
                        ) : (
                          <Layers className="size-5 text-base-content/40" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-sm text-base-content block truncate" title={subName}>
                          {subName}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {subCode && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                              {subCode}
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-base-content/50">
                            #{subOrder}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                        subActive
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-base-200 text-base-content/50"
                      }`}
                    >
                      {subActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {subDesc && (
                    <p className="line-clamp-2 text-xs text-base-content/70 leading-relaxed">
                      {subDesc}
                    </p>
                  )}

                  <div className="pt-2 border-t border-base-200 flex items-center justify-between">
                    <label className="inline-flex cursor-pointer items-center gap-1.5">
                      <input
                        type="checkbox"
                        className="toggle toggle-success toggle-xs"
                        checked={subActive}
                        onChange={() => handleToggleSubcategoryStatus(subcat)}
                      />
                      <span className="text-[11px] font-medium text-base-content/60">
                        {subActive ? "Live" : "Hidden"}
                      </span>
                    </label>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setSubcatDetailsModal({ isOpen: true, data: subcat })}
                        className="p-1 rounded-lg text-base-content/60 hover:text-primary hover:bg-base-200 transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEditSubcategory(subcat)}
                        className="p-1 rounded-lg text-base-content/60 hover:text-primary hover:bg-base-200 transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSubcatDeleteModal({ isOpen: true, data: subcat })}
                        className="p-1 rounded-lg text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Category Modal */}
      <CategoryFormModal
        open={isEditOpen}
        mode="edit"
        initialData={category}
        initialCompanyId={category.companyId || category.company_id || 1}
        onClose={() => setIsEditOpen(false)}
        onSubmit={async ({ values, imageFile, removeImage }) => {
          try {
            if (removeImage && !imageFile && imageUrl) {
              await deleteImageMutation.mutateAsync(category.id);
            }
            const targetCompanyId = canSelectCompany
              ? Number(values.company_id || category.companyId || category.company_id || 1)
              : Number(userCompanyId || category.companyId || category.company_id || 1);

            await updateMutation.mutateAsync({
              id: category.id,
              data: {
                ...values,
                company_id: targetCompanyId,
              },
              imageFile,
            });
            showNotification("success", "Category updated successfully");
            setIsEditOpen(false);
            refetch();
          } catch (err) {
            showNotification("error", err?.response?.data?.message || "Failed to save category");
          }
        }}
      />

      {/* Delete Category Confirmation Modal */}
      <CategoryDeleteModal
        isOpen={isDeleteOpen}
        category={category}
        onClose={() => !deleting && setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        isDeleting={deleting}
      />

      {/* High-Quality Image Viewer Modal */}
      <ImageViewerModal
        isOpen={imageViewer.isOpen}
        onClose={() => setImageViewer({ isOpen: false, src: "", title: "" })}
        src={imageViewer.src}
        title={imageViewer.title}
        subtitle="Product Master Category Visual Asset"
      />

      {/* Dedicated Add Subcategory Modal (Locked Parent Category) */}
      <CategoryAddSubcategoryModal
        isOpen={subcatFormModal.isOpen && subcatFormModal.mode === "add"}
        category={category}
        saving={createSubcategoryMutation.isPending}
        onClose={() => setSubcatFormModal({ isOpen: false, mode: "add", data: null })}
        onSubmit={async ({ values, imageFile }) => {
          await handleSubcategoryFormSubmit({ values, imageFile, removeImage: false });
        }}
      />

      {/* Subcategory Edit Modal */}
      <SubCategoryFormModal
        isOpen={subcatFormModal.isOpen && subcatFormModal.mode === "edit"}
        mode="edit"
        initialData={subcatFormModal.data}
        initialCategoryId={category.id}
        initialCompanyId={
          category.companyId ||
          category.company_id ||
          (userCompanyId ? Number(userCompanyId) : null)
        }
        saving={updateSubcategoryMutation.isPending}
        onClose={() => setSubcatFormModal({ isOpen: false, mode: "add", data: null })}
        onSubmit={handleSubcategoryFormSubmit}
      />

      {/* Subcategory Details Quick View Modal */}
      <SubCategoryDetailsModal
        isOpen={subcatDetailsModal.isOpen}
        subcategory={subcatDetailsModal.data}
        onClose={() => setSubcatDetailsModal({ isOpen: false, data: null })}
        onEdit={(subcat) => {
          setSubcatDetailsModal({ isOpen: false, data: null });
          handleOpenEditSubcategory(subcat);
        }}
        onDelete={(subcat) => {
          setSubcatDetailsModal({ isOpen: false, data: null });
          setSubcatDeleteModal({ isOpen: true, data: subcat });
        }}
        onToggleStatus={handleToggleSubcategoryStatus}
        onImageClick={(src, title) => setImageViewer({ isOpen: true, src, title })}
        onNavigateFullPage={(subcatId) => navigate(`/products/subcategories/${subcatId}`)}
      />

      {/* Subcategory Delete Confirmation Modal */}
      <SubCategoryDeleteModal
        isOpen={subcatDeleteModal.isOpen}
        subcategory={subcatDeleteModal.data}
        isDeleting={deleteSubcategoryMutation.isPending}
        onClose={() => setSubcatDeleteModal({ isOpen: false, data: null })}
        onConfirm={handleDeleteSubcategoryConfirm}
      />
    </div>
  );
}
