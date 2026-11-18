import React from "react";
import { Eye, Edit2, Trash2, Copy, Check, X, Tag, Package, ShoppingBag, Truck } from "lucide-react";
import ProductTypeThumb from "./ProductTypeThumb.jsx";

/**
 * ProductTypeTableView
 * Matches exact specification with DaisyUI Agency Tooltips:
 * ID | Type Code | Type Name | Stock Item | Saleable | Purchasable | Usage | Catalog Status | Actions
 */
export default function ProductTypeTableView({
  productTypes = [],
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
      <div className="overflow-x-auto scrollbar-none lg:overflow-x-visible">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="border-b border-base-200 bg-base-200/50 text-[11px] font-bold uppercase tracking-wider text-base-content/60 select-none">
              <th className="py-3.5 px-3 text-center w-14">ID</th>
              <th className="py-3.5 px-3">Type Code</th>
              <th className="py-3.5 px-3">Type Name</th>
              <th className="py-3.5 px-3 text-center">
                <div
                  className="tooltip tooltip-top"
                  data-tip="Whether this product type requires physical inventory tracking"
                >
                  <span className="cursor-help">Stock Item</span>
                </div>
              </th>
              <th className="py-3.5 px-3 text-center">
                <div
                  className="tooltip tooltip-top"
                  data-tip="Whether this product type can be sold to customers on POS"
                >
                  <span className="cursor-help">Saleable</span>
                </div>
              </th>
              <th className="py-3.5 px-3 text-center">
                <div
                  className="tooltip tooltip-top"
                  data-tip="Whether this product type can be purchased from vendors"
                >
                  <span className="cursor-help">Purchasable</span>
                </div>
              </th>
              <th className="py-3.5 px-4 min-w-[200px]">Usage</th>
              <th className="py-3.5 px-3 text-center w-28 whitespace-nowrap">
                <div
                  className="tooltip tooltip-top"
                  data-tip="Catalog visibility for sales & product creation"
                >
                  <span className="cursor-help">Status</span>
                </div>
              </th>
              <th className="py-3.5 px-3 text-right w-24 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200/80 text-xs sm:text-sm">
            {productTypes.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-base-content/50">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Tag className="w-8 h-8 text-base-content/30" />
                    <p className="font-medium text-sm">No product types found</p>
                    <p className="text-xs text-base-content/40">
                      Try adjusting your search or filters, or add a new product type.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              productTypes.map((pt, index) => {
                const id = pt.id;
                const name = pt.typeName || pt.type_name || "Unnamed Type";
                const code = pt.typeCode || pt.type_code;
                const description = pt.description;
                const isStockItem =
                  pt.isStockItem !== undefined ? Boolean(pt.isStockItem) : Boolean(pt.is_stock_item);
                const isSaleable =
                  pt.isSaleable !== undefined ? Boolean(pt.isSaleable) : Boolean(pt.is_saleable);
                const isPurchasable =
                  pt.isPurchasable !== undefined ? Boolean(pt.isPurchasable) : Boolean(pt.is_purchasable);
                const isActive = Boolean(pt.isActive !== undefined ? pt.isActive : pt.is_active);
                const isStatusPending = statusUpdatingId === id;

                return (
                  <tr
                    key={id}
                    className="hover:bg-base-200/50 transition-colors group animate-in fade-in-50 duration-200"
                    style={{ animationDelay: `${Math.min(index * 20, 150)}ms` }}
                  >
                    {/* 1. ID */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="font-mono text-xs font-semibold text-base-content/60 bg-base-200/80 px-2 py-0.5 rounded-md">
                        {id}
                      </span>
                    </td>

                    {/* 2. Type Code */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {code ? (
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                            {code}
                          </span>
                          <div
                            className="tooltip tooltip-top"
                            data-tip={copiedKey === `code-${id}` ? "Copied code!" : "Copy code"}
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onCopyText?.(code, `code-${id}`, "Type Code");
                              }}
                              className="p-1 text-base-content/40 hover:text-primary rounded-md hover:bg-base-200 transition-colors cursor-pointer"
                              aria-label="Copy Type Code"
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

                    {/* 3. Type Name */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <ProductTypeThumb
                          name={name}
                          code={code}
                          size="sm"
                          onClick={() => onViewDetails?.(pt)}
                        />
                        <button
                          type="button"
                          onClick={() => onViewDetails?.(pt)}
                          className="font-bold text-base-content hover:text-primary transition-colors cursor-pointer text-left truncate block text-xs sm:text-sm"
                        >
                          {name}
                        </button>
                      </div>
                    </td>

                    {/* 4. Stock Item (TRUE / FALSE) with Tooltip */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <div
                        className="tooltip tooltip-top"
                        data-tip={
                          isStockItem
                            ? "Stock tracked: Inventory quantities and stock alert tracking active"
                            : "Non-stock: No physical stock tracking (e.g. Services, Alterations)"
                        }
                      >
                        {isStockItem ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                            <Check className="w-3 h-3 stroke-[3]" /> TRUE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-base-200 text-base-content/50 border border-base-300">
                            <X className="w-3 h-3 stroke-[2.5]" /> FALSE
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 5. Saleable (TRUE / FALSE) with Tooltip */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <div
                        className="tooltip tooltip-top"
                        data-tip={
                          isSaleable
                            ? "Saleable: Visible on POS terminals and retail billing invoices"
                            : "Non-saleable: Internal manufacturing or expense category"
                        }
                      >
                        {isSaleable ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                            <Check className="w-3 h-3 stroke-[3]" /> TRUE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-base-200 text-base-content/50 border border-base-300">
                            <X className="w-3 h-3 stroke-[2.5]" /> FALSE
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 6. Purchasable (TRUE / FALSE) with Tooltip */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <div
                        className="tooltip tooltip-top"
                        data-tip={
                          isPurchasable
                            ? "Purchasable: Can be procured from textile mills and wholesale suppliers"
                            : "Non-purchasable: Services or internally generated items"
                        }
                      >
                        {isPurchasable ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                            <Check className="w-3 h-3 stroke-[3]" /> TRUE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-base-200 text-base-content/50 border border-base-300">
                            <X className="w-3 h-3 stroke-[2.5]" /> FALSE
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 7. Usage / Description */}
                    <td className="py-3.5 px-4">
                      {description ? (
                        <div className="tooltip tooltip-top max-w-xs" data-tip={description}>
                          <span className="text-xs text-base-content/75 block line-clamp-2 text-left cursor-default">
                            {description}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-base-content/40 italic block">
                          No description
                        </span>
                      )}
                    </td>

                    {/* 8. Catalog Status Toggle with Tooltip (Matching Units Module) */}
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <div
                        className="tooltip tooltip-top"
                        data-tip={
                          isActive
                            ? "Active: Click to hide from product creation"
                            : "Inactive: Click to make visible in product creation"
                        }
                      >
                        <label className="inline-flex cursor-pointer items-center gap-2 select-none">
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={() => onToggleStatus?.(pt)}
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
                            {isStatusPending ? "..." : isActive ? "Active" : "Inactive"}
                          </span>
                        </label>
                      </div>
                    </td>

                    {/* 9. Actions with DaisyUI Tooltips */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <div className="tooltip tooltip-left" data-tip="View Details">
                          <button
                            type="button"
                            onClick={() => onViewDetails?.(pt)}
                            className="p-1.5 rounded-lg text-base-content/60 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                            aria-label="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="tooltip tooltip-left" data-tip="Edit Product Type">
                          <button
                            type="button"
                            onClick={() => onEdit?.(pt)}
                            className="p-1.5 rounded-lg text-base-content/60 hover:text-amber-600 hover:bg-amber-500/10 transition-colors cursor-pointer"
                            aria-label="Edit Product Type"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div
                          className="tooltip tooltip-left tooltip-error"
                          data-tip="Delete Product Type"
                        >
                          <button
                            type="button"
                            onClick={() => onDelete?.(pt)}
                            className="p-1.5 rounded-lg text-base-content/60 hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            aria-label="Delete Product Type"
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
