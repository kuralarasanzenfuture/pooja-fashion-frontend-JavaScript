/**
 * Size Master Utilities & Formatters
 */

/**
 * Format human-readable size name
 * Capitalizes first letter of each word
 */
export function formatSizeName(name) {
  if (!name || typeof name !== "string") return "";
  return name.trim();
}

/**
 * Auto-generate a clean size code from size name
 * Common apparel size abbreviations & numeric extraction
 * e.g., "Extra Large" -> "XL", "Triple Extra Large" -> "3XL", "Size 32" -> "32"
 */
export function generateSizeCodeFromName(name) {
  if (!name || typeof name !== "string") return "";
  const cleaned = name.trim();

  const standardMap = {
    "extra small": "XS",
    "x-small": "XS",
    "small": "S",
    "medium": "M",
    "large": "L",
    "extra large": "XL",
    "x-large": "XL",
    "double extra large": "XXL",
    "xx-large": "XXL",
    "triple extra large": "3XL",
    "xxx-large": "3XL",
    "quadruple extra large": "4XL",
    "free size": "FS",
    "one size": "OS",
  };

  const lower = cleaned.toLowerCase();
  if (standardMap[lower]) {
    return standardMap[lower];
  }

  // If name is already just numbers (e.g., "32", "38", "40")
  if (/^\d+$/.test(cleaned)) {
    return cleaned;
  }

  // If pattern is "Size 32" or "Waist 32"
  const sizeNumMatch = cleaned.match(/^(?:size|waist|chest|length|uk|us|eur|euro)\s*([0-9]+(?:\.[0-9]+)?)$/i);
  if (sizeNumMatch) {
    return sizeNumMatch[1];
  }

  // If pattern is "UK 8" or "UK-8"
  const prefixNumMatch = cleaned.match(/^([A-Za-z]+)[\s-]*([0-9]+)$/);
  if (prefixNumMatch) {
    return `${prefixNumMatch[1].toUpperCase()}-${prefixNumMatch[2]}`;
  }

  // Fallback: uppercase letters, numbers, hyphen
  return cleaned
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 20);
}

/**
 * Get display initials / short token for Size thumbnail
 */
export function getSizeInitials(sizeCode, sizeName) {
  if (sizeCode && typeof sizeCode === "string") {
    return sizeCode.trim().slice(0, 4).toUpperCase();
  }
  if (sizeName && typeof sizeName === "string") {
    const parts = sizeName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return sizeName.trim().slice(0, 3).toUpperCase();
  }
  return "SZ";
}

/**
 * Deterministic Tailwind gradient based on size code or ID
 */
const GRADIENTS = [
  "from-violet-500/20 via-purple-500/15 to-indigo-500/10 text-violet-600 border-violet-500/30",
  "from-blue-500/20 via-cyan-500/15 to-teal-500/10 text-blue-600 border-blue-500/30",
  "from-emerald-500/20 via-teal-500/15 to-green-500/10 text-emerald-600 border-emerald-500/30",
  "from-amber-500/20 via-orange-500/15 to-yellow-500/10 text-amber-600 border-amber-500/30",
  "from-rose-500/20 via-pink-500/15 to-red-500/10 text-rose-600 border-rose-500/30",
  "from-indigo-500/20 via-sky-500/15 to-blue-500/10 text-indigo-600 border-indigo-500/30",
];

export function getSizeGradient(code = "") {
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = (hash << 5) - hash + code.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
}

export default {
  formatSizeName,
  generateSizeCodeFromName,
  getSizeInitials,
  getSizeGradient,
};

