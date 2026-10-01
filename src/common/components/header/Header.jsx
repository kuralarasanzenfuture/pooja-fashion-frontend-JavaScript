import { useState, useEffect } from "react";
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
  SearchModal,
} from "./components/index.js";

export default function Header({
  mobileMenuOpen,
  onToggleMobileMenu,
}) {
  const currentUser = useSelector(selectCurrentUser);
  const storeName = currentUser?.storeName || appConfig.name;
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global keyboard shortcut: Cmd+K / Ctrl+K opens search palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-base-100/90 text-base-content backdrop-blur-xl border-b border-base-200/80 shadow-[0_4px_20px_-4px_rgba(15,28,63,0.06)] shrink-0 transition-colors duration-200">
        {/* Luxury Golden & Sapphire Top Hairline Highlight */}
        {/* <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#0a1128] via-[#1e3a8a] to-[#d4af37]" /> */}

        <div className="px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand & Mobile Hamburger */}
          <HeaderBrand
            mobileMenuOpen={mobileMenuOpen}
            onToggleMobileMenu={onToggleMobileMenu}
            storeName={storeName}
          />

          {/* Center: Luxury Omni-Search Command Pill (Desktop & Tablet) */}
          <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-md mx-2 lg:mx-4">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-full bg-base-200/70 hover:bg-base-200 border border-base-300 text-base-content/60 hover:text-base-content transition-all text-xs shadow-2xs group cursor-pointer"
              aria-label="Open search dialog"
              title="Search (⌘K)"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Search className="w-3.5 h-3.5 text-base-content/40 group-hover:text-primary transition-colors shrink-0" />
                <span className="text-base-content/70 font-medium truncate hidden lg:inline">
                  Search lehengas, silk sarees, invoices...
                </span>
                <span className="text-base-content/70 font-medium truncate lg:hidden">
                  Search catalog, bills...
                </span>
              </div>
              <kbd className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-bold bg-base-100 text-base-content/70 rounded-full border border-base-300 shadow-2xs shrink-0">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Mobile Search Trigger Icon */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 rounded-xl text-base-content/70 hover:text-base-content hover:bg-base-200 border border-transparent hover:border-base-300 transition-colors cursor-pointer"
              aria-label="Open search"
              title="Search (⌘K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Quick Sale / POS Trigger Button */}
            <Link
              to={ROUTES.BILLING}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-content text-xs font-bold tracking-tight shadow-sm shadow-primary/20 hover:shadow-md transition-all cursor-pointer group"
            >
              <Plus className="w-3.5 h-3.5 text-primary-content/80 group-hover:rotate-90 transition-transform" />
              <span>New POS Bill</span>
            </Link>

            {/* Typography Switcher */}
            {/* <FontSwitcher /> */}

            {/* DaisyUI Theme Switcher */}
            <ThemeSwitcher />

            {/* Boutique Live Status Badge */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-base-200 border border-base-300 text-base-content text-xs font-semibold shadow-2xs">
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

      {/* Global Responsive Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}

