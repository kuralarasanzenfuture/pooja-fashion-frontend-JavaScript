import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFontFamily } from "../../redux/ui/uiSlice.js";
import {
  Sparkles,
  ChevronDown,
  Check,
  Crown,
  Laptop,
  Layers,
} from "lucide-react";

const FONT_OPTIONS = [
  {
    id: "outfit",
    name: "Modern Luxe",
    preview: "Outfit",
    badge: "Recommended",
    badgeColor: "bg-sky-100 text-[#1e3a8a] border-sky-200",
    description: "Modern Boutique & High Fashion",
    icon: Sparkles,
  },
  {
    id: "luxury",
    name: "Royal Boutique",
    preview: "Playfair Display",
    badge: "Heritage Silk",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-200",
    description: "Royal Sarees & Bridal Studio",
    icon: Crown,
  },
  {
    id: "jakarta",
    name: "Tech Modern",
    preview: "Plus Jakarta",
    badge: "Ultra Crisp",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-200",
    description: "Fast POS & Inventory Focus",
    icon: Laptop,
  },
  {
    id: "inter",
    name: "Enterprise Clean",
    preview: "Inter",
    badge: "Neutral",
    badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
    description: "Textile ERP & Accounting",
    icon: Layers,
  },
];

export default function FontSwitcher({ className = "" }) {
  const dispatch = useDispatch();
  const currentFont = useSelector((state) => state.ui?.fontFamily) || "outfit";
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedPreset = FONT_OPTIONS.find((f) => f.id === currentFont) || FONT_OPTIONS[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectFont = (fontId) => {
    dispatch(setFontFamily(fontId));
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={`dropdown dropdown-bottom dropdown-end ${
        isOpen ? "dropdown-open" : ""
      } relative inline-block text-left ${className}`}
    >
      {/* DaisyUI / Luxury Trigger Button */}
      <button
        type="button"
        role="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-primary/20 group ${
          isOpen
            ? "bg-base-200 border-primary shadow-xs ring-1 ring-primary/40 text-base-content"
            : "bg-base-200 hover:bg-base-300 border-base-300 text-base-content"
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-bold text-base-content tracking-tight">
          {selectedPreset.name}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-transform duration-250 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* DaisyUI Dropdown Menu Content */}
      {isOpen && (
        <div
          className="dropdown-content absolute right-0 top-full z-50 mt-2 w-76 bg-base-100 text-base-content backdrop-blur-xl rounded-2xl shadow-2xl border border-base-300 p-2 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="px-3 py-2 border-b border-base-200 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-base-content/60 font-mono flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-primary" /> Boutique Fonts
            </span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              Live Preview
            </span>
          </div>

          {/* Options List */}
          <ul className="menu menu-sm p-0 py-1 space-y-1 w-full" role="listbox">
            {FONT_OPTIONS.map((opt) => {
              const isSelected = opt.id === currentFont;
              const Icon = opt.icon;

              return (
                <li key={opt.id} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => handleSelectFont(opt.id)}
                    className={`w-full !flex !items-center !justify-between p-2.5 rounded-xl transition-all text-left cursor-pointer ${
                      isSelected
                        ? "!bg-primary !text-primary-content shadow-xs font-bold"
                        : "hover:bg-base-200 text-base-content/80 hover:text-base-content"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-primary-content/20 text-primary-content"
                            : "bg-base-200 text-base-content/70"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold leading-tight truncate">
                          {opt.name}
                        </div>
                        <div
                          className={`text-[10px] truncate mt-0.5 ${
                            isSelected ? "text-slate-300" : "text-slate-400"
                          }`}
                        >
                          {opt.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {!isSelected && (
                        <span
                          className={`hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-bold rounded-md border ${opt.badgeColor}`}
                        >
                          {opt.preview}
                        </span>
                      )}

                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Footer note */}
          <div className="px-3 py-1.5 mt-1 border-t border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 font-medium">
              Changes reflect immediately on all POS screens
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
