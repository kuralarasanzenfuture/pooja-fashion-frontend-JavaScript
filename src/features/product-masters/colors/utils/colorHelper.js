/**
 * Color Master Utilities & Formatting Helpers
 */

export const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

/**
 * Format human-readable color name
 */
export function formatColorName(name) {
  if (!name || typeof name !== "string") return "";
  return name.trim();
}

/**
 * Format HEX color code to standard uppercase #RRGGBB format
 */
export function formatHexCode(hex) {
  if (!hex || typeof hex !== "string") return "";
  let clean = hex.trim();
  if (!clean.startsWith("#")) {
    clean = `#${clean}`;
  }
  // Expand 3-digit hex e.g. #F00 to #FF0000
  if (/^#[0-9A-Fa-f]{3}$/.test(clean)) {
    const r = clean[1];
    const g = clean[2];
    const b = clean[3];
    clean = `#${r}${r}${g}${g}${b}${b}`;
  }
  return clean.toUpperCase();
}

/**
 * Check if a hex code is valid 6-digit hex
 */
export function isValidHexCode(hex) {
  if (!hex || typeof hex !== "string") return false;
  return HEX_COLOR_REGEX.test(formatHexCode(hex));
}

/**
 * Convert Hex to RGB object { r, g, b }
 */
export function hexToRgb(hex) {
  const formatted = formatHexCode(hex);
  if (!isValidHexCode(formatted)) return null;

  const r = parseInt(formatted.slice(1, 3), 16);
  const g = parseInt(formatted.slice(3, 5), 16);
  const b = parseInt(formatted.slice(5, 7), 16);

  return { r, g, b };
}

/**
 * Calculate relative perceived luminance (YIQ standard)
 * Returns true if the color is light, false if dark.
 */
export function isLightColor(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return true;
  // Perceived luminance formula (ITU-R BT.601)
  const yiq = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return yiq >= 155;
}

/**
 * Returns accessible text/icon contrast color ('#FFFFFF' or '#0F172A')
 * for rendering on top of the given hex color
 */
export function getContrastColor(hex) {
  if (!hex || hex === "multicolor" || hex === "MULTICOLOR") {
    return "#FFFFFF";
  }
  return isLightColor(hex) ? "#0F172A" : "#FFFFFF";
}

/**
 * Auto-generate clean color code from color name
 * e.g. "Royal Blue" -> "ROYAL-BLUE", "Navy Blue" -> "NAVY-BLUE", "Dark Green" -> "DARK-GREEN"
 */
export function generateColorCodeFromName(name) {
  if (!name || typeof name !== "string") return "";
  const cleaned = name.trim();

  // Known standard color mappings for apparel
  const codeMap = {
    black: "BLACK",
    white: "WHITE",
    red: "RED",
    blue: "BLUE",
    green: "GREEN",
    yellow: "YELLOW",
    pink: "PINK",
    orange: "ORANGE",
    purple: "PURPLE",
    grey: "GREY",
    gray: "GREY",
    brown: "BROWN",
    maroon: "MAROON",
    navy: "NAVY",
    "navy blue": "NAVY-BLUE",
    "royal blue": "ROYAL-BLUE",
    "sky blue": "SKY-BLUE",
    gold: "GOLD",
    silver: "SILVER",
    beige: "BEIGE",
    cream: "CREAM",
    multicolor: "MULTICOLOR",
  };

  const lower = cleaned.toLowerCase();
  if (codeMap[lower]) {
    return codeMap[lower];
  }

  return cleaned
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30);
}

/**
 * Get 2-character color initials fallback
 */
export function getColorInitials(name, code) {
  if (code && typeof code === "string") {
    const cleanCode = code.trim().replace(/[^A-Za-z0-9]/g, "");
    if (cleanCode.length >= 2) return cleanCode.slice(0, 2).toUpperCase();
  }
  if (name && typeof name === "string") {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.trim().slice(0, 2).toUpperCase();
  }
  return "CL";
}

/**
 * Get CSS style object for color swatch preview.
 * Supports solid hex colors and festive multi-color rainbow gradients.
 */
export function getColorSwatchStyle(hex) {
  if (!hex || String(hex).toLowerCase() === "multicolor") {
    return {
      background:
        "linear-gradient(135deg, #FF0000 0%, #FFA500 20%, #FFFF00 40%, #008000 60%, #0000FF 80%, #800080 100%)",
    };
  }

  const formatted = formatHexCode(hex);
  return {
    backgroundColor: formatted,
  };
}

export default {
  HEX_COLOR_REGEX,
  formatColorName,
  formatHexCode,
  isValidHexCode,
  hexToRgb,
  isLightColor,
  getContrastColor,
  generateColorCodeFromName,
  getColorInitials,
  getColorSwatchStyle,
};
