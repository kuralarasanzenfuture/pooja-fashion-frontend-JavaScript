import React, { useState } from "react";
import {
  X,
  Layers,
  Edit2,
  Trash2,
  Copy,
  Check,
  Building,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";
import MaterialThumb from "./MaterialThumb.jsx";

export default function MaterialDetailsModal({
  isOpen = false,
  onClose,
  material = null,
  onEdit,
  onDelete,
}) {
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isOpen && Boolean(material),
    onClose
  );

  const [copied, setCopied] = useState(false);

  if (!isRendered || !material) return null;

  const id = material.id;
  const name = material.materialName || material.material_name || "Unnamed Material";
  const code = material.materialCode || material.material_code;
  const companyName = material.companyName || material.company_name || "Pooja Fashion";
  const desc = material.description;
  const isActive = Boolean(
    material.isActive !== undefined ? material.isActive : material.is_active
  );
  const createdAt = material.createdAt || material.created_at;
  const updatedAt = material.updatedAt || material.updated_at;

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
        className={`relative w-full max-w-lg bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden ${cardClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-base-200">
          <div className="flex items-center gap-3">
            <MaterialThumb name={name} code={code} size="md" />
            <div>
              <h3 className="text-base font-black text-base-content tracking-tight">
                {name}
              </h3>
              <p className="text-xs text-base-content/60">
                Material ID #{id} • Fabric Specification
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
                MATERIAL CODE
              </span>
              <div className="flex items-center justify-between gap-1">
                <span className="font-mono font-bold text-sm text-primary truncate">
                  {code || "—"}
                </span>
                {code && (
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-1 rounded-lg hover:bg-base-300/50 text-base-content/50 hover:text-primary transition-colors cursor-pointer"
                    title="Copy code"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-base-200/50 border border-base-300/80">
              <span className="text-base-content/50 block text-[11px] font-bold uppercase mb-1">
                STATUS
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                    : "bg-rose-50 text-rose-700 border-rose-200/80"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                />
                {isActive ? "Active in Catalog" : "Inactive / Archived"}
              </span>
            </div>
          </div>

          {/* Company Info */}
          <div className="p-3.5 rounded-2xl bg-base-200/50 border border-base-300/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-base-content/50 block text-[11px] font-bold uppercase">
                COMPANY OWNER
              </span>
              <span className="font-semibold text-base-content mt-0.5 block">
                {companyName}
              </span>
            </div>
            <Building className="w-5 h-5 text-base-content/30" />
          </div>

          {/* Description */}
          <div className="p-3.5 rounded-2xl bg-base-200/30 border border-base-300/80 space-y-1 text-xs">
            <span className="text-base-content/50 block text-[11px] font-bold uppercase">
              DESCRIPTION
            </span>
            <p className="text-base-content/80 leading-relaxed">
              {desc || "No special retail description provided for this fabric material."}
            </p>
          </div>

          {/* Timestamps */}
          <div className="pt-2 border-t border-base-200 text-[11px] text-base-content/50 flex flex-wrap gap-4">
            {createdAt && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Created: {new Date(createdAt).toLocaleDateString()}
              </span>
            )}
            {updatedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Updated: {new Date(updatedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-base-200 bg-base-200/30">
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete?.(material)}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="clip-six"
              size="sm"
              onClick={() => onEdit?.(material)}
              leftIcon={<Edit2 className="w-4 h-4" />}
            >
              Edit Material
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
