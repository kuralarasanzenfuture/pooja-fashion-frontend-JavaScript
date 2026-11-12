import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  X,
  Ruler,
  Calendar,
  Building,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Edit2,
  Trash2,
  ArrowRight,
  Layers,
  ExternalLink,
} from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";
import SizeThumb from "./SizeThumb.jsx";
import { formatSizeName } from "../utils/sizeHelper.js";

/**
 * Size Details Quick View Modal
 */
export default function SizeDetailsModal({
  isOpen = false,
  size = null,
  onClose,
  onEdit,
  onDelete,
  onToggleStatus,
  onNavigateFullPage,
}) {
  const navigate = useNavigate();
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isOpen && Boolean(size),
    onClose
  );
  const [copied, setCopied] = useState(false);

  if (!isRendered || !size) return null;

  const name = formatSizeName(size.sizeName || size.size_name || "Unnamed Size");
  const code = size.sizeCode || size.size_code;
  const groupName = size.sizeGroupName || size.size_group_name || "—";
  const groupId = size.sizeGroupId || size.size_group_id;
  const displayOrder = size.displayOrder ?? size.display_order ?? 0;
  const isActive =
    size.isActive !== undefined ? size.isActive : Boolean(size.is_active);
  const companyName = size.companyName || size.company_name || "Pooja Fashion";
  const companyCode = size.companyCode || size.company_code;
  const updatedAt = size.updatedAt || size.updated_at;
  const createdAt = size.createdAt || size.created_at;

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
        className={`relative w-full max-w-lg bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden ${cardClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-base-200">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20">
              Size Details
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
            className="p-1.5 rounded-xl hover:bg-base-200 text-base-content/60 hover:text-base-content transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Header Banner */}
          <div className="flex items-start gap-4">
            <SizeThumb code={code} name={name} size="xl" className="shrink-0" />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-base-content/60 bg-base-200 px-2 py-0.5 rounded-lg border border-base-300">
                  #{size.id}
                </span>
                <span className="text-[11px] text-base-content/50">Display Order #{displayOrder}</span>
              </div>

              <h3 className="text-xl font-extrabold text-base-content tracking-tight mt-1 truncate">
                {name}
              </h3>

              {code && (
                <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-xl bg-base-200 font-mono text-xs font-bold text-base-content border border-base-300">
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
            </div>
          </div>

          {/* Key Information Cards */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-base-200/50 border border-base-300">
              <span className="text-base-content/50 block font-medium">Parent Size Group</span>
              <div className="flex items-center gap-1.5 font-bold text-base-content mt-1">
                <Layers className="w-3.5 h-3.5 text-primary" />
                <span className="truncate">{groupName}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-base-200/50 border border-base-300">
              <span className="text-base-content/50 block font-medium">Company</span>
              <div className="flex items-center gap-1.5 font-bold text-base-content mt-1">
                <Building className="w-3.5 h-3.5 text-base-content/40" />
                <span className="truncate">{companyName}</span>
                {companyCode && (
                  <span className="font-mono text-[10px] text-base-content/50">({companyCode})</span>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-base-200/50 border border-base-300">
              <span className="text-base-content/50 block font-medium">Display Sequence</span>
              <div className="font-mono font-bold text-base-content mt-1">
                Position #{displayOrder}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-base-200/50 border border-base-300">
              <span className="text-base-content/50 block font-medium">Created On</span>
              <div className="flex items-center gap-1.5 font-medium text-base-content/80 mt-1">
                <Calendar className="w-3.5 h-3.5 text-base-content/40" />
                <span>{fmtDate(createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Full Page Link */}
          <div className="p-3.5 rounded-2xl border border-primary/20 bg-primary/5 flex items-center justify-between">
            <div className="text-xs">
              <span className="font-bold text-base-content block">Dedicated Record Page</span>
              <span className="text-base-content/60 text-[11px]">
                Inspect usage in product variants and barcode generation.
              </span>
            </div>
            <Button
              variant="outline"
              size="xs"
              icon={ExternalLink}
              onClick={() => {
                handleClose();
                if (onNavigateFullPage) {
                  onNavigateFullPage(size);
                } else {
                  navigate(`/products/sizes/${size.id}`);
                }
              }}
            >
              Open Page
            </Button>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-base-200 bg-base-200/30">
          <Button
            variant="outline"
            size="sm"
            icon={Trash2}
            onClick={() => {
              handleClose();
              onDelete?.(size);
            }}
            className="text-rose-600 hover:bg-rose-50 border-rose-200"
          >
            Delete
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Edit2}
              onClick={() => {
                handleClose();
                onEdit?.(size);
              }}
            >
              Edit Size
            </Button>
            <Button
              variant="clip-six"
              size="sm"
              onClick={handleClose}
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
