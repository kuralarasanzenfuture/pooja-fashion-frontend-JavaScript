import materialPresetsData from "./materialPresets.json";

export const MATERIAL_PRESETS = materialPresetsData;

/**
 * Top 10 most popular apparel / textile fabrics for quick-pick row in the form modal
 */
export const POPULAR_MATERIALS = materialPresetsData.slice(0, 10);
export const POPULAR_MATERIAL_PRESETS = POPULAR_MATERIALS;

/**
 * Search materials in preset database
 */
export const searchMaterialPresets = (query = "") => {
  if (!query || !query.trim()) return MATERIAL_PRESETS;
  const q = query.toLowerCase().trim();
  return MATERIAL_PRESETS.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.code.toLowerCase().includes(q) ||
      (m.desc && m.desc.toLowerCase().includes(q))
  );
};

export default {
  MATERIAL_PRESETS,
  POPULAR_MATERIALS,
  POPULAR_MATERIAL_PRESETS,
  searchMaterialPresets,
};

