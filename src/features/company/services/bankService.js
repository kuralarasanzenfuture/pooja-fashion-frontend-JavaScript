import api from "../../../config/api.js";

/**
 * Bank Master & Identifiers API Service
 * Handles communication with backend /banks and /bank-identifiers routes.
 */

// ==========================================
// 1. BANK MASTER ENDPOINTS (/banks)
// ==========================================

/**
 * List banks from master directory with pagination, filtering, and search
 * @param {Object} params - { page, limit, bank_type, is_active, is_verified, search, sortBy, sortOrder }
 */
export const getBanks = async (params = {}) => {
  const response = await api.get("/banks", { params });
  return response.data;
};

/**
 * Get bank master record by ID
 * @param {number|string} id
 */
export const getBankById = async (id) => {
  const response = await api.get(`/banks/${id}`);
  return response.data;
};

/**
 * Get bank master record by bank code (e.g. HDFC, SBI, ICICI)
 * @param {string} bankCode
 */
export const getBankByCode = async (bankCode) => {
  const response = await api.get(`/banks/code/${bankCode}`);
  return response.data;
};

/**
 * Create a new bank master record
 * @param {Object} data
 */
export const createBank = async (data) => {
  const response = await api.post("/banks", data);
  return response.data;
};

/**
 * Update a bank master record (PUT)
 * @param {number|string} id
 * @param {Object} data
 */
export const updateBank = async (id, data) => {
  const response = await api.put(`/banks/${id}`, data);
  return response.data;
};

/**
 * Partial update a bank master record (PATCH)
 * @param {number|string} id
 * @param {Object} data
 */
export const patchBank = async (id, data) => {
  const response = await api.patch(`/banks/${id}`, data);
  return response.data;
};

/**
 * Delete a bank master record
 * @param {number|string} id
 */
export const deleteBank = async (id) => {
  const response = await api.delete(`/banks/${id}`);
  return response.data;
};

// ==========================================
// 2. BANK IDENTIFIERS ENDPOINTS (/bank-identifiers)
// ==========================================

/**
 * List bank branch identifiers (IFSC, MICR, SWIFT) with filters
 * @param {Object} params - { page, limit, bank_id, identifier_type, is_active, search, sortBy, sortOrder }
 */
export const getBankIdentifiers = async (params = {}) => {
  const response = await api.get("/bank-identifiers", { params });
  return response.data;
};

/**
 * Get bank branch identifier by ID
 * @param {number|string} id
 */
export const getBankIdentifierById = async (id) => {
  const response = await api.get(`/bank-identifiers/${id}`);
  return response.data;
};

/**
 * Get all identifiers belonging to a specific bank
 * @param {number|string} bankId
 */
export const getBankIdentifiersByBankId = async (bankId) => {
  const response = await api.get(`/bank-identifiers/bank/${bankId}`);
  return response.data;
};

/**
 * Lookup bank branch details by identifier code (e.g. IFSC code)
 * @param {string} identifierValue
 */
export const getBankIdentifierByValue = async (identifierValue) => {
  const response = await api.get(`/bank-identifiers/value/${identifierValue}`);
  return response.data;
};

/**
 * Create a new bank identifier
 * @param {Object} data
 */
export const createBankIdentifier = async (data) => {
  const response = await api.post("/bank-identifiers", data);
  return response.data;
};

/**
 * Update a bank identifier (PUT)
 * @param {number|string} id
 * @param {Object} data
 */
export const updateBankIdentifier = async (id, data) => {
  const response = await api.put(`/bank-identifiers/${id}`, data);
  return response.data;
};

/**
 * Partial update a bank identifier (PATCH)
 * @param {number|string} id
 * @param {Object} data
 */
export const patchBankIdentifier = async (id, data) => {
  const response = await api.patch(`/bank-identifiers/${id}`, data);
  return response.data;
};

/**
 * Delete a bank identifier
 * @param {number|string} id
 */
export const deleteBankIdentifier = async (id) => {
  const response = await api.delete(`/bank-identifiers/${id}`);
  return response.data;
};

export default {
  getBanks,
  getBankById,
  getBankByCode,
  createBank,
  updateBank,
  patchBank,
  deleteBank,
  getBankIdentifiers,
  getBankIdentifierById,
  getBankIdentifiersByBankId,
  getBankIdentifierByValue,
  createBankIdentifier,
  updateBankIdentifier,
  patchBankIdentifier,
  deleteBankIdentifier,
};
