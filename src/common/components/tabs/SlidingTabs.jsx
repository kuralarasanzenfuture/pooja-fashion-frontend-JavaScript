import { useEffect, useRef } from "react";

// Cubic easing curves matching Code & Chill's GSAP power3 curves
const easeOutPower3 = (t) => 1 - Math.pow(1 - t, 3);
const easeInOutPower3 = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * SlidingTabs
 * Code & Chill Signature Horizontal Fluid Liquid Elastic Sliding Tabs
 * Asymmetric stretch: leading edge shoots ahead, trailing edge pulls in
 */
export default function SlidingTabs({
  tabs = [],
  activeTab,
  onChange,
  variant = "pill", // "pill" | "segmented" | "underline" | "ghost"
  size = "md", // "xs" | "sm" | "md" | "lg"
  className = "",
  pillClassName = "",
  fullWidth = false,
}) {
  const containerRef = useRef(null);
  const pillRef = useRef(null);
  const animFrameRef = useRef(null);
  const currentStateRef = useRef(null);

  const updatePill = (animate = true) => {
    const container = containerRef.current;
    const pill = pillRef.current;
    if (!container || !pill) return;

    const activeBtn = container.querySelector(`[data-tab-id="${activeTab}"]`);
    if (!activeBtn || !activeBtn.offsetWidth) {
      pill.style.opacity = "0";
      return;
    }

    const cRect = container.getBoundingClientRect();
    const bRect = activeBtn.getBoundingClientRect();

    const target = {
      t: Math.round(bRect.top - cRect.top),
      r: Math.round(cRect.right - bRect.right),
      b: Math.round(cRect.bottom - bRect.bottom),
      l: Math.round(bRect.left - cRect.left),
    };

    const isUnderline = variant === "underline";
    const radius = isUnderline ? 2 : variant === "segmented" ? 10 : 12;

    const setClip = (state) => {
      if (isUnderline) {
        // Clip to bottom 3px accent bar for underline tabs
        pill.style.clipPath = `inset(${Math.max(0, state.b - 3)}px ${Math.max(
          0,
          state.r
        )}px 0px ${Math.max(0, state.l)}px round ${radius}px)`;
      } else {
        pill.style.clipPath = `inset(${Math.max(0, state.t)}px ${Math.max(
          0,
          state.r
        )}px ${Math.max(0, state.b)}px ${Math.max(0, state.l)}px round ${radius}px)`;
      }
      pill.style.opacity = "1";
    };

    const prev = currentStateRef.current;
    currentStateRef.current = { ...target };

    if (!animate || !prev || pill.style.opacity === "0") {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setClip(target);
      return;
    }

    // Directional stretch math (Code & Chill Gc horizontal tab physics)
    const isMovingRight = target.l > prev.l;
    const leadingKey = isMovingRight ? "r" : "l";
    const trailingKey = isMovingRight ? "l" : "r";

    const DURATION_LEAD = 300;
    const DURATION_TRAIL = 460;
    const DURATION_VERT = 240;

    const startTime = performance.now();
    const startValues = { ...prev };

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    const step = (now) => {
      const elapsed = now - startTime;

      const pLead = Math.min(1, elapsed / DURATION_LEAD);
      const pTrail = Math.min(1, elapsed / DURATION_TRAIL);
      const pVert = Math.min(1, elapsed / DURATION_VERT);

      const easeLead = easeOutPower3(pLead);
      const easeTrail = easeInOutPower3(pTrail);
      const easeVert = easeInOutPower3(pVert);

      const current = {
        [leadingKey]:
          startValues[leadingKey] +
          (target[leadingKey] - startValues[leadingKey]) * easeLead,
        [trailingKey]:
          startValues[trailingKey] +
          (target[trailingKey] - startValues[trailingKey]) * easeTrail,
        t: startValues.t + (target.t - startValues.t) * easeVert,
        b: startValues.b + (target.b - startValues.b) * easeVert,
      };

      setClip(current);

      if (elapsed < DURATION_TRAIL) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setClip(target);
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      updatePill(true);
    }, 15);
    return () => {
      clearTimeout(timer);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeTab]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => updatePill(false));
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  const sizeClasses =
    {
      xs: "px-2.5 py-1 text-xs gap-1.5",
      sm: "px-3 py-1.5 text-xs font-semibold gap-1.5",
      md: "px-4 py-2 text-sm font-semibold gap-2",
      lg: "px-5 py-2.5 text-base font-bold gap-2.5",
    }[size] || "px-4 py-2 text-sm font-semibold gap-2";

  const containerVariantClasses =
    {
      pill: "p-1 bg-base-200/80 rounded-2xl border border-base-300/80",
      segmented: "p-0.5 bg-base-200/60 rounded-xl border border-base-300/60",
      underline: "border-b border-base-300 gap-1",
      ghost: "p-1 bg-transparent gap-1.5",
    }[variant] || "p-1 bg-base-200/80 rounded-2xl border border-base-300/80";

  const defaultPillClass =
    {
      pill: "bg-primary text-primary-content shadow-sm shadow-primary/20",
      segmented:
        "bg-base-100 text-base-content shadow-xs border border-base-300/60",
      underline: "bg-primary",
      ghost: "bg-primary text-primary-content shadow-xs",
    }[variant] || "bg-primary text-primary-content shadow-sm";

  return (
    <div
      ref={containerRef}
      role="tablist"
      className={`relative inline-flex items-center select-none ${
        fullWidth ? "w-full flex" : ""
      } ${containerVariantClasses} ${className}`}
    >
      {/* Liquid Sliding Pill */}
      <div
        ref={pillRef}
        aria-hidden="true"
        className={`absolute inset-0 pointer-events-none z-0 transition-opacity duration-200 ${
          pillClassName || defaultPillClass
        }`}
        style={{ opacity: 0 }}
      />

      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        let activeTextClass = "text-primary-content font-bold";
        let inactiveTextClass =
          "text-base-content/70 hover:text-base-content hover:bg-base-200/40";

        if (variant === "segmented") {
          activeTextClass = "text-base-content font-bold";
          inactiveTextClass = "text-base-content/60 hover:text-base-content";
        } else if (variant === "underline") {
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
            className={`relative z-10 flex items-center justify-center transition-colors duration-200 rounded-xl cursor-pointer ${
              fullWidth ? "flex-1" : ""
            } ${sizeClasses} ${isActive ? activeTextClass : inactiveTextClass}`}
          >
            {Icon && (
              <Icon
                className={`size-4 shrink-0 transition-transform duration-200 ${
                  isActive ? "scale-105" : "opacity-75"
                }`}
              />
            )}
            <span className="truncate">{tab.label || tab.title || tab.id}</span>
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

