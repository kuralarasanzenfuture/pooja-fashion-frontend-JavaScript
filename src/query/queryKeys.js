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
};
