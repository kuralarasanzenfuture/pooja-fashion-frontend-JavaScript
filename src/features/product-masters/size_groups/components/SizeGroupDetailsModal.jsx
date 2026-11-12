import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Plus,
} from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";
import SizeGroupThumb from "./SizeGroupThumb.jsx";
import { formatSizeGroupName } from "../utils/sizeGroupHelper.js";

/**
 * Size Group Details Quick View Modal
 */
export default function SizeGroupDetailsModal({
  isOpen = false,
  sizeGroup = null,
  onClose,
  onEdit,
  onDelete,
  onToggleStatus,
  onNavigateFullPage,
}) {
  const navigate = useNavigate();
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isOpen && Boolean(sizeGroup),
    onClose
  );
  const [copied, setCopied] = useState(false);

  if (!isRendered || !sizeGroup) return null;

  const name = formatSizeGroupName(sizeGroup.sizeGroupName || sizeGroup.size_group_name);
  const code = sizeGroup.sizeGroupCode || sizeGroup.size_group_code;
  const isActive =
    sizeGroup.isActive !== undefined ? sizeGroup.isActive : Boolean(sizeGroup.is_active);
  const desc = sizeGroup.description;
  const companyName = sizeGroup.companyName || sizeGroup.company_name || "Pooja Fashion";
  const updatedAt = sizeGroup.updatedAt || sizeGroup.updated_at;
  const createdAt = sizeGroup.createdAt || sizeGroup.created_at;
  const sizesList = Array.isArray(sizeGroup.sizes) ? sizeGroup.sizes : [];

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
              Size Group Details
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
          {/* Identity Header */}
          <div className="flex items-start gap-4">
            <SizeGroupThumb name={name} size="xl" className="shrink-0" />
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
                  ID #{sizeGroup.id}
                </span>
              </div>
            </div>
          </div>

          {/* Assigned Child Sizes List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-base-content/70">
                Assigned Sizes ({sizesList.length})
              </span>
              <button
                type="button"
                onClick={() => navigate("/products/sizes")}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Manage sizes</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {sizesList.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 p-3.5 rounded-2xl bg-base-200/50 border border-base-300">
                {sizesList.map((s) => (
                  <div
                    key={s.id || s.size_code || s.size_name}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-base-100 border border-base-300 text-xs font-mono font-bold text-base-content shadow-2xs"
                  >
                    <span>{s.size_name || s.size_code || s.name}</span>
                    {s.size_code && s.size_code !== s.size_name && (
                      <span className="text-[10px] text-base-content/50 font-normal">
                        ({s.size_code})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-base-200/30 border border-base-300/80 text-center text-xs text-base-content/50">
                No child sizes assigned to this group yet. You can create sizes under this group from Products &gt; Sizes.
              </div>
            )}
          </div>

          {/* Details Grid */}
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
                Catalog Status
              </span>
              <div className="text-xs font-semibold text-base-content mt-1">
                {isActive ? "Visible in POS & Billing" : "Hidden"}
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
                Description & Sizing Chart Notes
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
                  onNavigateFullPage(sizeGroup);
                } else {
                  navigate(`/products/size-groups/${sizeGroup.id}`);
                }
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary font-bold text-xs sm:text-sm transition-all cursor-pointer group"
            >
              <span>View dedicated size group page & child sizes hierarchy</span>
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
              onDelete?.(sizeGroup);
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
                onClick={() => onToggleStatus(sizeGroup)}
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
                onEdit?.(sizeGroup);
              }}
            >
              Edit Group
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

