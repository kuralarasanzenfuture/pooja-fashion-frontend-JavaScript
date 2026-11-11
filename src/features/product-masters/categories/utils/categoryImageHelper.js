/**
 * Category Image Resolution & Fallback Engine
 * Ensures recent search cards and category thumbnails always display crisp,
 * high-resolution fashion imagery matching the user's curated catalog.
 */

export const REFERENCE_RECENT_SEARCHES = [
  {
    id: "ref-tshirt",
    name: "Girls T shirt",
    code: "GIRLS_TSHIRT",
    query: "Girls T shirt",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80",
    timestamp: Date.now() - 1000,
  },
  {
    id: "ref-beauty",
    name: "Beauty",
    code: "BEAUTY",
    query: "Beauty",
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80",
    timestamp: Date.now() - 2000,
  },
  {
    id: "ref-heels",
    name: "Heels",
    code: "HEELS",
    query: "Heels",
    imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&auto=format&fit=crop&q=80",
    timestamp: Date.now() - 3000,
  },
  {
    id: "ref-jeans",
    name: "Girls Jeans",
    code: "GIRLS_JEANS",
    query: "Girls Jeans",
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&auto=format&fit=crop&q=80",
    timestamp: Date.now() - 4000,
  },
  {
    id: "ref-dress",
    name: "Party Dress",
    code: "PARTY_DRESS",
    query: "Party Dress",
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&auto=format&fit=crop&q=80",
    timestamp: Date.now() - 5000,
  },
  {
    id: "ref-shoes",
    name: "Girls Shoes",
    code: "GIRLS_SHOES",
    query: "Girls Shoes",
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&auto=format&fit=crop&q=80",
    timestamp: Date.now() - 6000,
  },
];

const FASHION_KEYWORD_IMAGES = [
  {
    keywords: ["t-shirt", "tshirt", "t shirt", "tee", "top", "crop top"],
    url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["beauty", "cosmetic", "cosmetics", "makeup", "skin", "lipstick"],
    url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["heel", "heels", "stiletto", "sandal", "sandals", "wedge"],
    url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["jean", "jeans", "denim", "pant", "pants", "trousers"],
    url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["party dress", "dress", "gown", "frock", "maxi", "midi"],
    url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["shoe", "shoes", "sneaker", "sneakers", "boot", "footwear"],
    url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["silk", "kanchipuram", "banarasi", "mysore", "tussar"],
    url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["cotton", "handloom", "mulmul", "chanderi", "kota"],
    url: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=400&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["saree", "saris", "sarees", "drape"],
    url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["kurti", "kurtis", "kurta", "tunic", "ethnic"],
    url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["material", "salwar", "suit", "dupatta"],
    url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["bag", "bags", "handbag", "clutch", "purse", "wallet"],
    url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["jewel", "jewellery", "jewelry", "necklace", "bangles"],
    url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&auto=format&fit=crop&q=80",
  },
];

/**
 * Normalizes category / classification titles into clean Title Case.
 * Corrects irregular casing and trailing uppercase characters (e.g. "sareeS" -> "Sarees").
 */
export function formatCategoryName(name = "") {
  if (!name || typeof name !== "string") return name || "";
  const trimmed = name.trim();
  if (!trimmed || trimmed === "—") return trimmed;

  return trimmed
    .split(/(\s+|[-/&])/g)
    .map((token) => {
      if (!token || /^\s+$/.test(token) || /^[-/&]$/.test(token)) {
        return token;
      }

      const upperAcronyms = ["ERP", "POS", "ID", "GST", "SMS", "SKU", "HSN", "VIP", "USA", "UK"];
      if (upperAcronyms.includes(token.toUpperCase())) {
        return token.toUpperCase();
      }

      return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
    })
    .join("");
}

/**
 * Normalizes relative URLs (/uploads/...) and handles backend paths.
 */
export function normalizeCategoryImageUrl(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  return `/${trimmed}`;
}

/**
 * Resolves high-resolution category image or smart keyword-based fashion fallback.
 */
export function getCategoryFallbackImage(name = "", code = "") {
  const query = `${name} ${code}`.toLowerCase();

  for (const item of FASHION_KEYWORD_IMAGES) {
    if (item.keywords.some((k) => query.includes(k))) {
      return item.url;
    }
  }

  // Deterministic fallback from curated gallery based on string hash
  const hash = query.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const fallbackList = [
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop&q=80",
  ];

  return fallbackList[hash % fallbackList.length];
}

/**
 * Returns a guaranteed valid image URL for any category item
 */
export function resolveCategoryThumbnail(item) {
  if (!item) return getCategoryFallbackImage();

  const rawUrl = item.imageUrl || item.image_url || item.image || item.imagePath;
  const normalized = normalizeCategoryImageUrl(rawUrl);

  if (normalized) {
    return normalized;
  }

  const name = item.name || item.categoryName || item.category_name || item.query || "";
  const code = item.code || item.categoryCode || item.category_code || "";
  return getCategoryFallbackImage(name, code);
}
