import React from "react";
import {
  Eye,
  Edit2,
  Trash2,
  Copy,
  Check,
  Building,
  Calendar,
  Palette,
} from "lucide-react";
import ColorThumb from "./ColorThumb.jsx";
import { formatHexCode, getContrastColor } from "../utils/colorHelper.js";

/**
 * ColorCardsView
 * Responsive card grid layout for fashion colors catalog.
 */
export default function ColorCardsView({
  colors = [],
  page = 1,
  limit = 10,
  totalItems = 0,
  setPage,
  setLimit,
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

  if (colors.length === 0) {
    return (
      <div className="bg-base-100 rounded-2xl border border-base-200 p-12 text-center text-base-content/50 shadow-xs">
        <div className="flex flex-col items-center justify-center gap-2">
          <Palette className="w-10 h-10 text-base-content/30" />
          <p className="font-bold text-base">No colors found</p>
          <p className="text-xs text-base-content/40">
            Try adjusting your search query or filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {colors.map((color, index) => {
          const id = color.id;
          const name = color.colorName || color.color_name || "Unnamed";
          const code = color.colorCode || color.color_code;
          const hex = color.hexCode || color.hex_code;
          const companyName = color.companyName || color.company_name;
          const desc = color.description;
          const isActive = Boolean(
            color.isActive !== undefined ? color.isActive : color.is_active
          );
          const isStatusPending = statusUpdatingId === id;
          const isMulticolor =
            !hex ||
            String(hex).toLowerCase() === "multicolor" ||
            String(code).toUpperCase() === "MULTICOLOR";

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

                  <label className="inline-flex cursor-pointer items-center gap-1.5 select-none shrink-0">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => onToggleStatus?.(color)}
                      disabled={isStatusPending}
                      className="toggle toggle-success toggle-xs"
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

                {/* Big Swatch Banner */}
                <div className="flex flex-col items-center text-center py-2">
                  <ColorThumb
                    hex={hex}
                    name={name}
                    code={code}
                    size="xl"
                    className="mb-3.5 shadow-sm hover:scale-105 transition-transform"
                    onClick={() => onViewDetails?.(color)}
                  />

                  <button
                    type="button"
                    onClick={() => onViewDetails?.(color)}
                    className="font-bold text-base text-base-content group-hover:text-primary transition-colors cursor-pointer text-center truncate max-w-full"
                    title={name}
                  >
                    {name}
                  </button>

                  {/* Code and Hex Chips */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5 mt-1.5">
                    {code && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 text-[11px] font-mono font-bold">
                        <span>{code}</span>
                        <button
                          type="button"
                          onClick={() => onCopyText?.(code, `card-code-${id}`, "Color Code")}
                          className="hover:opacity-75 p-0.5 cursor-pointer"
                          aria-label="Copy code"
                        >
                          {copiedKey === `card-code-${id}` ? (
                            <Check className="w-2.5 h-2.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-2.5 h-2.5" />
                          )}
                        </button>
                      </div>
                    )}

                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-base-200 border border-base-300 text-[11px] font-mono font-semibold text-base-content/80">
                      {isMulticolor ? (
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                          🌈 Multi
                        </span>
                      ) : (
                        <>
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-black/15 shadow-2xs"
                            style={{ backgroundColor: formatHexCode(hex) }}
                          />
                          <span>{formatHexCode(hex)}</span>
                          <button
                            type="button"
                            onClick={() =>
                              onCopyText?.(
                                formatHexCode(hex),
                                `card-hex-${id}`,
                                "Hex Code"
                              )
                            }
                            className="hover:text-primary p-0.5 cursor-pointer"
                            aria-label="Copy hex"
                          >
                            {copiedKey === `card-hex-${id}` ? (
                              <Check className="w-2.5 h-2.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-2.5 h-2.5 text-base-content/40" />
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p
                    className="text-xs text-base-content/65 line-clamp-2 mt-2 leading-relaxed min-h-[32px] text-center"
                    title={desc || ""}
                  >
                    {desc || (
                      <span className="italic text-base-content/40">
                        No description provided
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Card Bottom: Date & Action Buttons */}
              <div className="pt-3 border-t border-base-200 flex items-center justify-between text-xs text-base-content/60 mt-3">
                <span className="flex items-center gap-1 font-medium text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-base-content/40" />
                  {fmtDate(color.updatedAt || color.updated_at || color.createdAt || color.created_at)}
                </span>

                <div className="flex items-center gap-1">
                  <div className="tooltip tooltip-top" data-tip="View Details">
                    <button
                      type="button"
                      onClick={() => onViewDetails?.(color)}
                      className="p-1.5 rounded-lg hover:bg-base-200 text-base-content/60 hover:text-base-content transition-colors cursor-pointer"
                      aria-label="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="tooltip tooltip-top" data-tip="Edit Color">
                    <button
                      type="button"
                      onClick={() => onEdit?.(color)}
                      className="p-1.5 rounded-lg hover:bg-primary/10 text-base-content/60 hover:text-primary transition-colors cursor-pointer"
                      aria-label="Edit Color"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div
                    className="tooltip tooltip-top tooltip-error"
                    data-tip="Delete Color"
                  >
                    <button
                      type="button"
                      onClick={() => onDelete?.(color)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-base-content/60 hover:text-rose-600 transition-colors cursor-pointer"
                      aria-label="Delete Color"
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
    </div>
  );
}
