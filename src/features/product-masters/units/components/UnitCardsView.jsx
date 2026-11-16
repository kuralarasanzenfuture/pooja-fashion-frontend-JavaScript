import React from "react";
import {
  Eye,
  Edit2,
  Trash2,
  Copy,
  Check,
  Building,
  Calendar,
  Scale,
} from "lucide-react";
import UnitThumb from "./UnitThumb.jsx";

/**
 * UnitCardsView
 * Responsive card grid layout for units catalog.
 */
export default function UnitCardsView({
  units = [],
  onViewDetails,
  onEdit,
  onDelete,
  onToggleStatus,
  onCopyText,
  copiedKey,
  statusUpdatingId = null,
}) {
  const fmtDate = (d) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  if (units.length === 0) {
    return (
      <div className="bg-base-100 rounded-2xl border border-base-200 p-12 text-center text-base-content/50 shadow-xs">
        <div className="flex flex-col items-center justify-center gap-2">
          <Scale className="w-10 h-10 text-base-content/30" />
          <p className="font-bold text-base">No units found</p>
          <p className="text-xs text-base-content/40">
            Try adjusting your search query or filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {units.map((u, index) => {
        const id = u.id;
        const name = u.unitName || u.unit_name || "Unnamed";
        const code = u.unitCode || u.unit_code;
        const decimals = u.decimalPlaces !== undefined ? u.decimalPlaces : u.decimal_places ?? 0;
        const companyName = u.companyName || u.company_name;
        const isActive = Boolean(
          u.isActive !== undefined ? u.isActive : u.is_active
        );
        const isStatusPending = statusUpdatingId === id;

        return (
          <div
            key={id}
            className="group p-5 rounded-2xl border border-base-200 bg-base-100 hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between animate-in fade-in-50 duration-200"
            style={{ animationDelay: `${Math.min(index * 25, 200)}ms` }}
          >
            {/* Card Top: ID, Company, Status Toggle */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-mono text-xs font-bold text-base-content/60 bg-base-200/90 px-2 py-0.5 rounded-md">
                    #{id}
                  </span>
                  {companyName && (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-base-200 text-base-content/70 border border-base-300 truncate max-w-[100px]"
                      title={companyName}
                    >
                      <Building className="w-2.5 h-2.5 text-primary shrink-0" />
                      <span className="truncate">{companyName}</span>
                    </span>
                  )}
                </div>

                {/* Status Toggle Switch */}
                <label className="inline-flex cursor-pointer items-center gap-1.5 select-none shrink-0">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => onToggleStatus?.(u)}
                    disabled={isStatusPending}
                    className="toggle toggle-success toggle-xs"
                    aria-label={`Toggle active status for ${name}`}
                  />
                  <span
                    className={`px-2 py-0.2 rounded-full text-[10px] font-bold border ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40"
                        : "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40"
                    }`}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </label>
              </div>

              {/* Unit Avatar & Identity */}
              <div className="flex items-start gap-3 mb-3">
                <UnitThumb
                  name={name}
                  code={code}
                  size="md"
                  onClick={() => onViewDetails?.(u)}
                />
                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => onViewDetails?.(u)}
                    className="font-bold text-sm sm:text-base text-base-content hover:text-primary transition-colors cursor-pointer text-left truncate block w-full"
                    title={name}
                  >
                    {name}
                  </button>

                  {code && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                        {code}
                      </span>
                      <button
                        type="button"
                        onClick={() => onCopyText?.(code, `code-${id}`, "Unit Code")}
                        className="p-1 text-base-content/40 hover:text-primary rounded-md hover:bg-base-200 transition-colors cursor-pointer"
                        title="Copy Code"
                      >
                        {copiedKey === `code-${id}` ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Decimal Precision Info */}
              <div className="p-2.5 rounded-xl bg-base-200/50 border border-base-300/70 mb-3 flex items-center justify-between text-xs">
                <span className="text-base-content/60 font-medium">Decimal Precision:</span>
                <span className="font-mono font-bold text-base-content">
                  {decimals} {decimals === 1 ? "digit" : "digits"} (e.g. {(1).toFixed(decimals)})
                </span>
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-3 border-t border-base-200/80 flex items-center justify-between text-xs text-base-content/50">
              <span className="flex items-center gap-1 text-[11px]">
                <Calendar className="w-3 h-3 text-base-content/40" />
                <span>{fmtDate(u.createdAt || u.created_at)}</span>
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <div className="tooltip tooltip-top" data-tip="View Details">
                  <button
                    type="button"
                    onClick={() => onViewDetails?.(u)}
                    className="p-1.5 rounded-lg hover:bg-base-200 text-base-content/60 hover:text-base-content transition-colors cursor-pointer"
                    aria-label="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                <div className="tooltip tooltip-top" data-tip="Edit Unit">
                  <button
                    type="button"
                    onClick={() => onEdit?.(u)}
                    className="p-1.5 rounded-lg hover:bg-primary/10 text-base-content/60 hover:text-primary transition-colors cursor-pointer"
                    aria-label="Edit Unit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <div
                  className="tooltip tooltip-top tooltip-error"
                  data-tip="Delete Unit"
                >
                  <button
                    type="button"
                    onClick={() => onDelete?.(u)}
                    className="p-1.5 rounded-lg hover:bg-rose-500/10 text-base-content/60 hover:text-rose-600 transition-colors cursor-pointer"
                    aria-label="Delete Unit"
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

