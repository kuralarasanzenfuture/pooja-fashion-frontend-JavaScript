import api from "../../../../config/api.js";

/**
 * Size Group Master API Service
 * Communicates with backend /api/product-master/size-groups endpoints.
 */

const BASE_URL = "/product-master/size-groups";

/**
 * List size groups with pagination, search, status filter, and sorting
 * @param {Object} params - { page, limit, company_id, is_active, search, sortBy, sortOrder }
 */
export const getSizeGroups = async (params = {}) => {
  const response = await api.get(BASE_URL, { params });
  return response.data;
};

/**
 * List all size groups without pagination (for dropdowns / selectors)
 * @param {Object} params - { company_id, is_active, search, sortBy, sortOrder }
 */
export const getAllSizeGroups = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/all`, { params });
  return response.data;
};

/**
 * List size groups with their nested child sizes hierarchy
 * @param {Object} params - { company_id, is_active }
 */
export const getSizeGroupTree = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/tree`, { params });
  return response.data;
};

/**
 * Get size group aggregate statistics for company
 * @param {Object} params - { company_id }
 */
export const getSizeGroupStats = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/stats`, { params });
  return response.data;
};

/**
 * Get single size group by ID
 * @param {number|string} id
 */
export const getSizeGroupById = async (id) => {
  const response = await api.get(`${BASE_URL}/${id}`);
  return response.data;
};

/**
 * Get size group by company ID and size group code
 * @param {number|string} companyId
 * @param {string} sizeGroupCode
 */
export const getSizeGroupByCode = async (companyId, sizeGroupCode) => {
  const response = await api.get(`${BASE_URL}/code/${companyId}/${sizeGroupCode}`);
  return response.data;
};

/**
 * Get all size groups for a specific company
 * @param {number|string} companyId
 */
export const getSizeGroupsByCompanyId = async (companyId) => {
  const response = await api.get(`${BASE_URL}/company/${companyId}`);
  return response.data;
};

/**
 * Create a new size group
 * @param {Object} data - { company_id, size_group_code, size_group_name, description, is_active }
 */
export const createSizeGroup = async (data) => {
  const response = await api.post(BASE_URL, data);
  return response.data;
};

/**
 * Update an existing size group
 * @param {number|string} id
 * @param {Object} data - fields to update
 */
export const updateSizeGroup = async (id, data) => {
  const response = await api.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

/**
 * Update size group active status
 * @param {number|string} id
 * @param {boolean} isActive
 */
export const updateSizeGroupStatus = async (id, isActive) => {
  const response = await api.patch(`${BASE_URL}/${id}/status`, {
    is_active: Boolean(isActive),
  });
  return response.data;
};

/**
 * Seed standard default size groups (Men, Women, Kids, Infants, Footwear)
 * @param {Object} data - { company_id }
 */
export const seedDefaultSizeGroups = async (data = {}) => {
  const response = await api.post(`${BASE_URL}/seed-defaults`, data);
  return response.data;
};

/**
 * Check if a size group name already exists in the company
 * @param {Object} params - { name, company_id, excludeId }
 */
export const checkSizeGroupName = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/check-name`, { params });
  return response.data;
};

/**
 * Check if a size group code already exists in the company
 * @param {Object} params - { code, company_id, excludeId }
 */
export const checkSizeGroupCode = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/check-code`, { params });
  return response.data;
};

/**
 * Permanently delete size group by ID
 * @param {number|string} id
 */
export const deleteSizeGroup = async (id) => {
  const response = await api.delete(`${BASE_URL}/${id}`);
  return response.data;
};

export default {
  getSizeGroups,
  getAllSizeGroups,
  getSizeGroupTree,
  getSizeGroupStats,
  getSizeGroupById,
  getSizeGroupByCode,
  getSizeGroupsByCompanyId,
  createSizeGroup,
  updateSizeGroup,
  updateSizeGroupStatus,
  seedDefaultSizeGroups,
  checkSizeGroupName,
  checkSizeGroupCode,
  deleteSizeGroup,
};

