import React, { useState } from "react";
import {
  X,
  Tag,
  Edit2,
  Trash2,
  Copy,
  Check,
  Building,
  Calendar,
  Package,
  ShoppingBag,
  Truck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Scissors,
} from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";
import ProductTypeThumb from "./ProductTypeThumb.jsx";

export default function ProductTypeDetailsModal({
  isOpen = false,
  onClose,
  productType = null,
  onEdit,
  onDelete,
}) {
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isOpen && Boolean(productType),
    onClose
  );

  const [copied, setCopied] = useState(false);

  if (!isRendered || !productType) return null;

  const id = productType.id;
  const name = productType.typeName || productType.type_name || "Unnamed Type";
  const code = productType.typeCode || productType.type_code;
  const description = productType.description;
  const companyName = productType.companyName || productType.company_name || "Pooja Fashion";
  const isStockItem = productType.isStockItem !== undefined ? Boolean(productType.isStockItem) : Boolean(productType.is_stock_item);
  const isSaleable = productType.isSaleable !== undefined ? Boolean(productType.isSaleable) : Boolean(productType.is_saleable);
  const isPurchasable = productType.isPurchasable !== undefined ? Boolean(productType.isPurchasable) : Boolean(productType.is_purchasable);
  const isActive = Boolean(productType.isActive !== undefined ? productType.isActive : productType.is_active);
  const createdAt = productType.createdAt || productType.created_at;
  const updatedAt = productType.updatedAt || productType.updated_at;

  const handleCopyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={backdropClasses}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full max-w-2xl bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden ${cardClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-base-200">
          <div className="flex items-center gap-3">
            <ProductTypeThumb name={name} code={code} size="md" />
            <div>
              <h3 className="text-base font-black text-base-content tracking-tight">
                {name}
              </h3>
              <p className="text-xs text-base-content/60">
                Type ID #{id} • Product Classification Master
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-xl hover:bg-base-200 text-base-content/60 hover:text-base-content transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Identity Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-base-200/50 border border-base-300/80">
              <span className="text-base-content/50 block text-[11px] font-bold uppercase mb-1">
                TYPE CODE
              </span>
              <div className="flex items-center justify-between gap-1">
                <span className="font-mono font-bold text-sm text-primary truncate">
                  {code || "—"}
                </span>
                {code && (
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-1 hover:bg-base-300/60 rounded text-base-content/50 hover:text-primary transition-colors cursor-pointer shrink-0"
                    title="Copy code"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-base-200/50 border border-base-300/80">
              <span className="text-base-content/50 block text-[11px] font-bold uppercase mb-1">
                CATALOG STATUS
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {isActive ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    <AlertCircle className="w-3 h-3" /> Inactive
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Usage / Description */}
          {description && (
            <div className="p-3.5 rounded-2xl bg-base-200/40 border border-base-300/70">
              <span className="text-base-content/50 block text-[11px] font-bold uppercase mb-1">
                USAGE & ITEMS
              </span>
              <p className="text-xs text-base-content/80 leading-relaxed whitespace-pre-wrap font-medium">
                {description}
              </p>
            </div>
          )}

          {/* Operational Capabilities Table */}
          <div className="p-4 rounded-2xl bg-base-200/40 border border-base-300 space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/60 block">
              OPERATIONAL SETTINGS
            </span>

            <div className="grid grid-cols-3 gap-2.5">
              <div
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center ${
                  isStockItem
                    ? "bg-indigo-500/10 border-indigo-500/25 text-indigo-700 dark:text-indigo-300"
                    : "bg-base-200/60 border-base-300 text-base-content/40"
                }`}
              >
                <Package className="w-5 h-5 mb-1" />
                <span className="text-xs font-bold">Stock Item</span>
                <span className="text-[10px] mt-0.5 font-bold uppercase font-mono">
                  {isStockItem ? "TRUE" : "FALSE"}
                </span>
              </div>

              <div
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center ${
                  isSaleable
                    ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-700 dark:text-emerald-300"
                    : "bg-base-200/60 border-base-300 text-base-content/40"
                }`}
              >
                <ShoppingBag className="w-5 h-5 mb-1" />
                <span className="text-xs font-bold">Saleable</span>
                <span className="text-[10px] mt-0.5 font-bold uppercase font-mono">
                  {isSaleable ? "TRUE" : "FALSE"}
                </span>
              </div>

              <div
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center ${
                  isPurchasable
                    ? "bg-amber-500/10 border-amber-500/25 text-amber-700 dark:text-amber-300"
                    : "bg-base-200/60 border-base-300 text-base-content/40"
                }`}
              >
                <Truck className="w-5 h-5 mb-1" />
                <span className="text-xs font-bold">Purchasable</span>
                <span className="text-[10px] mt-0.5 font-bold uppercase font-mono">
                  {isPurchasable ? "TRUE" : "FALSE"}
                </span>
              </div>
            </div>
          </div>

          {/* "Why these settings?" Guidance Callout */}
          <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-primary font-bold">
              <HelpCircle className="w-4 h-4" />
              <span className="text-[11px] uppercase tracking-wider font-black">
                Why these settings?
              </span>
            </div>
            <ul className="space-y-1 text-[11px] text-base-content/75 list-disc pl-4">
              <li>
                <strong>is_stock_item:</strong> Whether the product needs inventory tracking.
              </li>
              <li>
                <strong>is_saleable:</strong> Whether you can sell it to customers.
              </li>
              <li>
                <strong>is_purchasable:</strong> Whether you can purchase it from suppliers.
              </li>
              <li>
                <strong>SERVICE:</strong> No physical stock, but it can be sold to customers (e.g. stitching or alteration charges).
              </li>
            </ul>
          </div>

          {/* Company & Audit History */}
          <div className="p-3.5 rounded-2xl bg-base-200/40 border border-base-300/70 space-y-2 text-xs">
            <div className="flex items-center justify-between py-0.5">
              <span className="text-base-content/60 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" /> Company:
              </span>
              <span className="font-semibold text-base-content">{companyName}</span>
            </div>

            {createdAt && (
              <div className="flex items-center justify-between py-0.5 border-t border-base-200/60">
                <span className="text-base-content/60 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Created:
                </span>
                <span className="font-mono text-base-content/80 text-[11px]">
                  {new Date(createdAt).toLocaleString()}
                </span>
              </div>
            )}

            {updatedAt && (
              <div className="flex items-center justify-between py-0.5 border-t border-base-200/60">
                <span className="text-base-content/60 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Updated:
                </span>
                <span className="font-mono text-base-content/80 text-[11px]">
                  {new Date(updatedAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-base-200 bg-base-200/30">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              handleClose();
              onDelete?.(productType);
            }}
            className="text-rose-600 hover:bg-rose-500/10"
          >
            <Trash2 className="w-4 h-4 mr-1.5" /> Delete
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
            >
              Close
            </Button>
            <Button
              type="button"
              variant="clip-six"
              size="sm"
              onClick={() => {
                handleClose();
                onEdit?.(productType);
              }}
            >
              <Edit2 className="w-4 h-4 mr-1.5" /> Edit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
