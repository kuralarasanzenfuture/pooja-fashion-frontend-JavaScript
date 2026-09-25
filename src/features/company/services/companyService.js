import api from "../../../config/api.js";

/**
 * Company API Service
 * Handles communication with backend /api/companies routes.
 */

/**
 * List companies with pagination, filtering, and search
 * @param {Object} params - { page, limit, search, status, sortBy, sortOrder }
 */
export const getCompanies = async (params = {}) => {
  const response = await api.get("/companies", { params });
  return response.data;
};

/**
 * Get company by ID
 * @param {number|string} id
 */
export const getCompanyById = async (id) => {
  const response = await api.get(`/companies/${id}`);
  return response.data;
};

/**
 * Get company by unique company code
 * @param {string} companyCode
 */
export const getCompanyByCode = async (companyCode) => {
  const response = await api.get(`/companies/code/${companyCode}`);
  return response.data;
};

/**
 * Create a new company
 * @param {Object} companyData
 */
export const createCompany = async (companyData) => {
  const response = await api.post("/companies", companyData);
  return response.data;
};

/**
 * Update existing company
 * @param {number|string} id
 * @param {Object} companyData
 */
export const updateCompany = async (id, companyData) => {
  const response = await api.put(`/companies/${id}`, companyData);
  return response.data;
};

/**
 * Update company status (active | inactive | suspended)
 * @param {number|string} id
 * @param {'active' | 'inactive' | 'suspended'} status
 */
export const updateCompanyStatus = async (id, status) => {
  const response = await api.patch(`/companies/${id}/status`, { status });
  return response.data;
};

/**
 * Delete company by ID
 * @param {number|string} id
 */
export const deleteCompany = async (id) => {
  const response = await api.delete(`/companies/${id}`);
  return response.data;
};

export default {
  getCompanies,
  getCompanyById,
  getCompanyByCode,
  createCompany,
  updateCompany,
  updateCompanyStatus,
  deleteCompany,
};
