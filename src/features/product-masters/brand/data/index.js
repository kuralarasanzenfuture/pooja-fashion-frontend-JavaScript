import brandPresets from "./brandPresets.json";

export { brandPresets };

export const getPopularBrandPresets = () =>
  brandPresets.filter((b) => b.popular);

export const searchBrandPresets = (query = "") => {
  if (!query || !query.trim()) return brandPresets;
  const q = query.toLowerCase().trim();
  return brandPresets.filter(
    (b) =>
      b.name.toLowerCase().includes(q) ||
      b.code.toLowerCase().includes(q) ||
      (b.description && b.description.toLowerCase().includes(q))
  );
};

export default brandPresets;

