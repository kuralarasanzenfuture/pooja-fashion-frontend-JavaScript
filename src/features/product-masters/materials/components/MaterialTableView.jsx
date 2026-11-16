import React from "react";
import { Eye, Edit2, Trash2, Copy, Check, Building, Layers } from "lucide-react";
import MaterialThumb from "./MaterialThumb.jsx";

/**
 * MaterialTableView
 * Premium table view for materials master with avatars, copyable codes,
 * catalog status toggle, and action buttons.
 */
export default function MaterialTableView({
  materials = [],
  onViewDetails,
  onEdit,
  onDelete,
  onToggleStatus,
  onCopyText,
  copiedKey,
  statusUpdatingId = null,
}) {
  return (
    <div className="bg-base-100 rounded-2xl border border-base-200 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-base-200 bg-base-200/50 text-[11px] font-bold uppercase tracking-wider text-base-content/60 select-none">
              <th className="py-3.5 px-4 text-center w-16">ID</th>
              <th className="py-3.5 px-4">Material Details</th>
              <th className="py-3.5 px-4">Material Code</th>
              <th className="py-3.5 px-4 hidden lg:table-cell">Company</th>
              <th className="py-3.5 px-4 hidden xl:table-cell">Description</th>
              <th className="py-3.5 px-4 w-32 whitespace-nowrap">Catalog Status</th>
              <th className="py-3.5 px-4 text-right w-28 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200/80 text-xs sm:text-sm">
            {materials.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-base-content/50">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Layers className="w-8 h-8 text-base-content/30" />
                    <p className="font-medium text-sm">No materials found</p>
                    <p className="text-xs text-base-content/40">
                      Try adjusting your search or filters, or add a new material.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              materials.map((mat, index) => {
                const id = mat.id;
                const name = mat.materialName || mat.material_name || "Unnamed";
                const code = mat.materialCode || mat.material_code;
                const companyName = mat.companyName || mat.company_name;
                const desc = mat.description;
                const isActive = Boolean(
                  mat.isActive !== undefined ? mat.isActive : mat.is_active
                );
                const isStatusPending = statusUpdatingId === id;

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

                    {/* Material Details (Avatar + Name) */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <MaterialThumb
                          name={name}
                          code={code}
                          size="md"
                          onClick={() => onViewDetails?.(mat)}
                        />
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => onViewDetails?.(mat)}
                            className="font-bold text-base-content hover:text-primary transition-colors cursor-pointer text-left truncate block text-xs sm:text-sm"
                            title={name}
                          >
                            {name}
                          </button>
                          <span className="text-[11px] text-base-content/50 truncate block mt-0.5">
                            Fabric / Textile Composition
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Material Code */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {code ? (
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20">
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
                                onCopyText?.(code, `code-${id}`, "Material Code");
                              }}
                              className="p-1 text-base-content/40 hover:text-primary rounded-md hover:bg-base-200 transition-colors cursor-pointer"
                              aria-label="Copy Material Code"
                            >
                              {copiedKey === `code-${id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-base-content/40">—</span>
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
                    <td className="py-4 px-4 hidden xl:table-cell max-w-[220px]">
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
                          onChange={() => onToggleStatus?.(mat)}
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
                            onClick={() => onViewDetails?.(mat)}
                            className="p-1.5 rounded-xl hover:bg-base-200 text-base-content/60 hover:text-base-content transition-colors cursor-pointer"
                            aria-label="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="tooltip tooltip-left" data-tip="Edit Material">
                          <button
                            type="button"
                            onClick={() => onEdit?.(mat)}
                            className="p-1.5 rounded-xl hover:bg-primary/10 text-base-content/60 hover:text-primary transition-colors cursor-pointer"
                            aria-label="Edit Material"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div
                          className="tooltip tooltip-left tooltip-error"
                          data-tip="Delete Material"
                        >
                          <button
                            type="button"
                            onClick={() => onDelete?.(mat)}
                            className="p-1.5 rounded-xl hover:bg-rose-500/10 text-base-content/60 hover:text-rose-600 transition-colors cursor-pointer"
                            aria-label="Delete Material"
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
