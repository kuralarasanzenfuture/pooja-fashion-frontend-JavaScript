import { useRef, useState } from "react";
import { ImagePlus, RefreshCw, Trash2, Sparkles, AlertCircle } from "lucide-react";

const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

/**
 * Brand Logo Drag & Drop Image Uploader
 */
export default function BrandLogoUploader({
  previewUrl,
  onSelect,
  onRemove,
  maxSizeMB = 5,
  disabled = false,
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const pick = (file) => {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      setError("Please select a valid image file (PNG, JPG, WebP, or SVG).");
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Logo must be smaller than ${maxSizeMB} MB.`);
      return;
    }
    setError("");
    onSelect(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    pick(e.dataTransfer.files?.[0]);
  };

  const openPicker = () => !disabled && inputRef.current?.click();

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          pick(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {previewUrl ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-base-300 bg-base-200/70 shadow-xs flex items-center justify-center p-4"
        >
          <img
            src={previewUrl}
            alt="Brand logo preview"
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />

          {/* Top Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-medium text-white shadow-md">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Brand Logo</span>
          </div>

          {/* Drag over replace overlay */}
          {dragging && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-primary/80 backdrop-blur-xs text-white">
              <RefreshCw className="h-8 w-8 animate-spin" />
              <p className="mt-2 text-xs font-semibold">Drop to replace logo</p>
            </div>
          )}

          {/* Hover Action Buttons */}
          {!disabled && (
            <div className="absolute inset-0 flex items-center justify-center gap-2.5 bg-black/50 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
              <button
                type="button"
                onClick={openPicker}
                className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-md hover:bg-slate-100 cursor-pointer transition-all"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Replace</span>
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md hover:bg-rose-700 cursor-pointer transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={openPicker}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPicker();
            }
          }}
          className={`flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center transition-all ${
            dragging
              ? "border-primary bg-primary/10 scale-[0.99]"
              : "border-base-300 bg-base-200/50 hover:border-primary/50 hover:bg-base-200"
          } ${disabled ? "pointer-events-none opacity-50" : ""}`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-base-100 border border-base-300 text-primary shadow-xs mb-3">
            <ImagePlus className="h-6 w-6" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-base-content">
            Drag & drop brand logo here, or <span className="text-primary underline">browse</span>
          </p>
          <p className="mt-1 text-[11px] text-base-content/50">
            Supports PNG, SVG, JPG, WebP (up to {maxSizeMB}MB)
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

