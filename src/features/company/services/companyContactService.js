import api from "../../../config/api.js";

/**
 * Company Contact API Service
 * Handles communication with backend /company-contacts routes.
 */

/**
 * List company contacts with pagination, filtering, and search
 * @param {Object} params - { page, limit, companyId, contactType, isPrimary, isActive, search, sortBy, sortOrder }
 */
export const getCompanyContacts = async (params = {}) => {
  const response = await api.get("/company-contacts", { params });
  return response.data;
};

/**
 * Get company contact by ID
 * @param {number|string} id
 */
export const getCompanyContactById = async (id) => {
  const response = await api.get(`/company-contacts/${id}`);
  return response.data;
};

/**
 * Get all contacts for a specific company
 * @param {number|string} companyId
 */
export const getContactsByCompanyId = async (companyId) => {
  const response = await api.get(`/company-contacts/company/${companyId}`);
  return response.data;
};

/**
 * Get primary contact for a specific company
 * @param {number|string} companyId
 */
export const getPrimaryContactByCompanyId = async (companyId) => {
  const response = await api.get(`/company-contacts/company/${companyId}/primary`);
  return response.data;
};

/**
 * Create a new company contact
 * @param {Object} contactData
 */
export const createCompanyContact = async (contactData) => {
  const response = await api.post("/company-contacts", contactData);
  return response.data;
};

/**
 * Update existing company contact
 * @param {number|string} id
 * @param {Object} contactData
 */
export const updateCompanyContact = async (id, contactData) => {
  const response = await api.put(`/company-contacts/${id}`, contactData);
  return response.data;
};

/**
 * Update company contact active status
 * @param {number|string} id
 * @param {boolean} isActive
 */
export const updateCompanyContactStatus = async (id, isActive) => {
  const response = await api.patch(`/company-contacts/${id}/status`, { is_active: isActive });
  return response.data;
};

/**
 * Set a contact as primary for its company
 * @param {number|string} id
 */
export const setPrimaryCompanyContact = async (id) => {
  const response = await api.patch(`/company-contacts/${id}/primary`);
  return response.data;
};

/**
 * Delete company contact by ID
 * @param {number|string} id
 */
export const deleteCompanyContact = async (id) => {
  const response = await api.delete(`/company-contacts/${id}`);
  return response.data;
};

export default {
  getCompanyContacts,
  getCompanyContactById,
  getContactsByCompanyId,
  getPrimaryContactByCompanyId,
  createCompanyContact,
  updateCompanyContact,
  updateCompanyContactStatus,
  setPrimaryCompanyContact,
  deleteCompanyContact,
};
