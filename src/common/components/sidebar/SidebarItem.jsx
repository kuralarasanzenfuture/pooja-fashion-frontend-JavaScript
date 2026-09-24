import { useState, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, LogOut } from "lucide-react";

export default function SidebarItem({
  item,
  collapsed = false,
  onNavigate,
  onLogout,
}) {
  const location = useLocation();
  const [manualOpen, setManualOpen] = useState(null);
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const flyoutTimeout = useRef(null);

  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;

  // Deriving active state without setState in effect
  const isChildActive = (children) => {
    return children.some((c) => {
      if (c.children) return isChildActive(c.children);
      if (!c.to) return false;
      const cleanTo = c.to.split("?")[0];
      return location.pathname === cleanTo;
    });
  };

  const hasActiveChild = hasChildren && isChildActive(item.children);
  const isOpen = manualOpen !== null ? manualOpen : hasActiveChild;


  // Handle Flyout open/close on hover when collapsed
  const handleMouseEnter = () => {
    if (collapsed && hasChildren) {
      clearTimeout(flyoutTimeout.current);
      setFlyoutOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (collapsed && hasChildren) {
      flyoutTimeout.current = setTimeout(() => {
        setFlyoutOpen(false);
      }, 150);
    }
  };

  const isCurrentActive = item.to && location.pathname === item.to;

  // 1. Single direct route item (no children, e.g. Dashboard)
  if (!hasChildren) {
    return (
      <div className="relative group px-2 py-0.5">
        <NavLink
          to={item.to || "#"}
          onClick={onNavigate}
          end={item.to === "/"}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
              isActive
                ? "bg-[#0f1c3f] text-white shadow-xs font-bold"
                : "text-slate-600 hover:text-[#0f1c3f] hover:bg-[#f0f4fc]"
            } ${collapsed ? "justify-center px-0 py-2.5" : ""}`
          }
          title={collapsed ? item.title : undefined}
        >
          {Icon && (
            <Icon
              className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                isCurrentActive ? "text-sky-300" : "text-slate-500 group-hover:text-[#1e3a8a]"
              }`}
            />
          )}

          {!collapsed && (
            <span className="truncate flex-1 tracking-tight">{item.title}</span>
          )}

          {!collapsed && item.badge && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#e0e7ff] text-[#1e3a8a]">
              {item.badge}
            </span>
          )}
        </NavLink>

        {/* Collapsed Tooltip Flyout */}
        {collapsed && (
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
            {item.title}
          </div>
        )}
      </div>
    );
  }

  // 2. Parent item WITH children (Accordion or Collapsed Flyout)
  return (
    <div
      className="relative px-2 py-0.5"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Accordion Trigger Header */}
      <button
        type="button"
        onClick={() => {
          if (!collapsed) {
            setManualOpen(!isOpen);
          }
        }}

        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none group ${
          isOpen && !collapsed
            ? "bg-slate-100/80 text-[#0f1c3f]"
            : "text-slate-600 hover:text-[#0f1c3f] hover:bg-[#f0f4fc]"
        } ${collapsed ? "justify-center px-0 py-2.5" : ""}`}
        title={collapsed ? item.title : undefined}
        aria-expanded={isOpen}
      >
        {Icon && (
          <Icon
            className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
              isOpen ? "text-[#1e3a8a]" : "text-slate-500 group-hover:text-[#1e3a8a]"
            }`}
          />
        )}

        {!collapsed && (
          <>
            <span className="truncate flex-1 text-left tracking-tight font-semibold">
              {item.title}
            </span>

            {item.badge && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[#e0e7ff] text-[#1e3a8a] mr-1">
                {item.badge}
              </span>
            )}

            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-250 ease-in-out ${
                isOpen ? "rotate-180 text-[#0f1c3f]" : ""
              }`}
            />
          </>
        )}
      </button>

      {/* Expanded Accordion Submenu (When Sidebar is NOT collapsed) */}
      {!collapsed && (
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-250 ease-in-out ${
            isOpen ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="pl-5 pr-1 py-0.5 space-y-0.5 border-l-2 border-slate-200 ml-4.5 my-1">
              {item.children.map((subItem) => (
                <SubMenuItem
                  key={subItem.id}
                  item={subItem}
                  onNavigate={onNavigate}
                  onLogout={onLogout}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Mode Hover Flyout Submenu (MongoDB Atlas style) */}
      {collapsed && flyoutOpen && (
        <div className="absolute left-full top-0 ml-2 w-60 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2.5 px-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 mb-1.5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {Icon && <Icon className="w-3.5 h-3.5 text-[#1e3a8a]" />}
              <span className="text-xs font-bold text-slate-900">{item.title}</span>
            </div>
            {item.badge && (
              <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-[#e0e7ff] text-[#1e3a8a]">
                {item.badge}
              </span>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto space-y-0.5 py-0.5">
            {item.children.map((subItem) => (
              <SubMenuItem
                key={subItem.id}
                item={subItem}
                onNavigate={() => {
                  setFlyoutOpen(false);
                  if (onNavigate) onNavigate();
                }}
                onLogout={onLogout}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// SubMenuItem component handles second & third levels of navigation
function SubMenuItem({ item, onNavigate, onLogout }) {
  const location = useLocation();
  const [nestedOpen, setNestedOpen] = useState(false);
  const hasNested = item.children && item.children.length > 0;

  if (item.isLogout) {
    return (
      <button
        type="button"
        onClick={onLogout}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors text-left cursor-pointer"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>{item.title}</span>
      </button>
    );
  }

  // Nested grouping (e.g. Reports -> Sales Reports -> Daily Sales)
  if (hasNested) {
    return (
      <div className="space-y-0.5">
        <button
          type="button"
          onClick={() => setNestedOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 transition-colors text-left cursor-pointer"
        >
          <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500">
            {item.title}
          </span>
          <ChevronRight
            className={`w-3 h-3 text-slate-400 transition-transform ${
              nestedOpen ? "rotate-90 text-[#0f1c3f]" : ""
            }`}
          />
        </button>

        {nestedOpen && (
          <div className="pl-3 py-0.5 space-y-0.5 border-l border-slate-200 ml-2">
            {item.children.map((nested) => (
              <NavLink
                key={nested.id}
                to={nested.to || "#"}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `block px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    isActive || location.pathname === nested.to
                      ? "bg-[#0f1c3f] text-white font-bold"
                      : "text-slate-600 hover:text-[#0f1c3f] hover:bg-slate-100"
                  }`
                }
              >
                {nested.title}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.to || "#"}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          isActive || location.pathname === item.to
            ? "bg-[#0f1c3f] text-white font-bold shadow-2xs"
            : "text-slate-600 hover:text-[#0f1c3f] hover:bg-[#f0f4fc]"
        }`
      }
    >
      <span className="truncate">{item.title}</span>
      {item.badge && (
        <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-[#e0e7ff] text-[#1e3a8a]">
          {item.badge}
        </span>
      )}
    </NavLink>
  );
}
