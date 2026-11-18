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
} from "lucide-react";
import PageHeader from "../../../../common/components/PageHeader.jsx";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { toast } from "../../../../common/components/toast/index.js";
import {
  useMaterial,
  useUpdateMaterial,
  useUpdateMaterialStatus,
  useDeleteMaterial,
} from "../hooks/useMaterials.js";
import MaterialThumb from "../components/MaterialThumb.jsx";
import MaterialFormModal from "../components/MaterialFormModal.jsx";
import MaterialDeleteModal from "../components/MaterialDeleteModal.jsx";

export default function MaterialViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: materialResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useMaterial(id);

  const updateMutation = useUpdateMaterial();
  const updateStatusMutation = useUpdateMaterialStatus();
  const deleteMutation = useDeleteMaterial();

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

  const material = materialResponse?.data || materialResponse || null;

  const handleCopyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleToggleStatus = async () => {
    if (!material) return;
    const current = Boolean(
      material.isActive !== undefined ? material.isActive : material.is_active
    );
    try {
      await updateStatusMutation.mutateAsync({
        id: material.id,
        is_active: !current,
      });
      showNotification("success", `Material marked as ${!current ? "Active" : "Inactive"}.`);
      refetch();
    } catch (err) {
      showNotification("error", err.response?.data?.message || "Failed to update status.");
    }
  };

  const handleEditSubmit = async ({ values }) => {
    if (!material) return;
    setSaving(true);
    try {
      await updateMutation.mutateAsync({
        id: material.id,
        data: values,
      });
      showNotification("success", "Material updated successfully.");
      setIsEditOpen(false);
      refetch();
    } catch (err) {
      showNotification("error", err.response?.data?.message || "Failed to update material.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!material) return;
    setDeleting(true);
    try {
      await deleteMutation.mutateAsync(material.id);
      showNotification("success", "Material deleted successfully.");
      navigate("/products/materials");
    } catch (err) {
      showNotification("error", err.response?.data?.message || "Failed to delete material.");
      setDeleting(false);
    }
  };

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

  if (isError || !material) {
    return (
      <div className="space-y-6 pb-12">
        <Link
          to="/products/materials"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Materials</span>
        </Link>
        <div className="p-8 rounded-3xl border border-rose-500/20 bg-rose-500/5 text-center">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
          <h2 className="text-base font-bold text-base-content">Material Record Not Found</h2>
          <p className="text-xs text-base-content/60 mt-1">
            {error?.response?.data?.message || "The requested material does not exist or has been removed."}
          </p>
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/products/materials")}>
              Return to Catalog
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const name = material.materialName || material.material_name || "Unnamed Material";
  const code = material.materialCode || material.material_code || "—";
  const companyName = material.companyName || material.company_name || "Pooja Fashion";
  const desc = material.description;
  const isActive = Boolean(
    material.isActive !== undefined ? material.isActive : material.is_active
  );
  const createdAt = material.createdAt || material.created_at;
  const updatedAt = material.updatedAt || material.updated_at;

  return (
    <div className="space-y-6 pb-12">
      {/* Back link */}
      <div>
        <Link
          to="/products/materials"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-base-content/60 hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Materials Master</span>
        </Link>
      </div>

      {/* Page Header */}
      <PageHeader
        title={name}
        description={`Material Code: ${code} • Fabric Master Record`}
        actions={
          <div className="flex items-center gap-2">
            <div className="tooltip tooltip-bottom" data-tip="Refresh Material">
              <Button
                variant="outline"
                size="sm"
                icon={RefreshCw}
                onClick={() => refetch()}
                loading={isFetching}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={Edit2}
              onClick={() => setIsEditOpen(true)}
            >
              Edit Material
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
        }
      />

      {/* Hero Showcase Card */}
      <div className="rounded-3xl border border-base-300 bg-base-100 overflow-hidden shadow-xs">
        <div className="p-6 bg-gradient-to-r from-primary/10 via-base-100 to-indigo-500/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <MaterialThumb name={name} code={code} size="xl" />
            <div>
              <h2 className="text-xl sm:text-3xl font-black text-base-content tracking-tight">
                {name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/20">
                  {code}
                </span>
                <span className="text-xs text-base-content/50">•</span>
                <span className="text-xs text-base-content/60 font-medium">
                  Fabric Classification
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 select-none">
              <input
                type="checkbox"
                checked={isActive}
                onChange={handleToggleStatus}
                className="toggle toggle-success toggle-sm"
              />
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-bold border ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                    : "bg-rose-50 text-rose-700 border-rose-200/80"
                }`}
              >
                {isActive ? "Active in Catalog" : "Inactive / Archived"}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Company Context
            </h3>
            <div className="p-4 rounded-2xl bg-base-200/50 space-y-1">
              <span className="text-[11px] text-base-content/50 font-bold uppercase block">
                Target Company
              </span>
              <div className="flex items-center gap-2 text-sm font-bold text-base-content">
                <Building className="w-4 h-4 text-primary" />
                <span>{companyName}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-xs space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Identity & Configuration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-base-200/40 border border-base-300/60">
                <span className="text-[11px] text-base-content/50 font-bold uppercase block">
                  Material Name
                </span>
                <span className="text-sm font-black text-base-content mt-1 block">
                  {name}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-base-200/40 border border-base-300/60 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-base-content/50 font-bold uppercase block">
                    Material Code
                  </span>
                  <span className="font-mono font-bold text-sm text-primary mt-1 block">
                    {code}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyText(code, "code")}
                  className="p-1.5 rounded-xl hover:bg-base-200 text-base-content/60 hover:text-primary transition-colors"
                  title="Copy Code"
                >
                  {copiedKey === "code" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-base-200/40 border border-base-300/60 sm:col-span-2">
                <span className="text-[11px] text-base-content/50 font-bold uppercase block mb-1">
                  Description / Textile Notes
                </span>
                <p className="text-xs sm:text-sm text-base-content/80 leading-relaxed">
                  {desc || "No special retail notes configured for this material fabric."}
                </p>
              </div>
            </div>

            {/* Timestamps */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-[11px] text-base-content/50 border-t border-base-200">
              {createdAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Created: {new Date(createdAt).toLocaleString()}</span>
                </div>
              )}
              {updatedAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Last Updated: {new Date(updatedAt).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <MaterialFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={material}
        isEdit={true}
        isLoading={saving}
      />

      {/* Delete Modal */}
      <MaterialDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        material={material}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleting}
      />
    </div>
  );
}

