import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./sidebar.css";

/**
 * SidebarNavPill
 * Code & Chill Tend / Ignara Smooth Sliding Tab Indicator Pill
 * Managed cleanly via sidebar.css with GPU-composited 3D transforms
 */
export default function SidebarNavPill({ navRef, collapsed = false }) {
  const location = useLocation();
  const pillRef = useRef(null);
  const [pillType, setPillType] = useState("primary");

  const updatePill = () => {
    const nav = navRef?.current;
    const pill = pillRef?.current;
    if (!nav || !pill) return;

    // Query active nav link or open group trigger
    const activeEl =
      nav.querySelector('[data-nav-active="true"]') ||
      nav.querySelector('[data-nav-group-active="true"]') ||
      nav.querySelector('[data-nav-group-open="true"]');

    if (!activeEl || !activeEl.offsetWidth) {
      pill.style.opacity = "0";
      return;
    }

    const isDirectActive = activeEl.getAttribute("data-nav-active") === "true";
    setPillType(isDirectActive ? "primary" : "neutral");

    const navRect = nav.getBoundingClientRect();
    const itemRect = activeEl.getBoundingClientRect();

    const top = Math.round(itemRect.top - navRect.top);
    const height = Math.round(itemRect.height);

    pill.style.setProperty("--pill-y", `${top}px`);
    pill.style.setProperty("--pill-h", `${height}px`);
    pill.style.opacity = "1";
  };

  // Immediate update on route or state change
  useEffect(() => {
    updatePill();
    const timer = setTimeout(updatePill, 35);
    return () => clearTimeout(timer);
  }, [location.pathname, location.search, collapsed]);

  // Keep aligned on resizing or DOM updates
  useEffect(() => {
    const nav = navRef?.current;
    if (!nav) return;

    const ro = new ResizeObserver(() => updatePill());
    ro.observe(nav);

    const mo = new MutationObserver(() => updatePill());
    mo.observe(nav, { childList: true, subtree: true, attributes: true });

    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, [navRef]);

  return (
    <div
      ref={pillRef}
      aria-hidden="true"
      className={`sidebar-sliding-pill ${
        pillType === "primary" ? "pill-primary" : "pill-neutral"
      }`}
    />
  );
}

