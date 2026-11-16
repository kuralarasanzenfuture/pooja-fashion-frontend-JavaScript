import colorPresetsData from "./colorPresets.json";

export const COLOR_PRESETS = colorPresetsData;

/**
 * Top 10 most popular apparel / textile colors for quick-pick row in the form modal
 */
export const POPULAR_COLORS = colorPresetsData.slice(0, 10);
export const POPULAR_COLOR_PRESETS = POPULAR_COLORS;

/**
 * Search colors in preset database
 */
export const searchColorPresets = (query = "") => {
  if (!query || !query.trim()) return COLOR_PRESETS;
  const q = query.toLowerCase().trim();
  return COLOR_PRESETS.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      (c.hex && c.hex.toLowerCase().includes(q)) ||
      (c.desc && c.desc.toLowerCase().includes(q))
  );
};

export default {
  COLOR_PRESETS,
  POPULAR_COLORS,
  searchColorPresets,
};
