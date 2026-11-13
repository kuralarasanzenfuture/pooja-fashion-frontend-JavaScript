import React, { useEffect, useRef } from "react";

/**
 * Dual-Spring Physics Engine (OPAL Inspired)
 * Models natural harmonic motion with stiffness (k) and damping ratio (z).
 * Unconditionally stable with micro-stepping sub-ticks.
 */
class Spring {
  constructor(k = 240, z = 0.82) {
    this.k = k; // stiffness
    this.z = z; // damping ratio (0.82 = slight underdamping for fluid organic recoil)
    this.x = 0; // current position
    this.v = 0; // current velocity
  }

  reset(x) {
    this.x = x;
    this.v = 0;
  }

  step(dt, target) {
    if (!dt || dt <= 0 || isNaN(dt)) return;
    const c = 2 * this.z * Math.sqrt(this.k);
    const n = Math.max(1, Math.min(12, Math.ceil(dt / 0.003)));
    const h = dt / n;
    for (let i = 0; i < n; i++) {
      const a = -this.k * (this.x - target) - c * this.v;
      this.v += a * h;
      this.x += this.v * h;
    }
  }

  isSettled(target, tol = 0.25) {
    return Math.abs(this.x - target) < tol && Math.abs(this.v) < 1.0;
  }
}

/**
 * SlidingTabs
 * Premium Dual-Spring Fluid Navigation Tabs.
 * Symmetrical bidirectional elasticity:
 *  - Moving Forward (Table -> Cards): Right edge springs ahead, left edge follows
 *  - Moving Backward (Cards -> Table): Left edge springs ahead, right edge follows
 * Volume conservation ensures natural fluid thinning during rapid travel.
 */
