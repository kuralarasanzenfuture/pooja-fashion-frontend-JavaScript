import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft,
  Palette,
  Edit2,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  Calendar,
  Building,
  CheckCircle2,
  AlertCircle,
  Hash,
  Layers,
  Sparkles,
} from "lucide-react";
import PageHeader from "../../../../common/components/PageHeader.jsx";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { toast } from "../../../../common/components/toast/index.js";
import {
  useColor,
  useUpdateColor,
  useUpdateColorStatus,
  useDeleteColor,
} from "../hooks/useColors.js";
import ColorThumb from "../components/ColorThumb.jsx";
import ColorFormModal from "../components/ColorFormModal.jsx";
import ColorDeleteModal from "../components/ColorDeleteModal.jsx";
import {
  formatHexCode,
  hexToRgb,
  getContrastColor,
  isLightColor,
} from "../utils/colorHelper.js";

export default function ColorViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: colorResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useColor(id);

  const updateMutation = useUpdateColor();
  const updateStatusMutation = useUpdateColorStatus();
  const deleteMutation = useDeleteColor();

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

  const color = colorResponse?.data || colorResponse || null;

  const handleCopyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleToggleStatus = async () => {
    if (!color) return;
    const current = Boolean(color.isActive !== undefined ? color.isActive : color.is_active);
    try {
      await updateStatusMutation.mutateAsync({
        id: color.id,
        is_active: !current,
      });
      showNotification("success", `Color marked as ${!current ? "Active" : "Inactive"}.`);
      refetch();
    } catch (err) {
      showNotification("error", err.response?.data?.message || "Failed to update status.");
    }
  };

  const handleEditSubmit = async ({ values }) => {
    if (!color) return;
    setSaving(true);
    try {
      await updateMutation.mutateAsync({
        id: color.id,
        data: values,
      });
      showNotification("success", "Color updated successfully.");
      setIsEditOpen(false);
      refetch();
    } catch (err) {
      showNotification("error", err.response?.data?.message || "Failed to update color.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!color) return;
    setDeleting(true);
    try {
      await deleteMutation.mutateAsync(color.id);
      showNotification("success", "Color deleted successfully.");
      navigate("/products/colors");
    } catch (err) {
      showNotification("error", err.response?.data?.message || "Failed to delete color.");
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

  if (isError || !color) {
    return (
      <div className="space-y-6 pb-12">
        <Link
          to="/products/colors"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Colors</span>
        </Link>
        <div className="p-8 rounded-3xl border border-rose-500/20 bg-rose-500/5 text-center">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
          <h2 className="text-base font-bold text-base-content">Color Record Not Found</h2>
          <p className="text-xs text-base-content/60 mt-1">
            {error?.response?.data?.message || "The requested color record does not exist or has been removed."}
          </p>
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/products/colors")}>
              Return to Catalog
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const name = color.colorName || color.color_name || "Unnamed Color";
  const code = color.colorCode || color.color_code || "—";
  const hex = color.hexCode || color.hex_code;
  const companyName = color.companyName || color.company_name || "Pooja Fashion";
  const desc = color.description;
  const isActive = Boolean(color.isActive !== undefined ? color.isActive : color.is_active);
  const displayOrder = color.displayOrder ?? color.display_order ?? 0;
  const createdAt = color.createdAt || color.created_at;
  const updatedAt = color.updatedAt || color.updated_at;

  const rgb = hex ? hexToRgb(hex) : null;
  const contrast = hex ? getContrastColor(hex) : "#FFFFFF";
  const isMulticolor = !hex || String(hex).toLowerCase() === "multicolor" || String(code).toUpperCase() === "MULTICOLOR";

  return (
    <div className="space-y-6 pb-12">
      {/* Back link */}
      <div>
        <Link
          to="/products/colors"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-base-content/60 hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Colors Master</span>
        </Link>
      </div>

      {/* Page Header */}
      <PageHeader
        title={name}
        description={`Color Code: ${code} • Hex: ${hex ? formatHexCode(hex) : "Multicolor Variant"}`}
        actions={
          <div className="flex items-center gap-2">
            <div className="tooltip tooltip-bottom" data-tip="Refresh Color">
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
              Edit Color
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

      {/* Hero Swatch Showcase Card */}
      <div className="rounded-3xl border border-base-300 bg-base-100 overflow-hidden shadow-xs">
        <div
          className="h-36 sm:h-48 relative flex items-center justify-center p-6 transition-all duration-300"
          style={
            isMulticolor
              ? {
                  backgroundImage:
                    "linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 25%, #FFE66D 50%, #9B5DE5 75%, #00BBF9 100%)",
                }
              : {
                  backgroundColor: hex || "#2a0081",
                }
          }
        >
          <div
            className="px-5 py-3 rounded-2xl backdrop-blur-md shadow-2xl flex items-center gap-4 border"
            style={{
              backgroundColor: isLightColor(hex) ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.9)",
              borderColor: isLightColor(hex) ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
              color: isLightColor(hex) ? "#FFFFFF" : "#0F172A",
            }}
          >
            <ColorThumb hex={hex} code={code} name={name} size="lg" />
            <div>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight">{name}</h2>
              <div className="flex items-center gap-2 mt-0.5 text-xs font-mono font-bold opacity-90">
                <span>{code}</span>
                {hex && <span>• {formatHexCode(hex)}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Hero Metadata Strip */}
        <div className="p-6 bg-base-100 flex flex-wrap items-center justify-between gap-4 border-t border-base-200">
          <div className="flex items-center gap-4">
            <span className="text-xs text-base-content/60 font-medium">Catalog Status:</span>
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

          <div className="flex items-center gap-2 text-xs text-base-content/60">
            <Building className="w-4 h-4 text-base-content/40" />
            <span className="font-semibold text-base-content">{companyName}</span>
          </div>
        </div>
      </div>

      {/* Grid: Color Details & Attributes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Color Palette & Swatch Specs */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Color Swatch Specs
            </h3>

            <div className="space-y-3 text-xs">
              {/* Hex Code */}
              <div className="p-3 rounded-2xl bg-base-200/50 flex items-center justify-between">
                <div>
                  <span className="text-base-content/50 block text-[11px] font-medium">HEX VALUE</span>
                  <span className="font-mono font-bold text-sm text-base-content">
                    {hex ? formatHexCode(hex) : "Multicolor (No Solid Hex)"}
                  </span>
                </div>
                {hex && (
                  <button
                    type="button"
                    onClick={() => handleCopyText(formatHexCode(hex), "hex")}
                    className="p-1.5 rounded-xl hover:bg-base-200 text-base-content/60 hover:text-primary transition-colors"
                    title="Copy Hex"
                  >
                    {copiedKey === "hex" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>

              {/* RGB Value */}
              {rgb && (
                <div className="p-3 rounded-2xl bg-base-200/50 flex items-center justify-between">
                  <div>
                    <span className="text-base-content/50 block text-[11px] font-medium">RGB VALUES</span>
                    <span className="font-mono font-bold text-xs text-base-content">
                      rgb({rgb.r}, {rgb.g}, {rgb.b})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "rgb")}
                    className="p-1.5 rounded-xl hover:bg-base-200 text-base-content/60 hover:text-primary transition-colors"
                    title="Copy RGB"
                  >
                    {copiedKey === "rgb" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}

              {/* Contrast Recommendation */}
              {hex && (
                <div className="p-3 rounded-2xl bg-base-200/50 flex items-center justify-between">
                  <div>
                    <span className="text-base-content/50 block text-[11px] font-medium">OPTIMAL TEXT CONTRAST</span>
                    <span className="font-mono font-bold text-xs text-base-content">
                      {contrast === "#FFFFFF" ? "White Text (#FFFFFF)" : "Dark Text (#0F172A)"}
                    </span>
                  </div>
                  <div
                    className="w-5 h-5 rounded-md border border-base-300"
                    style={{ backgroundColor: contrast }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Master Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-xs space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Identity & Configuration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-base-200/40 border border-base-300/60">
                <span className="text-[11px] text-base-content/50 font-bold uppercase block">
                  Color Name
                </span>
                <span className="text-sm font-black text-base-content mt-1 block">
                  {name}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-base-200/40 border border-base-300/60 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-base-content/50 font-bold uppercase block">
                    Color Code
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

              <div className="p-4 rounded-2xl bg-base-200/40 border border-base-300/60">
                <span className="text-[11px] text-base-content/50 font-bold uppercase block">
                  Display Order
                </span>
                <span className="text-sm font-semibold text-base-content mt-1 block">
                  #{displayOrder} in sequence
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-base-200/40 border border-base-300/60">
                <span className="text-[11px] text-base-content/50 font-bold uppercase block">
                  Record ID
                </span>
                <span className="font-mono text-sm font-semibold text-base-content/70 mt-1 block">
                  #{color.id}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="p-4 rounded-2xl bg-base-200/30 border border-base-300/60 space-y-1">
              <span className="text-[11px] text-base-content/50 font-bold uppercase block">
                Description / Retail Notes
              </span>
              <p className="text-xs sm:text-sm text-base-content/80 leading-relaxed">
                {desc || "No special retail notes configured for this color variant."}
              </p>
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
      <ColorFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={color}
        isEdit={true}
        isLoading={saving}
      />

      {/* Delete Modal */}
      <ColorDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        color={color}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleting}
      />
    </div>
  );
}

