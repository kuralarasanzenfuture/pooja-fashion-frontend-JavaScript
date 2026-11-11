import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, LogOut } from "lucide-react";
import "./sidebar.css";

export default function SidebarItem({
  item,
  collapsed = false,
  onNavigate,
  onLogout,
}) {
  const location = useLocation();
  const triggerRef = useRef(null);
  const flyoutTimeout = useRef(null);

  const [manualOpen, setManualOpen] = useState(null);
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const [flyoutRendered, setFlyoutRendered] = useState(false);
  const [flyoutVisible, setFlyoutVisible] = useState(false);
  const [flyoutPos, setFlyoutPos] = useState({ top: 0, left: 0 });

  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;

  // Deriving active state across nested children
  const isChildActive = useCallback((children) => {
    return children.some((c) => {
      if (c.children) return isChildActive(c.children);
      if (!c.to) return false;
      const cleanTo = c.to.split("?")[0];
      return location.pathname === cleanTo;
    });
  }, [location.pathname]);

  const hasActiveChild = hasChildren && isChildActive(item.children);
  const isOpen = manualOpen !== null ? manualOpen : hasActiveChild;

  // Flyout Animation Lifecycle
  useEffect(() => {
    let timeoutId;
    if (flyoutOpen) {
      setFlyoutRendered(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFlyoutVisible(true);
        });
      });
    } else {
      setFlyoutVisible(false);
      timeoutId = setTimeout(() => {
        setFlyoutRendered(false);
      }, 160);
    }
    return () => clearTimeout(timeoutId);
  }, [flyoutOpen]);

  // Calculate position when hovering in collapsed mode
  const updateFlyoutPosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const cardEstimatedHeight = hasChildren ? Math.min(380, item.children.length * 42 + 80) : 40;
      let top = rect.top - 6;

      // Prevent card from overflowing below screen
      if (top + cardEstimatedHeight > window.innerHeight) {
        top = Math.max(10, window.innerHeight - cardEstimatedHeight - 16);
      }

      setFlyoutPos({
        top: Math.max(10, top),
        left: rect.right + 10,
      });
    }
  };

  const handleMouseEnter = () => {
    if (collapsed) {
      clearTimeout(flyoutTimeout.current);
      updateFlyoutPosition();
      setFlyoutOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (collapsed) {
      flyoutTimeout.current = setTimeout(() => {
        setFlyoutOpen(false);
      }, 220);
    }
  };

  const isCurrentActive = item.to && location.pathname === item.to;

  // 1. Single direct route item (no children, e.g. Dashboard)
  if (!hasChildren) {
    return (
      <div
        ref={triggerRef}
        className="relative group px-2 py-0.5"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <NavLink
          to={item.to || "#"}
          onClick={onNavigate}
          end={item.to === "/"}
          data-nav-active={isCurrentActive ? "true" : undefined}
          className={({ isActive }) =>
            `sidebar-link relative z-10 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 group ${
              isActive
                ? "text-primary-content font-bold"
                : "text-base-content/70 hover:text-base-content hover:bg-base-200/50"
            } ${collapsed ? "justify-center px-0 py-2.5" : ""}`
          }
        >
          {Icon && (
            <Icon
              className={`sidebar-link-icon w-4.5 h-4.5 shrink-0 transition-all duration-200 group-hover:scale-110 ${
                isCurrentActive ? "text-primary-content" : "text-base-content/60 group-hover:text-primary"
              }`}
            />
          )}

          {!collapsed && (
            <span className="truncate flex-1 tracking-tight transition-opacity duration-200">
              {item.title}
            </span>
          )}

          {!collapsed && item.badge && (
            <span
              className={`sidebar-badge px-2 py-0.5 text-xs font-bold rounded-full transition-colors ${
                isCurrentActive
                  ? "bg-white/20 text-white"
                  : "bg-primary/15 text-primary"
              }`}
            >
              {item.badge}
            </span>
          )}
        </NavLink>

        {/* Portal-based Tooltip in collapsed mode (Never clipped by overflow-hidden) */}
        {collapsed &&
          flyoutRendered &&
          createPortal(
            <div
              style={{
                position: "fixed",
                top: `${flyoutPos.top + 6}px`,
                left: `${flyoutPos.left}px`,
                zIndex: 9999,
              }}
              className={`px-3 py-1.5 bg-base-100 text-base-content text-xs font-bold rounded-xl shadow-xl border border-base-300 pointer-events-none transition-all duration-200 ease-out transform whitespace-nowrap ${
                flyoutVisible
                  ? "opacity-100 scale-100 translate-x-0"
                  : "opacity-0 scale-95 -translate-x-2"
              }`}
            >
              {item.title}
            </div>,
            document.body
          )}
      </div>
    );
  }

  // 2. Parent item WITH children (Accordion when expanded, Rich Side Card when collapsed)
  return (
    <div
      ref={triggerRef}
      className="relative px-2 py-0.5"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Accordion Trigger Header */}
      <button
        type="button"
        data-nav-group-active={hasActiveChild ? "true" : undefined}
        data-nav-group-open={isOpen && !collapsed ? "true" : undefined}
        onClick={() => {
          if (!collapsed) {
            setManualOpen(!isOpen);
          }
        }}
        className={`sidebar-link relative z-10 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer select-none group ${
          isOpen && !collapsed
            ? "text-base-content font-bold"
            : hasActiveChild
            ? "text-base-content font-semibold"
            : "text-base-content/70 hover:text-base-content hover:bg-base-200/50"
        } ${collapsed ? "justify-center px-0 py-2.5" : ""}`}
        aria-expanded={isOpen}
      >
        {Icon && (
          <Icon
            className={`sidebar-link-icon w-4.5 h-4.5 shrink-0 transition-all duration-200 group-hover:scale-110 ${
              hasActiveChild || (isOpen && !collapsed)
                ? "text-primary"
                : "text-base-content/60 group-hover:text-primary"
            }`}
          />
        )}

        {!collapsed && (
          <>
            <span className="truncate flex-1 text-left tracking-tight font-semibold text-sm">
              {item.title}
            </span>

            {item.badge && (
              <span className="sidebar-badge px-2 py-0.5 text-xs font-bold rounded-full bg-primary/15 text-primary mr-1">
                {item.badge}
              </span>
            )}

            <ChevronDown
              className={`w-3.5 h-3.5 text-base-content/40 transition-transform duration-300 ease-out ${
                isOpen ? "rotate-180 text-primary" : ""
              }`}
            />
          </>
        )}
      </button>

      {/* Expanded Mode: Normal Accordion Submenu */}
      {!collapsed && (
        <div className={`sidebar-submenu ${isOpen ? "is-open" : ""}`}>
          <div className="sidebar-submenu-inner">
            <div className="py-1 space-y-0.5">
              {item.children.map((subItem, index) => (
                <SubMenuItem
                  key={subItem.id}
                  item={subItem}
                  index={index}
                  parentOpen={isOpen}
                  onNavigate={onNavigate}
                  onLogout={onLogout}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Mode: Rich Portal Side Card (Floating out-of-flow, immune to overflow-hidden) */}
      {collapsed &&
        flyoutRendered &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: `${flyoutPos.top}px`,
              left: `${flyoutPos.left}px`,
              zIndex: 9999,
            }}
            onMouseEnter={() => {
              clearTimeout(flyoutTimeout.current);
              setFlyoutOpen(true);
            }}
            onMouseLeave={handleMouseLeave}
            className={`w-72 bg-base-100 text-base-content rounded-2xl shadow-2xl border border-base-300 overflow-hidden flex flex-col transition-all duration-200 ease-out transform origin-left select-none before:absolute before:-left-3 before:top-0 before:bottom-0 before:w-3 before:content-[''] ${
              flyoutVisible
                ? "opacity-100 scale-100 translate-x-0 pointer-events-auto"
                : "opacity-0 scale-95 -translate-x-2 pointer-events-none"
            }`}
          >
            {/* Side Card Header Details */}
            <div className="px-4 py-3 bg-base-200/70 border-b border-base-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                  {Icon && <Icon className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-base-content truncate leading-tight">
                    {item.title}
                  </h4>
                  <span className="text-[11px] text-base-content/50 font-medium">
                    {item.children.length} sub-items
                  </span>
                </div>
              </div>

              {item.badge && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-primary/15 text-primary border border-primary/20 shrink-0">
                  {item.badge}
                </span>
              )}
            </div>

            {/* Side Card Child Components List */}
            <div className="p-2 max-h-[65vh] overflow-y-auto overflow-x-hidden scrollbar-thin space-y-0.5">
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
          </div>,
          document.body
        )}
    </div>
  );
}

