import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  Heart,
  RotateCcw,
  ShoppingBag,
  Receipt,
  Boxes,
  Users,
  Sparkles,
  BarChart3,
  Settings,
  Building2,
  Landmark,
  Layers,
} from "lucide-react";
import { ROUTES } from "../../../../constants/routes.js";

// Storage keys
const RECENT_SEARCHES_KEY = "pooja_fashion_recent_searches_app_v1";
const FAVORITES_KEY = "pooja_fashion_favorites_app_v1";

/**
 * Exact Emerald 3-Node Component Icon from reference image
 */
function EmeraldNodeIcon({ className = "w-5 h-5 text-emerald-500 shrink-0" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="9" y="3" width="6" height="6" rx="1.5" />
      <rect x="3" y="15" width="6" height="6" rx="1.5" />
      <rect x="15" y="15" width="6" height="6" rx="1.5" />
      <path d="M12 9v3" />
      <path d="M6 15v-1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

// Strictly Pooja Fashion Application-Related Default Recent Searches
const DEFAULT_APPLICATION_RECENT = [
  {
    id: "app-lehengas",
    category: "Catalog",
    title: "Bridal Lehengas & Silk Sarees",
    path: "catalog/products/silk-sarees",
    route: ROUTES.PRODUCTS,
    type: "product",
  },
  {
    id: "app-pos-billing",
    category: "",
    title: "Point of Sale & Invoicing",
    path: "billing/pos-counter",
    route: ROUTES.BILLING,
    type: "billing",
  },
  {
    id: "app-stock",
    category: "Inventory",
    title: "Fabric Bolts & Thaan Stock",
    path: "inventory/fabric-bolts",
    route: ROUTES.STOCK,
    type: "stock",
  },
  {
    id: "app-customers",
    category: "",
    title: "Customer Directory & Khata Ledger",
    path: "customers/khata-directory",
    route: ROUTES.CUSTOMERS,
    type: "customer",
  },
];

// Comprehensive 100% Application-Related Search Items for Pooja Fashion
const POOJA_APPLICATION_SEARCH_ITEMS = [
  // Products & Saree Catalog
  {
    id: "app-lehengas",
    category: "Catalog",
    title: "Bridal Lehengas & Silk Sarees",
    path: "catalog/products/silk-sarees",
    route: ROUTES.PRODUCTS,
    type: "product",
    keywords: ["lehenga", "saree", "silk sarees", "bridal", "kanchipuram", "banarasi", "pattu", "choli", "velvet"],
  },
  {
    id: "app-kanchipuram",
    category: "Catalog",
    title: "Kanchipuram Pure Silk Sarees",
    path: "catalog/products/kanchipuram",
    route: ROUTES.PRODUCTS,
    type: "product",
    keywords: ["kanchipuram", "pure silk", "gold zari", "wedding saree", "pattu saree", "dharampuri"],
  },
  {
    id: "app-banarasi",
    category: "Catalog",
    title: "Banarasi Georgette & Katan Sarees",
    path: "catalog/products/banarasi",
    route: ROUTES.PRODUCTS,
    type: "product",
    keywords: ["banarasi", "georgette", "katan silk", "zari booti", "varanasi weave"],
  },
  {
    id: "app-categories",
    category: "Catalog",
    title: "Product Categories & Fabric Masters",
    path: "catalog/categories/masters",
    route: ROUTES.CATEGORIES,
    type: "product",
    keywords: ["categories", "product masters", "saree types", "lehenga categories", "fabrics", "silk grades"],
  },

  // Point of Sale & Invoices
  {
    id: "app-pos-billing",
    category: "Billing",
    title: "Point of Sale & Invoicing",
    path: "billing/pos-counter",
    route: ROUTES.BILLING,
    type: "billing",
    keywords: ["pos", "billing", "invoice", "new sale", "live counter", "cash register", "gst bill", "checkout"],
  },
  {
    id: "app-invoice-001",
    category: "Billing",
    title: "Invoice #INV-2024-001 • Ramesh Kumar (₹18,500)",
    path: "billing/invoices/INV-2024-001",
    route: ROUTES.BILLING,
    type: "billing",
    keywords: ["invoice", "inv-2024-001", "ramesh kumar", "paid", "upi receipt", "bill copy"],
  },
  {
    id: "app-invoice-002",
    category: "Billing",
    title: "Invoice #INV-2024-002 • Pooja Boutique (₹42,000)",
    path: "billing/invoices/INV-2024-002",
    route: ROUTES.BILLING,
    type: "billing",
    keywords: ["invoice", "inv-2024-002", "pooja boutique", "wholesale invoice", "gst tax bill"],
  },

  // Stock, Inventory & Purchases
  {
    id: "app-stock",
    category: "Inventory",
    title: "Fabric Bolts & Thaan Stock",
    path: "inventory/fabric-bolts",
    route: ROUTES.STOCK,
    type: "stock",
    keywords: ["stock", "bolts", "thaan", "inventory", "godown", "warehouse", "meters", "rolls"],
  },
  {
    id: "app-purchases",
    category: "Procurement",
    title: "Purchases & Weaver Inward",
    path: "purchases/weaver-inward",
    route: ROUTES.PURCHASES,
    type: "purchase",
    keywords: ["purchases", "weavers", "textile mills", "inward stock", "goods receipt", "grn", "purchase orders"],
  },
  {
    id: "app-suppliers",
    category: "Contacts",
    title: "Mills & Weaver Suppliers",
    path: "suppliers/textile-mills",
    route: ROUTES.SUPPLIERS,
    type: "supplier",
    keywords: ["suppliers", "mills", "master weavers", "surat textile", "kanchipuram weavers", "vendors"],
  },

  // Customers & Khata
  {
    id: "app-customers",
    category: "Khata",
    title: "Customer Directory & Khata Ledger",
    path: "customers/khata-directory",
    route: ROUTES.CUSTOMERS,
    type: "customer",
    keywords: ["customers", "khata", "ledger", "udhar", "boutique clients", "retail buyers", "credit balance"],
  },

  // Staff & Administration
  {
    id: "app-employees",
    category: "Staff",
    title: "Store Associates & Staff",
    path: "staff/employees-roster",
    route: ROUTES.EMPLOYEES,
    type: "employee",
    keywords: ["employees", "staff", "sales associates", "commission", "counter team"],
  },
  {
    id: "app-attendance",
    category: "Staff",
    title: "Staff Attendance & Shifts",
    path: "staff/attendance-register",
    route: ROUTES.ATTENDANCE,
    type: "attendance",
    keywords: ["attendance", "staff shifts", "biometric", "daily log", "leaves"],
  },

  // Reports & Analytics
  {
    id: "app-reports",
    category: "Analytics",
    title: "GST Tax & Sales Reports",
    path: "analytics/reports/gst-summary",
    route: ROUTES.REPORTS,
    type: "report",
    keywords: ["reports", "gst", "gstr-1", "sales analytics", "daily profit", "tax audit"],
  },

  // Store Settings & Company Configuration
  {
    id: "app-settings",
    category: "System",
    title: "Store Settings & Invoice Format",
    path: "settings/store-configuration",
    route: ROUTES.SETTINGS,
    type: "settings",
    keywords: ["settings", "invoice template", "printer", "thermal receipt", "barcode preferences"],
  },
  {
    id: "app-bank-master",
    category: "Finance",
    title: "Bank Master & Settlement Accounts",
    path: "finance/bank-master-accounts",
    route: ROUTES.BANK_MASTER,
    type: "bank",
    keywords: ["bank", "accounts", "ifsc", "payment settlement", "upi qr", "cheque"],
  },
  {
    id: "app-company",
    category: "Business",
    title: "Company Profile & GSTIN Details",
    path: "company/business-profile",
    route: ROUTES.COMPANY,
    type: "company",
    keywords: ["company", "profile", "gstin", "pan", "trade license", "showroom address"],
  },
  {
    id: "app-dashboard",
    category: "Overview",
    title: "Dashboard Overview & Live Stats",
    path: "dashboard/overview",
    route: ROUTES.DASHBOARD,
    type: "navigation",
    keywords: ["dashboard", "home", "live counter", "today revenue", "quick stats"],
  },
];

export default function SearchModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Animation lifecycle state
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  // Smooth open / close animation handler
  useEffect(() => {
    let timeoutId;
    if (isOpen) {
      setIsRendered(true);
      // Double rAF ensures the initial state is painted before entering
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      timeoutId = setTimeout(() => {
        setIsRendered(false);
      }, 180);
    }
    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  // Animated close handler
  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 180);
  }, [onClose]);

  // Load recent searches from localStorage
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Failed to load recent searches:", e);
    }
    return DEFAULT_APPLICATION_RECENT;
  });

  // Load favorites from localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to load favorites:", e);
    }
    return ["app-lehengas"];
  });

  const saveRecent = (items) => {
    setRecentSearches(items);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to save recent searches:", e);
    }
  };

  const saveFavorites = (favs) => {
    setFavorites(favs);
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    } catch (e) {
      console.warn("Failed to save favorites:", e);
    }
  };

  // Filter items matching query or display recent
  const displayedItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return recentSearches;
    }

    return POOJA_APPLICATION_SEARCH_ITEMS.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCategory = item.category?.toLowerCase().includes(q);
      const matchPath = item.path.toLowerCase().includes(q);
      const matchKeywords = item.keywords?.some((k) => k.toLowerCase().includes(q));
      return matchTitle || matchCategory || matchPath || matchKeywords;
    });
  }, [query, recentSearches]);

  // Autofocus input when visible
  useEffect(() => {
    if (isVisible) {
      setQuery("");
      setActiveIndex(0);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // Active index boundary clamp
  useEffect(() => {
    if (activeIndex >= displayedItems.length) {
      setActiveIndex(Math.max(0, displayedItems.length - 1));
    }
  }, [displayedItems.length, activeIndex]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [activeIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isRendered) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) =>
          displayedItems.length === 0 ? 0 : (prev + 1) % displayedItems.length
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) =>
          displayedItems.length === 0
            ? 0
            : (prev - 1 + displayedItems.length) % displayedItems.length
        );
      } else if (e.key === "Enter") {
        if (displayedItems[activeIndex]) {
          e.preventDefault();
          handleSelectItem(displayedItems[activeIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRendered, displayedItems, activeIndex, handleClose]);

  // Item selection handler
  const handleSelectItem = (item) => {
    const existingFiltered = recentSearches.filter((r) => r.id !== item.id);
    saveRecent([item, ...existingFiltered].slice(0, 10));

    handleClose();

    if (item.route) {
      navigate(item.route);
    }
  };

  const handleToggleFavorite = (e, itemId) => {
    e.stopPropagation();
    if (favorites.includes(itemId)) {
      saveFavorites(favorites.filter((id) => id !== itemId));
    } else {
      saveFavorites([...favorites, itemId]);
    }
  };

  const handleRemoveRecent = (e, itemId) => {
    e.stopPropagation();
    saveRecent(recentSearches.filter((item) => item.id !== itemId));
  };

  const handleClearAllRecent = (e) => {
    e.stopPropagation();
    saveRecent([]);
  };

  if (!isRendered) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-16 md:pt-20 px-3 sm:px-4 bg-black/40 transition-opacity duration-200 ease-out select-none ${
        isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
    >
      {/* Modal Dialog Card - Spacious tall height matching reference */}
      <div
        className={`relative w-full max-w-2xl h-[75vh] min-h-[460px] sm:min-h-[540px] md:min-h-[580px] max-h-[700px] bg-base-100 text-base-content rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.22)] border border-base-300 overflow-hidden flex flex-col transition-all duration-200 ease-out transform ${
          isVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-[0.96] -translate-y-2"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Input Bar with Search Icon & Dynamic Badge */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-base-200 bg-base-100 shrink-0">
          <Search className="w-5 h-5 text-base-content/40 shrink-0" />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Type to search..."
            className="flex-1 bg-transparent text-base sm:text-lg text-base-content placeholder:text-base-content/40 font-normal focus:outline-none min-w-0"
            aria-label="Type to search application"
          />

          {/* Quick Clear Button */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full hover:bg-base-200 text-base-content/40 hover:text-base-content transition-colors cursor-pointer shrink-0"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Dynamic Results Counter Badge matching Image 1 */}
          <div className="px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium bg-base-200/80 text-base-content/70 border border-base-300/60 shrink-0 select-none">
            {displayedItems.length} {displayedItems.length === 1 ? "result" : "results"}
          </div>
        </div>

        {/* Modal Body - Stretches to fill tall modal height */}
        <div className="p-3 sm:p-5 flex-1 flex flex-col gap-2 min-h-0 overflow-hidden">
          {/* Subheading: RECENT SEARCHES or SEARCH RESULTS */}
          <div className="flex items-center justify-between px-2 pt-1 pb-1 select-none shrink-0">
            <div className="flex items-center gap-1.5 text-base-content/40 text-[11px] font-bold tracking-wider uppercase">
              <RotateCcw className="w-3.5 h-3.5 text-base-content/40" />
              <span>{query.trim() ? "Search Results" : "Recent Searches"}</span>
            </div>

            {!query.trim() && recentSearches.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllRecent}
                className="text-[11px] font-semibold text-base-content/40 hover:text-error transition-colors cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Results List - Fills tall modal space and scrolls smoothly */}
          <div
            ref={listRef}
            className="flex-1 flex flex-col gap-1.5 overflow-y-auto overflow-x-hidden scrollbar-thin pr-0.5"
          >
            {displayedItems.length === 0 ? (
              <div className="py-16 px-4 text-center flex flex-col items-center justify-center text-base-content/50 my-auto">
                <Search className="w-10 h-10 text-base-content/25 mb-3" />
                <p className="text-sm font-semibold text-base-content/70">
                  No matching results for "{query}"
                </p>
                <p className="text-xs text-base-content/40 mt-1 max-w-xs">
                  Try searching for "silk sarees", "lehengas", "billing", "stock", or "khata".
                </p>
              </div>
            ) : (
              displayedItems.map((item, idx) => {
                const isSelected = idx === activeIndex;
                const isFav = favorites.includes(item.id);

                return (
                  <div
                    key={item.id}
                    data-index={idx}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => handleSelectItem(item)}
                    className={`group relative rounded-xl sm:rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 transition-all duration-150 cursor-pointer select-none ${
                      isSelected
                        ? "bg-neutral text-neutral-content shadow-lg shadow-neutral/20 ring-1 ring-neutral-content/15"
                        : "hover:bg-base-200 text-base-content"
                    }`}
                  >
                    {/* Left: 3-Node Icon & Title / Category */}
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="w-6 h-6 flex items-center justify-center shrink-0">
                        <EmeraldNodeIcon className="w-5 h-5 text-primary shrink-0" />
                      </div>

                      <div className="flex flex-col min-w-0 flex-1">
                        {item.category ? (
                          <span
                            className={`text-[11px] font-medium leading-tight truncate transition-colors ${
                              isSelected ? "text-neutral-content/75" : "text-base-content/50"
                            }`}
                          >
                            {item.category}
                          </span>
                        ) : null}
                        <span
                          className={`text-sm sm:text-base font-semibold leading-tight truncate transition-colors ${
                            isSelected ? "text-neutral-content font-bold" : "text-base-content"
                          }`}
                        >
                          {item.title}
                        </span>
                      </div>
                    </div>

                    {/* Right: Monospace Route Path & Action Icons */}
                    <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
                      {item.path && (
                        <span
                          className={`font-mono text-xs hidden sm:inline-block max-w-[150px] md:max-w-[240px] truncate transition-colors ${
                            isSelected ? "text-neutral-content/65" : "text-base-content/40"
                          }`}
                        >
                          {item.path}
                        </span>
                      )}

                      {/* Favorite Button (Heart) */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleFavorite(e, item.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isSelected
                            ? "text-neutral-content/60 hover:text-rose-400 hover:bg-neutral-content/10"
                            : "text-base-content/40 hover:text-rose-500 hover:bg-base-300"
                        }`}
                        title={isFav ? "Remove favorite" : "Add to favorites"}
                        aria-label="Favorite"
                      >
                        <Heart
                          className={`w-4 h-4 transition-all ${
                            isFav ? "fill-rose-500 text-rose-500 scale-110" : ""
                          }`}
                        />
                      </button>

                      {/* Remove from Recent Searches (X) */}
                      {!query.trim() && (
                        <button
                          type="button"
                          onClick={(e) => handleRemoveRecent(e, item.id)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isSelected
                              ? "text-neutral-content/60 hover:text-neutral-content hover:bg-neutral-content/10"
                              : "text-base-content/40 hover:text-base-content hover:bg-base-300"
                          }`}
                          title="Remove from recent"
                          aria-label="Remove"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer with Professional Keyboard Hints */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-t border-base-200 bg-base-200/50 flex items-center justify-between text-xs text-base-content/60">
          <div className="hidden sm:flex items-center gap-3 font-medium">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-base-100 border border-base-300 font-mono text-[10px] text-base-content">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-base-100 border border-base-300 font-mono text-[10px] text-base-content">
                ↓
              </kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-base-100 border border-base-300 font-mono text-[10px] text-base-content">
                ↵
              </kbd>
              <span>to select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-base-100 border border-base-300 font-mono text-[10px] text-base-content">
                esc
              </kbd>
              <span>to close</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 ml-auto text-[11px] font-semibold text-base-content/60">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Pooja OmniSearch</span>
          </div>
        </div>
      </div>
    </div>
  );

}
