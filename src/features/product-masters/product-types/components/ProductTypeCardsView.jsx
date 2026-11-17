import React from "react";
import { Eye, Edit2, Trash2, Copy, Check, Building, Tag, Package, ShoppingBag, Truck } from "lucide-react";
import ProductTypeThumb from "./ProductTypeThumb.jsx";

/**
 * ProductTypeCardsView
 * Responsive card grid layout for product types catalog.
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
      <div className="bg-base-100 rounded-2xl border border-base-200 p-12 text-center text-base-content/50 shadow-xs">
        <div className="flex flex-col items-center justify-center gap-2">
          <Tag className="w-10 h-10 text-base-content/30" />
          <p className="font-bold text-base">No product types found</p>
          <p className="text-xs text-base-content/40">
            Try adjusting your search query or filters.
          </p>
        </div>
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
        const companyName = pt.companyName || pt.company_name;
        const isStockItem = pt.isStockItem !== undefined ? Boolean(pt.isStockItem) : Boolean(pt.is_stock_item);
        const isSaleable = pt.isSaleable !== undefined ? Boolean(pt.isSaleable) : Boolean(pt.is_saleable);
        const isPurchasable = pt.isPurchasable !== undefined ? Boolean(pt.isPurchasable) : Boolean(pt.is_purchasable);
        const isActive = Boolean(pt.isActive !== undefined ? pt.isActive : pt.is_active);
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
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-base-200 text-base-content/70 border border-base-300 truncate max-w-[110px]"
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
                    onChange={() => onToggleStatus?.(pt)}
                    disabled={isStatusPending}
                    className="toggle toggle-success toggle-xs"
                    aria-label={`Toggle active status for ${name}`}
                  />
                  <span
                    className={`text-[11px] font-bold ${
                      isActive ? "text-emerald-600 dark:text-emerald-400" : "text-base-content/40"
                    }`}
                  >
                    {isActive ? "Active" : "Off"}
                  </span>
                </label>
              </div>

              {/* Icon & Title */}
              <div className="flex items-start gap-3 my-2">
                <ProductTypeThumb
                  name={name}
                  code={code}
                  size="md"
                  onClick={() => onViewDetails?.(pt)}
                />
                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => onViewDetails?.(pt)}
                    className="font-bold text-sm text-base-content group-hover:text-primary transition-colors text-left line-clamp-1 block cursor-pointer"
                    title={name}
                  >
                    {name}
                  </button>
                  {code && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="font-mono text-[11px] font-bold text-primary px-1.5 py-0.2 rounded bg-primary/10 border border-primary/20">
                        {code}
                      </span>
                      <button
                        type="button"
                        onClick={() => onCopyText?.(code, `card-code-${id}`, "Type Code")}
                        className="text-base-content/40 hover:text-primary p-0.5 rounded transition-colors cursor-pointer"
                        title="Copy Code"
                      >
                        {copiedKey === `card-code-${id}` ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
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

              {/* Operational Flags Badges (TRUE / FALSE) */}
              <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-3 border-t border-base-200/80">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                    isStockItem
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                      : "bg-base-200 text-base-content/50 border-base-300"
                  }`}
                  title={isStockItem ? "Tracked in stock inventory" : "Not stock tracked"}
                >
                  <Package className="w-2.5 h-2.5" />
                  <span>Stock: {isStockItem ? "TRUE" : "FALSE"}</span>
                </span>

                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                    isSaleable
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                      : "bg-base-200 text-base-content/50 border-base-300"
                  }`}
                  title={isSaleable ? "Available for POS & Sales billing" : "Not saleable"}
                >
                  <ShoppingBag className="w-2.5 h-2.5" />
                  <span>Sale: {isSaleable ? "TRUE" : "FALSE"}</span>
                </span>

                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                    isPurchasable
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                      : "bg-base-200 text-base-content/50 border-base-300"
                  }`}
                  title={isPurchasable ? "Available for supplier orders" : "Not purchasable"}
                >
                  <Truck className="w-2.5 h-2.5" />
                  <span>Purchase: {isPurchasable ? "TRUE" : "FALSE"}</span>
                </span>
              </div>
            </div>

            {/* Card Footer: Action Buttons */}
            <div className="flex items-center justify-end gap-1.5 pt-3 mt-3 border-t border-base-200">
              <button
                type="button"
                onClick={() => onViewDetails?.(pt)}
                className="btn btn-ghost btn-xs text-base-content/60 hover:text-primary gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> View
              </button>
              <button
                type="button"
                onClick={() => onEdit?.(pt)}
                className="btn btn-ghost btn-xs text-base-content/60 hover:text-amber-600 gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete?.(pt)}
                className="btn btn-ghost btn-xs text-base-content/60 hover:text-rose-600 gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

