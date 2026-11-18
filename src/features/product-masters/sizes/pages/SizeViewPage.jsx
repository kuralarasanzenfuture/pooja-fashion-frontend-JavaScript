import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft,
  Ruler,
  Edit2,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  Calendar,
  Building,
  CheckCircle2,
  AlertCircle,
  Layers,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import PageHeader from "../../../../common/components/PageHeader.jsx";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { toast } from "../../../../common/components/toast/index.js";
import {
  useSize,
  useUpdateSize,
  useUpdateSizeStatus,
  useDeleteSize,
} from "../hooks/useSizes.js";
import SizeThumb from "../components/SizeThumb.jsx";
import SizeFormModal from "../components/SizeFormModal.jsx";
import SizeDeleteModal from "../components/SizeDeleteModal.jsx";
import { formatSizeName } from "../utils/sizeHelper.js";

export default function SizeViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: sizeResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useSize(id);

  const updateMutation = useUpdateSize();
  const updateStatusMutation = useUpdateSizeStatus();
  const deleteMutation = useDeleteSize();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const showNotification = (type, message) => {
    if (type === "success") toast.success(message);
    else if (type === "error") toast.error(message);
    else if (type === "warning") toast.warning(message);
    else toast.help(message);
  };

  const size = sizeResponse?.data || sizeResponse || null;

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12 animate-pulse">
        <div className="h-8 w-48 bg-base-300 rounded-lg" />
        <div className="h-44 w-full bg-base-200 rounded-3xl border border-base-300" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-72 bg-base-200 rounded-3xl border border-base-300" />
          <div className="md:col-span-2 h-72 bg-base-200 rounded-3xl border border-base-300" />
        </div>
      </div>
    );
  }

  if (isError || !size) {
    return (
      <div className="space-y-6 pb-12">
        <Link
          to="/products/sizes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Sizes</span>
        </Link>
        <div className="p-8 rounded-3xl border border-rose-500/20 bg-rose-500/5 text-center">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
          <h2 className="text-base font-bold text-base-content">Size Record Not Found</h2>
          <p className="text-xs text-base-content/60 mt-1">
            {error?.response?.data?.message || "The requested size record does not exist or has been removed."}
          </p>
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/products/sizes")}>
              Return to Catalog
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const name = formatSizeName(size.sizeName || size.size_name);
  const code = size.sizeCode || size.size_code;
  const groupName = size.sizeGroupName || size.size_group_name || "—";
  const groupId = size.sizeGroupId || size.size_group_id;
  const displayOrder = size.displayOrder ?? size.display_order ?? 0;
  const isActive =
    size.isActive !== undefined ? size.isActive : Boolean(size.is_active);
  const companyName = size.companyName || size.company_name || "Pooja Fashion";
  const companyCode = size.companyCode || size.company_code;
  const createdAt = size.createdAt || size.created_at;
  const updatedAt = size.updatedAt || size.updated_at;

  const handleCopyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleStatus = async () => {
    const nextStatus = !isActive;
    try {
      await updateStatusMutation.mutateAsync({ id: size.id, isActive: nextStatus });
      showNotification("success", `Size status set to ${nextStatus ? "Active" : "Inactive"}`);
      refetch();
    } catch (err) {
      showNotification("error", err.response?.data?.message || "Failed to update size status");
    }
  };

  const handleEditSubmit = async ({ values }) => {
    setSaving(true);
    try {
      const payload = {
        company_id: Number(values.company_id || size.companyId || size.company_id),
        size_group_id: Number(values.size_group_id || size.sizeGroupId || size.size_group_id),
        size_name: values.size_name,
        size_code: values.size_code || undefined,
        display_order: Number(values.display_order ?? 0),
        is_active: values.is_active,
      };

      await updateMutation.mutateAsync({ id: size.id, data: payload });
      showNotification("success", "Size updated successfully");
      setIsEditOpen(false);
      refetch();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update size";
      showNotification("error", msg);
      return { errors: { size_name: msg } };
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(size.id);
      showNotification("success", `Size "${name}" deleted`);
      navigate("/products/sizes");
    } catch (err) {
      showNotification("error", err.response?.data?.message || "Failed to delete size");
      setIsDeleteOpen(false);
    }
  };

  const fmtDate = (iso) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleDateString("en-IN", {
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
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-base-content/60">
        <Link to="/products/sizes" className="hover:text-primary transition-colors flex items-center gap-1">
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Sizes Master</span>
        </Link>
        <span>/</span>
        <span className="text-base-content">{name}</span>
      </div>

      {/* Page Header */}
      <PageHeader
        title={name}
        description={`Master size record #${size.id} belonging to group "${groupName}".`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={() => refetch()}
              loading={isFetching && !isLoading}
            />
            <Button
              variant="outline"
              size="sm"
              icon={Edit2}
              onClick={() => setIsEditOpen(true)}
            >
              Edit Size
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={Trash2}
              onClick={() => setIsDeleteOpen(true)}
              className="text-rose-600 hover:bg-rose-50 border-rose-200"
            >
              Delete
            </Button>
          </div>
        }
      />

      {/* Hero Overview Card */}
      <div className="rounded-3xl border border-base-300 bg-base-100 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <SizeThumb
            code={code}
            name={name}
            size="xl"
            className="shrink-0"
          />

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
                {name}
              </h2>

              {/* Exact Toggle Switch matching user requirements */}
              <div className="inline-flex items-center gap-2 bg-base-200/50 px-3 py-1.5 rounded-2xl border border-base-300">
                <input
                  type="checkbox"
                  className="toggle toggle-success toggle-sm"
                  checked={isActive}
                  onChange={handleToggleStatus}
                  disabled={updateStatusMutation.isPending}
                />
                <span
                  className={
                    isActive
                      ? "px-2 py-0.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "px-2 py-0.5 rounded-lg text-xs font-semibold bg-base-200 text-base-content/50 border border-base-300"
                  }
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              {code && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-base-200 font-mono text-xs font-bold text-base-content/80 border border-base-300">
                  <span>{code}</span>
                  <div className="tooltip tooltip-top" data-tip={copied ? "Copied code!" : "Copy code"}>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="text-base-content/40 hover:text-primary transition-colors cursor-pointer"
                      aria-label="Copy code"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              {groupId && (
                <Link
                  to={`/products/size-groups/${groupId}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 text-xs font-bold transition-colors"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Group: {groupName}</span>
                </Link>
              )}

              <span className="inline-flex items-center px-3 py-1 rounded-xl bg-base-200 font-mono text-xs font-bold text-base-content/70 border border-base-300">
                Display Order #{displayOrder}
              </span>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-base-200 text-xs font-bold text-base-content/70 border border-base-300">
                <Building className="w-3.5 h-3.5 text-base-content/40" />
                <span>{companyName}</span>
              </div>
            </div>
          </div>

          <div className="sm:self-center shrink-0">
            <Button
              variant={isActive ? "outline" : "clip-six"}
              size="sm"
              onClick={handleToggleStatus}
              loading={updateStatusMutation.isPending}
            >
              {isActive ? "Deactivate Size" : "Activate Size"}
            </Button>
          </div>
        </div>
      </div>

      {/* Grid: Metadata Details & Catalog Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metadata Details */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-6 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60 border-b border-base-200 pb-2">
            Size Specifications
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-base-content/50 block">Company</span>
              <div className="flex items-center gap-1.5 font-bold text-base-content mt-0.5">
                <Building className="w-3.5 h-3.5 text-base-content/40" />
                <span>{companyName}</span>
                {companyCode && (
                  <span className="font-mono text-[10px] text-base-content/50">({companyCode})</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-base-content/50 block">Parent Size Group</span>
              <div className="flex items-center gap-1.5 font-bold text-primary mt-0.5">
                <Layers className="w-3.5 h-3.5" />
                <span>{groupName}</span>
              </div>
            </div>

            <div>
              <span className="text-base-content/50 block">Display Sequence Position</span>
              <span className="font-mono font-bold text-base-content mt-0.5 block">
                #{displayOrder}
              </span>
            </div>

            <div>
              <span className="text-base-content/50 block">Created At</span>
              <div className="flex items-center gap-1.5 font-medium text-base-content/80 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-base-content/40" />
                <span>{fmtDate(createdAt)}</span>
              </div>
            </div>

            <div>
              <span className="text-base-content/50 block">Last Updated</span>
              <div className="flex items-center gap-1.5 font-medium text-base-content/80 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-base-content/40" />
                <span>{fmtDate(updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Catalog Scope & Variant Integration Panel */}
        <div className="md:col-span-2 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60 border-b border-base-200 pb-2">
              Catalog & Inventory Application
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-base-200/40 border border-base-300">
                <div className="flex items-center gap-2 text-primary font-bold text-xs mb-1">
                  <Ruler className="w-4 h-4" />
                  <span>Product Variants</span>
                </div>
                <p className="text-xs text-base-content/70">
                  This size token ({code || name}) can be assigned when defining SKU variants across shirts, trousers, sarees, footwear, or accessories.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-base-200/40 border border-base-300">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Barcode Generation</span>
                </div>
                <p className="text-xs text-base-content/70">
                  Barcodes printed for garments in this size will reflect code "{code || name}" for quick barcode scanning during retail checkout.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-base-200 mt-6 flex items-center justify-between">
            <span className="text-xs text-base-content/50">
              Need to see parent size classification group?
            </span>
            <Button
              variant="outline"
              size="xs"
              icon={ArrowRight}
              onClick={() => {
                if (groupId) {
                  navigate(`/products/size-groups/${groupId}`);
                } else {
                  navigate("/products/size-groups");
                }
              }}
            >
              View Size Group
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <SizeFormModal
        isOpen={isEditOpen}
        mode="edit"
        initialData={size}
        saving={saving}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditSubmit}
      />

      {/* Delete Modal */}
      <SizeDeleteModal
        isOpen={isDeleteOpen}
        size={size}
        isDeleting={deleteMutation.isPending}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

