import categoryPresets from "./categoryPresets.json";

export { categoryPresets };

export const getPopularCategoryPresets = () =>
  categoryPresets.filter((item) => item.popular);

export const searchCategoryPresets = (query = "") => {
  const q = query.trim().toLowerCase();
  if (!q) return categoryPresets;
  return categoryPresets.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.department.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
  );
};

export default categoryPresets;
