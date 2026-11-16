/**
 * Unit Master Helper Utilities
 */

/**
 * Generate a clean uppercase alphanumeric unit code from name
 * e.g. "Meter" -> "METER", "Pieces" -> "PCS"
 */
export function generateUnitCodeFromName(name = "") {
  if (!name || typeof name !== "string") return "";

  const trimmed = name.trim().toUpperCase();
  if (trimmed === "PIECES" || trimmed === "PIECE") return "PCS";
  if (trimmed === "METERS" || trimmed === "METRE" || trimmed === "METRES") return "METER";
  if (trimmed === "KILOGRAMS" || trimmed === "KILOGRAM") return "KG";
  if (trimmed === "GRAMS" || trimmed === "GRAM") return "GM";
  if (trimmed === "PAIRS") return "PAIR";
  if (trimmed === "SETS") return "SET";
  if (trimmed === "BOXES") return "BOX";
  if (trimmed === "DOZENS") return "DOZEN";

  return trimmed
    .replace(/[^A-Z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 20);
}

/**
 * Format unit name
 */
export function formatUnitName(name = "") {
  if (!name || typeof name !== "string") return "";
  return name.trim();
}

/**
 * Formats a sample number using unit decimal places
 * e.g. (1.5, 2) -> "1.50"
 */
export function formatWithDecimals(value, decimals = 0) {
  const num = Number(value) || 0;
  return num.toFixed(Number(decimals) || 0);
}

const UNIT_PALETTES = [
  { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-600 dark:text-blue-400" },
  { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-600 dark:text-emerald-400" },
  { bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-600 dark:text-indigo-400" },
  { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-600 dark:text-amber-400" },
  { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-600 dark:text-purple-400" },
  { bg: "bg-teal-500/10", border: "border-teal-500/30", text: "text-teal-600 dark:text-teal-400" },
  { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-600 dark:text-cyan-400" },
  { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-600 dark:text-rose-400" },
];

export function getUnitTheme(code = "") {
  if (!code) return UNIT_PALETTES[0];
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = code.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % UNIT_PALETTES.length;
  return UNIT_PALETTES[index];
}
