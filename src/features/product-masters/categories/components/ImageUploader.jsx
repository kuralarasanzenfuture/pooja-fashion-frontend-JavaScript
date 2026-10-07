import { useRef, useState } from "react";
import { ImagePlus, RefreshCw, Trash2 } from "lucide-react";

const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

/**
 * Presentational image picker.
 */
export default function ImageUploader({
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
      setError("Please select a PNG, JPG, WebP, or SVG image.");
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image must be smaller than ${maxSizeMB} MB.`);
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
          className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-base-300 bg-base-200 shadow-xs"
        >
          <img
            src={previewUrl}
            alt="Category preview"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Top Tag */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[11px] font-medium text-white/90 shadow-md">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Visual Asset</span>
          </div>

          {/* Drag over replace overlay */}
          {dragging && (
            <div className="absolute inset-0 bg-primary/20 backdrop-blur-xs flex items-center justify-center border-2 border-dashed border-primary z-10 transition-all">
              <span className="px-3 py-1.5 rounded-xl bg-base-100 text-primary font-bold text-xs shadow-lg">
                Drop to Replace
              </span>
            </div>
          )}

          {/* Bottom Luxury Action Dock */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8">
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 shadow-xl">
              <button
                type="button"
                onClick={openPicker}
                disabled={disabled}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-white/15 hover:bg-white/25 active:scale-95 transition-all cursor-pointer border border-white/10 shadow-xs group/btn"
                title="Choose another image"
              >
                <RefreshCw className="size-3.5 transition-transform duration-500 group-hover/btn:rotate-180" />
                <span>Replace</span>
              </button>
              <button
                type="button"
                onClick={onRemove}
                disabled={disabled}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/20 hover:bg-rose-600 active:scale-95 transition-all cursor-pointer border border-rose-500/30 shadow-xs hover:shadow-rose-500/25 group/del"
                aria-label="Remove image"
                title="Remove current image"
              >
                <Trash2 className="size-3.5 transition-transform duration-200 group-hover/del:scale-110" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          disabled={disabled}
          className={`flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
            dragging
              ? "border-primary bg-primary/10 scale-[0.99]"
              : "border-base-300 bg-base-200/40 hover:border-primary/60 hover:bg-base-200/70"
          }`}
        >
          <span className="flex size-12 items-center justify-center rounded-2xl bg-base-100 text-primary border border-primary/20 shadow-2xs">
            <ImagePlus className="size-6" />
          </span>
          <div>
            <span className="text-xs sm:text-sm font-semibold text-base-content block">
              Drag & drop image, or <span className="text-primary hover:underline">browse</span>
            </span>
            <span className="text-[11px] text-base-content/50 block mt-0.5">
              PNG, JPG, WebP up to {maxSizeMB} MB
            </span>
          </div>
        </button>
      )}

      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
}
