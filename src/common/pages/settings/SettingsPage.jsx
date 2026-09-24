import { useState } from "react";
import {
  Type,
  User,
  Store,
  ShieldCheck,
  Settings as SettingsIcon,
  Sparkles,
} from "lucide-react";
import PageHeader from "../../components/PageHeader.jsx";
import {
  FontSettings,
  ProfileSettings,
  StoreSettings,
  SecuritySettings,
} from "./components/index.js";

const TABS = [
  { id: "fonts", label: "Typography & Fonts", icon: Type, description: "Switch fonts & boutique style" },
  { id: "profile", label: "Profile & Account", icon: User, description: "Staff operator identity" },
  { id: "store", label: "Store & POS Branding", icon: Store, description: "Branch, GSTIN, receipt notes" },
  { id: "security", label: "Security & Sessions", icon: ShieldCheck, description: "Cookie auth & passwords" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("fonts");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Settings & Boutique Preferences"
        description="Configure realtime typography, dress shop identity, POS bill layout, and cookie-based authentication security."
      />

      {/* Main Settings Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[580px]">
        {/* Left Settings Sidebar Tabs */}
        <aside className="w-full md:w-72 bg-slate-50/80 border-b md:border-b-0 md:border-r border-slate-200/90 p-4 md:p-5 flex flex-col justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 px-3 mb-4 text-[#0f1c3f]">
              <SettingsIcon className="w-4 h-4 text-[#1e3a8a]" />
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
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-start gap-3 p-3 rounded-2xl text-left transition-all cursor-pointer ${
                      isActive
                        ? "bg-white text-[#0f1c3f] shadow-xs border border-slate-200/80 font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/60 font-semibold"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? "bg-[#0f1c3f] text-white shadow-xs"
                          : "bg-slate-200/60 text-slate-500"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold leading-tight">{tab.label}</div>
                      <div className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                        {tab.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Info Box in Sidebar */}
          <div className="mt-6 p-3.5 rounded-2xl bg-[#f0f4fc] border border-[#c7d2fe]/80 text-[#0f1c3f]">
            <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#1e3a8a]" />
              <span>Realtime Applied</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Font and typography preferences apply instantly across all dashboard modules, saree billing, and stock screens.
            </p>
          </div>
        </aside>

        {/* Right Active Tab Content Area */}
        <main className="flex-1 p-6 md:p-8 bg-white">
          {activeTab === "fonts" && <FontSettings />}
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "store" && <StoreSettings />}
          {activeTab === "security" && <SecuritySettings />}
        </main>
      </div>
    </div>
  );
}
