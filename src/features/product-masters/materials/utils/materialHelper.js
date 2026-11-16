/**
 * Material Master Helper Utilities
 */

/**
 * Generate a clean uppercase alphanumeric material code from its name
 * e.g. "Pure Banarasi Silk" -> "BANARASI-SILK" or "COTTON"
 */
export function generateMaterialCodeFromName(name = "") {
  if (!name || typeof name !== "string") return "";

  return name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 30);
}

/**
 * Format material name to clean Title Case
 */
export function formatMaterialName(name = "") {
  if (!name || typeof name !== "string") return "";
  return name.trim();
}

/**
 * Extract 1 or 2 letter initials for material thumbnail
 */
export function getMaterialInitials(name = "") {
  if (!name || typeof name !== "string") return "MT";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Deterministically pick an aesthetic color theme based on material name
 */
const MATERIAL_PALETTES = [
  { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-600 dark:text-amber-400" },
  { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-600 dark:text-blue-400" },
  { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-600 dark:text-emerald-400" },
  { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-600 dark:text-purple-400" },
  { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-600 dark:text-rose-400" },
  { bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-600 dark:text-indigo-400" },
  { bg: "bg-teal-500/10", border: "border-teal-500/30", text: "text-teal-600 dark:text-teal-400" },
  { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-600 dark:text-cyan-400" },
];

export function getMaterialTheme(name = "") {
  if (!name) return MATERIAL_PALETTES[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % MATERIAL_PALETTES.length;
  return MATERIAL_PALETTES[index];
}
