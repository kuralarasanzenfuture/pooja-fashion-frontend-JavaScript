import api from "../../../config/api.js";

/**
 * Company Bank Account API Service
 * Handles communication with backend /company-banks routes.
 */

/**
 * List company bank accounts with pagination, filtering, and search
 * @param {Object} params - { page, limit, company_id, bank_id, account_type, is_primary, is_active, search, sortBy, sortOrder }
 */
export const getCompanyBanks = async (params = {}) => {
  const response = await api.get("/company-banks", { params });
  return response.data;
};

/**
 * Get company bank account by ID
 * @param {number|string} id
 */
export const getCompanyBankById = async (id) => {
  const response = await api.get(`/company-banks/${id}`);
  return response.data;
};

/**
 * Get all bank accounts for a specific company
 * @param {number|string} companyId
 */
export const getBanksByCompanyId = async (companyId) => {
  const response = await api.get(`/company-banks/company/${companyId}`);
  return response.data;
};

/**
 * Get primary bank account for a specific company
 * @param {number|string} companyId
 */
export const getPrimaryBankByCompanyId = async (companyId) => {
  const response = await api.get(`/company-banks/company/${companyId}/primary`);
  return response.data;
};

/**
 * Create a new company bank account
 * @param {Object} bankData
 */
export const createCompanyBank = async (bankData) => {
  const response = await api.post("/company-banks", bankData);
  return response.data;
};

/**
 * Update existing company bank account
 * @param {number|string} id
 * @param {Object} bankData
 */
export const updateCompanyBank = async (id, bankData) => {
  const response = await api.put(`/company-banks/${id}`, bankData);
  return response.data;
};

/**
 * Update company bank account active status
 * @param {number|string} id
 * @param {boolean} isActive
 */
export const updateCompanyBankStatus = async (id, isActive) => {
  const response = await api.patch(`/company-banks/${id}/status`, { is_active: isActive });
  return response.data;
};

/**
 * Set a bank account as primary for its company
 * @param {number|string} id
 */
export const setPrimaryCompanyBank = async (id) => {
  const response = await api.patch(`/company-banks/${id}/primary`);
  return response.data;
};

/**
 * Delete company bank account by ID
 * @param {number|string} id
 */
export const deleteCompanyBank = async (id) => {
  const response = await api.delete(`/company-banks/${id}`);
  return response.data;
};

export default {
  getCompanyBanks,
  getCompanyBankById,
  getBanksByCompanyId,
  getPrimaryBankByCompanyId,
  createCompanyBank,
  updateCompanyBank,
  updateCompanyBankStatus,
  setPrimaryCompanyBank,
  deleteCompanyBank,
};
