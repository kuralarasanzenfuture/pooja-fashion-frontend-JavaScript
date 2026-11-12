/**
 * Brand Master Helper Utilities
 * Provides formatting, logo URL resolution, monogram generation,
 * and bespoke human-crafted fashion brand styling for Pooja Fashion.
 */

export const KNOWN_UPPERCASE_BRANDS = [
  "BIBA",
  "W",
  "RAYMOND",
  "FABINDIA",
  "ZARA",
  "H&M",
  "MANGO",
  "AND",
  "GLOBAL DESI",
  "SOCH",
  "AURELIA",
  "MOHEY",
  "MANYAVAR",
  "NALLI",
  "KALAMANDIR",
  "MEENA BAZAAR",
  "SABYASACHI",
  "RAW MANGO",
  "RITU KUMAR",
  "ANITA DONGRE",
  "TARUN TAHILIANI",
  "KALANIKETHAN",
  "USPA",
];

/**
 * Curated authentic brand presets for recognized retail & fashion brands.
 * Designed with authentic heritage palettes, refined contrast, and bespoke monogram tokens.
 * Eliminates artificial/generic AI gradients in favor of high-end human craft.
 */
export const BRAND_PRESETS = {
  // 1. Peter England — Heritage Savile Row English Navy & Crest Gold
  PETER: {
    name: "Peter England",
    initials: "PE",
    background: "linear-gradient(145deg, #0d2847 0%, #07192d 100%)",
    text: "#f0f4f8",
    border: "#1e3a5f",
    accent: "#d4af37",
    tagline: "British Heritage Tailoring",
  },

  // 2. Allen Solly — British Countryside Spruce & Sage "Friday Dressing"
  ALLEN: {
    name: "Allen Solly",
    initials: "AS",
    background: "linear-gradient(145deg, #094025 0%, #052615 100%)",
    text: "#edf7f0",
    border: "#145934",
    accent: "#84cc16",
    tagline: "Friday Dressing",
  },

  // 3. Louis Philippe — The Upper Crest Royal Bordeaux & Champagne Gold
  LOUIS: {
    name: "Louis Philippe",
    initials: "LP",
    background: "linear-gradient(145deg, #4f0e1a 0%, #30060f 100%)",
    text: "#fde68a",
    border: "#781c2c",
    accent: "#fbbf24",
    tagline: "The Upper Crest",
  },

  // 4. Van Heusen — Manhattan Executive Midnight Slate & Platinum
  VANH: {
    name: "Van Heusen",
    initials: "VH",
    background: "linear-gradient(145deg, #1b2636 0%, #0f1620 100%)",
    text: "#f1f5f9",
    border: "#2c3e56",
    accent: "#94a3b8",
    tagline: "Corporate Executive",
  },

  // 5. Levi's — Raw Indigo Denim & Signature Crimson Tab
  LEVIS: {
    name: "Levi's",
    initials: "LV",
    background: "linear-gradient(145deg, #182848 0%, #0c1626 100%)",
    text: "#ffffff",
    border: "#2b3f66",
    accent: "#ef4444",
    tagline: "Original Denim",
  },

  // 6. Wrangler — Western Saddle Leather Tobacco & Warm Amber
  WRANGLER: {
    name: "Wrangler",
    initials: "WR",
    background: "linear-gradient(145deg, #4d2814 0%, #2b1407 100%)",
    text: "#fef3c7",
    border: "#6f3a1d",
    accent: "#f59e0b",
    tagline: "Western Denim",
  },

  // 7. U.S. Polo Assn. — Collegiate Heritage Navy & Varsity Crimson
  USPA: {
    name: "U.S. Polo Assn.",
    initials: "US",
    background: "linear-gradient(145deg, #0a1b38 0%, #040d1c 100%)",
    text: "#ffffff",
    border: "#1c3866",
    accent: "#dc2626",
    tagline: "Authentic Polo Heritage",
  },

  // 8. Zara — Haute Couture Minimalist Obsidian Noir
  ZARA: {
    name: "Zara",
    initials: "ZR",
    background: "linear-gradient(145deg, #161618 0%, #09090a 100%)",
    text: "#fafafa",
    border: "#2e2e33",
    accent: "#ffffff",
    tagline: "Haute Fast-Fashion",
  },

  // 9. H&M — Scandinavian Minimalist Charcoal & Nordic Crimson
  HNM: {
    name: "H&M",
    initials: "HM",
    background: "linear-gradient(145deg, #242426 0%, #121213 100%)",
    text: "#ffffff",
    border: "#3a3a3e",
    accent: "#e50010",
    tagline: "Modern Everyday Fashion",
  },

  // 10. Biba — Royal Indian Ethnic Deep Mulberry & Gulabi Rose
  BIBA: {
    name: "Biba",
    initials: "BB",
    background: "linear-gradient(145deg, #4a153d 0%, #2b0821 100%)",
    text: "#fce7f3",
    border: "#6b2259",
    accent: "#ec4899",
    tagline: "Indian Ethnic Wear",
  },

  // 11. W — Contemporary Fusion Deep Peacock Teal & Brushed Copper
  W: {
    name: "W",
    initials: "W",
    background: "linear-gradient(145deg, #0c3e47 0%, #052227 100%)",
    text: "#fed7aa",
    border: "#165c69",
    accent: "#f97316",
    tagline: "Fusion Ethnic",
  },

  // 12. Aurelia — Everyday Ethnic Terracotta Rust & Soft Saffron
  AURELIA: {
    name: "Aurelia",
    initials: "AU",
    background: "linear-gradient(145deg, #581d18 0%, #350e0a 100%)",
    text: "#fef3c7",
    border: "#7a2b24",
    accent: "#fb923c",
    tagline: "Daily Ethnic",
  },

  // 13. Libas — Contemporary Designer Merlot Wine & Pale Champagne
  LIBAS: {
    name: "Libas",
    initials: "LB",
    background: "linear-gradient(145deg, #4c1724 0%, #290810 100%)",
    text: "#fed7aa",
    border: "#6e2335",
    accent: "#f43f5e",
    tagline: "Designer Ethnic",
  },

  // 14. Manyavar — Royal Sherwani Velvet Crimson & Imperial Wedding Gold
  MANYAVAR: {
    name: "Manyavar",
    initials: "MV",
    background: "linear-gradient(145deg, #590a18 0%, #33020b 100%)",
    text: "#fef08a",
    border: "#801224",
    accent: "#eab308",
    tagline: "Celebration Wear",
  },

  // 15. Mohey — Royal Bridal Rose & Golden Zari
  MOHEY: {
    name: "Mohey",
    initials: "MH",
    background: "linear-gradient(145deg, #5e112d 0%, #340416 100%)",
    text: "#fde68a",
    border: "#851c43",
    accent: "#f472b6",
    tagline: "Bridal Wear",
  },

  // 16. Max Fashion — Family Retail Deep Indigo & Coral
  MAX: {
    name: "Max Fashion",
    initials: "MX",
    background: "linear-gradient(145deg, #1c2a66 0%, #0e153b 100%)",
    text: "#ffffff",
    border: "#2d3e8a",
    accent: "#f87171",
    tagline: "Family Fashion",
  },

  // 17. FirstCry — Kids Cerulean Blue & Warm Sunshine
  FIRSTCRY: {
    name: "FirstCry",
    initials: "FC",
    background: "linear-gradient(145deg, #1d4ed8 0%, #113498 100%)",
    text: "#ffffff",
    border: "#3b82f6",
    accent: "#fbbf24",
    tagline: "Kids & Baby",
  },

  // 18. Nike — Pitch Athletic Black & Pure White
  NIKE: {
    name: "Nike",
    initials: "NK",
    background: "linear-gradient(145deg, #09090b 0%, #000000 100%)",
    text: "#fafafa",
    border: "#27272a",
    accent: "#ffffff",
    tagline: "Performance Sportswear",
  },

  // 19. Adidas — Three-Stripes Core Black & Cloud White
  ADIDAS: {
    name: "Adidas",
    initials: "AD",
    background: "linear-gradient(145deg, #121214 0%, #050506 100%)",
    text: "#f8fafc",
    border: "#2a2a2e",
    accent: "#ffffff",
    tagline: "Originals",
  },

  // 20. Puma — Motorsport Carbon Black & Puma Red
  PUMA: {
    name: "Puma",
    initials: "PM",
    background: "linear-gradient(145deg, #1c1c1f 0%, #0e0e10 100%)",
    text: "#fca5a5",
    border: "#382326",
    accent: "#ef4444",
    tagline: "Sportstyle",
  },

  // 21. Campus — Urban Athletic Navy & Vibrant Tangerine
  CAMPUS: {
    name: "Campus",
    initials: "CP",
    background: "linear-gradient(145deg, #172554 0%, #0c1533 100%)",
    text: "#fdba74",
    border: "#1e3a8a",
    accent: "#f97316",
    tagline: "Athletic Footwear",
  },

  // 22. Bata — Heritage Shoemaker Red & Canvas White
  BATA: {
    name: "Bata",
    initials: "BT",
    background: "linear-gradient(145deg, #991b1b 0%, #630c0c 100%)",
    text: "#ffffff",
    border: "#b91c1c",
    accent: "#ffffff",
    tagline: "Heritage Footwear",
  },

  // 23. Relaxo — Oceanic Blue & Warm Amber
  RELAXO: {
    name: "Relaxo",
    initials: "RX",
    background: "linear-gradient(145deg, #0369a1 0%, #054063 100%)",
    text: "#ffffff",
    border: "#0284c7",
    accent: "#fde047",
    tagline: "Comfort Footwear",
  },

  // 24. Local Brand — Tailored Charcoal Wool & Raw Linen
  LOCAL001: {
    name: "Local Brand",
    initials: "LB",
    background: "linear-gradient(145deg, #27272a 0%, #161618 100%)",
    text: "#f4f4f5",
    border: "#3f3f46",
    accent: "#a1a1aa",
    tagline: "Boutique Label",
  },

  // 25. No Brand — Minimalist Slate & Cool Gray
  "NO-BRAND": {
    name: "No Brand",
    initials: "NB",
    background: "linear-gradient(145deg, #334155 0%, #1d2736 100%)",
    text: "#e2e8f0",
    border: "#475569",
    accent: "#94a3b8",
    tagline: "Unbranded",
  },
};

