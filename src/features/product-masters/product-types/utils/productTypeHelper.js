/**
 * Product Type Master Helper Utilities
 */

/**
 * Generate a clean uppercase alphanumeric product type code from name
 * e.g. "Ready Made Garments" -> "READY_MADE", "Fabric" -> "FABRIC"
 */
export function generateProductTypeCodeFromName(name = "") {
  if (!name || typeof name !== "string") return "";

  const trimmed = name.trim().toUpperCase();

  // Known retail fashion shortcuts
  if (trimmed === "READY MADE" || trimmed === "READY MADE GARMENTS" || trimmed === "READYMADE GARMENTS") {
    return "READY_MADE";
  }
  if (trimmed === "FABRIC" || trimmed === "FABRICS" || trimmed === "TEXTILE" || trimmed === "TEXTILES") {
    return "FABRIC";
  }
  if (trimmed === "ACCESSORY" || trimmed === "ACCESSORIES" || trimmed === "FASHION ACCESSORIES") {
    return "ACCESSORY";
  }
  if (trimmed === "FOOTWEAR" || trimmed === "SHOES" || trimmed === "FOOT WEAR") {
    return "FOOTWEAR";
  }
  if (trimmed === "SERVICE" || trimmed === "SERVICES" || trimmed === "TAILORING" || trimmed === "ALTERATIONS") {
    return "SERVICE";
  }
  if (trimmed === "SAREE" || trimmed === "SAREES") {
    return "SAREE";
  }
  if (trimmed === "LEHENGA" || trimmed === "LEHENGAS") {
    return "LEHENGA";
  }
  if (trimmed === "UNSTITCHED SUIT" || trimmed === "UNSTITCHED SUITS" || trimmed === "DRESS MATERIAL") {
    return "UNSTITCHED_SUIT";
  }

  return trimmed
    .replace(/['’]/g, "")
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 50);
}

/**
 * Format product type name
 */
export function formatProductTypeName(name = "") {
  if (!name || typeof name !== "string") return "";
  return name.trim();
}

const TYPE_PALETTES = [
  { bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-600 dark:text-indigo-400" },
  { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-600 dark:text-emerald-400" },
  { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-600 dark:text-amber-400" },
  { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-600 dark:text-purple-400" },
  { bg: "bg-teal-500/10", border: "border-teal-500/30", text: "text-teal-600 dark:text-teal-400" },
  { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-600 dark:text-blue-400" },
  { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-600 dark:text-rose-400" },
  { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-600 dark:text-cyan-400" },
];

/**
 * Get dynamic theme for product type badge
 */
export function getProductTypeTheme(code = "") {
  const c = String(code || "").toUpperCase();
  if (c.includes("READY") || c.includes("GARMENT")) return TYPE_PALETTES[0]; // Indigo
  if (c.includes("FABRIC") || c.includes("TEXTILE")) return TYPE_PALETTES[1]; // Emerald
  if (c.includes("ACCESSORY")) return TYPE_PALETTES[2]; // Amber
  if (c.includes("FOOTWEAR") || c.includes("SHOE")) return TYPE_PALETTES[6]; // Rose
  if (c.includes("SERVICE") || c.includes("TAILOR")) return TYPE_PALETTES[5]; // Blue
  if (c.includes("SAREE") || c.includes("SILK")) return TYPE_PALETTES[3]; // Purple
  if (c.includes("LEHENGA") || c.includes("BRIDAL")) return TYPE_PALETTES[2]; // Amber

  let hash = 0;
  for (let i = 0; i < c.length; i++) {
    hash = c.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % TYPE_PALETTES.length;
  return TYPE_PALETTES[index];
}

export default {
  generateProductTypeCodeFromName,
  formatProductTypeName,
  getProductTypeTheme,
};
