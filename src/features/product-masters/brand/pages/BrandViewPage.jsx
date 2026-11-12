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
  ExternalLink,
  Globe,
  Layers,
  ArrowRight,
} from "lucide-react";
import PageHeader from "../../../../common/components/PageHeader.jsx";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import ImageViewerModal from "../../../../common/components/ui/ImageViewerModal.jsx";
import {
  useBrand,
  useUpdateBrand,
  useUpdateBrandStatus,
  useDeleteBrand,
  useDeleteBrandLogo,
} from "../hooks/useBrands.js";
import BrandThumb from "../components/BrandThumb.jsx";
import BrandFormModal from "../components/BrandFormModal.jsx";
import BrandDeleteModal from "../components/BrandDeleteModal.jsx";
import { formatBrandName } from "../utils/brandHelper.js";

export default function BrandViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: brandResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useBrand(id);

  const updateMutation = useUpdateBrand();
  const updateStatusMutation = useUpdateBrandStatus();
  const deleteMutation = useDeleteBrand();
  const deleteLogoMutation = useDeleteBrandLogo();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageViewer, setImageViewer] = useState({ isOpen: false, src: "", title: "" });
  const [notification, setNotification] = useState(null);
  const [saving, setSaving] = useState(false);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const brand = brandResponse?.data || brandResponse || null;

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

  if (isError || !brand) {
    return (
      <div className="space-y-6 pb-12">
        <Link
          to="/products/brands"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Brands</span>
        </Link>
        <div className="p-8 rounded-3xl border border-rose-500/20 bg-rose-500/5 text-center">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
          <h2 className="text-base font-bold text-base-content">Brand Not Found</h2>
          <p className="text-xs text-base-content/60 mt-1">
            {error?.response?.data?.message || "The requested brand record does not exist or has been removed."}
          </p>
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/products/brands")}>
              Return to Catalog
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const name = formatBrandName(brand.brandName || brand.brand_name);
  const code = brand.brandCode || brand.brand_code;
  const logoUrl = brand.logoUrl || brand.logo_url;
  const website = brand.websiteUrl || brand.website_url;
  const displayOrder = brand.displayOrder ?? brand.display_order ?? 0;
  const isActive =
    brand.isActive !== undefined ? brand.isActive : Boolean(brand.is_active);
  const desc = brand.description;
  const companyName = brand.companyName || brand.company_name || "Pooja Fashion";
  const companyCode = brand.companyCode || brand.company_code;
  const createdAt = brand.createdAt || brand.created_at;
  const updatedAt = brand.updatedAt || brand.updated_at;

  const handleCopyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleStatus = async () => {
    const nextStatus = !isActive;
    try {
      await updateStatusMutation.mutateAsync({ id: brand.id, isActive: nextStatus });
      showNotification("success", `Brand status set to ${nextStatus ? "Active" : "Inactive"}`);
      refetch();
    } catch (err) {
      showNotification("error", err.response?.data?.message || "Failed to update brand status");
    }
  };

  const handleEditSubmit = async ({ values, logoFile, removeLogo }) => {
    setSaving(true);
    try {
      const payload = {
        company_id: Number(values.company_id || brand.companyId || brand.company_id),
        brand_name: values.brand_name,
        brand_code: values.brand_code || undefined,
        description: values.description || null,
        website_url: values.website_url || null,
        display_order: values.display_order,
        is_active: values.is_active,
      };

      if (removeLogo && !logoFile && (brand.logoUrl || brand.logo_url)) {
        await deleteLogoMutation.mutateAsync(brand.id);
      }

      await updateMutation.mutateAsync({ id: brand.id, data: payload, logoFile });
      showNotification("success", "Brand updated successfully");
      setIsEditOpen(false);
      refetch();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update brand";
      showNotification("error", msg);
      return { errors: { brand_name: msg } };
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(brand.id);
      showNotification("success", `Brand "${name}" deleted`);
      navigate("/products/brands");
    } catch (err) {
      showNotification("error", err.response?.data?.message || "Failed to delete brand");
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
        <Link to="/products/brands" className="hover:text-primary transition-colors flex items-center gap-1">
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Brands Master</span>
        </Link>
        <span>/</span>
        <span className="text-base-content">{name}</span>
      </div>

      {/* Page Header */}
      <PageHeader
        title={name}
        description={`Master brand record #${brand.id} with catalog status and logo imagery.`}
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
              Edit Brand
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
          <BrandThumb
            url={logoUrl}
            name={name}
            code={code}
            size="xl"
            onImageClick={setImageViewer}
            className="shrink-0"
          />

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
                {name}
              </h2>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                }`}
              >
                {isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                <span>{isActive ? "Active in Catalog" : "Inactive / Hidden"}</span>
              </span>
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

              <span className="inline-flex items-center px-3 py-1 rounded-xl bg-base-200 font-mono text-xs font-bold text-base-content/70 border border-base-300">
                Display Order #{displayOrder}
              </span>

              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary/10 text-primary hover:bg-primary/15 border border-primary/20 text-xs font-semibold transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{website.replace(/^https?:\/\//i, "")}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          <div className="sm:self-center shrink-0">
            <Button
              variant={isActive ? "outline" : "clip-six"}
              size="sm"
              onClick={handleToggleStatus}
              loading={updateStatusMutation.isPending}
            >
              {isActive ? "Deactivate Brand" : "Activate Brand"}
            </Button>
          </div>
        </div>
      </div>

      {/* Grid: Metadata Details & Description */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metadata Details */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-6 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60 border-b border-base-200 pb-2">
            Brand Metadata
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
              <span className="text-base-content/50 block">Display Order</span>
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

        {/* Description & Brand Profile */}
        <div className="md:col-span-2 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60 border-b border-base-200 pb-2 mb-4">
              Brand Description & Heritage
            </h3>

            {desc ? (
              <p className="text-sm text-base-content/80 leading-relaxed whitespace-pre-wrap">
                {desc}
              </p>
            ) : (
              <div className="p-8 rounded-2xl bg-base-200/40 border border-base-300/60 text-center text-xs text-base-content/50">
                No description provided for this brand. Click "Edit Brand" to add details, designer notes, or fabric focus.
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-base-200 mt-6 flex items-center justify-between">
            <span className="text-xs text-base-content/50">
              Need to classify products under this brand?
            </span>
            <Button
              variant="outline"
              size="xs"
              icon={ArrowRight}
              onClick={() => navigate("/products")}
            >
              Browse Products
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <BrandFormModal
        isOpen={isEditOpen}
        mode="edit"
        initialData={brand}
        saving={saving}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditSubmit}
      />

      {/* Delete Modal */}
      <BrandDeleteModal
        isOpen={isDeleteOpen}
        brand={brand}
        isDeleting={deleteMutation.isPending}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Image Viewer */}
      <ImageViewerModal
        isOpen={imageViewer.isOpen}
        src={imageViewer.src}
        title={imageViewer.title}
        onClose={() => setImageViewer({ isOpen: false, src: "", title: "" })}
      />
    </div>
  );
}

