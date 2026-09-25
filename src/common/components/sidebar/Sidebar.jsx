import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Sparkles,
} from "lucide-react";
import { toggleSidebar } from "../../../redux/ui/uiSlice.js";
import { logoutUser } from "../../../redux/auth/authSlice.js";
import { ROUTES } from "../../../constants/routes.js";
import { SIDEBAR_MENU_DATA } from "./menuData.js";
import SidebarItem from "./SidebarItem.jsx";
import SidebarSearch from "./SidebarSearch.jsx";

export default function Sidebar({
  mobileOpen = false,
  onCloseMobile,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sidebarOpen = useSelector((state) => state.ui?.sidebarOpen ?? true);
  const [searchQuery, setSearchQuery] = useState("");

  // Lock background scroll when modal sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && mobileOpen && onCloseMobile) {
        onCloseMobile();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, onCloseMobile]);

  const handleToggleCollapse = () => {
    dispatch(toggleSidebar());
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate(ROUTES.LOGIN, { replace: true });
    if (onCloseMobile) onCloseMobile();
  };

  // Filter menu items when searching
  const filteredMenu = useMemo(() => {
    if (!searchQuery.trim()) return SIDEBAR_MENU_DATA;
    const q = searchQuery.toLowerCase();

    return SIDEBAR_MENU_DATA.map((item) => {
      // Check if parent matches
      const parentMatch = item.title.toLowerCase().includes(q);

      // Check if children match
      const matchingChildren = item.children?.filter((child) => {
        if (child.children) {
          return (
            child.title.toLowerCase().includes(q) ||
            child.children.some((n) => n.title.toLowerCase().includes(q))
          );
        }
        return child.title.toLowerCase().includes(q);
      });

      if (parentMatch) {
        return item;
      }

      if (matchingChildren && matchingChildren.length > 0) {
        return {
          ...item,
          children: matchingChildren,
        };
      }

      return null;
    }).filter(Boolean);
  }, [searchQuery]);

  // Sidebar Inner Content reusable for both desktop and mobile drawer
  const renderSidebarContent = (isMobile = false) => {
    const isCollapsed = !isMobile && !sidebarOpen;

    return (
      <div className="flex flex-col h-full overflow-hidden bg-base-100 select-none transition-colors duration-200">
        {/* Fixed Top Section: Header & Search */}
        <div className="shrink-0 bg-base-100 border-b border-base-200/90 z-10 transition-colors duration-200">
          {!isCollapsed ? (
            <div className="px-4 pt-3.5 pb-1 flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-base-content/50 font-mono">
                Store Navigation
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                <Sparkles className="w-2.5 h-2.5" /> ERP POS
              </span>
            </div>
          ) : (
            <div className="pt-3 pb-1 text-center">
              <span className="text-xs font-bold uppercase text-base-content/50 font-mono">
                MENU
              </span>
            </div>
          )}

          {/* Quick Search Bar (when expanded) */}
          {!isCollapsed && (
            <SidebarSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClear={() => setSearchQuery("")}
              collapsed={isCollapsed}
            />
          )}
        </div>

        {/* Scrollable Middle Content ONLY - Clean invisible scrollbar on mobile drawer, sleek thin on desktop */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-1.5 no-scrollbar lg:scrollbar-thin">
          <nav className="space-y-0.5">
            {filteredMenu.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                collapsed={isCollapsed}
                onNavigate={isMobile ? onCloseMobile : undefined}
                onLogout={handleLogout}
              />
            ))}

            {filteredMenu.length === 0 && (
              <div className="px-4 py-8 text-center text-xs text-base-content/40">
                No menu items match "{searchQuery}"
              </div>
            )}
          </nav>
        </div>

        {/* Fixed Bottom Section (Pinned to bottom, never scrolls) */}
        {!isMobile && (
          <div className="shrink-0 mt-auto border-t border-base-200 p-2.5 bg-base-200/50 flex items-center justify-between z-10 transition-colors duration-200">
            {!isCollapsed && (
              <div className="px-2">
                <span className="text-[11px] font-bold text-base-content block leading-tight">
                  Pooja Fashion POS
                </span>
                <span className="text-[10px] text-base-content/50 block font-mono">
                  v1.0 • Multi-Store
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={handleToggleCollapse}
              className={`p-2 rounded-xl text-base-content/60 hover:text-base-content hover:bg-base-300/80 transition-all cursor-pointer focus:outline-none ${isCollapsed ? "mx-auto" : ""
                }`}
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {sidebarOpen ? (
                <PanelLeftClose className="w-4 h-4" />
              ) : (
                <PanelLeftOpen className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* ========================================================
          1. Desktop Collapsible Sidebar
          ======================================================== */}
      <aside
        className={`hidden lg:flex flex-col h-full border-r border-base-200 bg-base-100 shrink-0 transition-all duration-300 ease-in-out z-20 overflow-hidden ${sidebarOpen ? "w-68" : "w-[68px]"
          }`}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* ========================================================
          2. Mobile Navigation Drawer (Smooth Slide Open & Close)
          ======================================================== */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          mobileOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop Fade In & Out */}
        <div
          className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 ease-out ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={onCloseMobile}
        />

        {/* Drawer Body - Hardware-accelerated Smooth Slide In & Out */}
        <div
          className={`relative w-80 max-w-[85vw] bg-base-100 text-base-content h-full shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Drawer Pinned Header */}
          <div className="flex items-center justify-between p-4 border-b border-base-200 shrink-0">
            <span className="font-bold text-base-content font-display text-sm">
              Pooja Fashion Menu
            </span>
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-base-content/50 hover:text-base-content hover:bg-base-200 active:scale-90 transition-all cursor-pointer"
              aria-label="Close menu drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body Content */}
          <div className="flex-1 overflow-hidden min-h-0">
            {renderSidebarContent(true)}
          </div>
        </div>
      </div>
    </>
  );
}
