import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft,
  Layers,
  Edit2,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  Calendar,
  Building,
  CheckCircle2,
  AlertCircle,
  FolderTree,
  ExternalLink,
  Package,
  X,
  Maximize2,
} from "lucide-react";
import PageHeader from "../../../../common/components/PageHeader.jsx";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import ImageViewerModal from "../../../../common/components/ui/ImageViewerModal.jsx";
import {
  useSubcategory,
  useUpdateSubcategory,
  useUpdateSubcategoryStatus,
  useDeleteSubcategory,
} from "../hooks/useSubCategories.js";
import SubCategoryFormModal from "../components/SubCategoryFormModal.jsx";
import SubCategoryDeleteModal from "../components/SubCategoryDeleteModal.jsx";
import { formatCategoryName } from "../../categories/utils/categoryImageHelper.js";

export default function SubCategoryViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: subcategoryResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useSubcategory(id);

  const updateMutation = useUpdateSubcategory();
  const updateStatusMutation = useUpdateSubcategoryStatus();
  const deleteMutation = useDeleteSubcategory();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageViewer, setImageViewer] = useState({ isOpen: false, src: "", title: "" });
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const subcategory = subcategoryResponse?.data || subcategoryResponse || null;

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

  if (isError || !subcategory) {
    return (
      <div className="space-y-6 pb-12">
        <Link
          to="/products/subcategories"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-base-content/60 hover:text-primary transition-colors"
        >
          <ChevronLeft className="size-4" />
          <span>Back to Subcategories</span>
        </Link>
        <div className="p-12 rounded-3xl bg-base-100 border border-base-300 text-center space-y-4 shadow-xs">
          <div className="size-16 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="size-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-base-content">
              Subcategory Not Found
            </h3>
            <p className="text-xs text-base-content/60 max-w-sm mx-auto">
              {error?.response?.data?.message || "The requested subcategory record could not be found or has been deleted."}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/products/subcategories")}
            className="text-xs font-semibold"
          >
            Return to List
          </Button>
        </div>
      </div>
    );
  }

  const name = formatCategoryName(subcategory.subcategoryName || subcategory.subcategory_name);
  const code = subcategory.subcategoryCode || subcategory.subcategory_code || "—";
  const catName = formatCategoryName(
    subcategory.categoryName ||
    subcategory.category_name ||
    subcategory.category?.category_name ||
    "—"
  );
  const catId =
    subcategory.categoryId ||
    subcategory.category_id ||
    subcategory.category?.id;
  const catCode =
    subcategory.categoryCode ||
    subcategory.category_code ||
    subcategory.category?.category_code;
  const imageUrl = subcategory.imageUrl || subcategory.image_url;
  const isActive =
    subcategory.isActive !== undefined
      ? Boolean(subcategory.isActive)
      : subcategory.is_active !== undefined
      ? Boolean(subcategory.is_active)
      : true;
  const displayOrder = subcategory.displayOrder ?? subcategory.display_order ?? 0;
  const companyName = subcategory.companyName || subcategory.company_name;
  const companyCode = subcategory.companyCode || subcategory.company_code;

  const handleCopyCode = () => {
    if (!code || code === "—") return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleStatus = async () => {
    try {
      await updateStatusMutation.mutateAsync({ id, isActive: !isActive });
      showNotification("success", `Subcategory ${!isActive ? "activated" : "deactivated"} successfully`);
      refetch();
    } catch (err) {
      showNotification("error", err?.response?.data?.message || "Failed to toggle status");
    }
  };

  const handleFormSubmit = async ({ values, imageFile, removeImage }) => {
    try {
      await updateMutation.mutateAsync({
        id,
        data: values,
        imageFile: removeImage ? null : imageFile,
      });
      showNotification("success", "Subcategory updated successfully");
      setIsEditOpen(false);
      refetch();
    } catch (err) {
      showNotification("error", err?.response?.data?.message || "Failed to update subcategory");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      navigate("/products/subcategories");
    } catch (err) {
      showNotification(
        "error",
        err?.response?.data?.message || "Cannot delete subcategory with linked products"
      );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
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

      {/* Back button */}
      <div>
        <Link
          to="/products/subcategories"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-base-content/60 hover:text-primary transition-colors"
        >
          <ChevronLeft className="size-4" />
          <span>Back to Subcategories</span>
        </Link>
      </div>

      {/* Page Header */}
      <PageHeader
        title={name}
        subtitle={`Subcategory Record #${id} • Sequence Order #${displayOrder}`}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-2.5 rounded-xl border border-base-300 bg-base-100 hover:bg-base-200 text-base-content/70 hover:text-base-content transition-all cursor-pointer shadow-xs disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`size-4 ${isFetching ? "animate-spin text-primary" : ""}`} />
            </button>

            <Button
              type="button"
              variant="outline"
              onClick={handleToggleStatus}
              disabled={updateStatusMutation.isPending}
              className="text-xs font-semibold"
            >
              {isActive ? "Deactivate" : "Activate"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditOpen(true)}
              className="gap-2 text-xs font-semibold"
            >
              <Edit2 className="size-4" />
              <span>Edit</span>
            </Button>

            <Button
              type="button"
              variant="danger"
              onClick={() => setIsDeleteOpen(true)}
              className="gap-2 text-xs font-semibold shadow-md shadow-rose-500/20"
            >
              <Trash2 className="size-4" />
              <span>Delete</span>
            </Button>
          </div>
        }
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Visual Asset & Category Relation */}
        <div className="space-y-6">
          {/* Visual Showcase Card */}
          <div className="p-6 rounded-3xl bg-base-100 border border-base-300 shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Visual Asset
            </h4>

            {imageUrl ? (
              <div className="relative group rounded-2xl overflow-hidden border border-base-300 bg-base-200/50 aspect-square flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={() =>
                    setImageViewer({
                      isOpen: true,
                      src: imageUrl,
                      title: name,
                    })
                  }
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-semibold text-xs"
                >
                  <Maximize2 className="size-4" />
                  <span>Expand Visual</span>
                </button>
              </div>
            ) : (
              <div className="aspect-square rounded-2xl border-2 border-dashed border-base-300 bg-base-200/30 flex flex-col items-center justify-center gap-2 text-base-content/40 p-4 text-center">
                <Layers className="size-10" />
                <span className="text-xs font-medium">No visual media uploaded</span>
              </div>
            )}
          </div>

          {/* Parent Category Card */}
          <div className="p-6 rounded-3xl bg-base-100 border border-base-300 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-1.5">
                <FolderTree className="size-3.5 text-primary" />
                <span>Parent Category</span>
              </h4>
              {catId && (
                <Link
                  to={`/products/categories/${catId}`}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>View</span>
                  <ExternalLink className="size-3" />
                </Link>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300 space-y-2">
              <span className="text-sm font-bold text-base-content block">
                {catName}
              </span>
              <div className="flex items-center gap-2">
                {catCode && (
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-base-100 border border-base-300 text-base-content/70">
                    {catCode}
                  </span>
                )}
                {catId && (
                  <span className="text-xs text-base-content/50">
                    Category ID #{catId}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Core Specs & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details Card */}
          <div className="p-6 rounded-3xl bg-base-100 border border-base-300 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-base-200 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/50 block">
                  Classification Name
                </span>
                <h2 className="text-xl font-black text-base-content mt-0.5">
                  {name}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {isActive ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5" />
                    <span>Active in Catalog</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20 flex items-center gap-1.5">
                    <AlertCircle className="size-3.5" />
                    <span>Hidden / Inactive</span>
                  </span>
                )}
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Code */}
              <div className="p-4 rounded-2xl bg-base-200/40 border border-base-300 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-medium text-base-content/50 block">
                    Subcategory Code
                  </span>
                  <span className="text-sm font-mono font-bold text-base-content mt-0.5 block tracking-wider">
                    {code}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg border border-base-300 hover:bg-base-200 text-base-content/60 hover:text-base-content transition-colors cursor-pointer"
                  title="Copy code"
                >
                  {copied ? (
                    <Check className="size-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </button>
              </div>

              {/* Display Order */}
              <div className="p-4 rounded-2xl bg-base-200/40 border border-base-300">
                <span className="text-[11px] font-medium text-base-content/50 block">
                  Sequence Order
                </span>
                <span className="text-sm font-bold text-base-content mt-0.5 block">
                  Priority #{displayOrder}
                </span>
              </div>

              {/* Company */}
              <div className="p-4 rounded-2xl bg-base-200/40 border border-base-300">
                <span className="text-[11px] font-medium text-base-content/50 block">
                  Company Tenant
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Building className="size-3.5 text-base-content/40" />
                  <span className="text-xs font-bold text-base-content truncate">
                    {companyName || "Pooja Fashion"}
                  </span>
                  {companyCode && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-base-200 text-base-content/70">
                      {companyCode}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/60">
                Subcategory Scope & Description
              </h4>
              <div className="p-5 rounded-2xl bg-base-200/30 border border-base-300 text-xs sm:text-sm text-base-content/80 leading-relaxed">
                {subcategory.description || (
                  <span className="italic text-base-content/40">
                    No description entered for this subcategory yet.
                  </span>
                )}
              </div>
            </div>

            {/* Audit Metadata */}
            <div className="pt-4 border-t border-base-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-base-content/60">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-base-content/40" />
                <span>
                  Created:{" "}
                  <strong className="text-base-content">
                    {subcategory.createdAt || subcategory.created_at
                      ? new Date(
                          subcategory.createdAt || subcategory.created_at
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-base-content/40" />
                <span>
                  Last Updated:{" "}
                  <strong className="text-base-content">
                    {subcategory.updatedAt || subcategory.updated_at
                      ? new Date(
                          subcategory.updatedAt || subcategory.updated_at
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Linked Products Section */}
          <div className="p-6 rounded-3xl bg-base-100 border border-base-300 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-1.5">
                <Package className="size-4 text-primary" />
                <span>Linked Catalog Products</span>
              </h4>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-lg bg-base-200 text-base-content/70">
                0 Products Assigned
              </span>
            </div>

            <div className="p-8 rounded-2xl border-2 border-dashed border-base-300 bg-base-200/20 text-center space-y-2">
              <p className="text-xs font-medium text-base-content/60">
                No products are currently classified directly under this subcategory.
              </p>
              <p className="text-[11px] text-base-content/40">
                Products created with this subcategory will appear here automatically.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SubCategoryFormModal
        isOpen={isEditOpen}
        mode="edit"
        initialData={subcategory}
        saving={updateMutation.isPending}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <SubCategoryDeleteModal
        isOpen={isDeleteOpen}
        subcategory={subcategory}
        isDeleting={deleteMutation.isPending}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      <ImageViewerModal
        isOpen={imageViewer.isOpen}
        src={imageViewer.src}
        title={imageViewer.title}
        subtitle="Subcategory High-Resolution Preview"
        onClose={() => setImageViewer({ isOpen: false, src: "", title: "" })}
      />
    </div>
  );
}
