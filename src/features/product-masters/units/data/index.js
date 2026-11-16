import unitPresetsData from "./unitPresets.json";

export const UNIT_PRESETS = unitPresetsData;

/**
 * Top 10 most popular apparel / retail units of measure for quick-pick row in the form modal
 */
export const POPULAR_UNITS = unitPresetsData.slice(0, 10);
export const POPULAR_UNIT_PRESETS = POPULAR_UNITS;

/**
 * Search units in preset database
 */
export const searchUnitPresets = (query = "") => {
  if (!query || !query.trim()) return UNIT_PRESETS;
  const q = query.toLowerCase().trim();
  return UNIT_PRESETS.filter(
    (u) =>
      u.name.toLowerCase().includes(q) ||
      u.code.toLowerCase().includes(q) ||
      (u.desc && u.desc.toLowerCase().includes(q))
  );
};

export default {
  UNIT_PRESETS,
  POPULAR_UNITS,
  POPULAR_UNIT_PRESETS,
  searchUnitPresets,
};
