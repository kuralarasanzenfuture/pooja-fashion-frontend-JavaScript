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
  Sparkles,
} from "lucide-react";
import PageHeader from "../../../../common/components/PageHeader.jsx";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import {
  useSizeGroup,
  useUpdateSizeGroup,
  useUpdateSizeGroupStatus,
  useDeleteSizeGroup,
} from "../hooks/useSizeGroups.js";
import SizeGroupThumb from "../components/SizeGroupThumb.jsx";
import SizeGroupFormModal from "../components/SizeGroupFormModal.jsx";
import SizeGroupDeleteModal from "../components/SizeGroupDeleteModal.jsx";
import { formatSizeGroupName } from "../utils/sizeGroupHelper.js";

export default function SizeGroupViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: sizeGroupResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useSizeGroup(id);

  const updateMutation = useUpdateSizeGroup();
  const updateStatusMutation = useUpdateSizeGroupStatus();
  const deleteMutation = useDeleteSizeGroup();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notification, setNotification] = useState(null);
  const [saving, setSaving] = useState(false);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const sizeGroup = sizeGroupResponse?.data || sizeGroupResponse || null;

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

  if (isError || !sizeGroup) {
    return (
      <div className="space-y-6 pb-12">
        <Link
          to="/products/size-groups"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Size Groups</span>
        </Link>
        <div className="p-8 rounded-3xl border border-rose-500/20 bg-rose-500/5 text-center">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
          <h2 className="text-base font-bold text-base-content">Size Group Not Found</h2>
          <p className="text-xs text-base-content/60 mt-1">
            {error?.response?.data?.message || "The requested size group record does not exist or has been removed."}
          </p>
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/products/size-groups")}>
              Return to Catalog
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const name = formatSizeGroupName(sizeGroup.sizeGroupName || sizeGroup.size_group_name);
  const code = sizeGroup.sizeGroupCode || sizeGroup.size_group_code;
  const isActive =
    sizeGroup.isActive !== undefined ? sizeGroup.isActive : Boolean(sizeGroup.is_active);
  const desc = sizeGroup.description;
  const companyName = sizeGroup.companyName || sizeGroup.company_name || "Pooja Fashion";
  const companyCode = sizeGroup.companyCode || sizeGroup.company_code;
  const createdAt = sizeGroup.createdAt || sizeGroup.created_at;
  const updatedAt = sizeGroup.updatedAt || sizeGroup.updated_at;
  const childSizes = Array.isArray(sizeGroup.sizes) ? sizeGroup.sizes : [];

  const handleCopyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleStatus = async () => {
    const nextStatus = !isActive;
    try {
      await updateStatusMutation.mutateAsync({ id: sizeGroup.id, isActive: nextStatus });
      showNotification("success", `Size group status set to ${nextStatus ? "Active" : "Inactive"}`);
      refetch();
    } catch (err) {
      showNotification("error", err.response?.data?.message || "Failed to update size group status");
    }
  };

  const handleEditSubmit = async ({ values }) => {
    setSaving(true);
    try {
      const payload = {
        company_id: Number(values.company_id || sizeGroup.companyId || sizeGroup.company_id),
        size_group_name: values.size_group_name,
        size_group_code: values.size_group_code || undefined,
        description: values.description || null,
        is_active: values.is_active,
      };

      await updateMutation.mutateAsync({ id: sizeGroup.id, data: payload });
      showNotification("success", "Size group updated successfully");
      setIsEditOpen(false);
      refetch();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update size group";
      showNotification("error", msg);
      return { errors: { size_group_name: msg } };
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(sizeGroup.id);
      showNotification("success", `Size group "${name}" deleted`);
      navigate("/products/size-groups");
    } catch (err) {
      showNotification("error", err.response?.data?.message || "Failed to delete size group");
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

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-base-content/60">
        <Link to="/products/size-groups" className="hover:text-primary transition-colors flex items-center gap-1">
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Size Groups Master</span>
        </Link>
        <span>/</span>
        <span className="text-base-content">{name}</span>
      </div>

      {/* Page Header */}
      <PageHeader
        title={name}
        description={`Master size group record #${sizeGroup.id} for sizing classification.`}
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
              Edit Size Group
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
          <SizeGroupThumb
            name={name}
            code={code}
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

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-base-200 text-xs font-bold text-base-content/70 border border-base-300">
                <Layers className="w-3.5 h-3.5 text-primary" />
                <span>
                  {childSizes.length > 0
                    ? `${childSizes.length} Child ${childSizes.length === 1 ? "Size" : "Sizes"}`
                    : "No Sizes Configured"}
                </span>
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
              {isActive ? "Deactivate Group" : "Activate Group"}
            </Button>
          </div>
        </div>
      </div>

      {/* Grid: Metadata Details & Child Sizes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metadata Details */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-6 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60 border-b border-base-200 pb-2">
            Group Metadata
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
              <span className="text-base-content/50 block">System Code</span>
              <span className="font-mono font-bold text-base-content mt-0.5 block">
                {code || "—"}
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

        {/* Description & Child Sizes Panel */}
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60 border-b border-base-200 pb-2 mb-4">
              Group Description & Apparel Scope
            </h3>

            {desc ? (
              <p className="text-sm text-base-content/80 leading-relaxed whitespace-pre-wrap">
                {desc}
              </p>
            ) : (
              <div className="p-6 rounded-2xl bg-base-200/40 border border-base-300/60 text-center text-xs text-base-content/50">
                No description provided for this size group. Click "Edit Size Group" to add sizing notes or classification guidelines.
              </div>
            )}
          </div>

          {/* Configured Child Sizes */}
          <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-base-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/70">
                  Configured Child Sizes ({childSizes.length})
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-base-content/50">
                Sorted by sequence
              </span>
            </div>

            {childSizes.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {childSizes.map((sz, idx) => (
                  <div
                    key={sz.id || sz.size_code || idx}
                    className="p-3 rounded-2xl border border-base-300 bg-base-200/30 flex items-center justify-between hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-black text-base-content tracking-tight">
                        {sz.size_name || sz.name || sz.size_code}
                      </div>
                      <div className="text-[11px] font-mono text-base-content/50">
                        {sz.size_code || `Code #${idx + 1}`}
                      </div>
                    </div>
                    {sz.display_order !== undefined && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-base-300 text-base-content/60">
                        #{sz.display_order}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-base-200/30 border border-base-300/60 text-center">
                <Sparkles className="w-8 h-8 text-primary/40 mx-auto mb-2" />
                <p className="text-xs font-bold text-base-content">No Child Sizes Assigned Yet</p>
                <p className="text-[11px] text-base-content/60 mt-1 max-w-sm mx-auto">
                  Child sizes (e.g., S, M, L, XL, 38, 40) under this group will appear here once configured in the Sizes Master.
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-base-200 mt-6 flex items-center justify-between">
              <span className="text-xs text-base-content/50">
                Want to manage individual product sizes?
              </span>
              <Button
                variant="outline"
                size="xs"
                icon={ArrowRight}
                onClick={() => navigate("/products/size-groups")}
              >
                Back to Size Groups
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <SizeGroupFormModal
        isOpen={isEditOpen}
        mode="edit"
        initialData={sizeGroup}
        saving={saving}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditSubmit}
      />

      {/* Delete Modal */}
      <SizeGroupDeleteModal
        isOpen={isDeleteOpen}
        sizeGroup={sizeGroup}
        isDeleting={deleteMutation.isPending}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

