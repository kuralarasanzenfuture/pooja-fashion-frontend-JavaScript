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
 * SizeGroupCardsView
 * Visual grid view displaying size groups as responsive interactive cards.
 */
export default function SizeGroupCardsView({
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
      {sizeGroups.map((group, index) => {
        const name = formatSizeGroupName(group.sizeGroupName || group.size_group_name);
        const code = group.sizeGroupCode || group.size_group_code;
        const isActive =
          group.isActive !== undefined ? group.isActive : Boolean(group.is_active);
        const desc = group.description;
        const companyName = group.companyName || group.company_name;
        const sizesList = Array.isArray(group.sizes) ? group.sizes : [];

        return (
          <div
            key={group.id}
            className="group relative flex flex-col justify-between rounded-3xl border border-base-300 bg-base-100 p-5 shadow-2xs hover:shadow-lg hover:border-primary/40 transition-all duration-300 animate-in fade-in-50 slide-in-from-bottom-2 fill-mode-both"
            style={{ animationDelay: `${Math.min(index * 30, 240)}ms` }}
          >
            {/* Top Bar: ID & Status */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-lg bg-base-200 text-xs font-mono font-bold text-base-content/70 border border-base-300/80">
                  #{group.id}
                </span>

                <label className="inline-flex cursor-pointer items-center gap-1.5 select-none">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => onToggleStatus?.(group)}
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
                  <SizeGroupThumb name={name} size="lg" />
                </div>

                <button
                  type="button"
                  onClick={() => onViewDetails?.(group)}
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
                      data-tip={copiedKey === `sizegroup-${group.id}` ? "Copied code!" : "Copy code"}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCopyCode?.(code, group.id);
                        }}
                        className="hover:text-primary/70 transition-colors cursor-pointer"
                        aria-label="Copy size group code"
                      >
                        {copiedKey === `sizegroup-${group.id}` ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Sizes Tags Preview */}
                {sizesList.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-1 mt-3">
                    {sizesList.slice(0, 5).map((s) => (
                      <span
                        key={s.id || s.size_code || s.size_name}
                        className="px-2 py-0.5 rounded-md bg-base-200 text-[10px] font-mono font-bold text-base-content/75 border border-base-300"
                      >
                        {s.size_name || s.size_code || s.name}
                      </span>
                    ))}
                    {sizesList.length > 5 && (
                      <span className="text-[10px] text-base-content/50 font-medium">
                        +{sizesList.length - 5}
                      </span>
                    )}
                  </div>
                )}

                {desc && (
                  <p className="text-xs text-base-content/60 mt-2.5 line-clamp-2 text-center">
                    {desc}
                  </p>
                )}
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-4 mt-4 border-t border-base-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 text-[11px] text-base-content/60 truncate min-w-0">
                {companyName && (
                  <>
                    <Building className="w-3 h-3 shrink-0 text-base-content/40" />
                    <span className="truncate">{companyName}</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <div className="tooltip tooltip-top" data-tip="View Details">
                  <button
                    type="button"
                    onClick={() => onViewDetails?.(group)}
                    className="p-1.5 rounded-lg text-base-content/60 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                    aria-label="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                <div className="tooltip tooltip-top" data-tip="Edit Size Group">
                  <button
                    type="button"
                    onClick={() => onEdit?.(group)}
                    className="p-1.5 rounded-lg text-base-content/60 hover:text-amber-600 hover:bg-amber-500/10 transition-colors cursor-pointer"
                    aria-label="Edit Size Group"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="tooltip tooltip-top tooltip-error" data-tip="Delete Size Group">
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
            </div>
          </div>
        );
      })}
    </div>
  );
}
