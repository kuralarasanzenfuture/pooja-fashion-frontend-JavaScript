import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import FontSwitcher from "../FontSwitcher.jsx";
import ThemeSwitcher from "../ThemeSwitcher.jsx";
import { selectCurrentUser } from "../../../redux/selectors/authSelectors.js";
import { ROUTES } from "../../../constants/routes.js";
import appConfig from "../../../config/appConfig.js";
import {
  HeaderBrand,
  HeaderNotifications,
  ProfileDropdown,
} from "./components/index.js";

export default function Header({
  mobileMenuOpen,
  onToggleMobileMenu,
}) {
  const currentUser = useSelector(selectCurrentUser);
  const storeName = currentUser?.storeName || appConfig.name;

  return (
    <header className="sticky top-0 z-40 bg-base-100/90 text-base-content backdrop-blur-xl border-b border-base-200/80 shadow-[0_4px_20px_-4px_rgba(15,28,63,0.06)] shrink-0 transition-colors duration-200">
      {/* Luxury Golden & Sapphire Top Hairline Highlight */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#0a1128] via-[#1e3a8a] to-[#d4af37]" />

      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Mobile Hamburger */}
        <HeaderBrand
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={onToggleMobileMenu}
          storeName={storeName}
        />

        {/* Center: Luxury Omni-Search Command Pill (Desktop) */}
        <div className="hidden xl:flex items-center flex-1 max-w-md mx-4">
          <Link
            to={ROUTES.PRODUCTS}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-full bg-base-200/70 hover:bg-base-200 border border-base-300 text-base-content/60 hover:text-base-content transition-all text-xs shadow-2xs group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-base-content/40 group-hover:text-primary transition-colors" />
              <span className="text-base-content/70 font-medium">
                Search lehengas, silk sarees, invoices...
              </span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-bold bg-base-100 text-base-content/70 rounded-full border border-base-300 shadow-2xs">
              ⌘K
            </kbd>
          </Link>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Sale / POS Trigger Button */}
          <Link
            to={ROUTES.BILLING}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0f1c3f] to-[#1e3a8a] hover:from-[#0a1128] hover:to-[#172554] text-white text-xs font-bold tracking-tight shadow-sm shadow-[#0f1c3f]/20 hover:shadow-md transition-all cursor-pointer group"
          >
            <Plus className="w-3.5 h-3.5 text-sky-300 group-hover:rotate-90 transition-transform" />
            <span>New POS Bill</span>
          </Link>

          {/* Typography Switcher */}
          <FontSwitcher />

          {/* DaisyUI Theme Switcher */}
          <ThemeSwitcher />

          {/* Boutique Live Status Badge */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-base-200 border border-base-300 text-base-content text-xs font-semibold shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-bold text-[11px] text-base-content">Live Counter #01</span>
          </div>

          {/* Notification Center */}
          <HeaderNotifications />

          <div className="h-6 w-px bg-base-300 hidden sm:block" />

          {/* Profile Dropdown with User Details & Logout */}
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
