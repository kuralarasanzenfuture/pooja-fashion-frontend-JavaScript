import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Tag,
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
  Globe,
} from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";
import BrandThumb from "./BrandThumb.jsx";
import { formatBrandName, normalizeBrandLogoUrl } from "../utils/brandHelper.js";

/**
 * Brand Details Quick View Modal
 */
export default function BrandDetailsModal({
  isOpen = false,
  brand = null,
  onClose,
  onEdit,
  onDelete,
  onToggleStatus,
  onImageClick,
  onNavigateFullPage,
}) {
  const navigate = useNavigate();
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isOpen && Boolean(brand),
    onClose
  );
  const [copied, setCopied] = useState(false);

  if (!isRendered || !brand) return null;

  const name = formatBrandName(brand.brandName || brand.brand_name);
  const code = brand.brandCode || brand.brand_code;
  const logoUrl = brand.logoUrl || brand.logo_url;
  const website = brand.websiteUrl || brand.website_url;
  const displayOrder = brand.displayOrder ?? brand.display_order ?? 0;
  const isActive =
    brand.isActive !== undefined ? brand.isActive : Boolean(brand.is_active);
  const desc = brand.description;
  const companyName = brand.companyName || brand.company_name || "Pooja Fashion";
  const companyCode = brand.companyCode || brand.company_code || null;
  const updatedAt = brand.updatedAt || brand.updated_at;
  const createdAt = brand.createdAt || brand.created_at;

  const handleCopyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fmtDate = (iso) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  return (
    <div
      className={backdropClasses}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full max-w-xl bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden ${cardClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-base-200">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20">
              Brand Master Details
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
              }`}
            >
              {isActive ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Active</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3" />
                  <span>Inactive</span>
                </>
              )}
            </span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-xl text-base-content/40 hover:text-base-content hover:bg-base-200 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto scrollbar-thin">
          {/* Brand Identity Header */}
          <div className="flex items-start gap-4">
            <BrandThumb
              url={logoUrl}
              name={name}
              code={code}
              size="xl"
              onImageClick={onImageClick}
              className="shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-black text-base-content tracking-tight">
                {name}
              </h3>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                {code && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-base-200 font-mono text-xs font-bold text-base-content/80 border border-base-300">
                    <span>{code}</span>
                    <div className="tooltip tooltip-top" data-tip={copied ? "Copied code!" : "Copy code"}>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="text-base-content/40 hover:text-primary transition-colors cursor-pointer"
                        aria-label="Copy code"
                      >
                        {copied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-lg bg-base-200 text-xs font-mono font-bold text-base-content/70 border border-base-300">
                  Sequence #{displayOrder}
                </span>
              </div>

              {website && (
                <div className="mt-2.5">
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{website}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Details 2x2 Grid */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-base-200/50 border border-base-300">
            <div>
              <span className="text-[11px] font-semibold text-base-content/50 uppercase tracking-wider block">
                Company Scope
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-base-content mt-1">
                <Building className="w-3.5 h-3.5 text-base-content/40 shrink-0" />
                <span className="truncate">{companyName}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-base-content/50 uppercase tracking-wider block">
                Catalog Sequence
              </span>
              <div className="text-xs font-mono font-bold text-base-content mt-1">
                Display Order #{displayOrder}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-base-content/50 uppercase tracking-wider block">
                Created On
              </span>
              <div className="flex items-center gap-1.5 text-xs font-medium text-base-content/80 mt-1">
                <Calendar className="w-3.5 h-3.5 text-base-content/40 shrink-0" />
                <span>{fmtDate(createdAt)}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-base-content/50 uppercase tracking-wider block">
                Last Updated
              </span>
              <div className="flex items-center gap-1.5 text-xs font-medium text-base-content/80 mt-1">
                <Calendar className="w-3.5 h-3.5 text-base-content/40 shrink-0" />
                <span>{fmtDate(updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {desc && (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-base-content/60 block mb-1.5">
                Description & Brand Notes
              </span>
              <p className="p-3.5 rounded-2xl bg-base-200/40 border border-base-300 text-xs sm:text-sm text-base-content/80 leading-relaxed whitespace-pre-wrap">
                {desc}
              </p>
            </div>
          )}

          {/* Full Page Navigation Action */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                handleClose();
                if (onNavigateFullPage) {
                  onNavigateFullPage(brand);
                } else {
                  navigate(`/products/brands/${brand.id}`);
                }
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary font-bold text-xs sm:text-sm transition-all cursor-pointer group"
            >
              <span>View full dedicated brand page & history</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Modal Footer Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-base-200 bg-base-200/30">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              handleClose();
              onDelete?.(brand);
            }}
            className="text-rose-600 hover:bg-rose-50 border-rose-200"
            icon={Trash2}
          >
            Delete
          </Button>

          <div className="flex items-center gap-2">
            {onToggleStatus && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleStatus(brand)}
              >
                {isActive ? "Deactivate" : "Activate"}
              </Button>
            )}
            <Button
              variant="clip-six"
              size="sm"
              icon={Edit2}
              onClick={() => {
                handleClose();
                onEdit?.(brand);
              }}
            >
              Edit Brand
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

