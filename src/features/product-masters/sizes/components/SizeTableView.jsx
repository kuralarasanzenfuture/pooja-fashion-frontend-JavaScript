import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Copy,
  Check,
  Edit2,
  Trash2,
  Eye,
  Building,
  Ruler,
  ExternalLink,
  Layers,
} from "lucide-react";
import SizeThumb from "./SizeThumb.jsx";
import { formatSizeName } from "../utils/sizeHelper.js";

/**
 * Size Master Table View
 * Matches high-density catalog style with toggle-sm switch and green pill badge
 */
export default function SizeTableView({
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
        <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-4">
          <Ruler className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-base-content">No Sizes Found</h3>
        <p className="text-xs text-base-content/60 mt-1 max-w-sm mx-auto">
          No sizes match your active filters. Try adjusting your search query, selecting another size group, or add a new size.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-base-300 bg-base-100 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-base-200 bg-base-200/50 text-[11px] font-bold uppercase tracking-wider text-base-content/60 select-none">
              <th className="py-3.5 px-4">Size Details</th>
              <th className="py-3.5 px-4 hidden sm:table-cell">Size Group</th>
              <th className="py-3.5 px-4 hidden md:table-cell">Display Order</th>
              <th className="py-3.5 px-4 hidden lg:table-cell">Company</th>
              <th className="py-3.5 px-4">Catalog Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200 text-xs">
            {sizes.map((size) => {
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
                <tr
                  key={size.id}
                  className="hover:bg-base-200/40 transition-colors duration-150 group"
                >
                  {/* Size Details */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <SizeThumb
                        code={code}
                        name={name}
                        size="md"
                        onClick={() => onViewDetails?.(size)}
                      />
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => onViewDetails?.(size)}
                          className="font-extrabold text-sm text-base-content hover:text-primary transition-colors cursor-pointer text-left truncate max-w-[200px] sm:max-w-xs block"
                          title={name}
                        >
                          {name}
                        </button>
                        <div className="flex items-center gap-2 mt-0.5">
                          {code && (
                            <span className="font-mono text-[11px] font-bold text-base-content/60 bg-base-200 px-1.5 py-0.2 rounded-md border border-base-300">
                              {code}
                            </span>
                          )}
                          {code && (
                            <div
                              className="tooltip tooltip-top"
                              data-tip={isCopied(size.id) ? "Copied code!" : "Copy code"}
                            >
                              <button
                                type="button"
                                onClick={() => handleCopy(code, size.id)}
                                className="text-base-content/40 hover:text-primary p-0.5 rounded transition-colors cursor-pointer"
                                aria-label="Copy size code"
                              >
                                {isCopied(size.id) ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Size Group */}
                  <td className="py-3.5 px-4 hidden sm:table-cell">
                    {groupId ? (
                      <Link
                        to={`/products/size-groups/${groupId}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 text-xs font-semibold transition-colors"
                      >
                        <Layers className="w-3 h-3 shrink-0" />
                        <span className="truncate max-w-[140px]">{groupName}</span>
                      </Link>
                    ) : (
                      <span className="text-xs text-base-content/50">{groupName}</span>
                    )}
                  </td>

                  {/* Display Order */}
                  <td className="py-3.5 px-4 hidden md:table-cell">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-base-200 font-mono text-xs font-bold text-base-content/70 border border-base-300">
                      #{displayOrder}
                    </span>
                  </td>

                  {/* Company */}
                  <td className="py-3.5 px-4 hidden lg:table-cell">
                    {companyName ? (
                      <div className="flex items-center gap-1.5 text-xs text-base-content/80 font-medium">
                        <Building className="w-3.5 h-3.5 text-base-content/40 shrink-0" />
                        <span className="truncate max-w-[150px]">{companyName}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-base-content/40">—</span>
                    )}
                  </td>

                  {/* Catalog Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <label className="inline-flex cursor-pointer items-center gap-2 select-none">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => onToggleStatus?.(size)}
                        disabled={isStatusPending}
                        className="toggle toggle-success toggle-sm"
                        aria-label={`Toggle active status for ${name}`}
                      />
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40"
                            : "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </label>
                  </td>

                  {/* Action buttons */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <div className="tooltip tooltip-left" data-tip="View Details">
                        <button
                          type="button"
                          onClick={() => onViewDetails?.(size)}
                          className="p-1.5 rounded-xl hover:bg-base-200 text-base-content/60 hover:text-base-content transition-colors cursor-pointer"
                          aria-label="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="tooltip tooltip-left" data-tip="Dedicated Page">
                        <Link
                          to={`/products/sizes/${size.id}`}
                          className="p-1.5 rounded-xl hover:bg-base-200 text-base-content/60 hover:text-primary transition-colors cursor-pointer"
                          aria-label="Dedicated View Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>

                      <div className="tooltip tooltip-left" data-tip="Edit Size">
                        <button
                          type="button"
                          onClick={() => onEdit?.(size)}
                          className="p-1.5 rounded-xl hover:bg-primary/10 text-base-content/60 hover:text-primary transition-colors cursor-pointer"
                          aria-label="Edit Size"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="tooltip tooltip-left tooltip-error" data-tip="Delete Size">
                        <button
                          type="button"
                          onClick={() => onDelete?.(size)}
                          className="p-1.5 rounded-xl hover:bg-rose-50 text-base-content/60 hover:text-rose-600 transition-colors cursor-pointer"
                          aria-label="Delete Size"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

