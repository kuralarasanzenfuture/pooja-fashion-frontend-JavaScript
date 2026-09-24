import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFontFamily } from "../../../../redux/ui/uiSlice.js";
import {
  Type,
  Check,
  Sparkles,
  Crown,
  Laptop,
  Layers,
  Tag,
  Receipt,
  RotateCcw,
} from "lucide-react";

const FONT_PRESETS = [
  {
    id: "outfit",
    name: "Modern Luxe (Outfit)",
    styleLabel: "Modern Boutique & High Fashion",
    headingFont: "Outfit, sans-serif",
    bodyFont: "Plus Jakarta Sans, sans-serif",
    icon: Sparkles,
    badge: "Recommended",
    badgeColor: "bg-sky-100 text-[#1e3a8a] border-sky-200",
    description: "Sleek geometric typography with warm boutique curves. Ideal for ready-to-wear dress racks, gowns, and contemporary billing.",
    sampleHeading: "Exclusive Bridal Gowns & Silk Sarees",
    sampleBody: "Designed for premium boutique stores with high-impact headings and comfortable receipt readability.",
  },
  {
    id: "luxury",
    name: "Royal Boutique (Playfair Display)",
    styleLabel: "Heritage Silk & Banarasi Sarees",
    headingFont: "Playfair Display, Georgia, serif",
    bodyFont: "Plus Jakarta Sans, sans-serif",
    icon: Crown,
    badge: "Traditional Luxury",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-200",
    description: "Classic high-contrast serif display font reminiscent of royal Indian textiles, zari weaving, and wedding couture studios.",
    sampleHeading: "Handwoven Kanjivaram & Zari Lehengas",
    sampleBody: "Elevates the showroom atmosphere with aristocratic serif titles while preserving rapid numeric POS calculations.",
  },
  {
    id: "jakarta",
    name: "Tech Modern (Plus Jakarta)",
    styleLabel: "Fast POS & Inventory Focus",
    headingFont: "Plus Jakarta Sans, sans-serif",
    bodyFont: "Plus Jakarta Sans, sans-serif",
    icon: Laptop,
    badge: "Ultra Crisp",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-200",
    description: "Modern grotesque sans designed for dense UI screens, high-speed barcode scanning, metre fabric measurements, and ledger entries.",
    sampleHeading: "Fast Metre Cutting & POS Invoicing",
    sampleBody: "Optimized for fast-paced retail checkout counters where high legibility on standard monitors is priority #1.",
  },
  {
    id: "inter",
    name: "Enterprise Clean (Inter)",
    styleLabel: "Textile ERP & Accounting",
    headingFont: "Inter, sans-serif",
    bodyFont: "Inter, sans-serif",
    icon: Layers,
    badge: "Neutral & Clean",
    badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
    description: "Globally acclaimed UI typeface. Maximum neutral clarity for inventory stock balancing, GST tax reports, and purchase reconciliation.",
    sampleHeading: "GST Tax Invoices & Stock Reports",
    sampleBody: "Pure neutral clarity across every number, invoice table line, and fabric inventory ledger row.",
  },
];

