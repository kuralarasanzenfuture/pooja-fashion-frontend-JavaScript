import React from "react";
import { Eye, Edit2, Trash2, Copy, Check, Building, Palette, Hash } from "lucide-react";
import ColorThumb from "./ColorThumb.jsx";
import { formatHexCode } from "../utils/colorHelper.js";

/**
 * ColorTableView
 * Premium table view for colors master with swatches, copyable codes,
 * catalog status toggle, and action buttons.
 */
export default function ColorTableView({
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
  return (
    <div className="bg-base-100 rounded-2xl border border-base-200 overflow-hidden shadow-xs flex flex-col justify-between">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-base-200 bg-base-200/50 text-[11px] font-bold uppercase tracking-wider text-base-content/60 select-none">
              <th className="py-3.5 px-4 text-center w-16">ID</th>
              <th className="py-3.5 px-4">Color Details</th>
              <th className="py-3.5 px-4">Hex Code</th>
              <th className="py-3.5 px-4 hidden lg:table-cell">Company</th>
              <th className="py-3.5 px-4 hidden xl:table-cell">Description</th>
              <th className="py-3.5 px-4 w-32 whitespace-nowrap">Catalog Status</th>
              <th className="py-3.5 px-4 text-right w-28 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200/80 text-xs sm:text-sm">
            {colors.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-base-content/50">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Palette className="w-8 h-8 text-base-content/30" />
                    <p className="font-medium text-sm">No colors found</p>
                    <p className="text-xs text-base-content/40">
                      Try adjusting your search or filters, or add a new color.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              colors.map((color, index) => {
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
                  <tr
                    key={id}
                    className="hover:bg-base-200/50 transition-colors group animate-in fade-in-50 duration-200"
                    style={{ animationDelay: `${Math.min(index * 20, 150)}ms` }}
                  >
                    {/* ID */}
                    <td className="py-4 px-4 text-center">
                      <span className="font-mono text-xs font-semibold text-base-content/60 bg-base-200/80 px-2 py-0.5 rounded-md">
                        #{id}
                      </span>
                    </td>

                    {/* Color Details (Swatch + Name + Code) */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <ColorThumb
                          hex={hex}
                          name={name}
                          code={code}
                          size="md"
                          onClick={() => onViewDetails?.(color)}
                        />
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => onViewDetails?.(color)}
                            className="font-bold text-base-content hover:text-primary transition-colors cursor-pointer text-left truncate block text-xs sm:text-sm"
                            title={name}
                          >
                            {name}
                          </button>
                          {code && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
                                {code}
                              </span>
                              <div
                                className="tooltip tooltip-top"
                                data-tip={
                                  copiedKey === `code-${id}` ? "Copied!" : "Copy code"
                                }
                              >
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onCopyText?.(code, `code-${id}`, "Color Code");
                                  }}
                                  className="text-base-content/40 hover:text-primary p-0.5 rounded transition-colors cursor-pointer"
                                  aria-label="Copy color code"
                                >
                                  {copiedKey === `code-${id}` ? (
                                    <Check className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Hex Code & Swatch Pill */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {isMulticolor ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-teal-500/10 border border-base-300 text-base-content/80">
                          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-rose-500 via-amber-400 to-cyan-500" />
                          <span>Multicolor</span>
                        </span>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-base-200/80 border border-base-300 text-xs font-mono font-semibold">
                          <span
                            className="w-3 h-3 rounded-full shrink-0 ring-1 ring-black/15 shadow-2xs"
                            style={{ backgroundColor: formatHexCode(hex) }}
                          />
                          <span>{formatHexCode(hex)}</span>
                          <div
                            className="tooltip tooltip-top"
                            data-tip={
                              copiedKey === `hex-${id}` ? "Copied!" : "Copy hex"
                            }
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onCopyText?.(
                                  formatHexCode(hex),
                                  `hex-${id}`,
                                  "HEX Code"
                                );
                              }}
                              className="text-base-content/40 hover:text-primary p-0.5 rounded transition-colors cursor-pointer ml-0.5"
                              aria-label="Copy hex code"
                            >
                              {copiedKey === `hex-${id}` ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Company */}
                    <td className="py-4 px-4 hidden lg:table-cell">
                      {companyName ? (
                        <div className="flex items-center gap-1.5 text-xs text-base-content/80 font-medium">
                          <Building className="w-3.5 h-3.5 text-base-content/40 shrink-0" />
                          <span className="truncate max-w-[150px]">{companyName}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-base-content/40">—</span>
                      )}
                    </td>

                    {/* Description */}
                    <td className="py-4 px-4 hidden xl:table-cell max-w-[200px]">
                      <span
                        className="text-xs text-base-content/65 line-clamp-1 truncate block"
                        title={desc || ""}
                      >
                        {desc || "—"}
                      </span>
                    </td>

                    {/* Catalog Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <label className="inline-flex cursor-pointer items-center gap-2 select-none">
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={() => onToggleStatus?.(color)}
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

                    {/* Actions */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <div className="tooltip tooltip-left" data-tip="View Details">
                          <button
                            type="button"
                            onClick={() => onViewDetails?.(color)}
                            className="p-1.5 rounded-xl hover:bg-base-200 text-base-content/60 hover:text-base-content transition-colors cursor-pointer"
                            aria-label="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="tooltip tooltip-left" data-tip="Edit Color">
                          <button
                            type="button"
                            onClick={() => onEdit?.(color)}
                            className="p-1.5 rounded-xl hover:bg-primary/10 text-base-content/60 hover:text-primary transition-colors cursor-pointer"
                            aria-label="Edit Color"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div
                          className="tooltip tooltip-left tooltip-error"
                          data-tip="Delete Color"
                        >
                          <button
                            type="button"
                            onClick={() => onDelete?.(color)}
                            className="p-1.5 rounded-xl hover:bg-rose-500/10 text-base-content/60 hover:text-rose-600 transition-colors cursor-pointer"
                            aria-label="Delete Color"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
