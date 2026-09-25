import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Type,
  User,
  Store,
  ShieldCheck,
  Settings as SettingsIcon,
  Palette,
  Sparkles,
} from "lucide-react";
import PageHeader from "../../components/PageHeader.jsx";
import {
  FontSettings,
  ThemeSettings,
  ProfileSettings,
  StoreSettings,
  SecuritySettings,
} from "./components/index.js";

const TABS = [
  { id: "themes", label: "DaisyUI Themes", icon: Palette, description: "All 29 curated theme palettes" },
  { id: "fonts", label: "Typeset & Typography", icon: Type, description: "shadcn typeset studio & font rhythm" },
  { id: "profile", label: "Profile & Account", icon: User, description: "Staff operator identity" },
  { id: "store", label: "Store & POS Branding", icon: Store, description: "Branch, GSTIN, receipt notes" },
  { id: "security", label: "Security & Sessions", icon: ShieldCheck, description: "Cookie auth & passwords" },
];

const TAB_ALIASES = {
  general: "store",
  pos: "store",
  invoice: "store",
  tax: "store",
  payment: "store",
  currency: "store",
  datetime: "store",
  receipt: "store",
  printer: "store",
  notif: "store",
  system: "fonts",
  typeset: "fonts",
  typography: "fonts",
  password: "security",
  sessions: "security",
  account: "profile",
};

export default function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get("tab");

  const resolveTab = (tab) => {
    if (!tab) return "fonts";
    const directMatch = TABS.find((t) => t.id === tab);
    if (directMatch) return directMatch.id;
    return TAB_ALIASES[tab] || "fonts";
  };

  const [activeTab, setActiveTab] = useState(() => resolveTab(urlTab));

  useEffect(() => {
    if (urlTab) {
      const resolved = resolveTab(urlTab);
      if (resolved !== activeTab) {
        setActiveTab(resolved);
      }
    }
  }, [urlTab]);

  const handleTabChange = (newTabId) => {
    setActiveTab(newTabId);
    setSearchParams({ tab: newTabId });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Settings & Boutique Preferences"
        description="Configure realtime typography, dress shop identity, POS bill layout, and cookie-based authentication security."
      />

      {/* Main Settings Card */}
      <div className="bg-base-100 rounded-3xl border border-base-300 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[580px] text-base-content">
        {/* Left Settings Sidebar Tabs */}
        <aside className="w-full md:w-72 bg-base-200/50 border-b md:border-b-0 md:border-r border-base-300 p-4 md:p-5 flex flex-col justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 px-3 mb-4 text-base-content">
              <SettingsIcon className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Settings Menu
              </span>
            </div>

            <nav className="space-y-1.5">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full flex items-start gap-3 p-3 rounded-2xl text-left transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary text-primary-content shadow-sm shadow-primary/25 font-bold"
                        : "text-base-content/70 hover:text-base-content hover:bg-base-200 font-semibold"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? "bg-primary-content/20 text-primary-content shadow-xs"
                          : "bg-base-300/80 text-base-content/60"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold leading-tight">{tab.label}</div>
                      <div
                        className={`text-[11px] font-medium truncate mt-0.5 ${
                          isActive ? "text-primary-content/80" : "text-base-content/50"
                        }`}
                      >
                        {tab.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Info Box in Sidebar */}
          <div className="mt-6 p-3.5 rounded-2xl bg-base-200 border border-base-300 text-base-content">
            <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Realtime Applied</span>
            </div>
            <p className="text-[11px] text-base-content/60 leading-relaxed">
              Font and typography preferences apply instantly across all dashboard modules, saree billing, and stock screens.
            </p>
          </div>
        </aside>

        {/* Right Active Tab Content Area */}
        <main className="flex-1 p-6 md:p-8 bg-base-100 min-w-0">
          {activeTab === "themes" && <ThemeSettings />}
          {activeTab === "fonts" && <FontSettings />}
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "store" && <StoreSettings />}
          {activeTab === "security" && <SecuritySettings />}
        </main>
      </div>
    </div>
  );
}
