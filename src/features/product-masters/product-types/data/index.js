import productTypePresetsData from "./productTypePresets.json";

export const PRODUCT_TYPE_PRESETS = productTypePresetsData;

export const POPULAR_PRODUCT_TYPES = productTypePresetsData.filter(
  (item) => item.popular
);
export const POPULAR_PRODUCT_TYPE_PRESETS = POPULAR_PRODUCT_TYPES;

export const searchProductTypePresets = (query = "") => {
  if (!query || typeof query !== "string") return PRODUCT_TYPE_PRESETS;
  const q = query.trim().toLowerCase();
  return PRODUCT_TYPE_PRESETS.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q))
  );
};

export const getPopularProductTypePresets = () => POPULAR_PRODUCT_TYPES;

export default {
  PRODUCT_TYPE_PRESETS,
  POPULAR_PRODUCT_TYPES,
  POPULAR_PRODUCT_TYPE_PRESETS,
  searchProductTypePresets,
  getPopularProductTypePresets,
};

