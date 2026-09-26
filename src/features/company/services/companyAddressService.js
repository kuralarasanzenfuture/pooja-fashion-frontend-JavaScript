import api from "../../../config/api.js";

/**
 * Company Address API Service
 * Handles communication with backend /api/company-addresses routes.
 */

/**
 * List company addresses with pagination, filtering, and search
 * @param {Object} params - { page, limit, companyId, addressType, isPrimary, isActive, search, sortBy, sortOrder }
 */
export const getCompanyAddresses = async (params = {}) => {
  const response = await api.get("/company-addresses", { params });
  return response.data;
};

/**
 * Get company address by ID
 * @param {number|string} id
 */
export const getCompanyAddressById = async (id) => {
  const response = await api.get(`/company-addresses/${id}`);
  return response.data;
};

/**
 * Get all addresses for a specific company
 * @param {number|string} companyId
 */
export const getAddressesByCompanyId = async (companyId) => {
  const response = await api.get(`/company-addresses/company/${companyId}`);
  return response.data;
};

/**
 * Get primary address for a specific company
 * @param {number|string} companyId
 */
export const getPrimaryAddressByCompanyId = async (companyId) => {
  const response = await api.get(`/company-addresses/company/${companyId}/primary`);
  return response.data;
};

/**
 * Create a new company address
 * @param {Object} addressData
 */
export const createCompanyAddress = async (addressData) => {
  const response = await api.post("/company-addresses", addressData);
  return response.data;
};

/**
 * Update existing company address
 * @param {number|string} id
 * @param {Object} addressData
 */
export const updateCompanyAddress = async (id, addressData) => {
  const response = await api.put(`/company-addresses/${id}`, addressData);
  return response.data;
};

/**
 * Update company address active status
 * @param {number|string} id
 * @param {boolean} isActive
 */
export const updateCompanyAddressStatus = async (id, isActive) => {
  const response = await api.patch(`/company-addresses/${id}/status`, { is_active: isActive });
  return response.data;
};

/**
 * Set an address as primary for its company
 * @param {number|string} id
 */
export const setPrimaryCompanyAddress = async (id) => {
  const response = await api.patch(`/company-addresses/${id}/primary`);
  return response.data;
};

/**
 * Delete company address by ID
 * @param {number|string} id
 */
export const deleteCompanyAddress = async (id) => {
  const response = await api.delete(`/company-addresses/${id}`);
  return response.data;
};

export default {
  getCompanyAddresses,
  getCompanyAddressById,
  getAddressesByCompanyId,
  getPrimaryAddressByCompanyId,
  createCompanyAddress,
  updateCompanyAddress,
  updateCompanyAddressStatus,
  setPrimaryCompanyAddress,
  deleteCompanyAddress,
};