/**
 * Curated human editorial palettes for custom or unlisted brands.
 * Sophisticated, balanced, desaturated tones inspired by luxury fashion ateliers.
 */
export const CURATED_EDITORIAL_PALETTES = [
  // 1. Sartorial Navy
  {
    background: "linear-gradient(145deg, #0f243d 0%, #081729 100%)",
    text: "#f0f6fc",
    border: "#1c3d63",
    accent: "#38bdf8",
  },
  // 2. Savile Spruce
  {
    background: "linear-gradient(145deg, #0b3820 0%, #062414 100%)",
    text: "#ecfdf5",
    border: "#155734",
    accent: "#4ade80",
  },
  // 3. Royal Bordeaux
  {
    background: "linear-gradient(145deg, #4c111e 0%, #2f0710 100%)",
    text: "#fce7f3",
    border: "#731b2f",
    accent: "#fb7185",
  },
  // 4. Roasted Espresso
  {
    background: "linear-gradient(145deg, #381f14 0%, #21110a 100%)",
    text: "#fef3c7",
    border: "#5c3322",
    accent: "#f59e0b",
  },
  // 5. Midnight Indigo
  {
    background: "linear-gradient(145deg, #1a2247 0%, #0f1530 100%)",
    text: "#e0e7ff",
    border: "#2d3a73",
    accent: "#818cf8",
  },
  // 6. Tuscan Terracotta
  {
    background: "linear-gradient(145deg, #4d2315 0%, #2e1209 100%)",
    text: "#ffedd5",
    border: "#733621",
    accent: "#fb923c",
  },
  // 7. Jewel Mulberry
  {
    background: "linear-gradient(145deg, #3d1436 0%, #240920 100%)",
    text: "#f5d0fe",
    border: "#612257",
    accent: "#c084fc",
  },
  // 8. Alpine Moss
  {
    background: "linear-gradient(145deg, #1b3626 0%, #0e2117 100%)",
    text: "#d1fae5",
    border: "#2d543d",
    accent: "#34d399",
  },
  // 9. Haute Graphite
  {
    background: "linear-gradient(145deg, #21262d 0%, #121519 100%)",
    text: "#f0f6fc",
    border: "#363f4a",
    accent: "#9ca3af",
  },
  // 10. Deep Cerulean
  {
    background: "linear-gradient(145deg, #0e354f 0%, #072133 100%)",
    text: "#bae6fd",
    border: "#18537b",
    accent: "#38bdf8",
  },
  // 11. Rich Cognac
  {
    background: "linear-gradient(145deg, #3d2310 0%, #241308 100%)",
    text: "#fed7aa",
    border: "#5f381b",
    accent: "#fbbf24",
  },
  // 12. Obsidian Noir
  {
    background: "linear-gradient(145deg, #141416 0%, #070708 100%)",
    text: "#f4f4f5",
    border: "#27272a",
    accent: "#e4e4e7",
  },
];

