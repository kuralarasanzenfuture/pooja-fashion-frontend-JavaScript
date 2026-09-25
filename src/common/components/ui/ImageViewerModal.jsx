import React, { useState, useEffect } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Maximize2,
  Minimize2,
  Image as ImageIcon,
} from "lucide-react";

/**
 * High-Quality Image Viewer / Lightbox Modal
 * Provides interactive zoom, rotation, download, and crystal-clear inspection.
 */
export default function ImageViewerModal({
  isOpen = false,
  onClose,
  src = "",
  title = "Company Brand Logo",
  subtitle = "High-Resolution Image Preview",
}) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Reset controls when modal opens
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setRotation(0);
      setIsFullscreen(false);
    }
  }, [isOpen, src]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !src) return null;

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => {
    setScale(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handleDownload = () => {
    try {
      const a = document.createElement("a");
      a.href = src;
      a.download = `${title.toLowerCase().replace(/\s+/g, "-")}-logo.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("Failed to download image:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-black/90 backdrop-blur-md animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      {/* Top Controls Toolbar */}
      <div
        className="w-full px-4 sm:px-6 py-3.5 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 text-white min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
            <ImageIcon className="w-5 h-5 text-amber-300" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-white truncate leading-tight">
              {title}
            </h3>
            <p className="text-[11px] text-white/60 truncate font-mono">
              {subtitle} • {Math.round(scale * 100)}% zoom
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Zoom Out */}
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
            title="Zoom Out"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white disabled:opacity-40 transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Reset Zoom */}
          <button
            type="button"
            onClick={handleResetZoom}
            title="Reset 100%"
            className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-semibold transition-colors cursor-pointer"
          >
            {Math.round(scale * 100)}%
          </button>

          {/* Zoom In */}
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={scale >= 3}
            title="Zoom In"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white disabled:opacity-40 transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Rotate */}
          <button
            type="button"
            onClick={handleRotate}
            title="Rotate 90°"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Download */}
          <button
            type="button"
            onClick={handleDownload}
            title="Download High-Resolution Image"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-white/20 mx-1 hidden sm:block" />

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            title="Close Preview (Esc)"
            className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-200 hover:text-white border border-rose-500/30 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        className="flex-1 w-full flex items-center justify-center p-4 sm:p-8 overflow-hidden relative"
        onClick={(e) => {
          // Clicking directly on the stage closes, but not when clicking on image
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div
          className="relative max-w-full max-h-full flex items-center justify-center transition-transform duration-200 ease-out cursor-grab active:cursor-grabbing"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={src}
            alt={title}
            className="max-h-[75vh] max-w-[88vw] object-contain rounded-2xl shadow-2xl ring-1 ring-white/10"
            draggable={false}
          />
        </div>
      </div>

      {/* Bottom Hint */}
      <div
        className="w-full py-2.5 px-4 text-center bg-gradient-to-t from-black/80 to-transparent z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs text-white/50 font-medium">
          Click outside or press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">Esc</kbd> to close. Use controls to zoom in for high definition details.
        </p>
      </div>
    </div>
  );
}
