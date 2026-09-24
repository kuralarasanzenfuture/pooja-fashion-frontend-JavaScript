src/
│
├── app/
│   ├── App.jsx
│   ├── providers/
│   │   ├── AppProviders.jsx
│   │   ├── QueryProvider.jsx
│   │   └── ReduxProvider.jsx
│   │
│   └── config/
│       └── appConfig.js
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── common/
│   ├── components/
│   │   ├── Button.jsx
│   │   ├── DataTable.jsx
│   │   ├── Modal.jsx
│   │   ├── Pagination.jsx
│   │   ├── SearchInput.jsx
│   │   └── PageHeader.jsx
│   │
│   ├── layouts/
│   │   ├── MainLayout.jsx
│   │   ├── AuthLayout.jsx
│   │   └── DashboardLayout.jsx
│   │
│   └── utils/
│       ├── formatCurrency.js
│       ├── formatDate.js
│       └── validation.js
│
├── config/
│   ├── api.js
│   └── environment.js
│
├── constants/
│   ├── roles.js
│   ├── permissions.js
│   ├── status.js
│   └── routes.js
│
├── features/
│   │
│   ├── auth/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── authApi.js
│   │
│   ├── dashboard/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   │
│   ├── customers/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── CustomerList.jsx
│   │   │   ├── CustomerCreate.jsx
│   │   │   └── CustomerEdit.jsx
│   │   ├── services/
│   │   │   └── customerApi.js
│   │   ├── hooks/
│   │   └── schemas/
│   │
│   ├── products/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   │   └── productApi.js
│   │   └── hooks/
│   │
│   ├── billing/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   │   └── billingApi.js
│   │   └── hooks/
│   │
│   ├── purchases/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   │
│   ├── suppliers/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   │
│   ├── stock/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   │
│   ├── employees/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   │
│   ├── attendance/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   │
│   └── reports/
│       ├── components/
│       ├── pages/
│       └── services/
│
├── redux/
│   ├── store.js
│   │
│   ├── slices/
│   │   ├── authSlice.js
│   │   ├── uiSlice.js
│   │   ├── cartSlice.js
│   │   └── settingsSlice.js
│   │
│   └── selectors/
│       ├── authSelectors.js
│       └── uiSelectors.js
│
├── query/
│   ├── queryClient.js
│   └── queryKeys.js
│
├── routes/
│   ├── AppRoutes.jsx
│   ├── ProtectedRoute.jsx
│   └── PublicRoute.jsx
│
├── types/
│   ├── customer.js
│   ├── product.js
│   ├── sales.js
│   └── common.js
│
├── App.jsx
├── main.jsx
├── index.css
└── App.css