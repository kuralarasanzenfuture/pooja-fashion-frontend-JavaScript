import api from "../../../config/api.js";

/**
 * Company Tax Detail API Service
 * Handles communication with backend /company-tax-details routes.
 */

/**
 * List company tax details with pagination, filtering, and search
 * @param {Object} params - { page, limit, companyId, gstRegistrationType, isPrimary, isActive, search, sortBy, sortOrder }
 */
export const getCompanyTaxDetails = async (params = {}) => {
  const response = await api.get("/company-tax-details", { params });
  return response.data;
};

/**
 * Get company tax detail by ID
 * @param {number|string} id
 */
export const getCompanyTaxDetailById = async (id) => {
  const response = await api.get(`/company-tax-details/${id}`);
  return response.data;
};

/**
 * Get all tax details for a specific company
 * @param {number|string} companyId
 */
export const getTaxDetailsByCompanyId = async (companyId) => {
  const response = await api.get(`/company-tax-details/company/${companyId}`);
  return response.data;
};

/**
 * Get primary tax detail for a specific company
 * @param {number|string} companyId
 */
export const getPrimaryTaxDetailByCompanyId = async (companyId) => {
  const response = await api.get(`/company-tax-details/company/${companyId}/primary`);
  return response.data;
};

/**
 * Create a new company tax detail
 * @param {Object} taxData
 */
export const createCompanyTaxDetail = async (taxData) => {
  const response = await api.post("/company-tax-details", taxData);
  return response.data;
};

/**
 * Update existing company tax detail
 * @param {number|string} id
 * @param {Object} taxData
 */
export const updateCompanyTaxDetail = async (id, taxData) => {
  const response = await api.put(`/company-tax-details/${id}`, taxData);
  return response.data;
};

/**
 * Update company tax detail active status
 * @param {number|string} id
 * @param {boolean} isActive
 */
export const updateCompanyTaxDetailStatus = async (id, isActive) => {
  const response = await api.patch(`/company-tax-details/${id}/status`, { is_active: isActive });
  return response.data;
};

/**
 * Set a tax record as primary for its company
 * @param {number|string} id
 */
export const setPrimaryCompanyTaxDetail = async (id) => {
  const response = await api.patch(`/company-tax-details/${id}/primary`);
  return response.data;
};

/**
 * Delete company tax detail by ID
 * @param {number|string} id
 */
export const deleteCompanyTaxDetail = async (id) => {
  const response = await api.delete(`/company-tax-details/${id}`);
  return response.data;
};

export default {
  getCompanyTaxDetails,
  getCompanyTaxDetailById,
  getTaxDetailsByCompanyId,
  getPrimaryTaxDetailByCompanyId,
  createCompanyTaxDetail,
  updateCompanyTaxDetail,
  updateCompanyTaxDetailStatus,
  setPrimaryCompanyTaxDetail,
  deleteCompanyTaxDetail,
};
