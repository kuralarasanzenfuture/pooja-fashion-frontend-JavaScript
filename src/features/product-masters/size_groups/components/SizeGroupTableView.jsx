import {
  Copy,
  Check,
  Eye,
  Edit2,
  Trash2,
  Building,
  Ruler,
  Plus,
} from "lucide-react";
import SizeGroupThumb from "./SizeGroupThumb.jsx";
import { formatSizeGroupName } from "../utils/sizeGroupHelper.js";
import { Button } from "../../../../common/components/ui/buttons/index.js";

/**
 * SizeGroupTableView
 * High-density data table for managing product master size groups.
 */
export default function SizeGroupTableView({
  sizeGroups = [],
  copiedKey = null,
  onCopyCode,
  onToggleStatus,
  isStatusPending = false,
  onViewDetails,
  onEdit,
  onDelete,
  onAddSizeGroup,
}) {
  if (!sizeGroups || sizeGroups.length === 0) {
    return (
      <div className="rounded-3xl border border-base-300 bg-base-100 p-12 text-center shadow-xs">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-4">
          <Ruler className="w-8 h-8" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-base-content">
          No size groups found
        </h3>
        <p className="text-xs sm:text-sm text-base-content/60 mt-1 max-w-sm mx-auto">
          No size groups match your current search or filter criteria. Try adjusting your query or create a new size group.
        </p>
        {onAddSizeGroup && (
          <div className="mt-5">
            <Button variant="clip-six" size="sm" icon={Plus} onClick={onAddSizeGroup}>
              Add Size Group
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-3xl border border-base-300 overflow-hidden shadow-2xs">
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="border-b border-base-300 bg-base-200/50 text-[11px] font-semibold uppercase tracking-wider text-base-content/60">
              <th className="py-3.5 px-5 w-20 text-center first:rounded-tl-3xl">ID</th>
              <th className="py-3.5 px-4">Size Group Details</th>
              <th className="py-3.5 px-4 hidden md:table-cell">Assigned Sizes</th>
              <th className="py-3.5 px-4 hidden lg:table-cell">Company</th>
              <th className="py-3.5 px-4 hidden xl:table-cell max-w-[200px]">Description</th>
              <th className="py-3.5 px-4 whitespace-nowrap">Catalog Status</th>
              <th className="py-3.5 px-5 text-right whitespace-nowrap last:rounded-tr-3xl">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200 text-sm">
            {sizeGroups.map((group, index) => {
              const name = formatSizeGroupName(group.sizeGroupName || group.size_group_name);
              const code = group.sizeGroupCode || group.size_group_code;
              const isActive =
                group.isActive !== undefined ? group.isActive : Boolean(group.is_active);
              const desc = group.description;
              const companyName = group.companyName || group.company_name;
              const sizesList = Array.isArray(group.sizes) ? group.sizes : [];
              const sizesCount = group.sizesCount ?? group.sizes_count ?? sizesList.length;

              return (
                <tr
                  key={group.id}
                  className="hover:bg-base-200/50 transition-all duration-200 group animate-in fade-in-50 slide-in-from-bottom-2 duration-300 fill-mode-both"
                  style={{ animationDelay: `${Math.min(index * 25, 200)}ms` }}
                >
                  {/* ID */}
                  <td className="py-4 px-5 text-center">
                    <span className="inline-flex items-center justify-center min-w-8 px-2 py-1 rounded-lg bg-base-200 text-xs font-mono font-bold text-base-content/75 border border-base-300/80">
                      #{group.id}
                    </span>
                  </td>

                  {/* Size Group Details */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <SizeGroupThumb name={name} size="md" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onViewDetails?.(group)}
                            className="font-bold text-base-content text-sm leading-snug hover:text-primary transition-colors cursor-pointer text-left truncate"
                            title="Click to view size group details"
                          >
                            {name}
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {code && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
                              {code}
                            </span>
                          )}
                          {code && (
                            <div
                              className="tooltip tooltip-top"
                              data-tip={copiedKey === `sizegroup-${group.id}` ? "Copied code!" : "Copy code"}
                            >
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onCopyCode?.(code, group.id);
                                }}
                                className="text-base-content/40 hover:text-primary p-0.5 rounded transition-colors cursor-pointer"
                                aria-label="Copy size group code"
                              >
                                {copiedKey === `sizegroup-${group.id}` ? (
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

                  {/* Assigned Sizes preview */}
                  <td className="py-4 px-4 hidden md:table-cell">
                    {sizesList.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1 max-w-xs">
                        {sizesList.slice(0, 4).map((s) => (
                          <span
                            key={s.id || s.size_code || s.size_name}
                            className="px-2 py-0.5 rounded-md bg-base-200 text-[11px] font-mono font-bold text-base-content/80 border border-base-300/80"
                          >
                            {s.size_name || s.size_code || s.name}
                          </span>
                        ))}
                        {sizesList.length > 4 && (
                          <span className="text-[10px] text-base-content/50 font-medium">
                            +{sizesList.length - 4} more
                          </span>
                        )}
                      </div>
                    ) : sizesCount > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-base-200 text-xs font-semibold text-base-content/70">
                        {sizesCount} sizes configured
                      </span>
                    ) : (
                      <span className="text-xs text-base-content/40 italic">No child sizes yet</span>
                    )}
                  </td>

                  {/* Company */}
                  <td className="py-4 px-4 hidden lg:table-cell">
                    {companyName ? (
                      <div className="flex items-center gap-1.5 text-xs text-base-content/80 font-medium">
                        <Building className="w-3.5 h-3.5 text-base-content/40 shrink-0" />
                        <span className="truncate max-w-[160px]">{companyName}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-base-content/40">—</span>
                    )}
                  </td>

                  {/* Description */}
                  <td className="py-4 px-4 hidden xl:table-cell max-w-[200px]">
                    <span className="text-xs text-base-content/60 line-clamp-1 truncate block" title={desc || ""}>
                      {desc || "—"}
                    </span>
                  </td>

                  {/* Catalog Status */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <label className="inline-flex cursor-pointer items-center gap-2 select-none">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => onToggleStatus?.(group)}
                        disabled={isStatusPending}
                        className="toggle toggle-success toggle-sm"
                        aria-label={`Toggle active status for ${name}`}
                      />
                      <span
                        className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
                          isActive
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-base-200 text-base-content/50 border border-base-300"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </label>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <div className="tooltip tooltip-left" data-tip="View Details">
                        <button
                          type="button"
                          onClick={() => onViewDetails?.(group)}
                          className="p-1.5 rounded-lg text-base-content/60 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                          aria-label="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="tooltip tooltip-left" data-tip="Edit Size Group">
                        <button
                          type="button"
                          onClick={() => onEdit?.(group)}
                          className="p-1.5 rounded-lg text-base-content/60 hover:text-amber-600 hover:bg-amber-500/10 transition-colors cursor-pointer"
                          aria-label="Edit Size Group"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="tooltip tooltip-left tooltip-error" data-tip="Delete Size Group">
                        <button
                          type="button"
                          onClick={() => onDelete?.(group)}
                          className="p-1.5 rounded-lg text-base-content/60 hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          aria-label="Delete Size Group"
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

