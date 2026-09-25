import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../../../../redux/ui/uiSlice.js";
import { DAISYUI_THEMES } from "../../../components/ThemeSwitcher.jsx";
import {
  Palette,
  Check,
  Search,
  Sun,
  Moon,
  Sparkles,
  Sliders,
  CheckCircle2,
} from "lucide-react";

export default function ThemeSettings() {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state) => state.ui?.theme) || "light";
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // 'all' | 'light' | 'dark'

  const activeThemeObj = useMemo(() => {
    return DAISYUI_THEMES.find((t) => t.id === currentTheme) || DAISYUI_THEMES[0];
  }, [currentTheme]);

  const filteredThemes = useMemo(() => {
    return DAISYUI_THEMES.filter((t) => {
      const matchSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.desc.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase());
      const matchType = activeFilter === "all" ? true : t.type === activeFilter;
      return matchSearch && matchType;
    });
  }, [search, activeFilter]);

  const handleSelect = (id) => {
    dispatch(setTheme(id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-base-200">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                <Palette className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-base-content font-display">
                DaisyUI Theme Studio
              </h3>
            </div>
            <p className="text-xs text-base-content/60 mt-1 max-w-xl">
              Switch themes live across your entire ERP & POS application. All 29 DaisyUI themes are dynamically compiled and ready.
            </p>
          </div>

          {/* Active Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-primary/30 bg-primary/5 text-primary text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Active: {activeThemeObj.name}</span>
          </div>
        </div>
      </div>

      {/* Current Theme Showcase Card */}
      <div
        data-theme={currentTheme}
        className="p-5 sm:p-6 rounded-2xl border border-base-300 bg-base-100 text-base-content shadow-sm transition-all"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-[11px] font-bold">
              <CheckCircle2 className="w-3 h-3" />
              Active Workspace Theme
            </div>
            <h4 className="text-xl font-black capitalize mt-2 font-display">
              {activeThemeObj.name} Theme
            </h4>
            <p className="text-xs opacity-70 mt-0.5">
              {activeThemeObj.desc} • Automatically persisted to local storage
            </p>
          </div>

          {/* Live Preview Elements in Current Theme */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button type="button" className="btn btn-primary btn-sm rounded-lg">
              Primary
            </button>
            <button type="button" className="btn btn-secondary btn-sm rounded-lg">
              Secondary
            </button>
            <button type="button" className="btn btn-accent btn-sm rounded-lg">
              Accent
            </button>
            <span className="badge badge-primary font-bold text-[10px]">
              Active Badge
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {[
            { id: "all", label: "All Themes", icon: Sparkles, count: DAISYUI_THEMES.length },
            { id: "light", label: "Light", icon: Sun, count: 18 },
            { id: "dark", label: "Dark", icon: Moon, count: 11 },
          ].map((pill) => {
            const Icon = pill.icon;
            const isSelected = activeFilter === pill.id;

            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setActiveFilter(pill.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary text-primary-content shadow-xs"
                    : "bg-base-200 hover:bg-base-300 text-base-content/70 border border-base-300"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{pill.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
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

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter 29 themes..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-base-100 border border-base-300 placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Grid of All 29 Themes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredThemes.map((theme) => {
          const isSelected = theme.id === currentTheme;

          return (
            <div
              key={theme.id}
              data-theme={theme.id}
              onClick={() => handleSelect(theme.id)}
              className={`p-3.5 rounded-2xl border bg-base-100 text-base-content shadow-xs transition-all cursor-pointer relative overflow-hidden select-none hover:shadow-md ${
                isSelected
                  ? "border-primary ring-2 ring-primary/40 shadow-sm"
                  : "border-base-300 hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold capitalize">
                    {theme.name}
                  </span>
                  {theme.type === "dark" ? (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-base-300 text-base-content/70 font-mono">
                      Dark
                    </span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-base-300 text-base-content/70 font-mono">
                      Light
                    </span>
                  )}
                </div>

                {isSelected ? (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-content">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold opacity-40 group-hover:opacity-100">
                    Apply
                  </span>
                )}
              </div>

              {/* 4-Color Swatch Bar */}
              <div className="flex items-center gap-1 mb-2">
                <span className="h-5 flex-1 rounded-xs bg-primary" title="Primary" />
                <span className="h-5 flex-1 rounded-xs bg-secondary" title="Secondary" />
                <span className="h-5 flex-1 rounded-xs bg-accent" title="Accent" />
                <span className="h-5 flex-1 rounded-xs bg-neutral" title="Neutral" />
              </div>

              <p className="text-[11px] opacity-70 truncate">
                {theme.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
