import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFontFamily, setFontSize, setTypography } from "../../../../redux/ui/uiSlice.js";
import {
  Type,
  Check,
  Sparkles,
  Shuffle,
  Copy,
  RotateCcw,
  Undo2,
  Redo2,
  ChevronDown,
  Code2,
  FileText,
  BookOpen,
  Laptop,
  Layers,
  ArrowRight,
  Menu as MenuIcon,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "../../../../common/components/ui/buttons/index.js";

// Font Options as seen in ui.shadcn.com/typeset
const HEADING_BODY_FONTS = [
  { id: "geist", label: "Geist", family: "var(--font-geist, 'Geist Variable', sans-serif)", category: "Sans" },
  { id: "inter", label: "Inter", family: "'Inter', sans-serif", category: "Sans" },
  { id: "noto-sans", label: "Noto Sans", family: "'Noto Sans', sans-serif", category: "Sans" },
  { id: "nunito-sans", label: "Nunito Sans", family: "'Nunito Sans', sans-serif", category: "Sans" },
  { id: "figtree", label: "Figtree", family: "'Figtree', sans-serif", category: "Sans" },
  { id: "roboto", label: "Roboto", family: "'Roboto', sans-serif", category: "Sans" },
  { id: "raleway", label: "Raleway", family: "'Raleway', sans-serif", category: "Sans" },
  { id: "dm-sans", label: "DM Sans", family: "'DM Sans', sans-serif", category: "Sans" },
  { id: "public-sans", label: "Public Sans", family: "'Public Sans', sans-serif", category: "Sans" },
  { id: "outfit", label: "Outfit", family: "'Outfit', sans-serif", category: "Sans" },
  { id: "jakarta", label: "Plus Jakarta Sans", family: "'Plus Jakarta Sans', sans-serif", category: "Sans" },
  { id: "playfair", label: "Playfair Display", family: "'Playfair Display', Georgia, serif", category: "Serif" },
];

const MONO_FONTS = [
  { id: "geist-mono", label: "Geist Mono", family: "var(--font-geist-mono, 'Geist Mono Variable', monospace)" },
  { id: "jetbrains-mono", label: "JetBrains Mono", family: "'JetBrains Mono', monospace" },
  { id: "fira-code", label: "Fira Code", family: "'Fira Code', monospace" },
  { id: "courier", label: "Courier New", family: "'Courier New', monospace" },
];

const MEASURE_OPTIONS = ["37em", "60ch", "70ch", "80ch", "90ch"];

const SIZE_OPTIONS = ["13px", "14px", "15px", "16px", "18px", "20px"];

const LEADING_OPTIONS = [
  { id: "tight", label: "Tight (1.6)", value: "1.6" },
  { id: "regular", label: "Regular (1.75)", value: "1.75" },
  { id: "loose", label: "Loose (1.9)", value: "1.9" },
];

const FLOW_OPTIONS = [
  { id: "compact", label: "Compact (1em)", value: "1em" },
  { id: "regular", label: "Regular (1.25em)", value: "1.25em" },
  { id: "airy", label: "Airy (2em)", value: "2em" },
];

// Content sample pages (01 - 05)
const CONTENT_SAMPLES = [
  {
    id: "01",
    tag: "Chatbot & LLM Streaming Guide",
    title: "In this guide, you will learn how to use the useChat hook to create a chatbot application with real-time message streaming.",
    lead: "Check out our chatbot with tools guide to learn how to use tools in your chatbot.",
    steps: [
      {
        num: "1",
        title: "Create typeset.css",
        text: "Copy the stylesheet into a typeset.css file next to your main CSS file, then import it into your root stylesheet:",
        code: `@import "tailwindcss";\n@import "./typeset.css";`,
      },
      {
        num: "2",
        title: "Add the variable fonts",
        text: "Install the Geist and Geist Mono font packages via your favorite package manager:",
        code: `npm install @fontsource-variable/geist @fontsource-variable/geist-mono`,
      },
      {
        num: "3",
        title: "Create your custom typeset",
        text: "Configure typography rhythm tokens using clean CSS custom properties:",
        code: `/* globals.css */\n@import "tailwindcss";\n@import "./typeset.css";\n\n.typeset-docs {\n  --typeset-font-body: var(--font-geist);\n  --typeset-font-heading: var(--font-geist);\n  --typeset-font-mono: var(--font-geist-mono);\n  --typeset-size: 15px;\n  --typeset-leading: 1.75;\n  --typeset-flow: 1.25em;\n}`,
      },
      {
        num: "4",
        title: "Wrap your rendered content",
        text: "Apply container-aware typeset classes to eliminate layout shifts in streaming responses:",
        code: `<div className="typeset typeset-docs max-w-[37em]">\n  {content}\n</div>`,
      },
    ],
  },
  {
    id: "02",
    tag: "Pooja Fashion Saree & Silk Catalog",
    title: "Handwoven Kanjivaram Silks, Banarasi Brocades & Luxury Bridal Ensembles",
    lead: "Every metre is spun with pure mulberry threads, certified zari weaving, and artisan floral jaal craftsmanship.",
    steps: [
      {
        num: "1",
        title: "Pure Zari Weft Verification",
        text: "Inspected at our Kanchipuram loom cluster using electroplated silver and gold wire grading.",
        code: `SKU: KANJI-BRIDAL-001\nType: Pure Silk 6-yard\nZari: Certified 2G Pure\nHSN: 5007`,
      },
      {
        num: "2",
        title: "Boutique Retail Pricing & HSN Tax",
        text: "Standard GST 5% applies under Indian textiles taxation with real-time barcode sync to our POS register.",
        code: `Base Price: ₹18,500\nCGST (2.5%): ₹462.50\nSGST (2.5%): ₹462.50\nFinal Bill: ₹19,425`,
      },
    ],
  },
  {
    id: "03",
    tag: "POS Invoicing & Billing Guide",
    title: "High-Speed Cash Counter Workflow & Instant Thermal Bill Generation",
    lead: "Designed for peak festival rushes at Diwali, Pongal, and wedding seasons with sub-second barcode checkout.",
    steps: [
      {
        num: "1",
        title: "Scan Barcode or Enter Product Code",
        text: "The optical scanner decodes both EAN-13 retail tags and metre fabric cut QR vouchers.",
        code: `scanner.on("scan", (barcode) => {\n  posCart.addItem({ barcode, qty: 1 });\n});`,
      },
      {
        num: "2",
        title: "Select Payment Mode & Print Tax Receipt",
        text: "Split tender between UPI QR, credit card, and cash with automatic GST breakdown.",
        code: `await generateInvoice({\n  tender: "UPI",\n  printThermal: true,\n  sendWhatsApp: true,\n});`,
      },
    ],
  },
  {
    id: "04",
    tag: "Store Policies & Exchange Terms",
    title: "Seven-Day Exchange Policy, Saree Blouse Alterations & Fall-Pico Services",
    lead: "Ensuring every boutique patron enjoys transparent fitting guarantees and hassle-free gifting exchanges.",
    steps: [
      {
        num: "1",
        title: "Exchange Window & Condition",
        text: "Unstitched sarees and lehengas may be exchanged within 7 days with original price tags intact.",
        code: `Condition: Unworn, tags intact\nWindow: 7 days from purchase\nBill Required: Original POS receipt`,
      },
      {
        num: "2",
        title: "Complimentary Fall & Pico",
        text: "Every silk saree purchased at Pooja Fashion includes master artisan fall-stitching and edge pico finishing.",
        code: `Turnaround: Same-day (under 4 hours)\nThread: Matched silk-cotton blend`,
      },
    ],
  },
  {
    id: "05",
    tag: "Component Specs & Typography System",
    title: "Container-Aware Spacing, Typography Rhythm & Fluid Streaming Layouts",
    lead: "All line-heights, paragraph margins, blockquote borders, and table padding are calculated proportionally.",
    steps: [
      {
        num: "1",
        title: "Fluid Relative Em Scaling",
        text: "Font sizes and spacing scale proportionally to --typeset-size without breaking layout harmony.",
        code: `font-size: calc(var(--typeset-size) * 1.125);\nmargin-block-start: var(--typeset-flow);\nline-height: var(--typeset-leading);`,
      },
      {
        num: "2",
        title: "Theme Invariant Contrast",
        text: "Works smoothly across dark mode, light mode, and vibrant boutique theme palettes.",
        code: `color: var(--color-foreground, currentColor);\n--typeset-muted: var(--color-muted-foreground);`,
      },
    ],
  },
];

export default function FontSettings() {
  const dispatch = useDispatch();
  const currentAppFontId = useSelector((state) => state.ui?.fontFamily) || (typeof window !== "undefined" ? localStorage.getItem("pooja_app_font") : "") || "outfit";
  const currentAppFontSize = useSelector((state) => state.ui?.fontSize) || (typeof window !== "undefined" ? localStorage.getItem("pooja_app_font_size") : "") || "15px";
  const currentAppHeading = useSelector((state) => state.ui?.headingFont) || (typeof window !== "undefined" ? localStorage.getItem("pooja_app_heading_font") : "") || "";
  const currentAppMono = useSelector((state) => state.ui?.monoFont) || (typeof window !== "undefined" ? localStorage.getItem("pooja_app_mono_font") : "") || "";
  const currentAppLineHeight = useSelector((state) => state.ui?.lineHeight) || (typeof window !== "undefined" ? localStorage.getItem("pooja_app_line_height") : "") || "1.75";

  const initialBody =
    HEADING_BODY_FONTS.find((f) => f.id === currentAppFontId || (currentAppFontId === "luxury" && f.id === "playfair")) ||
    HEADING_BODY_FONTS[0];

  const initialHeading =
    HEADING_BODY_FONTS.find((f) => f.family === currentAppHeading || f.id === currentAppHeading) ||
    initialBody;

  const initialMono =
    MONO_FONTS.find((f) => f.family === currentAppMono || f.id === currentAppMono) ||
    MONO_FONTS[0];

  const initialSize = SIZE_OPTIONS.includes(currentAppFontSize) ? currentAppFontSize : "15px";

  const initialLeading =
    LEADING_OPTIONS.find((l) => l.value === currentAppLineHeight) ||
    LEADING_OPTIONS[1];

  // Active Typeset Controls State
  const [measure, setMeasure] = useState("80ch");
  const [headingFont, setHeadingFont] = useState(initialHeading);
  const [bodyFont, setBodyFont] = useState(initialBody);
  const [monoFont, setMonoFont] = useState(initialMono);
  const [size, setSize] = useState(initialSize);
  const [leading, setLeading] = useState(initialLeading);
  const [flow, setFlow] = useState(FLOW_OPTIONS[1]); // Regular 1.25em
  const [liveSync, setLiveSync] = useState(true);

  // Live Hover Preview States (matching ui.shadcn.com/typeset)
  const [hoveredHeading, setHoveredHeading] = useState(null);
  const [hoveredBody, setHoveredBody] = useState(null);
  const [hoveredMono, setHoveredMono] = useState(null);
  const [hoveredMeasure, setHoveredMeasure] = useState(null);
  const [hoveredSize, setHoveredSize] = useState(null);
  const [hoveredLeading, setHoveredLeading] = useState(null);
  const [hoveredFlow, setHoveredFlow] = useState(null);

  const effectiveHeading = hoveredHeading || headingFont;
  const effectiveBody = hoveredBody || bodyFont;
  const effectiveMono = hoveredMono || monoFont;
  const effectiveMeasure = hoveredMeasure || measure;
  const effectiveSize = hoveredSize || size;
  const effectiveLeading = hoveredLeading || leading;
  const effectiveFlow = hoveredFlow || flow;

  // UI state for popovers and tabs
  const [activeTab, setActiveTab] = useState("docs"); // 'docs' | 'prompt' | 'code'
  const [currentSampleIndex, setCurrentSampleIndex] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null); // 'menu' | 'measure' | 'heading' | 'body' | 'mono' | 'size' | 'leading' | 'flow' | null
  const [copiedCode, setCopiedCode] = useState(false);
  const [appliedNotice, setAppliedNotice] = useState(false);

  // Close dropdown on click outside
  const controlPanelRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (controlPanelRef.current && !controlPanelRef.current.contains(e.target)) {
        setOpenDropdown(null);
        setHoveredHeading(null);
        setHoveredBody(null);
        setHoveredMono(null);
        setHoveredMeasure(null);
        setHoveredSize(null);
        setHoveredLeading(null);
        setHoveredFlow(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
    setHoveredHeading(null);
    setHoveredBody(null);
    setHoveredMono(null);
    setHoveredMeasure(null);
    setHoveredSize(null);
    setHoveredLeading(null);
    setHoveredFlow(null);
  };

  // Helper to apply typography changes across the whole application
  const applyGlobalTypography = ({
    targetFontId = bodyFont.id === "playfair" ? "luxury" : bodyFont.id,
    targetBodyFamily = bodyFont.family,
    targetHeadingFamily = headingFont.family,
    targetMonoFamily = monoFont.family,
    targetSize = size,
    targetLeading = leading.value,
    saveToStorage = true,
  } = {}) => {
    dispatch(
      setTypography({
        fontFamily: targetFontId,
        fontSize: targetSize,
        headingFamily: targetHeadingFamily,
        monoFamily: targetMonoFamily,
        lineHeight: targetLeading,
      })
    );

    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-font", targetFontId);
      document.documentElement.setAttribute("data-font-size", targetSize);
      document.documentElement.style.setProperty("--app-font-size", targetSize);
      document.documentElement.style.setProperty("font-size", targetSize, "important");
      document.documentElement.style.setProperty("--font-family", targetBodyFamily);
      document.documentElement.style.setProperty("--font-body", targetBodyFamily);
      document.documentElement.style.setProperty("--font-display", targetHeadingFamily);
      document.documentElement.style.setProperty("--font-geist-mono", targetMonoFamily);
      document.documentElement.style.setProperty("--app-line-height", targetLeading);
      if (document.body) {
        document.body.style.setProperty("font-size", targetSize);
        document.body.style.setProperty("line-height", targetLeading);
      }
    }

    if (saveToStorage && typeof window !== "undefined") {
      localStorage.setItem("pooja_app_font", targetFontId);
      localStorage.setItem("pooja_app_font_size", targetSize);
      localStorage.setItem("pooja_app_heading_font", targetHeadingFamily);
      localStorage.setItem("pooja_app_mono_font", targetMonoFamily);
      localStorage.setItem("pooja_app_line_height", targetLeading);
    }
  };

  // Selection & Live Hover Handlers for Size
  const handleSelectSize = (opt) => {
    setSize(opt);
    setHoveredSize(null);
    setOpenDropdown(null);
    if (liveSync) {
      applyGlobalTypography({ targetSize: opt });
    }
  };

  const handleHoverSize = (opt) => {
    setHoveredSize(opt);
  };

  const handleLeaveSize = () => {
    setHoveredSize(null);
  };

  // Selection & Live Hover Handlers for Heading Font
  const handleSelectHeading = (font) => {
    setHeadingFont(font);
    setHoveredHeading(null);
    setOpenDropdown(null);
    if (liveSync) {
      applyGlobalTypography({ targetHeadingFamily: font.family });
    }
  };

  const handleHoverHeading = (font) => {
    setHoveredHeading(font);
  };

  const handleLeaveHeading = () => {
    setHoveredHeading(null);
  };

  // Selection & Live Hover Handlers for Body Font
  const handleSelectBody = (font) => {
    setBodyFont(font);
    setHoveredBody(null);
    setOpenDropdown(null);
    if (liveSync) {
      const fid = font.id === "playfair" ? "luxury" : font.id;
      applyGlobalTypography({ targetFontId: fid, targetBodyFamily: font.family });
    }
  };

  const handleHoverBody = (font) => {
    setHoveredBody(font);
  };

  const handleLeaveBody = () => {
    setHoveredBody(null);
  };

  // Selection & Live Hover Handlers for Mono Font
  const handleSelectMono = (font) => {
    setMonoFont(font);
    setHoveredMono(null);
    setOpenDropdown(null);
    if (liveSync) {
      applyGlobalTypography({ targetMonoFamily: font.family });
    }
  };

  const handleHoverMono = (font) => {
    setHoveredMono(font);
  };

  const handleLeaveMono = () => {
    setHoveredMono(null);
  };

  // Selection & Live Hover Handlers for Leading (Line Height)
  const handleSelectLeading = (opt) => {
    setLeading(opt);
    setHoveredLeading(null);
    setOpenDropdown(null);
    if (liveSync) {
      applyGlobalTypography({ targetLeading: opt.value });
    }
  };

  const handleHoverLeading = (opt) => {
    setHoveredLeading(opt);
  };

  const handleLeaveLeading = () => {
    setHoveredLeading(null);
  };

  // Shuffle algorithm
  const handleShuffle = () => {
    const randomHeading = HEADING_BODY_FONTS[Math.floor(Math.random() * HEADING_BODY_FONTS.length)];
    const randomBody = HEADING_BODY_FONTS[Math.floor(Math.random() * HEADING_BODY_FONTS.length)];
    const randomMono = MONO_FONTS[Math.floor(Math.random() * MONO_FONTS.length)];
    const randomMeasure = MEASURE_OPTIONS[Math.floor(Math.random() * MEASURE_OPTIONS.length)];
    const randomSize = SIZE_OPTIONS[Math.floor(Math.random() * SIZE_OPTIONS.length)];
    const randomLeading = LEADING_OPTIONS[Math.floor(Math.random() * LEADING_OPTIONS.length)];
    const randomFlow = FLOW_OPTIONS[Math.floor(Math.random() * FLOW_OPTIONS.length)];

    setHeadingFont(randomHeading);
    setBodyFont(randomBody);
    setMonoFont(randomMono);
    setMeasure(randomMeasure);
    setSize(randomSize);
    setLeading(randomLeading);
    setFlow(randomFlow);
    setOpenDropdown(null);

    if (liveSync) {
      const fid = randomBody.id === "playfair" ? "luxury" : randomBody.id;
      applyGlobalTypography({
        targetFontId: fid,
        targetBodyFamily: randomBody.family,
        targetHeadingFamily: randomHeading.family,
        targetMonoFamily: randomMono.family,
        targetSize: randomSize,
        targetLeading: randomLeading.value,
      });
    }
  };

  // Reset to default Geist specs
  const handleReset = () => {
    const defaultHeading = HEADING_BODY_FONTS[0]; // Geist
    const defaultBody = HEADING_BODY_FONTS[0]; // Geist
    const defaultMono = MONO_FONTS[0]; // Geist Mono
    const defaultMeasure = "80ch";
    const defaultSize = "15px";
    const defaultLeading = LEADING_OPTIONS[1]; // Regular 1.75
    const defaultFlow = FLOW_OPTIONS[1];

    setHeadingFont(defaultHeading);
    setBodyFont(defaultBody);
    setMonoFont(defaultMono);
    setMeasure(defaultMeasure);
    setSize(defaultSize);
    setLeading(defaultLeading);
    setFlow(defaultFlow);
    setOpenDropdown(null);

    applyGlobalTypography({
      targetFontId: defaultBody.id,
      targetBodyFamily: defaultBody.family,
      targetHeadingFamily: defaultHeading.family,
      targetMonoFamily: defaultMono.family,
      targetSize: defaultSize,
      targetLeading: defaultLeading.value,
      saveToStorage: true,
    });
  };

  // Copy CSS code
  const handleCopyCode = () => {
    const cssCode = `/* globals.css */\n@import "tailwindcss";\n@import "./typeset.css";\n@import "@fontsource-variable/geist";\n@import "@fontsource-variable/geist-mono";\n\n:root {\n  --font-geist: 'Geist Variable', sans-serif;\n  --font-geist-mono: 'Geist Mono Variable', monospace;\n}\n\n.typeset-docs {\n  --typeset-font-body: ${bodyFont.family};\n  --typeset-font-heading: ${headingFont.family};\n  --typeset-font-mono: ${monoFont.family};\n  --typeset-size: ${size};\n  --typeset-leading: ${leading.value};\n  --typeset-flow: ${flow.value};\n}`;
    navigator.clipboard.writeText(cssCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Explicitly apply chosen typography to entire application
  const handleApplyToApp = () => {
    const targetFontId = bodyFont.id === "playfair" ? "luxury" : bodyFont.id;
    applyGlobalTypography({
      targetFontId,
      targetBodyFamily: bodyFont.family,
      targetHeadingFamily: headingFont.family,
      targetMonoFamily: monoFont.family,
      targetSize: size,
      targetLeading: leading.value,
      saveToStorage: true,
    });
    setAppliedNotice(true);
    setTimeout(() => setAppliedNotice(false), 2500);
  };

  const currentSample = CONTENT_SAMPLES[currentSampleIndex];

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-base-300">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Type className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-base-content font-display">
              shadcn / typeset Studio & Typography Rhythm
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary text-primary-content">
              ui.shadcn.com/typeset
            </span>
          </div>
          <p className="text-xs text-base-content/60 mt-1 max-w-2xl">
            Single-file container-aware typography stylesheet (<code className="font-mono text-primary font-bold">typeset.css</code>).
            Control body, heading, and mono typography rhythm with instant live preview and stream-safe layout.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="clip-six"
            size="sm"
            icon={Sparkles}
            onClick={handleApplyToApp}
          >
            {appliedNotice ? "Applied to Entire App!" : "Apply All to Entire App"}
          </Button>
        </div>
      </div>

      {/* Main Typeset Interactive Studio Workspace */}
      <div className="rounded-3xl border border-base-300 bg-base-100 shadow-md flex flex-col lg:flex-row min-h-[640px] relative">
        {/* ========================================================
            LEFT CONTROL STRIP (Directly replicating ui.shadcn.com/typeset)
           ======================================================== */}
        <aside
          ref={controlPanelRef}
          className="w-full lg:w-56 bg-[#18181b] text-[#fafafa] p-3.5 flex flex-col justify-between shrink-0 select-none border-b lg:border-b-0 lg:border-r border-[#27272a] text-xs font-medium rounded-t-3xl lg:rounded-tr-none lg:rounded-l-3xl relative z-30"
        >
          <div className="space-y-2">
            {/* 1. Menu Row */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown("menu")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#27272a]/70 hover:bg-[#27272a] text-white transition-colors cursor-pointer"
              >
                <span className="font-semibold text-sm">Menu</span>
                <MenuIcon className="w-4 h-4 text-white/70" />
              </button>

              {/* Menu Dropdown Popover */}
              {openDropdown === "menu" && (
                <div className="absolute left-0 top-full lg:left-full lg:top-0 lg:ml-2 mt-1.5 lg:mt-0 w-48 rounded-xl bg-[#27272a] border border-[#3f3f46] shadow-2xl p-1.5 z-50 text-white animate-in fade-in duration-150">
                  <button
                    type="button"
                    onClick={handleShuffle}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left transition-colors cursor-pointer"
                  >
                    <span>Shuffle</span>
                    <kbd className="text-[10px] text-white/40 font-mono">R</kbd>
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left transition-colors cursor-pointer"
                  >
                    <span>Reset</span>
                    <kbd className="text-[10px] text-white/40 font-mono">Shift+R</kbd>
                  </button>
                </div>
              )}
            </div>

            {/* Live Sync with Application Overall Toggle */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#27272a]/60 border border-[#3f3f46]/50">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${liveSync ? "bg-emerald-400 animate-pulse" : "bg-white/30"}`} />
                <span className="text-[11px] font-medium text-white/80">Sync to App</span>
              </div>
              <button
                type="button"
                onClick={() => setLiveSync(!liveSync)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition-colors cursor-pointer ${
                  liveSync ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-white/10 text-white/50"
                }`}
                title="When ON, font sizes and typesets scale the entire app immediately"
              >
                {liveSync ? "LIVE ON" : "PAUSED"}
              </button>
            </div>

            {/* 2. Measure Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown("measure")}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer text-left ${
                  hoveredMeasure
                    ? "bg-primary/25 border border-primary/40 text-white"
                    : "bg-[#27272a]/50 hover:bg-[#27272a] text-white"
                }`}
              >
                <div>
                  <div className="text-[10.5px] text-white/50 font-normal flex items-center gap-1.5">
                    <span>Measure</span>
                    {hoveredMeasure && <span className="text-[9px] text-primary bg-primary/20 px-1 rounded font-mono font-bold">Live</span>}
                  </div>
                  <div className="text-[13px] font-bold mt-0.5">{effectiveMeasure}</div>
                </div>
                <span className="text-white/40 font-mono text-xs">↔</span>
              </button>

              {openDropdown === "measure" && (
                <div
                  onMouseLeave={() => setHoveredMeasure(null)}
                  className="absolute left-0 top-full lg:left-full lg:top-0 lg:ml-2 mt-1.5 lg:mt-0 w-44 rounded-xl bg-[#27272a] border border-[#3f3f46] shadow-2xl p-1.5 z-50 animate-in fade-in duration-150"
                >
                  <div className="px-2.5 py-1 text-[10px] text-white/40 font-mono uppercase tracking-wider flex items-center justify-between">
                    <span>Column Measure</span>
                    {hoveredMeasure && <span className="text-primary font-bold">Preview</span>}
                  </div>
                  {MEASURE_OPTIONS.map((opt) => {
                    const isSelected = measure === opt;
                    const isHovered = hoveredMeasure === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onMouseEnter={() => setHoveredMeasure(opt)}
                        onClick={() => {
                          setMeasure(opt);
                          setHoveredMeasure(null);
                          setOpenDropdown(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer my-0.5 ${
                          isHovered
                            ? "bg-primary text-primary-content font-bold shadow-sm scale-[1.02]"
                            : isSelected
                            ? "bg-white/20 text-white font-semibold"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <span className="text-xs font-mono">{opt}</span>
                        {isSelected && <Check className={`w-3.5 h-3.5 ${isHovered ? "text-primary-content" : "text-primary"}`} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Heading Font Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown("heading")}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer text-left ${
                  hoveredHeading
                    ? "bg-primary/25 border border-primary/40 text-white"
                    : "bg-[#27272a]/50 hover:bg-[#27272a] text-white"
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="text-[10.5px] text-white/50 font-normal flex items-center gap-1.5">
                    <span>Heading</span>
                    {hoveredHeading && <span className="text-[9px] text-primary bg-primary/20 px-1 rounded font-mono font-bold">Live</span>}
                  </div>
                  <div className="text-[13px] font-bold mt-0.5 truncate" style={{ fontFamily: effectiveHeading.family }}>
                    {effectiveHeading.label}
                  </div>
                </div>
                <span className="text-white/40 font-serif text-sm">Aa</span>
              </button>

              {openDropdown === "heading" && (
                <div
                  onMouseLeave={handleLeaveHeading}
                  className="absolute left-0 top-full lg:left-full lg:top-0 lg:ml-2 mt-1.5 lg:mt-0 w-56 max-h-72 overflow-y-auto rounded-xl bg-[#27272a] border border-[#3f3f46] shadow-2xl p-1.5 z-50 scrollbar-thin animate-in fade-in duration-150"
                >
                  <div className="px-2.5 py-1 text-[10px] text-white/40 font-mono uppercase tracking-wider flex items-center justify-between">
                    <span>Heading Typeface</span>
                    {hoveredHeading && <span className="text-primary font-bold">Previewing</span>}
                  </div>
                  {HEADING_BODY_FONTS.map((font) => {
                    const isSelected = headingFont.id === font.id;
                    const isHovered = hoveredHeading?.id === font.id;
                    return (
                      <button
                        key={font.id}
                        type="button"
                        onMouseEnter={() => handleHoverHeading(font)}
                        onClick={() => handleSelectHeading(font)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer my-0.5 ${
                          isHovered
                            ? "bg-primary text-primary-content font-bold shadow-sm scale-[1.02]"
                            : isSelected
                            ? "bg-white/20 text-white font-semibold"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="truncate text-xs" style={{ fontFamily: font.family }}>
                            {font.label}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase ${
                            isHovered ? "bg-primary-content/20 text-primary-content" : "bg-white/10 text-white/50"
                          }`}>
                            {font.category}
                          </span>
                        </div>
                        {isSelected && <Check className={`w-3.5 h-3.5 ${isHovered ? "text-primary-content" : "text-primary"}`} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. Body Font Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown("body")}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer text-left ${
                  hoveredBody
                    ? "bg-primary/25 border border-primary/40 text-white"
                    : "bg-[#27272a]/50 hover:bg-[#27272a] text-white"
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="text-[10.5px] text-white/50 font-normal flex items-center gap-1.5">
                    <span>Body</span>
                    {hoveredBody && <span className="text-[9px] text-primary bg-primary/20 px-1 rounded font-mono font-bold">Live</span>}
                  </div>
                  <div className="text-[13px] font-bold mt-0.5 truncate" style={{ fontFamily: effectiveBody.family }}>
                    {effectiveBody.label}
                  </div>
                </div>
                <span className="text-white/40 font-sans text-sm">Aa</span>
              </button>

              {openDropdown === "body" && (
                <div
                  onMouseLeave={handleLeaveBody}
                  className="absolute left-0 top-full lg:left-full lg:top-0 lg:ml-2 mt-1.5 lg:mt-0 w-56 max-h-72 overflow-y-auto rounded-xl bg-[#27272a] border border-[#3f3f46] shadow-2xl p-1.5 z-50 scrollbar-thin animate-in fade-in duration-150"
                >
                  <div className="px-2.5 py-1 text-[10px] text-white/40 font-mono uppercase tracking-wider flex items-center justify-between">
                    <span>Body Typeface</span>
                    {hoveredBody && <span className="text-primary font-bold">Previewing</span>}
                  </div>
                  {HEADING_BODY_FONTS.map((font) => {
                    const isSelected = bodyFont.id === font.id;
                    const isHovered = hoveredBody?.id === font.id;
                    return (
                      <button
                        key={font.id}
                        type="button"
                        onMouseEnter={() => handleHoverBody(font)}
                        onClick={() => handleSelectBody(font)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer my-0.5 ${
                          isHovered
                            ? "bg-primary text-primary-content font-bold shadow-sm scale-[1.02]"
                            : isSelected
                            ? "bg-white/20 text-white font-semibold"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="truncate text-xs" style={{ fontFamily: font.family }}>
                            {font.label}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase ${
                            isHovered ? "bg-primary-content/20 text-primary-content" : "bg-white/10 text-white/50"
                          }`}>
                            {font.category}
                          </span>
                        </div>
                        {isSelected && <Check className={`w-3.5 h-3.5 ${isHovered ? "text-primary-content" : "text-primary"}`} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 5. Mono Font Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown("mono")}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer text-left ${
                  hoveredMono
                    ? "bg-primary/25 border border-primary/40 text-white"
                    : "bg-[#27272a]/50 hover:bg-[#27272a] text-white"
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="text-[10.5px] text-white/50 font-normal flex items-center gap-1.5">
                    <span>Mono</span>
                    {hoveredMono && <span className="text-[9px] text-primary bg-primary/20 px-1 rounded font-mono font-bold">Live</span>}
                  </div>
                  <div className="text-[13px] font-bold mt-0.5 truncate" style={{ fontFamily: effectiveMono.family }}>
                    {effectiveMono.label}
                  </div>
                </div>
                <span className="text-white/40 font-mono text-xs">Aa</span>
              </button>

              {openDropdown === "mono" && (
                <div
                  onMouseLeave={handleLeaveMono}
                  className="absolute left-0 top-full lg:left-full lg:top-0 lg:ml-2 mt-1.5 lg:mt-0 w-52 rounded-xl bg-[#27272a] border border-[#3f3f46] shadow-2xl p-1.5 z-50 animate-in fade-in duration-150"
                >
                  <div className="px-2.5 py-1 text-[10px] text-white/40 font-mono uppercase tracking-wider flex items-center justify-between">
                    <span>Monospace Typeface</span>
                    {hoveredMono && <span className="text-primary font-bold">Previewing</span>}
                  </div>
                  {MONO_FONTS.map((font) => {
                    const isSelected = monoFont.id === font.id;
                    const isHovered = hoveredMono?.id === font.id;
                    return (
                      <button
                        key={font.id}
                        type="button"
                        onMouseEnter={() => handleHoverMono(font)}
                        onClick={() => handleSelectMono(font)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer my-0.5 ${
                          isHovered
                            ? "bg-primary text-primary-content font-bold shadow-sm scale-[1.02]"
                            : isSelected
                            ? "bg-white/20 text-white font-semibold"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <span className="truncate text-xs font-mono" style={{ fontFamily: font.family }}>
                          {font.label}
                        </span>
                        {isSelected && <Check className={`w-3.5 h-3.5 ${isHovered ? "text-primary-content" : "text-primary"}`} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 6. Size Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown("size")}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer text-left ${
                  hoveredSize
                    ? "bg-primary/25 border border-primary/40 text-white"
                    : "bg-[#27272a]/50 hover:bg-[#27272a] text-white"
                }`}
              >
                <div>
                  <div className="text-[10.5px] text-white/50 font-normal flex items-center gap-1.5">
                    <span>Size</span>
                    {hoveredSize && <span className="text-[9px] text-primary bg-primary/20 px-1 rounded font-mono font-bold">Live</span>}
                  </div>
                  <div className="text-[13px] font-bold mt-0.5">{effectiveSize}</div>
                </div>
                <span className="text-white/40 text-xs font-mono font-bold">Tt</span>
              </button>

              {openDropdown === "size" && (
                <div
                  onMouseLeave={handleLeaveSize}
                  className="absolute left-0 bottom-full lg:bottom-auto lg:top-0 lg:left-full lg:ml-2 mb-1.5 lg:mb-0 w-44 rounded-xl bg-[#27272a] border border-[#3f3f46] shadow-2xl p-1.5 z-50 animate-in fade-in duration-150"
                >
                  <div className="px-2.5 py-1 text-[10px] text-white/40 font-mono uppercase tracking-wider flex items-center justify-between">
                    <span>Base Body Size</span>
                    {hoveredSize && <span className="text-primary font-bold">Preview</span>}
                  </div>
                  {SIZE_OPTIONS.map((opt) => {
                    const isSelected = size === opt;
                    const isHovered = hoveredSize === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onMouseEnter={() => handleHoverSize(opt)}
                        onClick={() => handleSelectSize(opt)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer my-0.5 ${
                          isHovered
                            ? "bg-primary text-primary-content font-bold shadow-sm scale-[1.02]"
                            : isSelected
                            ? "bg-white/20 text-white font-semibold"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <span className="text-xs font-mono">{opt}</span>
                        {isSelected && <Check className={`w-3.5 h-3.5 ${isHovered ? "text-primary-content" : "text-primary"}`} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 7. Leading Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown("leading")}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer text-left ${
                  hoveredLeading
                    ? "bg-primary/25 border border-primary/40 text-white"
                    : "bg-[#27272a]/50 hover:bg-[#27272a] text-white"
                }`}
              >
                <div>
                  <div className="text-[10.5px] text-white/50 font-normal flex items-center gap-1.5">
                    <span>Leading</span>
                    {hoveredLeading && <span className="text-[9px] text-primary bg-primary/20 px-1 rounded font-mono font-bold">Live</span>}
                  </div>
                  <div className="text-[13px] font-bold mt-0.5">{effectiveLeading.label}</div>
                </div>
                <span className="text-white/40 text-xs font-mono">A</span>
              </button>

              {openDropdown === "leading" && (
                <div
                  onMouseLeave={handleLeaveLeading}
                  className="absolute left-0 bottom-full lg:bottom-auto lg:top-0 lg:left-full lg:ml-2 mb-1.5 lg:mb-0 w-48 rounded-xl bg-[#27272a] border border-[#3f3f46] shadow-2xl p-1.5 z-50 animate-in fade-in duration-150"
                >
                  <div className="px-2.5 py-1 text-[10px] text-white/40 font-mono uppercase tracking-wider flex items-center justify-between">
                    <span>Line Height</span>
                    {hoveredLeading && <span className="text-primary font-bold">Preview</span>}
                  </div>
                  {LEADING_OPTIONS.map((opt) => {
                    const isSelected = leading.id === opt.id;
                    const isHovered = hoveredLeading?.id === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onMouseEnter={() => handleHoverLeading(opt)}
                        onClick={() => handleSelectLeading(opt)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer my-0.5 ${
                          isHovered
                            ? "bg-primary text-primary-content font-bold shadow-sm scale-[1.02]"
                            : isSelected
                            ? "bg-white/20 text-white font-semibold"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <span className="text-xs">{opt.label}</span>
                        {isSelected && <Check className={`w-3.5 h-3.5 ${isHovered ? "text-primary-content" : "text-primary"}`} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 8. Flow Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown("flow")}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer text-left ${
                  hoveredFlow
                    ? "bg-primary/25 border border-primary/40 text-white"
                    : "bg-[#27272a]/50 hover:bg-[#27272a] text-white"
                }`}
              >
                <div>
                  <div className="text-[10.5px] text-white/50 font-normal flex items-center gap-1.5">
                    <span>Flow</span>
                    {hoveredFlow && <span className="text-[9px] text-primary bg-primary/20 px-1 rounded font-mono font-bold">Live</span>}
                  </div>
                  <div className="text-[13px] font-bold mt-0.5">{effectiveFlow.label}</div>
                </div>
                <span className="text-white/40 text-xs font-mono">↕</span>
              </button>

              {openDropdown === "flow" && (
                <div
                  onMouseLeave={() => setHoveredFlow(null)}
                  className="absolute left-0 bottom-full lg:bottom-auto lg:top-0 lg:left-full lg:ml-2 mb-1.5 lg:mb-0 w-48 rounded-xl bg-[#27272a] border border-[#3f3f46] shadow-2xl p-1.5 z-50 animate-in fade-in duration-150"
                >
                  <div className="px-2.5 py-1 text-[10px] text-white/40 font-mono uppercase tracking-wider flex items-center justify-between">
                    <span>Block Spacing</span>
                    {hoveredFlow && <span className="text-primary font-bold">Preview</span>}
                  </div>
                  {FLOW_OPTIONS.map((opt) => {
                    const isSelected = flow.id === opt.id;
                    const isHovered = hoveredFlow?.id === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onMouseEnter={() => setHoveredFlow(opt)}
                        onClick={() => {
                          setFlow(opt);
                          setHoveredFlow(null);
                          setOpenDropdown(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer my-0.5 ${
                          isHovered
                            ? "bg-primary text-primary-content font-bold shadow-sm scale-[1.02]"
                            : isSelected
                            ? "bg-white/20 text-white font-semibold"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <span className="text-xs">{opt.label}</span>
                        {isSelected && <Check className={`w-3.5 h-3.5 ${isHovered ? "text-primary-content" : "text-primary"}`} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Shuffle Action Button */}
          <div className="mt-4 pt-3 border-t border-[#27272a]">
            <button
              type="button"
              onClick={handleShuffle}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-white font-semibold transition-all cursor-pointer shadow-xs active:scale-98"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Shuffle</span>
            </button>
          </div>
        </aside>

        {/* ========================================================
            RIGHT WORKSPACE (Live Typeset & Code Document Area)
           ======================================================== */}
        <main className="flex-1 flex flex-col justify-between bg-base-100 text-base-content min-w-0 rounded-b-3xl lg:rounded-bl-none lg:rounded-r-3xl overflow-hidden relative z-10">
          {/* Top Tabs Bar: Docs / Prompt / Code */}
          <div className="px-6 py-3.5 border-b border-base-300 flex items-center justify-between bg-base-200/40">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-base-200 border border-base-300">
              <button
                type="button"
                onClick={() => setActiveTab("docs")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "docs"
                    ? "bg-primary text-primary-content shadow-xs"
                    : "text-base-content/60 hover:text-base-content"
                }`}
              >
                Docs
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("prompt")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "prompt"
                    ? "bg-primary text-primary-content shadow-xs"
                    : "text-base-content/60 hover:text-base-content"
                }`}
              >
                Prompt
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("code")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "code"
                    ? "bg-primary text-primary-content shadow-xs"
                    : "text-base-content/60 hover:text-base-content"
                }`}
              >
                CSS Code
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-base-content/50 hidden sm:inline">
                {currentSample.tag}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-base-200 hover:bg-base-300 text-base-content border border-base-300 transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? "Copied CSS" : "Copy CSS"}</span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="p-6 sm:p-10 overflow-y-auto flex-1 max-h-[580px] scrollbar-thin">
            {/* VIEW 1: DOCS (Interactive Rendered Typeset) */}
            {activeTab === "docs" && (
              <div className="w-full flex justify-center">
                <div
                  className="typeset typeset-docs w-full transition-all duration-150"
                  style={{
                    "--typeset-font-body": effectiveBody.family,
                    "--typeset-font-heading": effectiveHeading.family,
                    "--typeset-font-mono": effectiveMono.family,
                    "--typeset-size": effectiveSize,
                    "--typeset-leading": effectiveLeading.value,
                    "--typeset-flow": effectiveFlow.value,
                    maxWidth: effectiveMeasure,
                    fontFamily: effectiveBody.family,
                    fontSize: effectiveSize,
                    lineHeight: effectiveLeading.value,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-primary/80 uppercase tracking-wider font-mono">
                      {currentSample.tag}
                    </p>
                    {(hoveredHeading || hoveredBody || hoveredMono || hoveredMeasure || hoveredSize || hoveredLeading || hoveredFlow) && (
                      <span className="text-[11px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                        Live Preview Active
                      </span>
                    )}
                  </div>

                  <h1
                    className="text-2xl sm:text-3xl font-bold tracking-tight transition-all duration-150"
                    style={{ fontFamily: effectiveHeading.family }}
                  >
                    {currentSample.title}
                  </h1>

                  <p
                    className="text-base-content/80 text-base leading-relaxed transition-all duration-150"
                    style={{ fontFamily: effectiveBody.family, lineHeight: effectiveLeading.value }}
                  >
                    {currentSample.lead}
                  </p>

                  {/* Rendered Steps */}
                  <ol style={{ fontFamily: effectiveBody.family }}>
                    {currentSample.steps.map((st) => (
                      <li key={st.num} className="space-y-1.5" style={{ marginBottom: effectiveFlow.value }}>
                        <strong
                          className="block text-base text-base-content font-bold transition-all duration-150"
                          style={{ fontFamily: effectiveHeading.family }}
                        >
                          {st.title}
                        </strong>
                        <p
                          className="text-base-content/75 transition-all duration-150"
                          style={{ fontFamily: effectiveBody.family, lineHeight: effectiveLeading.value }}
                        >
                          {st.text}
                        </p>
                        <pre style={{ fontFamily: effectiveMono.family }}>
                          <code style={{ fontFamily: effectiveMono.family }}>{st.code}</code>
                        </pre>
                      </li>
                    ))}
                  </ol>

                  {/* Sample Quote */}
                  <blockquote
                    style={{
                      fontFamily: effectiveBody.family,
                      lineHeight: effectiveLeading.value,
                      marginBlock: effectiveFlow.value,
                    }}
                  >
                    "Typeset makes rendered markdown and HTML effortless with container-aware rhythm.
                    No more writing custom prose CSS overrides for every page."
                  </blockquote>

                  {/* Sample Table */}
                  <table style={{ fontFamily: effectiveBody.family }}>
                    <thead>
                      <tr>
                        <th style={{ fontFamily: effectiveHeading.family }}>Setting</th>
                        <th style={{ fontFamily: effectiveHeading.family }}>Preview / Active Value</th>
                        <th style={{ fontFamily: effectiveHeading.family }}>CSS Rhythm Token</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className={hoveredHeading ? "bg-primary/10 font-bold" : ""}>
                        <td>Heading Font</td>
                        <td style={{ fontFamily: effectiveHeading.family }}>{effectiveHeading.label}</td>
                        <td><code>--typeset-font-heading</code></td>
                      </tr>
                      <tr className={hoveredBody ? "bg-primary/10 font-bold" : ""}>
                        <td>Body Font</td>
                        <td style={{ fontFamily: effectiveBody.family }}>{effectiveBody.label}</td>
                        <td><code>--typeset-font-body</code></td>
                      </tr>
                      <tr className={hoveredMono ? "bg-primary/10 font-bold" : ""}>
                        <td>Monospace</td>
                        <td style={{ fontFamily: effectiveMono.family }}>{effectiveMono.label}</td>
                        <td><code>--typeset-font-mono</code></td>
                      </tr>
                      <tr className={hoveredSize ? "bg-primary/10 font-bold" : ""}>
                        <td>Base Size</td>
                        <td>{effectiveSize}</td>
                        <td><code>--typeset-size</code></td>
                      </tr>
                      <tr className={hoveredLeading ? "bg-primary/10 font-bold" : ""}>
                        <td>Line Height</td>
                        <td>{effectiveLeading.label}</td>
                        <td><code>--typeset-leading</code></td>
                      </tr>
                      <tr className={hoveredFlow ? "bg-primary/10 font-bold" : ""}>
                        <td>Block Spacing Flow</td>
                        <td>{effectiveFlow.label}</td>
                        <td><code>--typeset-flow</code></td>
                      </tr>
                      <tr className={hoveredMeasure ? "bg-primary/10 font-bold" : ""}>
                        <td>Max Column Width</td>
                        <td>{effectiveMeasure}</td>
                        <td><code>max-width</code></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW 2: PROMPT (Markdown view) */}
            {activeTab === "prompt" && (
              <div className="w-full flex justify-center">
                <div
                  className="w-full font-mono text-xs sm:text-sm bg-base-200/60 p-6 rounded-2xl border border-base-300 text-base-content/85 whitespace-pre-wrap leading-relaxed transition-all duration-150"
                  style={{ maxWidth: effectiveMeasure, fontFamily: effectiveMono.family }}
                >
                  {`# ${currentSample.title}\n\n${currentSample.lead}\n\n${currentSample.steps
                    .map((s, idx) => `${idx + 1}. **${s.title}**\n   ${s.text}\n\n   \`\`\`\n   ${s.code}\n   \`\`\``)
                    .join("\n\n")}`}
                </div>
              </div>
            )}

            {/* VIEW 3: CODE (Generated typeset.css implementation) */}
            {activeTab === "code" && (
              <div className="w-full flex justify-center">
                <div className="w-full space-y-4 transition-all duration-150" style={{ maxWidth: effectiveMeasure }}>
                  <div className="p-5 rounded-2xl bg-[#0f172a] text-slate-100 border border-slate-800 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto shadow-lg">
                    <div className="text-slate-400 mb-2">/* 1. In your globals.css or index.css */</div>
                    <div className="text-sky-300">@import "tailwindcss";</div>
                    <div className="text-sky-300">@import "./typeset.css";</div>
                    <div className="text-sky-300">@import "@fontsource-variable/geist";</div>
                    <div className="text-sky-300 mb-3">@import "@fontsource-variable/geist-mono";</div>

                    <div className="text-slate-400 mb-1">:root &#123;</div>
                    <div className="pl-4 text-emerald-300">--font-geist: 'Geist Variable', sans-serif;</div>
                    <div className="pl-4 text-emerald-300">--font-geist-mono: 'Geist Mono Variable', monospace;</div>
                    <div className="text-slate-400 mb-3">&#125;</div>

                    <div className="text-slate-400 mb-1">/* 2. Custom Typeset Container Definition */</div>
                    <div className="text-amber-300">.typeset-docs &#123;</div>
                    <div className="pl-4 text-purple-300">--typeset-font-body: {effectiveBody.family};</div>
                    <div className="pl-4 text-purple-300">--typeset-font-heading: {effectiveHeading.family};</div>
                    <div className="pl-4 text-purple-300">--typeset-font-mono: {effectiveMono.family};</div>
                    <div className="pl-4 text-purple-300">--typeset-size: {effectiveSize};</div>
                    <div className="pl-4 text-purple-300">--typeset-leading: {effectiveLeading.value};</div>
                    <div className="pl-4 text-purple-300">--typeset-flow: {effectiveFlow.value};</div>
                    <div className="text-amber-300 mb-3">&#125;</div>

                    <div className="text-slate-400 mb-1">/* 3. Wrap your rendered content in JSX */</div>
                    <div className="text-blue-300">&lt;div className="typeset typeset-docs max-w-[{effectiveMeasure}]"&gt;</div>
                    <div className="pl-4 text-slate-300">&#123;content&#125;</div>
                    <div className="text-blue-300">&lt;/div&gt;</div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-base-200 border border-base-300 text-xs">
                    <span className="text-base-content/70">
                      Already imported in <code className="font-mono text-primary font-bold">src/index.css</code> and ready to use anywhere!
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="px-3 py-1.5 rounded-lg bg-primary text-primary-content font-bold shadow-xs cursor-pointer"
                    >
                      {copiedCode ? "Copied!" : "Copy Snippet"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================
              BOTTOM FLOATING PREVIEW PAGINATOR (01 02 03 04 05)
             ======================================================== */}
          <div className="p-4 border-t border-base-300 flex items-center justify-center bg-base-200/30">
            <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-[#18181b] text-white shadow-lg border border-[#27272a]">
              {CONTENT_SAMPLES.map((sample, idx) => {
                const isActive = currentSampleIndex === idx;
                return (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => setCurrentSampleIndex(idx)}
                    title={sample.tag}
                    className={`w-8 h-8 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center ${
                      isActive
                        ? "bg-white text-black shadow-sm scale-105"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {sample.id}
                  </button>
                );
              })}

              <div className="w-px h-4 bg-white/20 mx-1" />

              <button
                type="button"
                onClick={handleApplyToApp}
                className="px-3 py-1 text-xs font-semibold text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                Apply to App
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