export default function SlidingTabs({
  tabs = [],
  activeTab,
  onChange,
  variant = "segmented", // "pill" | "segmented" | "underline" | "ghost"
  size = "xs", // "xs" | "sm" | "md" | "lg"
  className = "",
  pillClassName = "",
  fullWidth = false,
}) {
  const containerRef = useRef(null);
  const beadRef = useRef(null);
  const springLRef = useRef(new Spring(240, 0.82));
  const springRRef = useRef(new Spring(240, 0.82));
  const rafRef = useRef(null);
  const isInitializedRef = useRef(false);
  const isAnimatingRef = useRef(false);

  // Measure tab button geometry relative to container
  const getTabGeometry = (tabId) => {
    const container = containerRef.current;
    if (!container) return null;
    const btn = container.querySelector(`[data-tab-id="${tabId}"]`);
    if (!btn || !btn.offsetWidth) return null;

    const cRect = container.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();

    const left = bRect.left - cRect.left;
    const top = bRect.top - cRect.top;
    const width = bRect.width;
    const height = bRect.height;
    const right = left + width;

    return { left, top, width, height, right };
  };

  // Paint the bead at the calculated spring positions
  const paint = (L, R, top, height, targetW, isMoving) => {
    const bead = beadRef.current;
    if (!bead) return;

    const w = Math.max(16, R - L);
    const stretch = targetW > 0 ? w / targetW : 1;
    // Fluid volume conservation: height thins as bead elongates horizontally
    const scaleY = Math.max(
      0.82,
      Math.min(1.15, Math.pow(1 / Math.max(0.2, stretch), 0.4))
    );

    const isUnderline = variant === "underline";

    if (isUnderline) {
      bead.style.left = `${L.toFixed(2)}px`;
      bead.style.width = `${w.toFixed(2)}px`;
      bead.style.bottom = "0px";
      bead.style.height = "3px";
      bead.style.transform = "none";
    } else {
      bead.style.left = `${L.toFixed(2)}px`;
      bead.style.top = `${top.toFixed(2)}px`;
      bead.style.width = `${w.toFixed(2)}px`;
      bead.style.height = `${height.toFixed(2)}px`;
      bead.style.transform = isMoving ? `scaleY(${scaleY.toFixed(3)})` : "scale(1)";
    }
    bead.style.opacity = "1";
  };

  // Bidirectional spring animation loop
  const animateToTab = (tabId, immediate = false) => {
    const geo = getTabGeometry(tabId);
    if (!geo) return;

    const { left: tL, right: tR, top, height, width: targetW } = geo;

    if (immediate || !isInitializedRef.current) {
      isInitializedRef.current = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      isAnimatingRef.current = false;
      springLRef.current.reset(tL);
      springRRef.current.reset(tR);
      paint(tL, tR, top, height, targetW, false);
      return;
    }

    let lastTime = performance.now();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    isAnimatingRef.current = true;

    const tick = (now) => {
      const dt = Math.min(0.064, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      // Re-query current geometry in case of dynamic layout reflow
      const curGeo = getTabGeometry(tabId);
      const curTL = curGeo ? curGeo.left : tL;
      const curTR = curGeo ? curGeo.right : tR;
      const curTop = curGeo ? curGeo.top : top;
      const curHeight = curGeo ? curGeo.height : height;
      const curTargetW = curGeo ? curGeo.width : targetW;

      springLRef.current.step(dt, curTL);
      springRRef.current.step(dt, curTR);

      const L = springLRef.current.x;
      const R = springRRef.current.x;

      paint(L, R, curTop, curHeight, curTargetW, true);

      // Check if both edges have settled within tolerance
      if (
        springLRef.current.isSettled(curTL, 0.3) &&
        springRRef.current.isSettled(curTR, 0.3)
      ) {
        springLRef.current.reset(curTL);
        springRRef.current.reset(curTR);
        paint(curTL, curTR, curTop, curHeight, curTargetW, false);
        isAnimatingRef.current = false;
        rafRef.current = null;
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  // Trigger animation when activeTab changes
  useEffect(() => {
    animateToTab(activeTab, false);
  }, [activeTab]);

  // Handle window/container resizing without interrupting ongoing animations
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => {
      if (!isAnimatingRef.current) {
        animateToTab(activeTab, true);
      }
    });

    ro.observe(container);
    return () => ro.disconnect();
  }, [activeTab]);

  const sizeClasses =
    {
      xs: "px-3 py-1 text-xs gap-1.5",
      sm: "px-3.5 py-1.5 text-xs font-semibold gap-1.5",
      md: "px-4 py-2 text-sm font-semibold gap-2",
      lg: "px-5 py-2.5 text-base font-bold gap-2.5",
    }[size] || "px-3 py-1 text-xs gap-1.5";

  const containerVariantClasses =
    {
      pill: "p-1 bg-base-200/80 dark:bg-base-300/50 rounded-full border border-base-300/80 inline-flex items-center gap-0.5 shadow-2xs",
      segmented:
        "p-1 bg-base-200/70 dark:bg-base-300/40 rounded-full border border-base-300/80 inline-flex items-center gap-0.5 shadow-2xs",
      underline: "border-b border-base-300 gap-1",
      ghost: "p-1 bg-transparent gap-1.5",
    }[variant] ||
    "p-1 bg-base-200/70 dark:bg-base-300/40 rounded-full border border-base-300/80 inline-flex items-center gap-0.5 shadow-2xs";

  const defaultPillClass =
    {
      pill: "bg-primary text-primary-content shadow-sm shadow-primary/25 rounded-full",
      segmented:
        "bg-primary text-primary-content shadow-sm shadow-primary/25 rounded-full",
      underline: "bg-primary",
      ghost: "bg-primary text-primary-content shadow-xs rounded-full",
    }[variant] ||
    "bg-primary text-primary-content shadow-sm shadow-primary/25 rounded-full";

  return (
    <div
      ref={containerRef}
      role="tablist"
      className={`relative inline-flex items-center select-none ${
        fullWidth ? "w-full flex" : ""
      } ${containerVariantClasses} ${className}`}
    >
      {/* Liquid Elastic Spring Bead */}
      <div
        ref={beadRef}
        aria-hidden="true"
        className={`absolute pointer-events-none z-0 transition-opacity duration-200 ${
          pillClassName || defaultPillClass
        }`}
        style={{
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          opacity: 0,
          transformOrigin: "center center",
          willChange: "left, width, transform",
        }}
      />

      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        let activeTextClass = "text-primary-content font-bold";
        let inactiveTextClass =
          "text-base-content/65 hover:text-primary hover:bg-base-200/50 font-medium";

        if (variant === "underline") {
          activeTextClass = "text-primary font-bold";
          inactiveTextClass = "text-base-content/60 hover:text-base-content";
        }

        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            data-tab-id={tab.id}
            aria-selected={isActive}
            onClick={() => onChange?.(tab.id)}
            className={`relative z-10 flex items-center justify-center transition-colors duration-200 rounded-full cursor-pointer tracking-tight ${
              fullWidth ? "flex-1" : ""
            } ${sizeClasses} ${isActive ? activeTextClass : inactiveTextClass}`}
          >
            {Icon && (
              <Icon
                className={`size-3.5 shrink-0 transition-transform duration-200 ${
                  isActive ? "scale-105 opacity-100" : "opacity-60"
                }`}
              />
            )}
            <span className="truncate capitalize">{tab.label || tab.title || tab.id}</span>
            {tab.badge !== undefined && tab.badge !== null && (
              <span
                className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                  isActive
                    ? variant === "pill"
                      ? "bg-white/20 text-white"
                      : "bg-primary/15 text-primary"
                    : "bg-base-300 text-base-content/70"
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
