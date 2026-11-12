import sizeGroupPresets from "./sizeGroupPresets.json";

export { sizeGroupPresets };

export const getPopularSizeGroupPresets = () =>
  sizeGroupPresets.filter((sg) => sg.popular);

export const searchSizeGroupPresets = (query = "") => {
  if (!query || !query.trim()) return sizeGroupPresets;
  const q = query.toLowerCase().trim();
  return sizeGroupPresets.filter(
    (sg) =>
      sg.name.toLowerCase().includes(q) ||
      sg.code.toLowerCase().includes(q) ||
      (sg.description && sg.description.toLowerCase().includes(q))
  );
};

export default sizeGroupPresets;

