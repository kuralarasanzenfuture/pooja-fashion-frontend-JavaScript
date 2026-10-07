import subCategoryPresets from "./subCategoryPresets.json";

export { subCategoryPresets };

export const getPopularSubcategoryPresets = () =>
  subCategoryPresets.filter((item) => item.popular);

export const searchSubcategoryPresets = (query = "") => {
  const q = query.trim().toLowerCase();
  if (!q) return subCategoryPresets;
  return subCategoryPresets.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
  );
};

export default subCategoryPresets;