// SubMenuItem component handles second & third levels of navigation
function SubMenuItem({
  item,
  index = 0,
  parentOpen = true,
  onNavigate,
  onLogout,
}) {
  const location = useLocation();
  const [nestedOpen, setNestedOpen] = useState(false);
  const hasNested = item.children && item.children.length > 0;

  if (item.isLogout) {
    return (
      <button
        type="button"
        onClick={onLogout}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm font-semibold text-rose-700 hover:bg-rose-50 transition-colors text-left cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>{item.title}</span>
      </button>
    );
  }

  const currentFullPath = `${location.pathname}${location.search}`;
  const isQueryItem = Boolean(item.to && item.to.includes("?"));
  const isItemActive = isQueryItem
    ? currentFullPath === item.to ||
      (location.pathname === item.to.split("?")[0] &&
        !location.search &&
        (item.to.endsWith("tab=themes") || item.to.endsWith("tab=fonts") || item.to.endsWith("view=new")))
    : location.pathname === item.to;

  // Nested grouping (e.g. Reports -> Sales Reports -> Daily Sales)
  if (hasNested) {
    return (
      <div className="space-y-0.5">
        <button
          type="button"
          onClick={() => setNestedOpen((prev) => !prev)}
          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors text-left cursor-pointer ${
            nestedOpen
              ? "text-base-content font-bold bg-base-200/80"
              : "text-base-content/75 hover:text-base-content hover:bg-base-200/50"
          }`}
        >
          <span className="truncate flex-1 tracking-tight">
            {item.title}
          </span>
          <ChevronRight
            className={`w-3.5 h-3.5 text-base-content/40 transition-transform duration-200 shrink-0 ${
              nestedOpen ? "rotate-90 text-primary" : ""
            }`}
          />
        </button>

        {nestedOpen && (
          <div className="relative pl-3.5 py-1 space-y-0.5 border-l-2 border-base-200/80 dark:border-base-300/50 ml-3.5 my-0.5">
            {item.children.map((nested, nIdx) => {
              const isNestedQuery = Boolean(nested.to && nested.to.includes("?"));
              const isNestedActive = isNestedQuery
                ? currentFullPath === nested.to
                : location.pathname === nested.to;

              return (
                <NavLink
                  key={nested.id}
                  to={nested.to || "#"}
                  onClick={onNavigate}
                  data-active={isNestedActive ? "true" : undefined}
                  style={parentOpen ? { animationDelay: `${nIdx * 35}ms` } : undefined}
                  className={() =>
                    `sidebar-subitem-link group relative block px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                      parentOpen ? "animate-subitem-cascade" : ""
                    } ${
                      isNestedActive
                        ? "bg-primary/10 text-primary font-bold shadow-2xs dark:bg-primary/20"
                        : "text-base-content/75 hover:text-base-content hover:bg-base-200/60"
                    }`
                  }
                >
                  {isNestedActive && (
                    <span
                      aria-hidden="true"
                      className="absolute -left-[18px] top-1.5 bottom-1.5 w-[3px] rounded-full bg-primary shadow-xs shadow-primary/30"
                    />
                  )}
                  <span className="truncate block group-hover:translate-x-0.5 transition-transform duration-150">
                    {nested.title}
                  </span>
                </NavLink>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.to || "#"}
      onClick={onNavigate}
      data-active={isItemActive ? "true" : undefined}
      style={parentOpen ? { animationDelay: `${index * 35}ms` } : undefined}
      className={() =>
        `sidebar-subitem-link group relative flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
          parentOpen ? "animate-subitem-cascade" : ""
        } ${
          isItemActive
            ? "bg-primary/10 text-primary font-bold shadow-2xs dark:bg-primary/20"
            : "text-base-content/70 hover:text-base-content hover:bg-base-200/60"
        }`
      }
    >
      {/* Code & Chill Talvo active vertical indicator connected to the guide line */}
      {isItemActive && (
        <span
          aria-hidden="true"
          className="absolute -left-[20px] top-2 bottom-2 w-[3px] rounded-full bg-primary shadow-xs shadow-primary/30 animate-in fade-in zoom-in-75 duration-200"
        />
      )}

      <span className="truncate group-hover:translate-x-0.5 transition-transform duration-150">
        {item.title}
      </span>
      {item.badge && (
        <span className="sidebar-badge px-2 py-0.5 text-xs font-bold rounded-full bg-primary/15 text-primary">
          {item.badge}
        </span>
      )}
    </NavLink>
  );
}
