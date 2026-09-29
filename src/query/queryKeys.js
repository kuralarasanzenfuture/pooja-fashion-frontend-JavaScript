export const queryKeys = {
  customers: {
    all: ["customers"],
    list: (params) => ["customers", "list", params],
    detail: (id) => ["customers", "detail", id],
  },

  products: {
    all: ["products"],
    list: (params) => ["products", "list", params],
    detail: (id) => ["products", "detail", id],
  },

  suppliers: {
    all: ["suppliers"],
    list: (params) => ["suppliers", "list", params],
    detail: (id) => ["suppliers", "detail", id],
  },

  sales: {
    all: ["sales"],
    list: (params) => ["sales", "list", params],
    detail: (id) => ["sales", "detail", id],
  },

  purchases: {
    all: ["purchases"],
    list: (params) => ["purchases", "list", params],
    detail: (id) => ["purchases", "detail", id],
  },

  stock: {
    all: ["stock"],
    list: (params) => ["stock", "list", params],
  },

  employees: {
    all: ["employees"],
    list: (params) => ["employees", "list", params],
  },

  companies: {
    all: ["companies"],
    list: (params) => ["companies", "list", params],
    detail: (id) => ["companies", "detail", id],
    byCode: (code) => ["companies", "byCode", code],
  },

  companyAddresses: {
    all: ["companyAddresses"],
    list: (params) => ["companyAddresses", "list", params],
    byCompany: (companyId) => ["companyAddresses", "byCompany", companyId],
    primary: (companyId) => ["companyAddresses", "primary", companyId],
    detail: (id) => ["companyAddresses", "detail", id],
  },

  companyContacts: {
    all: ["companyContacts"],
    list: (params) => ["companyContacts", "list", params],
    byCompany: (companyId) => ["companyContacts", "byCompany", companyId],
    primary: (companyId) => ["companyContacts", "primary", companyId],
    detail: (id) => ["companyContacts", "detail", id],
  },

  companyTaxDetails: {
    all: ["companyTaxDetails"],
    list: (params) => ["companyTaxDetails", "list", params],
    byCompany: (companyId) => ["companyTaxDetails", "byCompany", companyId],
    primary: (companyId) => ["companyTaxDetails", "primary", companyId],
    detail: (id) => ["companyTaxDetails", "detail", id],
  },

  banks: {
    all: ["banks"],
    list: (params) => ["banks", "list", params],
    detail: (id) => ["banks", "detail", id],
    byCode: (code) => ["banks", "byCode", code],
  },

  bankIdentifiers: {
    all: ["bankIdentifiers"],
    list: (params) => ["bankIdentifiers", "list", params],
    byBank: (bankId) => ["bankIdentifiers", "byBank", bankId],
    byValue: (value) => ["bankIdentifiers", "byValue", value],
    detail: (id) => ["bankIdentifiers", "detail", id],
  },

  companyBanks: {
    all: ["companyBanks"],
    list: (params) => ["companyBanks", "list", params],
    byCompany: (companyId) => ["companyBanks", "byCompany", companyId],
    primary: (companyId) => ["companyBanks", "primary", companyId],
    detail: (id) => ["companyBanks", "detail", id],
  },
};


