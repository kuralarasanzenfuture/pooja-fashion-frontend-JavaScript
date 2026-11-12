import sizePresets from "./sizePresets.json";

export { sizePresets };

export function getPopularSizePresets() {
  return sizePresets.slice(0, 8);
}

export function searchSizePresets(query = "") {
  if (!query) return sizePresets;
  const q = query.toLowerCase().trim();
  return sizePresets.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      (p.groupCode && p.groupCode.toLowerCase().includes(q))
  );
}

export default {
  sizePresets,
  getPopularSizePresets,
  searchSizePresets,
};