export default function FontSettings() {
  const dispatch = useDispatch();
  const activeFontId = useSelector((state) => state.ui?.fontFamily) || "outfit";
  const [customPreviewText, setCustomPreviewText] = useState("Pooja Fashion & Boutique Studio");

  const handleSelectFont = (fontId) => {
    dispatch(setFontFamily(fontId));
  };

  const handleResetDefault = () => {
    dispatch(setFontFamily("outfit"));
  };

  const currentPreset = FONT_PRESETS.find((p) => p.id === activeFontId) || FONT_PRESETS[0];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#f0f4fc] text-[#1e3a8a] flex items-center justify-center border border-[#c7d2fe]">
              <Type className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Boutique Typography & Fonts
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Switch the application typographic personality in real-time. Changes immediately apply to your POS dashboard, printed invoices, dress labels, and inventory tables.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDefault}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition-colors self-start cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Modern Luxe</span>
        </button>
      </div>

      {/* Font Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FONT_PRESETS.map((preset) => {
          const isSelected = activeFontId === preset.id;
          const Icon = preset.icon;

          return (
            <div
              key={preset.id}
              onClick={() => handleSelectFont(preset.id)}
              className={`relative rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "border-[#1e3a8a] bg-gradient-to-br from-[#f8faff] to-[#eef4ff] shadow-md shadow-[#1e3a8a]/10 ring-2 ring-[#1e3a8a]/20"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-[#0f1c3f] text-white shadow-xs"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {preset.name}
                      </h4>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {preset.styleLabel}
                      </span>
                    </div>
                  </div>

                  {isSelected ? (
                    <span className="w-6 h-6 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="w-6 h-6 rounded-full border-2 border-slate-200 shrink-0" />
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {preset.description}
                </p>

                {/* Typography Mini Specimen */}
                <div className="bg-white/80 rounded-xl p-3.5 border border-slate-200/80 mb-3 shadow-2xs">
                  <div
                    className="text-base font-bold text-slate-900 tracking-tight leading-snug mb-1"
                    style={{ fontFamily: preset.headingFont }}
                  >
                    {preset.sampleHeading}
                  </div>
                  <div
                    className="text-xs text-slate-500 leading-normal"
                    style={{ fontFamily: preset.bodyFont }}
                  >
                    {preset.sampleBody}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 text-[11px]">
                <span
                  className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] border ${preset.badgeColor}`}
                >
                  {preset.badge}
                </span>

                <span className="text-xs font-semibold text-[#1e3a8a] hover:underline">
                  {isSelected ? "Active Typography" : "Click to Apply"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Realtime Live Simulator Box */}
      <div className="bg-gradient-to-br from-slate-900 to-[#0f1c3f] text-white rounded-2xl p-5 shadow-lg border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <h4 className="text-sm font-bold tracking-wide">
              Live Boutique POS Specimen in "{currentPreset.name}"
            </h4>
          </div>
          <span className="text-[11px] text-sky-300 font-mono bg-white/10 px-2 py-0.5 rounded-full">
            Active System Font: {activeFontId}
          </span>
        </div>

        {/* Live Simulator Preview Elements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Dress Price Tag Mockup */}
          <div className="bg-white text-slate-900 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                <Tag className="w-3 h-3 text-amber-700" /> Designer Boutique Tag
              </span>
              <span className="font-mono text-[10px] text-slate-400">#TAG-2026-08</span>
            </div>

            <p className="text-xs text-slate-400 font-medium">Boutique Collection</p>
            <h5 className="text-base font-extrabold text-[#0f1c3f] font-display mt-0.5">
              Royal Navy Bridal Silk Saree
            </h5>
            <p className="text-xs text-slate-500 mt-1">
              Pure Mulberry Silk with Gold Zari Border • 1 Pc Ready
            </p>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-bold block">
                  MRP Price
                </span>
                <span className="font-mono text-base font-black text-[#0f1c3f]">
                  ₹18,500.00
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                GST 5% Included
              </span>
            </div>
          </div>

          {/* Quick Invoice Strip Mockup */}
          <div className="bg-white text-slate-900 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-[#1e3a8a] bg-[#e0e7ff] px-2 py-0.5 rounded-full">
                <Receipt className="w-3 h-3" /> POS Counter Slip
              </span>
              <span className="font-mono text-xs font-bold text-slate-700">#INV-9810</span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-700 py-1 font-medium">
              <div className="flex justify-between">
                <span>Royal Navy Saree (1 Pc)</span>
                <span className="font-mono font-bold">₹18,500</span>
              </div>
              <div className="flex justify-between">
                <span>Designer Anarkali Gown (1 Pc)</span>
                <span className="font-mono font-bold">₹12,400</span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-dashed border-slate-200 flex justify-between items-center">
              <span className="text-xs font-bold uppercase text-slate-900 font-display">
                Total Bill Paid
              </span>
              <span className="font-mono text-base font-black text-[#0f1c3f]">
                ₹32,445.00
              </span>
            </div>
          </div>
        </div>

        {/* Custom Text Tester */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <label
            htmlFor="custom-preview-input"
            className="block text-[11px] font-semibold text-slate-300 mb-1.5"
          >
            Type custom boutique phrase to test font live:
          </label>
          <input
            id="custom-preview-input"
            type="text"
            value={customPreviewText}
            onChange={(e) => setCustomPreviewText(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 font-display"
            placeholder="Type anything to test typography..."
          />
        </div>
      </div>
    </div>
  );
}
