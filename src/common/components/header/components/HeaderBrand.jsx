import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { toggleSidebar } from "../../../../redux/ui/uiSlice.js";
import { ROUTES } from "../../../../constants/routes.js";
import appConfig from "../../../../config/appConfig.js";
import brandLogo from "../../../../assets/logo/pooja_emblem_transparent.png";

export default function HeaderBrand({
  mobileMenuOpen,
  onToggleMobileMenu,
  storeName,
}) {
  const dispatch = useDispatch();

  const handleToggle = () => {
    // If mobile/tablet, toggle the slide-over drawer
    if (window.innerWidth < 1024) {
      if (onToggleMobileMenu) onToggleMobileMenu();
    } else {
      // If desktop, toggle sidebar collapse/expand
      dispatch(toggleSidebar());
    }
  };

  const displaySubtitle =
    storeName && storeName !== appConfig.name
      ? storeName
      : "Main Boutique";

  return (
    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
      {/* Universal Navigation Toggle Button (Instant 60fps response) */}
      <button
        type="button"
        onClick={handleToggle}
        className="p-2 sm:p-2.5 rounded-xl bg-base-200/70 hover:bg-base-200 text-base-content/80 hover:text-base-content active:scale-90 transition-all duration-150 cursor-pointer border border-base-300/80 shadow-2xs group flex items-center justify-center shrink-0 select-none focus:outline-none"
        aria-label="Toggle navigation menu"
        title="Toggle sidebar menu"
      >
        <div className="relative w-5 h-5 flex items-center justify-center pointer-events-none">
          <Menu
            className={`w-5 h-5 transition-all duration-200 ease-out ${
              mobileMenuOpen
                ? "rotate-90 scale-0 opacity-0"
                : "rotate-0 scale-100 opacity-100 group-hover:scale-105"
            }`}
          />
          <X
            className={`w-5 h-5 absolute inset-0 transition-all duration-200 ease-out ${
              mobileMenuOpen
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-90 scale-0 opacity-0"
            }`}
          />
        </div>
      </button>

      {/* Luxury Brand Logo & Store Name */}
      <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2 sm:gap-3 group shrink-0">
        <div className="relative shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-2xl bg-white dark:bg-base-200/90 p-1 flex items-center justify-center shadow-xs border border-base-300/90 ring-1 ring-primary/20 group-hover:scale-105 group-hover:shadow-md transition-all duration-200 overflow-hidden">
            <img
              src={brandLogo}
              alt="Pooja Fashion logo"
              className="w-full h-full object-contain filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
            />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 border-2 border-base-100 ring-1 ring-emerald-400/40" />
        </div>

        <div className="flex flex-col shrink-0">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="font-extrabold text-base-content tracking-tight text-sm sm:text-base md:text-lg leading-none font-display group-hover:text-primary transition-colors whitespace-nowrap">
              {appConfig.name}
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-400/30 text-amber-600 dark:text-amber-400 text-[9px] font-bold uppercase tracking-widest font-mono">
              LUXE
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-1 whitespace-nowrap">
            <span className="text-[11px] text-primary font-semibold tracking-wide whitespace-nowrap">
              {displaySubtitle}
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