/**
 * Normalizes brand name for presentation.
 * Respects Title Case and established brand acronyms.
 */
export function formatBrandName(name = "") {
  if (!name || typeof name !== "string") return name || "";
  const trimmed = name.trim();
  if (!trimmed || trimmed === "—") return trimmed;

  const upper = trimmed.toUpperCase();
  if (KNOWN_UPPERCASE_BRANDS.includes(upper)) {
    if (upper === "W" || upper === "BIBA" || upper === "H&M" || upper === "AND" || upper === "USPA") {
      return upper;
    }
  }

  return trimmed
    .split(/(\s+|[-/&])/g)
    .map((token) => {
      if (!token || /^\s+$/.test(token) || /^[-/&]$/.test(token)) {
        return token;
      }
      const upperAcronyms = ["ERP", "POS", "ID", "GST", "SMS", "SKU", "HSN", "VIP", "USA", "UK", "H&M", "USPA"];
      if (upperAcronyms.includes(token.toUpperCase())) {
        return token.toUpperCase();
      }
      return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
    })
    .join("");
}

/**
 * Generates an uppercase valid brand code from brand name.
 * e.g. "Manyavar & Mohey" -> "MANYAVAR_MOHEY"
 */
export function generateBrandCodeFromName(name = "") {
  if (!name || typeof name !== "string") return "";
  return name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 50);
}

