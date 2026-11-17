import React from "react";
import { Eye, Edit2, Trash2, Copy, Check, Building, Tag, Package, ShoppingBag, Truck } from "lucide-react";
import ProductTypeThumb from "./ProductTypeThumb.jsx";

/**
 * ProductTypeTableView
 * Premium table view for Product Types master with operational flag badges,
 * copyable codes, catalog status toggle, and action buttons.
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
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-base-200 bg-base-200/50 text-[11px] font-bold uppercase tracking-wider text-base-content/60 select-none">
              <th className="py-3.5 px-4 text-center w-16">ID</th>
              <th className="py-3.5 px-4">Type Details</th>
              <th className="py-3.5 px-4">Type Code</th>
              <th className="py-3.5 px-4">Operational Flags</th>
              <th className="py-3.5 px-4 hidden lg:table-cell">Company</th>
              <th className="py-3.5 px-4 w-32 whitespace-nowrap">Catalog Status</th>
              <th className="py-3.5 px-4 text-right w-28 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200/80 text-xs sm:text-sm">
            {productTypes.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-base-content/50">
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
                const companyName = pt.companyName || pt.company_name;
                const isStockItem = pt.isStockItem !== undefined ? Boolean(pt.isStockItem) : Boolean(pt.is_stock_item);
                const isSaleable = pt.isSaleable !== undefined ? Boolean(pt.isSaleable) : Boolean(pt.is_saleable);
                const isPurchasable = pt.isPurchasable !== undefined ? Boolean(pt.isPurchasable) : Boolean(pt.is_purchasable);
                const isActive = Boolean(pt.isActive !== undefined ? pt.isActive : pt.is_active);
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

                    {/* Type Details (Avatar + Name + Description) */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <ProductTypeThumb
                          name={name}
                          code={code}
                          size="md"
                          onClick={() => onViewDetails?.(pt)}
                        />
                        <div className="min-w-0 max-w-xs">
                          <button
                            type="button"
                            onClick={() => onViewDetails?.(pt)}
                            className="font-bold text-base-content hover:text-primary transition-colors cursor-pointer text-left truncate block text-xs sm:text-sm"
                            title={name}
                          >
                            {name}
                          </button>
                          {description ? (
                            <span className="text-[11px] text-base-content/50 truncate block mt-0.5">
                              {description}
                            </span>
                          ) : (
                            <span className="text-[11px] text-base-content/40 italic block mt-0.5">
                              No description
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Type Code */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {code ? (
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                            {code}
                          </span>
                          <div
                            className="tooltip tooltip-top"
                            data-tip={copiedKey === `code-${id}` ? "Copied!" : "Copy code"}
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

                    {/* Operational Flags */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Stock Item Flag */}
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                            isStockItem
                              ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                              : "bg-base-200 text-base-content/50 border-base-300 line-through"
                          }`}
                          title={isStockItem ? "Tracked in stock inventory" : "Not stock tracked"}
                        >
                          <Package className="w-2.5 h-2.5" />
                          <span>Stock</span>
                        </span>

                        {/* Saleable Flag */}
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                            isSaleable
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : "bg-base-200 text-base-content/50 border-base-300 line-through"
                          }`}
                          title={isSaleable ? "Available for POS & Sales billing" : "Not saleable"}
                        >
                          <ShoppingBag className="w-2.5 h-2.5" />
                          <span>Sale</span>
                        </span>

                        {/* Purchasable Flag */}
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                            isPurchasable
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                              : "bg-base-200 text-base-content/50 border-base-300 line-through"
                          }`}
                          title={isPurchasable ? "Available for purchase orders & inward" : "Not purchasable"}
                        >
                          <Truck className="w-2.5 h-2.5" />
                          <span>Purchase</span>
                        </span>
                      </div>
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

                    {/* Catalog Status Toggle */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <label className="inline-flex cursor-pointer items-center gap-2 select-none">
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={() => onToggleStatus?.(pt)}
                          disabled={isStatusPending}
                          className="toggle toggle-success toggle-xs"
                          aria-label={`Toggle active status for ${name}`}
                        />
                        <span
                          className={`text-xs font-semibold transition-colors ${
                            isActive
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-base-content/50"
                          }`}
                        >
                          {isStatusPending ? "Saving..." : isActive ? "Active" : "Inactive"}
                        </span>
                      </label>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onViewDetails?.(pt)}
                          className="p-1.5 rounded-lg hover:bg-base-200 text-base-content/60 hover:text-primary transition-colors cursor-pointer"
                          title="View Details"
                          aria-label="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit?.(pt)}
                          className="p-1.5 rounded-lg hover:bg-base-200 text-base-content/60 hover:text-amber-600 transition-colors cursor-pointer"
                          title="Edit Product Type"
                          aria-label="Edit Product Type"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete?.(pt)}
                          className="p-1.5 rounded-lg hover:bg-rose-500/10 text-base-content/60 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete Product Type"
                          aria-label="Delete Product Type"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
