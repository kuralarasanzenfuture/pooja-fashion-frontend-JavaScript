import React from "react";
import { Eye, Edit2, Trash2, Copy, Check, Tag, Package, ShoppingBag, Truck, Building } from "lucide-react";
import ProductTypeThumb from "./ProductTypeThumb.jsx";

/**
 * ProductTypeCardsView
 * Responsive card grid presentation with DaisyUI Agency Tooltips.
 */
export default function ProductTypeCardsView({
  productTypes = [],
  onViewDetails,
  onEdit,
  onDelete,
  onToggleStatus,
  onCopyText,
  copiedKey,
  statusUpdatingId = null,
}) {
  if (productTypes.length === 0) {
    return (
      <div className="bg-base-100 rounded-3xl border border-base-200 p-12 text-center shadow-xs">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-4">
          <Tag className="w-8 h-8" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-base-content">
          No product types found
        </h3>
        <p className="text-xs sm:text-sm text-base-content/60 mt-1 max-w-sm mx-auto">
          No records match your search or filter criteria. Try adjusting filters or create a new product type.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {productTypes.map((pt, index) => {
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
        const companyName = pt.companyName || pt.company_name;
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
                    <div
                      className="tooltip tooltip-top max-w-[150px]"
                      data-tip={`Company: ${companyName}`}
                    >
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-base-200 text-base-content/70 border border-base-300 truncate max-w-[120px] cursor-default">
                        <Building className="w-2.5 h-2.5 text-primary shrink-0" />
                        <span className="truncate">{companyName}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Status Toggle Switch with Tooltip (Matching Units Module) */}
                <div
                  className="tooltip tooltip-left"
                  data-tip={isActive ? "Active in catalog" : "Hidden from catalog"}
                >
                  <label className="inline-flex cursor-pointer items-center gap-1.5 select-none shrink-0">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => onToggleStatus?.(pt)}
                      disabled={isStatusPending}
                      className="toggle toggle-success toggle-sm"
                      aria-label={`Toggle active status for ${name}`}
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
              </div>

              {/* Icon & Title */}
              <div className="flex items-start gap-3 my-2">
                <ProductTypeThumb
                  name={name}
                  code={code}
                  size="md"
                  onClick={() => onViewDetails?.(pt)}
                />

                <div className="flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => onViewDetails?.(pt)}
                    className="font-bold text-sm text-base-content group-hover:text-primary transition-colors text-left line-clamp-1 block cursor-pointer"
                  >
                    {name}
                  </button>
                  {code && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="font-mono text-[11px] font-bold text-primary px-1.5 py-0.2 rounded bg-primary/10 border border-primary/20">
                        {code}
                      </span>
                      <div
                        className="tooltip tooltip-top"
                        data-tip={copiedKey === `card-code-${id}` ? "Copied code!" : "Copy code"}
                      >
                        <button
                          type="button"
                          onClick={() => onCopyText?.(code, `card-code-${id}`, "Type Code")}
                          className="text-base-content/40 hover:text-primary p-0.5 rounded transition-colors cursor-pointer"
                          aria-label="Copy Code"
                        >
                          {copiedKey === `card-code-${id}` ? (
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

              {/* Usage / Description */}
              <div className="mt-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 block">
                  Usage:
                </span>
                {description ? (
                  <p className="text-xs text-base-content/75 line-clamp-2 mt-0.5">
                    {description}
                  </p>
                ) : (
                  <p className="text-xs text-base-content/40 italic mt-0.5">
                    No description provided
                  </p>
                )}
              </div>

              {/* Operational Flags Badges (TRUE / FALSE) with Tooltips */}
              <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-3 border-t border-base-200/80">
                <div
                  className="tooltip tooltip-top"
                  data-tip={isStockItem ? "Physical stock tracked" : "No stock tracking"}
                >
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border cursor-default ${
                      isStockItem
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                        : "bg-base-200 text-base-content/50 border-base-300"
                    }`}
                  >
                    <Package className="w-2.5 h-2.5" />
                    <span>Stock: {isStockItem ? "TRUE" : "FALSE"}</span>
                  </span>
                </div>

                <div
                  className="tooltip tooltip-top"
                  data-tip={isSaleable ? "POS saleable & billable" : "Not saleable"}
                >
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border cursor-default ${
                      isSaleable
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                        : "bg-base-200 text-base-content/50 border-base-300"
                    }`}
                  >
                    <ShoppingBag className="w-2.5 h-2.5" />
                    <span>Sale: {isSaleable ? "TRUE" : "FALSE"}</span>
                  </span>
                </div>

                <div
                  className="tooltip tooltip-top"
                  data-tip={isPurchasable ? "Procured from suppliers" : "Not purchasable"}
                >
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border cursor-default ${
                      isPurchasable
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                        : "bg-base-200 text-base-content/50 border-base-300"
                    }`}
                  >
                    <Truck className="w-2.5 h-2.5" />
                    <span>Purchase: {isPurchasable ? "TRUE" : "FALSE"}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Card Footer: Action Buttons with DaisyUI Tooltips */}
            <div className="flex items-center justify-end gap-1 pt-3 mt-3 border-t border-base-200">
              <div className="tooltip tooltip-top" data-tip="View Details">
                <button
                  type="button"
                  onClick={() => onViewDetails?.(pt)}
                  className="p-1.5 rounded-lg text-base-content/60 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                  aria-label="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              <div className="tooltip tooltip-top" data-tip="Edit Product Type">
                <button
                  type="button"
                  onClick={() => onEdit?.(pt)}
                  className="p-1.5 rounded-lg text-base-content/60 hover:text-amber-600 hover:bg-amber-500/10 transition-colors cursor-pointer"
                  aria-label="Edit Product Type"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <div className="tooltip tooltip-top tooltip-error" data-tip="Delete Product Type">
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
          </div>
        );
      })}
    </div>
  );
}
