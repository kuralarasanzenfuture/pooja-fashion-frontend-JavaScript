import { Route, Routes } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage.jsx";
import DashboardPage from "../features/dashboard/pages/DashboardPage.jsx";
import DashboardLayout from "../common/layouts/DashboardLayout.jsx";
import ModulePlaceholder from "../common/components/ModulePlaceholder.jsx";
import SettingsPage from "../common/pages/settings/SettingsPage.jsx";
import CompanyPage from "../features/company/pages/CompanyPage.jsx";
import CompanyViewPage from "../features/company/pages/CompanyViewPage.jsx";
import BankMasterPage from "../features/bank-master/pages/BankMasterPage.jsx";
import CategoriesPage from "../features/product-masters/categories/pages/CategoriesPage.jsx";
import CategoryViewPage from "../features/product-masters/categories/pages/CategoryViewPage.jsx";
import {
  SubCategoriesPage,
  SubCategoryViewPage,
} from "../features/product-masters/sub-categories/index.js";
import {
  BrandsPage,
  BrandViewPage,
} from "../features/product-masters/brand/index.js";
import {
  SizeGroupsPage,
  SizeGroupViewPage,
} from "../features/product-masters/size_groups/index.js";
import {
  SizesPage,
  SizeViewPage,
} from "../features/product-masters/sizes/index.js";
import {
  ColorsPage,
  ColorViewPage,
} from "../features/product-masters/colors/index.js";
import {
  MaterialsPage,
  MaterialViewPage,
} from "../features/product-masters/materials/index.js";
import {
  UnitsPage,
  UnitViewPage,
} from "../features/product-masters/units/index.js";
import {
  ProductTypesPage,
  ProductTypeViewPage,
} from "../features/product-masters/product-types/index.js";
import {
  TaxesPage,
  TaxViewPage,
} from "../features/product-masters/taxes/index.js";
import RolesPage from "../features/roles/pages/RolesPage.jsx";
import UsersPage from "../features/users/pages/UsersPage.jsx";
import UserViewPage from "../features/users/pages/UserViewPage.jsx";
import NotFoundPage from "../common/pages/404/NotFoundPage.jsx";
import Error500Page from "../common/pages/500/Error500Page.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import RoleProtectedRoute from "./RoleProtectedRoute.jsx";
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
          <Route path="/company/profile" element={<CompanyViewPage isProfileMode={true} initialTab="overview" />} />
          <Route path="/company/addresses" element={<CompanyViewPage isProfileMode={true} initialTab="addresses" />} />
          <Route path="/company/contacts" element={<CompanyViewPage isProfileMode={true} initialTab="contacts" />} />
          <Route path="/company/tax" element={<CompanyViewPage isProfileMode={true} initialTab="tax" />} />
          <Route path="/company/bank-accounts" element={<CompanyViewPage isProfileMode={true} initialTab="banks" />} />
          <Route path="/company/view/:id" element={<CompanyViewPage />} />
          <Route path="/company/:id" element={<CompanyViewPage />} />
          <Route path="/bank-master" element={<BankMasterPage />} />
          <Route path="/banks" element={<BankMasterPage />} />
          <Route path={ROUTES.CATEGORIES} element={<CategoriesPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path={ROUTES.CATEGORY_VIEW} element={<CategoryViewPage />} />
          <Route path="/categories/:id" element={<CategoryViewPage />} />
          <Route path={ROUTES.SUBCATEGORIES} element={<SubCategoriesPage />} />
          <Route path="/subcategories" element={<SubCategoriesPage />} />
          <Route path="/products/subcategories" element={<SubCategoriesPage />} />
          <Route path={ROUTES.SUBCATEGORY_VIEW} element={<SubCategoryViewPage />} />
          <Route path="/subcategories/:id" element={<SubCategoryViewPage />} />
          <Route path="/products/subcategories/:id" element={<SubCategoryViewPage />} />
          <Route path={ROUTES.BRANDS} element={<BrandsPage />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/products/brands" element={<BrandsPage />} />
          <Route path={ROUTES.BRAND_VIEW} element={<BrandViewPage />} />
          <Route path="/brands/:id" element={<BrandViewPage />} />
          <Route path="/products/brands/:id" element={<BrandViewPage />} />
          <Route path={ROUTES.SIZE_GROUPS} element={<SizeGroupsPage />} />
          <Route path="/size-groups" element={<SizeGroupsPage />} />
          <Route path="/products/size-groups" element={<SizeGroupsPage />} />
          <Route path="/products/size_groups" element={<SizeGroupsPage />} />
          <Route path={ROUTES.SIZE_GROUP_VIEW} element={<SizeGroupViewPage />} />
          <Route path="/size-groups/:id" element={<SizeGroupViewPage />} />
          <Route path="/products/size-groups/:id" element={<SizeGroupViewPage />} />
          <Route path="/products/size_groups/:id" element={<SizeGroupViewPage />} />
          <Route path={ROUTES.SIZES} element={<SizesPage />} />
          <Route path="/sizes" element={<SizesPage />} />
          <Route path="/products/sizes" element={<SizesPage />} />
          <Route path={ROUTES.SIZE_VIEW} element={<SizeViewPage />} />
          <Route path="/sizes/:id" element={<SizeViewPage />} />
          <Route path="/products/sizes/:id" element={<SizeViewPage />} />
          <Route path={ROUTES.COLORS} element={<ColorsPage />} />
          <Route path="/colors" element={<ColorsPage />} />
          <Route path="/products/colors" element={<ColorsPage />} />
          <Route path={ROUTES.COLOR_VIEW} element={<ColorViewPage />} />
          <Route path="/colors/:id" element={<ColorViewPage />} />
          <Route path="/products/colors/:id" element={<ColorViewPage />} />
          <Route path={ROUTES.MATERIALS} element={<MaterialsPage />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/products/materials" element={<MaterialsPage />} />
          <Route path={ROUTES.MATERIAL_VIEW} element={<MaterialViewPage />} />
          <Route path="/materials/:id" element={<MaterialViewPage />} />
          <Route path="/products/materials/:id" element={<MaterialViewPage />} />
          <Route path={ROUTES.UNITS} element={<UnitsPage />} />
          <Route path="/units" element={<UnitsPage />} />
          <Route path="/products/units" element={<UnitsPage />} />
          <Route path={ROUTES.UNIT_VIEW} element={<UnitViewPage />} />
          <Route path="/units/:id" element={<UnitViewPage />} />
          <Route path="/products/units/:id" element={<UnitViewPage />} />
          <Route path={ROUTES.PRODUCT_TYPES} element={<ProductTypesPage />} />
          <Route path="/products/types" element={<ProductTypesPage />} />
          <Route path="/products/product-types" element={<ProductTypesPage />} />
          <Route path="/product-types" element={<ProductTypesPage />} />
          <Route path={ROUTES.PRODUCT_TYPE_VIEW} element={<ProductTypeViewPage />} />
          <Route path="/products/types/:id" element={<ProductTypeViewPage />} />
          <Route path="/products/product-types/:id" element={<ProductTypeViewPage />} />
          <Route path="/product-types/:id" element={<ProductTypeViewPage />} />
          <Route path={ROUTES.TAXES} element={<TaxesPage />} />
          <Route path="/products/taxes" element={<TaxesPage />} />
          <Route path="/taxes" element={<TaxesPage />} />
          <Route path={ROUTES.TAX_VIEW} element={<TaxViewPage />} />
          <Route path="/products/taxes/:id" element={<TaxViewPage />} />
          <Route path="/taxes/:id" element={<TaxViewPage />} />

          {/* Users & Roles Management (Admin & SuperAdmin only) */}
          <Route element={<RoleProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN"]} />}>
            <Route path={ROUTES.USERS} element={<UsersPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:id" element={<UserViewPage />} />
            <Route path="/users/view/:id" element={<UserViewPage />} />
            <Route path={ROUTES.ROLES} element={<RolesPage />} />
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/users/roles" element={<RolesPage />} />
          </Route>
        </Route>
      </Route>


      {/* Error routes */}
      <Route path="/500" element={<Error500Page />} />

      {/* Fallback wildcard */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
