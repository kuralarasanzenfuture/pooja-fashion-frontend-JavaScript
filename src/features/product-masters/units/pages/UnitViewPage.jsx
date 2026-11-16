import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft,
  Scale,
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
import {
  useUnit,
  useUpdateUnit,
  useUpdateUnitStatus,
  useDeleteUnit,
} from "../hooks/useUnits.js";
import UnitThumb from "../components/UnitThumb.jsx";
import UnitFormModal from "../components/UnitFormModal.jsx";
import UnitDeleteModal from "../components/UnitDeleteModal.jsx";

export default function UnitViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: unitResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useUnit(id);

  const updateMutation = useUpdateUnit();
  const updateStatusMutation = useUpdateUnitStatus();
  const deleteMutation = useDeleteUnit();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [notification, setNotification] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const unit = unitResponse?.data || unitResponse || null;

  const handleCopyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleToggleStatus = async () => {
    if (!unit) return;
    const current = Boolean(
      unit.isActive !== undefined ? unit.isActive : unit.is_active
    );
    try {
      await updateStatusMutation.mutateAsync({
        id: unit.id,
        is_active: !current,
      });
      showNotification("success", `Unit marked as ${!current ? "Active" : "Inactive"}.`);
      refetch();
    } catch (err) {
      showNotification("error", err.response?.data?.message || "Failed to update status.");
    }
  };

  const handleEditSubmit = async ({ values }) => {
    if (!unit) return;
    setSaving(true);
    try {
      await updateMutation.mutateAsync({
        id: unit.id,
        data: values,
      });
      showNotification("success", "Unit updated successfully.");
      setIsEditOpen(false);
      refetch();
    } catch (err) {
      showNotification("error", err.response?.data?.message || "Failed to update unit.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!unit) return;
    setDeleting(true);
    try {
      await deleteMutation.mutateAsync(unit.id);
      showNotification("success", "Unit deleted successfully.");
      navigate("/products/units");
    } catch (err) {
      showNotification("error", err.response?.data?.message || "Failed to delete unit.");
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

  if (isError || !unit) {
    return (
      <div className="space-y-6 pb-12">
        <Link
          to="/products/units"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Units</span>
        </Link>
        <div className="p-8 rounded-3xl border border-rose-500/20 bg-rose-500/5 text-center">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
          <h2 className="text-base font-bold text-base-content">Unit Record Not Found</h2>
          <p className="text-xs text-base-content/60 mt-1">
            {error?.response?.data?.message || "The requested unit does not exist or has been removed."}
          </p>
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/products/units")}>
              Return to Catalog
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const name = unit.unitName || unit.unit_name || "Unnamed Unit";
  const code = unit.unitCode || unit.unit_code || "—";
  const decimals = unit.decimalPlaces !== undefined ? unit.decimalPlaces : unit.decimal_places ?? 0;
  const companyName = unit.companyName || unit.company_name || "Pooja Fashion";
  const isActive = Boolean(
    unit.isActive !== undefined ? unit.isActive : unit.is_active
  );
  const createdAt = unit.createdAt || unit.created_at;
  const updatedAt = unit.updatedAt || unit.updated_at;

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

      {/* Back link */}
      <div>
        <Link
          to="/products/units"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-base-content/60 hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Units Master</span>
        </Link>
      </div>

      {/* Page Header */}
      <PageHeader
        title={name}
        description={`Unit Code: ${code} • Precision: ${decimals} decimal places`}
        actions={
          <div className="flex items-center gap-2">
            <div className="tooltip tooltip-bottom" data-tip="Refresh Unit">
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
              Edit Unit
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
        }
      />

      {/* Hero Showcase Card */}
      <div className="rounded-3xl border border-base-300 bg-base-100 overflow-hidden shadow-xs">
        <div className="p-6 bg-gradient-to-r from-primary/10 via-base-100 to-blue-500/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <UnitThumb name={name} code={code} size="xl" />
            <div>
              <h2 className="text-xl sm:text-3xl font-black text-base-content tracking-tight">
                {name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/20">
                  {code}
                </span>
                <span className="text-xs text-base-content/50">•</span>
                <span className="text-xs text-base-content/60 font-mono font-medium">
                  {decimals} decimals (e.g. {(1).toFixed(decimals)})
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
                  Unit Name
                </span>
                <span className="text-sm font-black text-base-content mt-1 block">
                  {name}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-base-200/40 border border-base-300/60 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-base-content/50 font-bold uppercase block">
                    Unit Code
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
                  Decimal Precision
                </span>
                <p className="text-xs sm:text-sm text-base-content/80 leading-relaxed font-mono">
                  Quantities measured in <strong>{code}</strong> allow up to <strong>{decimals}</strong> decimal {decimals === 1 ? "place" : "places"} (e.g. {(25.75).toFixed(decimals)} {code}).
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
      <UnitFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={unit}
        isEdit={true}
        isLoading={saving}
      />

      {/* Delete Modal */}
      <UnitDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        unit={unit}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleting}
      />
    </div>
  );
}

