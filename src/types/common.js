/**
 * Common data shapes and constants for Pooja Fashion Shop frontend.
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} username
 * @property {string} email
 * @property {'ADMIN' | 'MANAGER' | 'STAFF'} role
 * @property {string} [storeName]
 */

/**
 * @typedef {Object} FabricProduct
 * @property {string} id
 * @property {string} code
 * @property {string} name
 * @property {string} category
 * @property {number} pricePerMetre
 * @property {number} currentStockMetres
 * @property {number} lowStockAlert
 * @property {string} unit
 */

/**
 * @typedef {Object} InvoiceItem
 * @property {string} productId
 * @property {string} name
 * @property {number} quantityMetres
 * @property {number} rate
 * @property {number} gstPercent
 * @property {number} total
 */

export const USER_ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  STAFF: "STAFF",
};

export const PAYMENT_MODES = {
  CASH: "CASH",
  UPI: "UPI",
  CARD: "CARD",
  KHATA_CREDIT: "KHATA_CREDIT",
};
