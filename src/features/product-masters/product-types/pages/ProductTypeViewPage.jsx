import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft,
  Tag,
  Edit2,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  Calendar,
  Building,
  CheckCircle2,
  AlertCircle,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";
import PageHeader from "../../../../common/components/PageHeader.jsx";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { toast } from "../../../../common/components/toast/index.js";
import {
  useProductType,
  useUpdateProductType,
  useUpdateProductTypeStatus,
  useDeleteProductType,
} from "../hooks/useProductTypes.js";
import ProductTypeThumb from "../components/ProductTypeThumb.jsx";
import ProductTypeFormModal from "../components/ProductTypeFormModal.jsx";
import ProductTypeDeleteModal from "../components/ProductTypeDeleteModal.jsx";
import { ROUTES } from "../../../../constants/routes.js";

export default function ProductTypeViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: productTypeResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useProductType(id);

  const updateMutation = useUpdateProductType();
  const updateStatusMutation = useUpdateProductTypeStatus();
  const deleteMutation = useDeleteProductType();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const showNotification = (type, message) => {
    if (type === "success") toast.success(message);
    else if (type === "error") toast.error(message);
    else if (type === "warning") toast.warning(message);
    else toast.help(message);
  };

  const productType = productTypeResponse?.data || productTypeResponse || null;

  const handleCopyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleToggleStatus = async () => {
    if (!productType) return;
    const current = Boolean(
      productType.isActive !== undefined ? productType.isActive : productType.is_active
    );
    try {
      await updateStatusMutation.mutateAsync({
        id: productType.id,
        is_active: !current,
      });
      showNotification("success", `Product type marked as ${!current ? "Active" : "Inactive"}.`);
      refetch();
    } catch (err) {
      showNotification("error", err.response?.data?.message || "Failed to update status.");
    }
  };

  const handleEditSubmit = async ({ values }) => {
    if (!productType) return;
    setSaving(true);
    try {
      await updateMutation.mutateAsync({
        id: productType.id,
        data: values,
      });
      showNotification("success", "Product type updated successfully.");
      setIsEditOpen(false);
      refetch();
    } catch (err) {
      showNotification("error", err.response?.data?.message || "Failed to update product type.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!productType) return;
    setDeleting(true);
    try {
      await deleteMutation.mutateAsync(productType.id);
      showNotification("success", "Product type deleted successfully.");
      navigate(ROUTES.PRODUCT_TYPES || "/products/types", { replace: true });
    } catch (err) {
      showNotification(
        "error",
        err.response?.data?.message || "Cannot delete product type referenced by products."
      );
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-base-200 rounded w-48" />
        <div className="h-64 bg-base-200 rounded-3xl" />
      </div>
    );
  }

  if (isError || !productType) {
    return (
      <div className="p-8 max-w-md mx-auto text-center space-y-4">
        <div className="w-12 h-12 bg-rose-500/10 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-base-content">Product Type Not Found</h2>
        <p className="text-xs text-base-content/60">
          {error?.message || "The requested product type does not exist or has been removed."}
        </p>
        <Link
          to={ROUTES.PRODUCT_TYPES || "/products/types"}
          className="btn btn-outline btn-sm rounded-xl gap-2 inline-flex"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Product Types
        </Link>
      </div>
    );
  }

  const name = productType.typeName || productType.type_name || "Unnamed Type";
  const code = productType.typeCode || productType.type_code;
  const description = productType.description;
  const companyName = productType.companyName || productType.company_name || "Pooja Fashion";
  const isStockItem = productType.isStockItem !== undefined ? Boolean(productType.isStockItem) : Boolean(productType.is_stock_item);
  const isSaleable = productType.isSaleable !== undefined ? Boolean(productType.isSaleable) : Boolean(productType.is_saleable);
  const isPurchasable = productType.isPurchasable !== undefined ? Boolean(productType.isPurchasable) : Boolean(productType.is_purchasable);
  const isActive = Boolean(
    productType.isActive !== undefined ? productType.isActive : productType.is_active
  );

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to={ROUTES.PRODUCT_TYPES || "/products/types"}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-base-content/60 hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Product Types
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={() => refetch()}
            loading={isFetching}
          />
          <Button
            variant="outline"
            size="sm"
            icon={Edit2}
            onClick={() => setIsEditOpen(true)}
          >
            Edit
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

      {/* Main Profile Header Card */}
      <div className="bg-base-100 rounded-3xl border border-base-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <ProductTypeThumb name={name} code={code} size="lg" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-base-content tracking-tight">
                  {name}
                </h1>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-base-200 text-base-content/70 border border-base-300">
                  ID #{productType.id}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                  }`}
                >
                  {isActive ? "Active in Catalog" : "Inactive"}
                </span>
              </div>
              <p className="text-xs text-base-content/60 mt-1">
                Product Classification Master • {companyName}
              </p>
            </div>
          </div>

          {/* Quick Toggle Status */}
          <button
            type="button"
            onClick={handleToggleStatus}
            className={`btn btn-sm rounded-xl font-semibold gap-1.5 ${
              isActive
                ? "btn-outline border-rose-500/30 text-rose-600 hover:bg-rose-500/10"
                : "btn-outline border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
            }`}
          >
            {isActive ? "Deactivate Type" : "Activate Type"}
          </button>
        </div>

        {/* Identity & Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-base-200">
          {/* Type Code */}
          <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300">
            <span className="text-[11px] font-bold uppercase text-base-content/50 block">
              Type Code
            </span>
            <div className="flex items-center justify-between gap-2 mt-1">
              <span className="text-sm font-mono font-bold text-primary">
                {code || "—"}
              </span>
              {code && (
                <div
                  className="tooltip tooltip-top"
                  data-tip={copiedKey === "view-code" ? "Copied code!" : "Copy code"}
                >
                  <button
                    type="button"
                    onClick={() => handleCopyText(code, "view-code")}
                    className="p-1 hover:bg-base-300 rounded text-base-content/40 hover:text-primary transition-colors cursor-pointer"
                    aria-label="Copy code"
                  >
                    {copiedKey === "view-code" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stock Tracking Flag */}
          <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300">
            <span className="text-[11px] font-bold uppercase text-base-content/50 block">
              Stock Inventory
            </span>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-sm">
              <Package className={`w-4 h-4 ${isStockItem ? "text-indigo-600" : "text-base-content/40"}`} />
              <span className={isStockItem ? "text-indigo-600" : "text-base-content/50"}>
                {isStockItem ? "Tracked in Stock" : "Non-Stock Item"}
              </span>
            </div>
          </div>

          {/* Saleable Flag */}
          <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300">
            <span className="text-[11px] font-bold uppercase text-base-content/50 block">
              POS Billing
            </span>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-sm">
              <ShoppingBag className={`w-4 h-4 ${isSaleable ? "text-emerald-600" : "text-base-content/40"}`} />
              <span className={isSaleable ? "text-emerald-600" : "text-base-content/50"}>
                {isSaleable ? "Saleable on POS" : "Not Saleable"}
              </span>
            </div>
          </div>

          {/* Purchasable Flag */}
          <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300">
            <span className="text-[11px] font-bold uppercase text-base-content/50 block">
              Purchases / Inward
            </span>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-sm">
              <Truck className={`w-4 h-4 ${isPurchasable ? "text-amber-600" : "text-base-content/40"}`} />
              <span className={isPurchasable ? "text-amber-600" : "text-base-content/50"}>
                {isPurchasable ? "Purchasable" : "Not Purchasable"}
              </span>
            </div>
          </div>
        </div>

        {/* Description / Usage section */}
        {description && (
          <div className="p-5 rounded-2xl bg-base-200/30 border border-base-300 space-y-1">
            <span className="text-[11px] font-bold uppercase text-base-content/50 block">
              Usage & Description
            </span>
            <p className="text-xs sm:text-sm text-base-content/80 leading-relaxed whitespace-pre-wrap">
              {description}
            </p>
          </div>
        )}

        {/* "Why these settings?" Guidance Card */}
        <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-2.5">
          <span className="text-xs font-black text-base-content uppercase tracking-wider block">
            Why these settings?
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-base-content/80">
            <div className="p-3 rounded-xl bg-base-100 border border-base-200">
              <strong className="text-base-content font-mono font-bold">is_stock_item:</strong> Whether the product needs inventory tracking.
            </div>
            <div className="p-3 rounded-xl bg-base-100 border border-base-200">
              <strong className="text-base-content font-mono font-bold">is_saleable:</strong> Whether you can sell it to customers.
            </div>
            <div className="p-3 rounded-xl bg-base-100 border border-base-200">
              <strong className="text-base-content font-mono font-bold">is_purchasable:</strong> Whether you can purchase it from suppliers.
            </div>
            <div className="p-3 rounded-xl bg-base-100 border border-base-200">
              <strong className="text-base-content font-mono font-bold text-primary">SERVICE:</strong> No physical stock, but it can be sold to customers. For example, stitching or alteration charges.
            </div>
          </div>
        </div>

        {/* Company & Audit History */}
        <div className="p-5 rounded-2xl bg-base-200/40 border border-base-300 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-base-content/50 block uppercase text-[10px] font-bold">
              Company Scope
            </span>
            <span className="font-semibold text-base-content mt-1 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-primary" /> {companyName}
            </span>
          </div>

          <div>
            <span className="text-base-content/50 block uppercase text-[10px] font-bold">
              Created At
            </span>
            <span className="font-mono text-base-content/80 mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-base-content/40" />
              {productType.createdAt ? new Date(productType.createdAt).toLocaleString() : "—"}
            </span>
          </div>

          <div>
            <span className="text-base-content/50 block uppercase text-[10px] font-bold">
              Last Updated
            </span>
            <span className="font-mono text-base-content/80 mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-base-content/40" />
              {productType.updatedAt ? new Date(productType.updatedAt).toLocaleString() : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Form Modal */}
      <ProductTypeFormModal
        open={isEditOpen}
        mode="edit"
        isEdit={true}
        initialData={productType}
        saving={saving}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditSubmit}
      />

      {/* Delete Confirmation Modal */}
      <ProductTypeDeleteModal
        isOpen={isDeleteOpen}
        productType={productType}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleting}
      />
    </div>
  );
}

