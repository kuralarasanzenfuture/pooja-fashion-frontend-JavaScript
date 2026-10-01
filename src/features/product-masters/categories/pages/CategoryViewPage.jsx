import React, { useState } from "react";
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
} from "lucide-react";
import PageHeader from "../../../../common/components/PageHeader.jsx";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import ImageViewerModal from "../../../../common/components/ui/ImageViewerModal.jsx";
import {
  useCategory,
  useUpdateCategory,
  useUpdateCategoryStatus,
  useDeleteCategory,
  useDeleteCategoryImage,
} from "../hooks/useCategories.js";
import CategoryFormModal from "../components/CategoryFormModal.jsx";
import CategoryDeleteModal from "../components/CategoryDeleteModal.jsx";

export default function CategoryViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  // Local UI state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageViewer, setImageViewer] = useState({ isOpen: false, src: "", title: "" });
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
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

  const name = category.categoryName || category.category_name;
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
            className="relative group size-20 sm:size-24 rounded-2xl overflow-hidden border border-base-300 bg-base-200/50 shrink-0 cursor-pointer shadow-xs"
            onClick={() => imageUrl && setImageViewer({ isOpen: true, src: imageUrl, title: name })}
            title={imageUrl ? "Click to view full image in high quality" : "No image"}
          >
            {imageUrl ? (
              <>
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 backdrop-blur-xs">
                  <Maximize2 className="size-5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">High-Res</span>
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
        <div className="flex items-center gap-2.5 self-start md:self-center">
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={() => refetch()}
            loading={isFetching}
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
            variant="danger"
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

      {/* Edit Modal */}
      <CategoryFormModal
        open={isEditOpen}
        mode="edit"
        initialData={category}
        onClose={() => setIsEditOpen(false)}
        onSubmit={async ({ values, imageFile, removeImage }) => {
          try {
            if (removeImage && !imageFile && imageUrl) {
              await deleteImageMutation.mutateAsync(category.id);
            }
            await updateMutation.mutateAsync({
              id: category.id,
              data: {
                ...values,
                company_id: category.companyId || category.company_id || 1,
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

      {/* Delete Confirmation Modal */}
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
    </div>
  );
}
