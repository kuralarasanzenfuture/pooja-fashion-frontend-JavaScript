import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/header/Header.jsx";
import Sidebar from "../components/sidebar/Sidebar.jsx";

export default function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen bg-base-100 text-base-content flex flex-col antialiased overflow-hidden transition-colors duration-200">
      {/* Top Modular Navigation Bar */}
      <Header
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
      />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden min-h-0 bg-base-100 transition-colors duration-200">
        {/* Full Hierarchical Collapsible Sidebar & Mobile Drawer */}
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Content Area - Full width responsive container */}
        <main className="flex-1 h-full overflow-y-auto min-h-0 w-full scrollbar-thin">
          <div className="w-full p-4 sm:p-6 lg:p-6 xl:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>

  );
}

