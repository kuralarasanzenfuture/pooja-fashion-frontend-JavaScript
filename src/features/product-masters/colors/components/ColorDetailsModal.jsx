import React from "react";
import {
  X,
  Palette,
  Building,
  Calendar,
  Copy,
  Check,
  Edit2,
  Clock,
  Layers,
  Sparkles,
} from "lucide-react";
import { useModalAnimation } from "../../../../common/hooks/useModalAnimation.js";
import ColorThumb from "./ColorThumb.jsx";
import {
  formatHexCode,
  hexToRgb,
  getContrastColor,
  isLightColor,
} from "../utils/colorHelper.js";

/**
 * ColorDetailsModal
 * Rich modal preview of color swatch, codes, contrast values, and metadata.
 */
export default function ColorDetailsModal({
  isOpen,
  color,
  onClose,
  onEdit,
  onCopyText,
  copiedKey,
}) {
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isOpen,
    onClose
  );

  if (!isRendered || !color) return null;

  const id = color.id;
  const name = color.colorName || color.color_name || "Unnamed";
  const code = color.colorCode || color.color_code;
  const hex = color.hexCode || color.hex_code;
  const companyName = color.companyName || color.company_name;
  const companyCode = color.companyCode || color.company_code;
  const desc = color.description;
  const displayOrder = color.displayOrder ?? color.display_order ?? 0;
  const isActive = Boolean(
    color.isActive !== undefined ? color.isActive : color.is_active
  );
  const createdAt = color.createdAt || color.created_at;
  const updatedAt = color.updatedAt || color.updated_at;

  const isMulticolor =
    !hex ||
    String(hex).toLowerCase() === "multicolor" ||
    String(code).toUpperCase() === "MULTICOLOR";

  const rgb = hex ? hexToRgb(hex) : null;
  const contrast = hex ? getContrastColor(hex) : "#FFFFFF";

  const fmtDate = (d) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return "—";
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 ${backdropClasses}`}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full max-w-lg bg-base-100 rounded-3xl shadow-2xl border border-base-200 overflow-hidden ${cardClasses}`}
      >
        {/* Header with big color swatch banner */}
        <div className="relative p-6 border-b border-base-200 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <ColorThumb hex={hex} name={name} code={code} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-base-content tracking-tight">
                  {name}
                </h2>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40"
                      : "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40"
                  }`}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-xs text-base-content/60 font-mono">
                Color Master #{id}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-xl hover:bg-base-200 text-base-content/60 hover:text-base-content transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Large Color Swatch Card */}
          <div
            className="w-full h-24 rounded-2xl p-4 flex flex-col justify-between shadow-xs ring-1 ring-black/10 relative overflow-hidden"
            style={{
              background: isMulticolor
                ? "linear-gradient(135deg, #FF0000 0%, #FFA500 20%, #FFFF00 40%, #008000 60%, #0000FF 80%, #800080 100%)"
                : formatHexCode(hex),
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-black/20 backdrop-blur-xs"
                style={{ color: contrast }}
              >
                {isMulticolor ? "MULTICOLOR" : formatHexCode(hex)}
              </span>

              {code && (
                <span
                  className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-black/20 backdrop-blur-xs"
                  style={{ color: contrast }}
                >
                  {code}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs font-semibold" style={{ color: contrast }}>
              <span>{name}</span>
              {rgb && (
                <span className="font-mono text-[11px] opacity-90">
                  rgb({rgb.r}, {rgb.g}, {rgb.b})
                </span>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* Color Code */}
            <div className="p-3 rounded-2xl bg-base-200/50 border border-base-300">
              <span className="text-base-content/50 block text-[11px] font-semibold mb-1">
                Color Code
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-base-content text-sm">
                  {code || "—"}
                </span>
                {code && (
                  <button
                    type="button"
                    onClick={() => onCopyText?.(code, `modal-code-${id}`, "Color Code")}
                    className="text-base-content/40 hover:text-primary p-1 cursor-pointer"
                    title="Copy code"
                  >
                    {copiedKey === `modal-code-${id}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Hex Code */}
            <div className="p-3 rounded-2xl bg-base-200/50 border border-base-300">
              <span className="text-base-content/50 block text-[11px] font-semibold mb-1">
                Hex Code
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-base-content text-sm">
                  {isMulticolor ? "Multicolor" : formatHexCode(hex)}
                </span>
                {!isMulticolor && hex && (
                  <button
                    type="button"
                    onClick={() =>
                      onCopyText?.(formatHexCode(hex), `modal-hex-${id}`, "HEX Code")
                    }
                    className="text-base-content/40 hover:text-primary p-1 cursor-pointer"
                    title="Copy hex code"
                  >
                    {copiedKey === `modal-hex-${id}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Company */}
            <div className="p-3 rounded-2xl bg-base-200/50 border border-base-300 col-span-2 sm:col-span-1">
              <span className="text-base-content/50 block text-[11px] font-semibold mb-1">
                Target Company
              </span>
              <div className="flex items-center gap-1.5 font-semibold text-base-content">
                <Building className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">{companyName || "Global / Default"}</span>
              </div>
            </div>

            {/* Display Order */}
            <div className="p-3 rounded-2xl bg-base-200/50 border border-base-300 col-span-2 sm:col-span-1">
              <span className="text-base-content/50 block text-[11px] font-semibold mb-1">
                Display Order
              </span>
              <span className="font-mono font-bold text-base-content text-sm">
                #{displayOrder}
              </span>
            </div>
          </div>

          {/* Description */}
          {desc && (
            <div className="p-3.5 rounded-2xl bg-base-200/50 border border-base-300">
              <span className="text-base-content/50 block text-[11px] font-semibold mb-1">
                Description
              </span>
              <p className="text-xs text-base-content/80 leading-relaxed">{desc}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className="p-3 rounded-2xl bg-base-200/30 border border-base-200 text-[11px] text-base-content/60 space-y-1">
            <div className="flex items-center justify-between">
              <span>Created</span>
              <span className="font-medium text-base-content/80">{fmtDate(createdAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Last Updated</span>
              <span className="font-medium text-base-content/80">{fmtDate(updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-base-200 bg-base-200/20">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-base-content/70 hover:bg-base-200 cursor-pointer transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              handleClose();
              onEdit?.(color);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-primary-content hover:bg-primary/90 shadow-sm cursor-pointer transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Color</span>
          </button>
        </div>
      </div>
    </div>
  );
}
