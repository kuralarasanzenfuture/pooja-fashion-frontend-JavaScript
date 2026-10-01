import React from "react";
import {
  X,
  Tags,
  Calendar,
  Layers,
  Building,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Edit2,
  Trash2,
  ExternalLink,
  Maximize2,
  ArrowRight,
} from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";

/**
 * Category Details Quick View Modal
 */
export default function CategoryDetailsModal({
  isOpen = false,
  category = null,
  onClose,
  onEdit,
  onDelete,
  onToggleStatus,
  onImageClick,
  onNavigateFullPage,
}) {
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isOpen && !!category,
    onClose
  );
  const [copied, setCopied] = React.useState(false);

  if (!isRendered || !category) return null;

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
    setTimeout(() => setCopied(false), 2000);
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
    <div className={backdropClasses} onClick={handleClose} role="dialog" aria-modal="true" aria-labelledby="view-cat-title">
      <div
        className={`relative w-full max-w-2xl p-0 rounded-3xl bg-base-100 border border-base-300 shadow-2xl overflow-hidden ${cardClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-base-300 bg-base-100">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <Tags className="size-5" />
            </span>
            <div>
              <h3 id="view-cat-title" className="text-lg font-bold text-base-content leading-tight">
                {name}
              </h3>
              <p className="text-xs text-base-content/60 mt-0.5">
                Category Master Record • #{category.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="p-1.5 rounded-lg text-base-content/50 hover:text-base-content hover:bg-base-200 transition-colors cursor-pointer"
            onClick={handleClose}
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Visual Banner & Key Details */}
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {/* Clickable Image Box */}
            <div className="relative group w-full sm:w-44 h-44 rounded-2xl overflow-hidden border border-base-300 bg-base-200/50 shrink-0">
              {imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => onImageClick?.(imageUrl, name)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1.5 cursor-pointer backdrop-blur-xs"
                    title="Click to view full image in high quality"
                  >
                    <Maximize2 className="size-6" />
                    <span className="text-[11px] font-semibold">View High-Res</span>
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-primary/60 bg-gradient-to-br from-primary/10 via-base-200 to-base-300/40">
                  <Tags className="size-10 opacity-70" />
                  <span className="text-[11px] text-base-content/50 font-medium mt-2">
                    No image asset
                  </span>
                </div>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="flex-1 space-y-3 w-full">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-base-200 text-base-content/80 border border-base-300">
                  Order #{displayOrder}
                </span>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-mono font-bold">
                  <span>{code}</span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="hover:text-primary transition-colors cursor-pointer"
                    title="Copy Code"
                  >
                    {copied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                  </button>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1 ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                  }`}
                >
                  {isActive ? <CheckCircle2 className="size-3.5" /> : <AlertCircle className="size-3.5" />}
                  {isActive ? "Active on POS" : "Inactive"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-base-200/50 border border-base-300/70">
                  <span className="text-[10px] uppercase font-bold text-base-content/50 tracking-wider block">
                    Company
                  </span>
                  <span className="font-semibold text-base-content mt-0.5 block truncate">
                    {companyName}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-base-200/50 border border-base-300/70">
                  <span className="text-[10px] uppercase font-bold text-base-content/50 tracking-wider block">
                    Sequence Order
                  </span>
                  <span className="font-semibold text-base-content mt-0.5 block">
                    Position {displayOrder}
                  </span>
                </div>
              </div>

              <div className="text-xs text-base-content/60 space-y-1 pt-1 font-medium">
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-base-content/40 shrink-0" />
                  <span>Updated: {fmtDate(updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 rounded-xl bg-base-200/40 border border-base-300/70 space-y-1.5">
            <h4 className="text-xs font-bold text-base-content uppercase tracking-wider">
              Category Description
            </h4>
            <p className="text-xs sm:text-sm text-base-content/75 leading-relaxed">
              {desc || <span className="italic text-base-content/40">No description provided for this category.</span>}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-2.5 border-t border-base-300 bg-base-200/40 px-6 py-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={ExternalLink}
              onClick={() => {
                onClose();
                onNavigateFullPage?.(category.id);
              }}
            >
              Open Full Page
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Edit2}
              onClick={() => {
                onClose();
                onEdit?.(category);
              }}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => {
                onClose();
                onDelete?.(category);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
