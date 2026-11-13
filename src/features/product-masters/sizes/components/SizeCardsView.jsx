import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Copy,
  Check,
  Edit2,
  Trash2,
  Eye,
  ExternalLink,
  Layers,
  Building,
} from "lucide-react";
import SizeThumb from "./SizeThumb.jsx";
import { formatSizeName } from "../utils/sizeHelper.js";

/**
 * Responsive Card Grid for Sizes Module
 * Uses standard toggle-sm and status pill badge
 */
export default function SizeCardsView({
  sizes = [],
  onViewDetails,
  onEdit,
  onDelete,
  onToggleStatus,
  onCopyCode,
  copiedKey,
  statusPendingId,
}) {
  const [internalCopied, setInternalCopied] = useState(null);

  const handleCopy = (code, id) => {
    if (onCopyCode) {
      onCopyCode(code, id);
      return;
    }
    navigator.clipboard.writeText(code);
    setInternalCopied(id);
    setTimeout(() => setInternalCopied(null), 2000);
  };

  const isCopied = (id) =>
    copiedKey === `size-${id}` || internalCopied === id;

  if (!sizes || sizes.length === 0) {
    return (
      <div className="rounded-3xl border border-base-300 bg-base-100 p-12 text-center shadow-xs">
        <h3 className="text-base font-bold text-base-content">No Sizes Found</h3>
        <p className="text-xs text-base-content/60 mt-1 max-w-sm mx-auto">
          No sizes match your active criteria. Try clearing search filters or creating a new size.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {sizes.map((size, index) => {
        const name = formatSizeName(size.sizeName || size.size_name || "Unnamed Size");
        const code = size.sizeCode || size.size_code || "";
        const groupName = size.sizeGroupName || size.size_group_name || "—";
        const groupId = size.sizeGroupId || size.size_group_id;
        const displayOrder = size.displayOrder ?? size.display_order ?? 0;
        const companyName = size.companyName || size.company_name;
        const isActive =
          size.isActive !== undefined ? size.isActive : Boolean(size.is_active);
        const isStatusPending = statusPendingId === size.id;

        return (
          <div
            key={size.id}
            className="group relative flex flex-col justify-between rounded-3xl border border-base-300 bg-base-100 p-5 shadow-2xs hover:shadow-lg hover:border-primary/40 transition-all duration-300 animate-in fade-in-50 slide-in-from-bottom-2 fill-mode-both"
            style={{ animationDelay: `${Math.min(index * 30, 240)}ms` }}
          >
            {/* Top Bar: Sequence ID & Status */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-lg bg-base-200 text-xs font-mono font-bold text-base-content/70 border border-base-300/80">
                  #{size.id}
                </span>

                <label className="inline-flex cursor-pointer items-center gap-1.5 select-none">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => onToggleStatus?.(size)}
                    disabled={isStatusPending}
                    className="toggle toggle-success toggle-sm"
                    aria-label={`Toggle status for ${name}`}
                  />
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40"
                        : "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40"
                    }`}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </label>
              </div>

              {/* Centered Identity */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-3">
                  <SizeThumb
                    code={code}
                    name={name}
                    size="lg"
                    onClick={() => onViewDetails?.(size)}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => onViewDetails?.(size)}
                  className="font-extrabold text-base text-base-content hover:text-primary transition-colors cursor-pointer line-clamp-1 max-w-full"
                  title={name}
                >
                  {name}
                </button>

                {code && (
                  <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 text-[11px] font-mono font-bold">
                    <span>{code}</span>
                    <div
                      className="tooltip tooltip-top"
                      data-tip={isCopied(size.id) ? "Copied code!" : "Copy code"}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(code, size.id);
                        }}
                        className="hover:text-primary/70 transition-colors cursor-pointer"
                        aria-label="Copy size code"
                      >
                        {isCopied(size.id) ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Parent Size Group Pill */}
                {groupId && (
                  <div className="mt-3">
                    <Link
                      to={`/products/size-groups/${groupId}`}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-base-200 text-base-content/70 hover:text-primary hover:bg-primary/10 border border-base-300 transition-colors"
                    >
                      <Layers className="w-3 h-3 text-primary" />
                      <span className="truncate max-w-[130px]">{groupName}</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Meta & Action Bar */}
            <div className="pt-4 mt-4 border-t border-base-200">
              <div className="flex items-center justify-between text-xs text-base-content/60 mb-3">
                <span className="font-mono font-bold">Order #{displayOrder}</span>
                {companyName && (
                  <span className="truncate max-w-[110px] text-[11px] flex items-center gap-1">
                    <Building className="w-3 h-3 shrink-0 text-base-content/40" />
                    <span className="truncate">{companyName}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-1 pt-1">
                <button
                  type="button"
                  onClick={() => onViewDetails?.(size)}
                  className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-base-200 hover:bg-base-300 text-xs font-bold text-base-content transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>

                <div className="tooltip tooltip-top" data-tip="Edit Size">
                  <button
                    type="button"
                    onClick={() => onEdit?.(size)}
                    className="p-1.5 rounded-xl border border-base-300 hover:border-primary/40 hover:bg-primary/10 text-base-content/70 hover:text-primary transition-all cursor-pointer"
                    aria-label="Edit Size"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="tooltip tooltip-top" data-tip="Dedicated Page">
                  <Link
                    to={`/products/sizes/${size.id}`}
                    className="p-1.5 rounded-xl border border-base-300 hover:border-primary/40 hover:bg-primary/10 text-base-content/70 hover:text-primary transition-all cursor-pointer"
                    aria-label="Dedicated Page"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="tooltip tooltip-top tooltip-error" data-tip="Delete Size">
                  <button
                    type="button"
                    onClick={() => onDelete?.(size)}
                    className="p-1.5 rounded-xl border border-base-300 hover:border-rose-300 hover:bg-rose-50 text-base-content/70 hover:text-rose-600 transition-all cursor-pointer"
                    aria-label="Delete Size"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

