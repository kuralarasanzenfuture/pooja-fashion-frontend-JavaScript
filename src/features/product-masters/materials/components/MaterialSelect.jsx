import React, { useState, useRef, useEffect } from "react";
import { Layers, ChevronDown, Check, Search, AlertCircle, X } from "lucide-react";
import MaterialThumb from "./MaterialThumb.jsx";

/**
 * Premium DaisyUI Material Select Component
 * Replaces native HTML select with an accessible DaisyUI styled dropdown.
 */
export default function MaterialSelect({
  value,
  onChange,
  onBlur,
  materials = [],
  isLoading = false,
  error,
  disabled = false,
  label = "Fabric Material",
  required = false,
  helperText,
  placeholder = "-- Select Fabric Material --",
  className = "",
  allowClear = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedMaterial = materials.find(
    (m) => String(m.id) === String(value) || String(m.materialCode) === String(value)
  );

  const filteredMaterials = materials.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    const name = String(m.materialName || m.material_name || "").toLowerCase();
    const code = String(m.materialCode || m.material_code || "").toLowerCase();
    const desc = String(m.description || "").toLowerCase();
    return name.includes(q) || code.includes(q) || desc.includes(q);
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        if (onBlur) onBlur();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onBlur]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    if (!isOpen) {
      setSearch("");
    }
  }, [isOpen]);

  const handleSelect = (mat) => {
    if (disabled) return;
    onChange(mat.id);
    setIsOpen(false);
    setSearch("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (disabled) return;
    onChange("");
  };

  return (
    <div className={`space-y-1.5 relative ${className}`} ref={dropdownRef}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/70">
            {label} {required && <span className="text-error">*</span>}
          </label>
          <span className="text-[11px] text-base-content/50">
            {materials.length} active {materials.length === 1 ? "fabric" : "fabrics"}
          </span>
        </div>
      )}

      {/* Trigger Box */}
      <div
        tabIndex={0}
        role="button"
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 bg-base-100 ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-base-200 border-base-300"
            : isOpen
            ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
            : error
            ? "border-rose-500 ring-2 ring-rose-500/20 text-rose-600"
            : "border-base-300 hover:border-primary/50 hover:bg-base-200/30"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {selectedMaterial ? (
            <MaterialThumb
              name={selectedMaterial.materialName || selectedMaterial.material_name}
              code={selectedMaterial.materialCode || selectedMaterial.material_code}
              size="xs"
              className="shrink-0"
            />
          ) : (
            <div className="w-6 h-6 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Layers className="w-3.5 h-3.5" />
            </div>
          )}

          {selectedMaterial ? (
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-semibold text-base-content truncate">
                {selectedMaterial.materialName || selectedMaterial.material_name}
              </span>
              {(selectedMaterial.materialCode || selectedMaterial.material_code) && (
                <span className="badge badge-sm badge-primary font-mono text-[10px] uppercase font-bold tracking-wider shrink-0">
                  {selectedMaterial.materialCode || selectedMaterial.material_code}
                </span>
              )}
            </div>
          ) : (
            <span className="text-base-content/40 font-normal">
              {isLoading ? "Loading available materials..." : placeholder}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {allowClear && selectedMaterial && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-base-content/40 hover:text-base-content rounded-full hover:bg-base-200"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 text-base-content/50 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-primary" : ""
            }`}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-base-100 rounded-2xl border border-base-300 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {materials.length > 5 && (
            <div className="p-2 border-b border-base-200 bg-base-200/40">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search fabric name or code..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-base-300 bg-base-100 text-base-content focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto p-1.5 space-y-1">
            {filteredMaterials.length === 0 ? (
              <div className="py-8 text-center text-xs text-base-content/50">
                <Layers className="w-6 h-6 mx-auto mb-1 text-base-content/30" />
                No materials found
              </div>
            ) : (
              filteredMaterials.map((mat) => {
                const isSelected =
                  String(mat.id) === String(value) ||
                  String(mat.materialCode) === String(value);
                const name = mat.materialName || mat.material_name;
                const code = mat.materialCode || mat.material_code;

                return (
                  <button
                    key={mat.id}
                    type="button"
                    onClick={() => handleSelect(mat)}
                    className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-primary text-primary-content font-bold shadow-xs"
                        : "text-base-content hover:bg-primary/10 hover:text-primary font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MaterialThumb
                        name={name}
                        code={code}
                        size="xs"
                        className="shrink-0"
                      />
                      <div className="truncate">
                        <span className="truncate block text-xs sm:text-sm">{name}</span>
                        {code && (
                          <span className="text-[11px] opacity-75 font-mono">{code}</span>
                        )}
                      </div>
                    </div>

                    {isSelected && <Check className="w-4 h-4 shrink-0 text-primary-content ml-2" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Helper / Error Text */}
      {error ? (
        <p className="text-xs text-rose-500 font-medium flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-base-content/50 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}
