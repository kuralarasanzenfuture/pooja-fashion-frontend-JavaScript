import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/header/Header.jsx";
import Sidebar from "../components/sidebar/Sidebar.jsx";

export default function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen bg-[#faf8f5] text-slate-800 flex flex-col antialiased overflow-hidden">
      {/* Top Modular Navigation Bar */}
      <Header
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
      />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Full Hierarchical Collapsible Sidebar & Mobile Drawer */}
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 h-full overflow-y-auto min-h-0 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>

  );
}

