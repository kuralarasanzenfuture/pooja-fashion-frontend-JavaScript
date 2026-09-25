import { Route, Routes } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage.jsx";
import DashboardPage from "../features/dashboard/pages/DashboardPage.jsx";
import DashboardLayout from "../common/layouts/DashboardLayout.jsx";
import ModulePlaceholder from "../common/components/ModulePlaceholder.jsx";
import SettingsPage from "../common/pages/settings/SettingsPage.jsx";
import CompanyPage from "../features/company/pages/CompanyPage.jsx";
import CompanyViewPage from "../features/company/pages/CompanyViewPage.jsx";
import NotFoundPage from "../common/pages/404/NotFoundPage.jsx";
import Error500Page from "../common/pages/500/Error500Page.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";
import { ROUTES } from "../constants/routes.js";


export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes (Accessible only when NOT logged in) */}
      <Route element={<PublicRoute />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      </Route>

      {/* Protected Routes (Requires authentication) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route
            path={ROUTES.CUSTOMERS}
            element={
              <ModulePlaceholder
                title="Customer Directory & Khata"
                description="Manage retail customers, wholesale boutiques, and ledger balances."
                moduleName="Customer"
              />
            }
          />
          <Route
            path={ROUTES.PRODUCTS}
            element={
              <ModulePlaceholder
                title="Fabrics & Sarees Catalog"
                description="Catalogue sarees, silk rolls, shirting, suiting, and readymade apparel."
                moduleName="Product"
              />
            }
          />
          <Route
            path={ROUTES.BILLING}
            element={
              <ModulePlaceholder
                title="Point of Sale & Invoicing"
                description="Create GST invoices, metre calculations, discounts, and print bills."
                moduleName="Invoice"
              />
            }
          />
          <Route
            path={ROUTES.STOCK}
            element={
              <ModulePlaceholder
                title="Fabric Bolts & Thaan Inventory"
                description="Track fabric bolts, metre balances, shrinkage, and warehouse storage."
                moduleName="Bolt / Stock"
              />
            }
          />
          <Route
            path={ROUTES.PURCHASES}
            element={
              <ModulePlaceholder
                title="Purchases & Weaver Inward"
                description="Record mill and weaver purchase orders, freight, and invoices."
                moduleName="Purchase"
              />
            }
          />
          <Route
            path={ROUTES.SUPPLIERS}
            element={
              <ModulePlaceholder
                title="Mills & Weaver Suppliers"
                description="Manage master weavers, textile mills, agents, and payables."
                moduleName="Supplier"
              />
            }
          />
          <Route
            path={ROUTES.EMPLOYEES}
            element={
              <ModulePlaceholder
                title="Shop Staff & Sales Associates"
                description="Manage store employees, sales commission rates, and shifts."
                moduleName="Employee"
              />
            }
          />
          <Route
            path={ROUTES.ATTENDANCE}
            element={
              <ModulePlaceholder
                title="Staff Daily Attendance"
                description="Track store staff attendance, clock-in, leaves, and payroll."
                moduleName="Attendance Record"
              />
            }
          />
          <Route
            path={ROUTES.REPORTS}
            element={
              <ModulePlaceholder
                title="Sales & GST Reports"
                description="Export GSTR-1 summaries, profit margins, and daily cash balances."
                moduleName="Report"
              />
            }
          />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
          <Route path={ROUTES.COMPANY} element={<CompanyPage />} />
          <Route path="/company/profile" element={<CompanyViewPage isProfileMode={true} />} />
          <Route path="/company/view/:id" element={<CompanyViewPage />} />
          <Route path="/company/:id" element={<CompanyViewPage />} />
        </Route>
      </Route>


      {/* Error routes */}
      <Route path="/500" element={<Error500Page />} />

      {/* Fallback wildcard */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
