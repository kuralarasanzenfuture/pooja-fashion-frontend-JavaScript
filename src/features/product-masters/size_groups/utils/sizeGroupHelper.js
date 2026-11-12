/**
 * Size Group Master Helper Utilities
 * Provides formatting, monogram generation, and human-designed luxury tokens.
 */

const KNOWN_UPPERCASE_TOKENS = ["XL", "XXL", "XXXL", "XS", "S", "M", "L", "UK", "US", "EU", "CM", "IN", "POS", "ERP", "ID"];

export const SIZE_GROUP_PRESETS = {
  MEN: {
    name: "Men's Clothing",
    initials: "MN",
    background: "linear-gradient(145deg, #0d2847 0%, #07192d 100%)",
    text: "#f0f4f8",
    border: "#1e3a5f",
    accent: "#38bdf8",
  },
  WOMEN: {
    name: "Women's Clothing",
    initials: "WN",
    background: "linear-gradient(145deg, #4f0e1a 0%, #30060f 100%)",
    text: "#fde68a",
    border: "#781c2c",
    accent: "#fb7185",
  },
  KIDS: {
    name: "Kids Clothing",
    initials: "KD",
    background: "linear-gradient(145deg, #1d4ed8 0%, #113498 100%)",
    text: "#ffffff",
    border: "#3b82f6",
    accent: "#fbbf24",
  },
  FOOTWEAR: {
    name: "Footwear",
    initials: "FW",
    background: "linear-gradient(145deg, #4d2814 0%, #2b1407 100%)",
    text: "#fef3c7",
    border: "#6f3a1d",
    accent: "#f59e0b",
  },
  FREE: {
    name: "Free Size",
    initials: "FS",
    background: "linear-gradient(145deg, #27272a 0%, #161618 100%)",
    text: "#f4f4f5",
    border: "#3f3f46",
    accent: "#a1a1aa",
  },
  SAREE: {
    name: "Saree",
    initials: "SR",
    background: "linear-gradient(145deg, #590a18 0%, #33020b 100%)",
    text: "#fef08a",
    border: "#801224",
    accent: "#eab308",
  },
  INNERWEAR: {
    name: "Innerwear",
    initials: "IW",
    background: "linear-gradient(145deg, #1b2636 0%, #0f1620 100%)",
    text: "#f1f5f9",
    border: "#2c3e56",
    accent: "#94a3b8",
  },
};

export const EDITORIAL_SIZE_PALETTES = [
  {
    background: "linear-gradient(145deg, #0f243d 0%, #081729 100%)",
    text: "#f0f6fc",
    border: "#1c3d63",
    accent: "#38bdf8",
  },
  {
    background: "linear-gradient(145deg, #0b3820 0%, #062414 100%)",
    text: "#ecfdf5",
    border: "#155734",
    accent: "#4ade80",
  },
  {
    background: "linear-gradient(145deg, #4c111e 0%, #2f0710 100%)",
    text: "#fce7f3",
    border: "#731b2f",
    accent: "#fb7185",
  },
  {
    background: "linear-gradient(145deg, #381f14 0%, #21110a 100%)",
    text: "#fef3c7",
    border: "#5c3322",
    accent: "#f59e0b",
  },
  {
    background: "linear-gradient(145deg, #1a2247 0%, #0f1530 100%)",
    text: "#e0e7ff",
    border: "#2d3a73",
    accent: "#818cf8",
  },
  {
    background: "linear-gradient(145deg, #21262d 0%, #121519 100%)",
    text: "#f0f6fc",
    border: "#363f4a",
    accent: "#9ca3af",
  },
];

/**
 * Normalizes size group name for presentation in clean Title Case.
 */
export function formatSizeGroupName(name = "") {
  if (!name || typeof name !== "string") return name || "";
  const trimmed = name.trim();
  if (!trimmed || trimmed === "—") return trimmed;

  return trimmed
    .split(/(\s+|[-/&])/g)
    .map((token) => {
      if (!token || /^\s+$/.test(token) || /^[-/&]$/.test(token)) {
        return token;
      }
      if (KNOWN_UPPERCASE_TOKENS.includes(token.toUpperCase())) {
        return token.toUpperCase();
      }
      return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
    })
    .join("");
}

/**
 * Generates an uppercase valid size group code from name.
 */
export function generateSizeGroupCodeFromName(name = "") {
  if (!name || typeof name !== "string") return "";
  return name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 50);
}

/**
 * Extracts 1 or 2 uppercase initials for size group avatar badges.
 */
export function getSizeGroupInitials(name = "") {
  if (!name || typeof name !== "string") return "SG";
  const cleaned = name.trim().replace(/[^a-zA-Z0-9\s]/g, "");
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "SG";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/**
 * Returns bespoke human styling for size group.
 */
export function getSizeGroupStyle(name = "", code = "") {
  const normCode = String(code || "").trim().toUpperCase();
  const normName = String(name || "").trim().toUpperCase();

  if (normCode && SIZE_GROUP_PRESETS[normCode]) {
    return SIZE_GROUP_PRESETS[normCode];
  }
  if (normName.includes("MEN") && !normName.includes("WOMEN")) return SIZE_GROUP_PRESETS.MEN;
  if (normName.includes("WOMEN")) return SIZE_GROUP_PRESETS.WOMEN;
  if (normName.includes("KID")) return SIZE_GROUP_PRESETS.KIDS;
  if (normName.includes("FOOTWEAR") || normName.includes("SHOE")) return SIZE_GROUP_PRESETS.FOOTWEAR;
  if (normName.includes("FREE")) return SIZE_GROUP_PRESETS.FREE;
  if (normName.includes("SAREE")) return SIZE_GROUP_PRESETS.SAREE;
  if (normName.includes("INNER")) return SIZE_GROUP_PRESETS.INNERWEAR;

  // Fallback
  let hash = 0;
  const str = normCode || normName || "SG";
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % EDITORIAL_SIZE_PALETTES.length;
  const palette = EDITORIAL_SIZE_PALETTES[index];
  return {
    ...palette,
    initials: getSizeGroupInitials(name || code),
  };
}

/**
 * Legacy gradient compatibility.
 */
export function getSizeGroupGradient(name = "") {
  const style = getSizeGroupStyle(name);
  return style.background;
}

export default {
  formatSizeGroupName,
  generateSizeGroupCodeFromName,
  getSizeGroupInitials,
  getSizeGroupStyle,
  getSizeGroupGradient,
  SIZE_GROUP_PRESETS,
};
