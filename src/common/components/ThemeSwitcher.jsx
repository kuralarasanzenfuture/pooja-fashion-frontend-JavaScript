import { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../../redux/ui/uiSlice.js";
import {
  Palette,
  ChevronDown,
  Check,
  Search,
  Sun,
  Moon,
  Sparkles,
  X,
} from "lucide-react";

export const DAISYUI_THEMES = [
  // --- Core Defaults ---
  { id: "light", name: "Light", type: "light", desc: "Clean & crisp default", colors: ["#4f46e5", "#06b6d4", "#f59e0b", "#1f2937"] },
  { id: "dark", name: "Dark", type: "dark", desc: "Modern deep charcoal", colors: ["#6366f1", "#22d3ee", "#fbbf24", "#111827"] },

  // --- Chic Boutique & Pastels ---
  { id: "cupcake", name: "Cupcake", type: "light", desc: "Sweet pastel boutique", colors: ["#65c3c8", "#ef9fbc", "#eeaf3a", "#291334"] },
  { id: "bumblebee", name: "Bumblebee", type: "light", desc: "Sunny gold & amber", colors: ["#e0a82e", "#f9d72f", "#181830", "#e0a82e"] },
  { id: "emerald", name: "Emerald", type: "light", desc: "Lush botanical greens", colors: ["#66cc8a", "#377cfb", "#ea5234", "#333c4d"] },
  { id: "corporate", name: "Corporate", type: "light", desc: "Formal executive blue", colors: ["#4b6bfb", "#7b92b2", "#67cba0", "#181a2a"] },
  { id: "synthwave", name: "Synthwave", type: "dark", desc: "80s neon purple & pink", colors: ["#e779c1", "#58c7f3", "#f3cc30", "#20134e"] },
  { id: "retro", name: "Retro", type: "light", desc: "Vintage sepia aesthetic", colors: ["#ef9995", "#a4cbb4", "#ebdc99", "#2e282a"] },
  { id: "cyberpunk", name: "Cyberpunk", type: "light", desc: "High-voltage sci-fi yellow", colors: ["#ff7598", "#75d1f0", "#c07eec", "#ffee00"] },
  { id: "valentine", name: "Valentine", type: "light", desc: "Romantic rose petals", colors: ["#e96d7b", "#a991f7", "#88dbdd", "#af4670"] },
  { id: "aqua", name: "Aqua", type: "light", desc: "Oceanic tropical cyan", colors: ["#09ecf3", "#966fb3", "#ffe999", "#3b8ac4"] },
  { id: "lofi", name: "Lofi", type: "light", desc: "Chic grayscale monochrome", colors: ["#0d0d0d", "#1a1919", "#262626", "#000000"] },
  { id: "pastel", name: "Pastel", type: "light", desc: "Soft soothing candy hues", colors: ["#d1c1d7", "#f6cbd1", "#b4e9d6", "#706f6f"] },
  { id: "fantasy", name: "Fantasy", type: "light", desc: "Whimsical violet dream", colors: ["#6e0b75", "#007ebd", "#f8860d", "#1f2937"] },
  { id: "wireframe", name: "Wireframe", type: "light", desc: "Technical blueprint look", colors: ["#b8b8b8", "#b8b8b8", "#b8b8b8", "#000000"] },

  // --- Dark & Luxury ---
  { id: "black", name: "Black", type: "dark", desc: "Deep OLED midnight pitch", colors: ["#343232", "#343232", "#343232", "#000000"] },
  { id: "luxury", name: "Luxury", type: "dark", desc: "Imperial gold & velvet", colors: ["#ffffff", "#152747", "#513448", "#331800"] },
  { id: "dracula", name: "Dracula", type: "dark", desc: "Gothic vampire purple", colors: ["#ff79c6", "#bd93f9", "#ffb86c", "#414558"] },
  { id: "cmyk", name: "CMYK", type: "light", desc: "Vibrant print industry", colors: ["#45aeee", "#e8488a", "#fff232", "#1a1a1a"] },
  { id: "autumn", name: "Autumn", type: "light", desc: "Warm foliage terracotta", colors: ["#8c0327", "#d85251", "#d59b6a", "#826a5c"] },
  { id: "business", name: "Business", type: "dark", desc: "Sleek slate executive", colors: ["#1c4e80", "#7d94b5", "#6f3662", "#2b3440"] },
  { id: "acid", name: "Acid", type: "light", desc: "Neon electric lime", colors: ["#ff00f4", "#ff7b00", "#a8ff00", "#1e1e1e"] },
  { id: "lemonade", name: "Lemonade", type: "light", desc: "Zesty citrus freshness", colors: ["#519903", "#e9e92f", "#ebad00", "#191a3f"] },
  { id: "night", name: "Night", type: "dark", desc: "Starry sapphire night", colors: ["#38bdf8", "#818cf8", "#f472b6", "#1e293b"] },
  { id: "coffee", name: "Coffee", type: "dark", desc: "Warm roasted mocha", colors: ["#db924b", "#263e3f", "#10576d", "#120912"] },
  { id: "winter", name: "Winter", type: "light", desc: "Glacier cool frost", colors: ["#047aff", "#463aa2", "#c148ac", "#021431"] },
  { id: "dim", name: "Dim", type: "dark", desc: "Comfortable night reading", colors: ["#9fe88d", "#ff7d5c", "#c792ea", "#1c2127"] },
  { id: "nord", name: "Nord", type: "light", desc: "Arctic Scandinavian mist", colors: ["#5e81ac", "#81a1c1", "#88c0d0", "#2e3440"] },
  { id: "sunset", name: "Sunset", type: "dark", desc: "Twilight dusk & coral", colors: ["#ff865b", "#fd6f96", "#ff6b6b", "#1a1a24"] },
];

export default function ThemeSwitcher({ className = "" }) {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state) => state.ui?.theme) || "light";
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all' | 'light' | 'dark'
  const dropdownRef = useRef(null);

  const activeTheme = useMemo(() => {
    return DAISYUI_THEMES.find((t) => t.id === currentTheme) || DAISYUI_THEMES[0];
  }, [currentTheme]);

  // Click outside & Escape key listeners
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

  const handleSelectTheme = (themeId) => {
    dispatch(setTheme(themeId));
    setIsOpen(false);
  };

  const filteredThemes = useMemo(() => {
    return DAISYUI_THEMES.filter((theme) => {
      const matchesSearch =
        theme.name.toLowerCase().includes(search.toLowerCase()) ||
        theme.desc.toLowerCase().includes(search.toLowerCase()) ||
        theme.id.toLowerCase().includes(search.toLowerCase());
      const matchesType =
        filterType === "all" ? true : theme.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [search, filterType]);

  return (
    <div
      ref={dropdownRef}
      className={`dropdown dropdown-bottom dropdown-end ${
        isOpen ? "dropdown-open" : ""
      } relative inline-block text-left ${className}`}
    >
      {/* Dropdown Trigger */}
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
        title={`Current DaisyUI theme: ${activeTheme.name}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Palette className="w-3.5 h-3.5 text-primary shrink-0 group-hover:rotate-12 transition-transform" />

        {/* Mini Palette Swatch */}
        <div className="flex items-center -space-x-1 shrink-0">
          {activeTheme.colors.slice(0, 3).map((col, idx) => (
            <span
              key={idx}
              className="w-2 h-2 rounded-full border border-white shadow-2xs"
              style={{ backgroundColor: col }}
            />
          ))}
        </div>

        <span className="text-xs font-bold capitalize tracking-tight">
          {activeTheme.name}
        </span>

        <ChevronDown
          className={`w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-transform duration-250 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div
          className="dropdown-content z-50 mt-2 w-80 sm:w-96 rounded-2xl bg-base-100 text-base-content border border-base-300 shadow-2xl shadow-slate-900/15 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
          style={{ maxHeight: "calc(100vh - 100px)" }}
        >
          {/* Header */}
          <div className="p-3.5 border-b border-base-200 bg-base-200/50">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-base-content/80">
                  DaisyUI Themes
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {DAISYUI_THEMES.length}
                </span>
              </div>
              <span className="text-[11px] font-medium text-base-content/60">
                Active: <strong className="text-primary capitalize">{activeTheme.name}</strong>
              </span>
            </div>

            {/* Live Search */}
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search themes (e.g. dark, luxury, cupcake)..."
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl bg-base-100 border border-base-300 placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                autoFocus
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5">
              {[
                { id: "all", label: "All", icon: Sparkles, count: DAISYUI_THEMES.length },
                { id: "light", label: "Light", icon: Sun, count: 18 },
                { id: "dark", label: "Dark", icon: Moon, count: 11 },
              ].map((pill) => {
                const Icon = pill.icon;
                const isSelected = filterType === pill.id;
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setFilterType(pill.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary text-primary-content shadow-xs"
                        : "bg-base-100 hover:bg-base-200 text-base-content/70 border border-base-300"
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{pill.label}</span>
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded-full ${
                        isSelected
                          ? "bg-primary-content/20 text-primary-content"
                          : "bg-base-300 text-base-content/60"
                      }`}
                    >
                      {pill.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme List Grid */}
          <div className="max-h-72 sm:max-h-80 overflow-y-auto p-2.5 space-y-1.5 scrollbar-thin">
            {filteredThemes.length === 0 ? (
              <div className="text-center py-8 text-base-content/50">
                <Palette className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs font-medium">No themes match "{search}"</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setFilterType("all");
                  }}
                  className="mt-2 text-[11px] text-primary hover:underline font-bold"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {filteredThemes.map((theme) => {
                  const isSelected = theme.id === currentTheme;

                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => handleSelectTheme(theme.id)}
                      data-theme={theme.id}
                      className={`group w-full text-left p-2 rounded-xl border text-base-content bg-base-100 transition-all cursor-pointer relative overflow-hidden select-none ${
                        isSelected
                          ? "border-primary ring-2 ring-primary/30 shadow-sm"
                          : "border-base-200 hover:border-primary/50 hover:shadow-xs"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5 mb-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-xs font-bold capitalize truncate">
                            {theme.name}
                          </span>
                          {theme.type === "dark" ? (
                            <Moon className="w-2.5 h-2.5 text-base-content/40 shrink-0" />
                          ) : (
                            <Sun className="w-2.5 h-2.5 text-base-content/40 shrink-0" />
                          )}
                        </div>

                        {isSelected && (
                          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-primary text-primary-content shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>

                      {/* 4-Color Swatch Bar previewing primary, secondary, accent, neutral */}
                      <div className="flex items-center gap-1">
                        <span className="h-4 flex-1 rounded-xs bg-primary" title="Primary" />
                        <span className="h-4 flex-1 rounded-xs bg-secondary" title="Secondary" />
                        <span className="h-4 flex-1 rounded-xs bg-accent" title="Accent" />
                        <span className="h-4 flex-1 rounded-xs bg-neutral" title="Neutral" />
                      </div>

                      <p className="text-[10px] text-base-content/60 mt-1 truncate">
                        {theme.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Quick Reset */}
          <div className="p-2.5 border-t border-base-200 bg-base-200/40 flex items-center justify-between">
            <span className="text-[10px] text-base-content/50">
              DaisyUI v5 • Tailwind CSS v4
            </span>
            <button
              type="button"
              onClick={() => handleSelectTheme("light")}
              className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
            >
              Reset to Light
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
