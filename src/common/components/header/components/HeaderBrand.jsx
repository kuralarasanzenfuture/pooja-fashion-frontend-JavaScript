import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { ROUTES } from "../../../../constants/routes.js";
import appConfig from "../../../../config/appConfig.js";

export default function HeaderBrand({
  mobileMenuOpen,
  onToggleMobileMenu,
  storeName,
}) {
  return (
    <div className="flex items-center gap-3">
      {/* Mobile Menu Toggle Button */}
      <button
        type="button"
        onClick={onToggleMobileMenu}
        className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 focus:outline-none transition-colors cursor-pointer border border-transparent hover:border-slate-200"
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Luxury Brand Logo & Store Name */}
      <Link to={ROUTES.DASHBOARD} className="flex items-center gap-3 group">
        <div className="relative">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0a1128] via-[#0f1c3f] to-[#1e3a8a] flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-[#0f1c3f]/25 border border-white/20 ring-1 ring-[#c7d2fe]/30 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-[#1e3a8a]/20 transition-all duration-200">
            <span className="font-display tracking-tight bg-gradient-to-b from-white via-slate-100 to-amber-200 bg-clip-text text-transparent">
              P
            </span>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-400/40" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base-content tracking-tight text-base sm:text-lg leading-none font-display group-hover:text-primary transition-colors">
              {appConfig.name}
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-md bg-amber-500/15 border border-amber-400/30 text-amber-500 text-[9px] font-bold uppercase tracking-widest font-mono">
              LUXE
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[11px] text-primary font-semibold tracking-wide truncate max-w-[140px] sm:max-w-[200px]">
              {storeName || "Main Showroom"}
            </span>
            <span className="w-1 h-1 rounded-full bg-base-300 hidden sm:inline-block" />
            <span className="text-[10px] text-base-content/50 font-mono hidden sm:inline-block">
              POS Terminal
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