/**
 * Extracts 1 or 2 uppercase initials for brand avatar badges.
 */
export function getBrandInitials(name = "") {
  if (!name || typeof name !== "string") return "B";
  const cleaned = name.trim().replace(/[^a-zA-Z0-9\s]/g, "");
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "B";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/**
 * Resolves canonical brand preset key from brand name or code.
 */
export function getBrandPresetKey(name = "", code = "") {
  const normCode = String(code || "").trim().toUpperCase();
  const normName = String(name || "").trim().toUpperCase();

  // 1. Direct code lookup
  if (normCode && BRAND_PRESETS[normCode]) {
    return normCode;
  }

  // 2. Name-based match rules
  if (normName.includes("PETER ENGLAND") || normCode === "PETER") return "PETER";
  if (normName.includes("ALLEN SOLLY") || normCode === "ALLEN") return "ALLEN";
  if (normName.includes("LOUIS PHILIPPE") || normCode === "LOUIS") return "LOUIS";
  if (normName.includes("VAN HEUSEN") || normCode === "VANH") return "VANH";
  if (normName.includes("LEVI") || normCode === "LEVIS") return "LEVIS";
  if (normName.includes("WRANGLER") || normCode === "WRANGLER") return "WRANGLER";
  if (normName.includes("POLO ASSN") || normName.includes("USPA") || normCode === "USPA") return "USPA";
  if (normName === "ZARA" || normCode === "ZARA") return "ZARA";
  if (normName.includes("H&M") || normName.includes("H & M") || normCode === "HNM") return "HNM";
  if (normName.includes("BIBA") || normCode === "BIBA") return "BIBA";
  if (normName === "W" || normCode === "W") return "W";
  if (normName.includes("AURELIA") || normCode === "AURELIA") return "AURELIA";
  if (normName.includes("LIBAS") || normCode === "LIBAS") return "LIBAS";
  if (normName.includes("MANYAVAR") || normCode === "MANYAVAR") return "MANYAVAR";
  if (normName.includes("MOHEY") || normCode === "MOHEY") return "MOHEY";
  if (normName.includes("MAX FASHION") || normName === "MAX" || normCode === "MAX") return "MAX";
  if (normName.includes("FIRSTCRY") || normCode === "FIRSTCRY") return "FIRSTCRY";
  if (normName.includes("NIKE") || normCode === "NIKE") return "NIKE";
  if (normName.includes("ADIDAS") || normCode === "ADIDAS") return "ADIDAS";
  if (normName.includes("PUMA") || normCode === "PUMA") return "PUMA";
  if (normName.includes("CAMPUS") || normCode === "CAMPUS") return "CAMPUS";
  if (normName.includes("BATA") || normCode === "BATA") return "BATA";
  if (normName.includes("RELAXO") || normCode === "RELAXO") return "RELAXO";
  if (normName.includes("LOCAL") || normCode.includes("LOCAL")) return "LOCAL001";
  if (normName.includes("NO BRAND") || normName.includes("UNBRANDED") || normCode === "NO-BRAND") return "NO-BRAND";

  return null;
}

/**
 * Returns a bespoke human-crafted brand styling object.
 * Returns { background, text, border, accent, initials, isPreset, tagline }
 */
export function getBrandStyle(name = "", code = "") {
  const presetKey = getBrandPresetKey(name, code);
  if (presetKey && BRAND_PRESETS[presetKey]) {
    const preset = BRAND_PRESETS[presetKey];
    return {
      ...preset,
      isPreset: true,
    };
  }

  // Fallback: Deterministic selection from Curated Editorial Palettes
  const seedStr = String(code || name || "Brand").toUpperCase();
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % CURATED_EDITORIAL_PALETTES.length;
  const palette = CURATED_EDITORIAL_PALETTES[index];

  return {
    ...palette,
    initials: getBrandInitials(name || code),
    isPreset: false,
    tagline: null,
  };
}

/**
 * Backwards-compatibility helper for legacy callers expecting gradient string.
 */
export function getBrandGradient(name = "") {
  const style = getBrandStyle(name);
  return style.background;
}

/**
 * Normalizes relative URLs (/uploads/brands/...) and handles backend paths.
 */
export function normalizeBrandLogoUrl(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  return `/${trimmed}`;
}

export default {
  formatBrandName,
  generateBrandCodeFromName,
  getBrandInitials,
  getBrandPresetKey,
  getBrandStyle,
  getBrandGradient,
  normalizeBrandLogoUrl,
  BRAND_PRESETS,
  CURATED_EDITORIAL_PALETTES,
};
