import api from "../../../../config/api.js";

/**
 * Size Master API Service
 * Communicates with backend /api/product-master/sizes endpoints.
 */

const BASE_URL = "/product-master/sizes";

/**
 * List sizes with pagination, search, status filter, size group filter, and sorting
 * @param {Object} params - { page, limit, company_id, size_group_id, is_active, search, sortBy, sortOrder }
 */
export const getSizes = async (params = {}) => {
  const response = await api.get(BASE_URL, { params });
  return response.data;
};

/**
 * List all sizes without pagination (for dropdowns / selectors)
 * @param {Object} params - { company_id, size_group_id, is_active, search, sortBy, sortOrder }
 */
export const getAllSizes = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/all`, { params });
  return response.data;
};

/**
 * Get size aggregate statistics for company & optional size group
 * @param {Object} params - { company_id, size_group_id }
 */
export const getSizeStats = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/stats`, { params });
  return response.data;
};

/**
 * Bulk reorder display sequence of sizes
 * @param {Object} payload - { items: [{ id, display_order }], company_id, size_group_id }
 */
export const reorderSizes = async (payload) => {
  const response = await api.patch(`${BASE_URL}/reorder`, payload);
  return response.data;
};

/**
 * Check if a size name already exists
 * @param {Object} params - { name, size_group_id, company_id, exclude_id }
 */
export const checkSizeNameExists = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/check-name`, { params });
  return response.data;
};

/**
 * Check if a size code already exists
 * @param {Object} params - { code, size_group_id, company_id, exclude_id }
 */
export const checkSizeCodeExists = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/check-code`, { params });
  return response.data;
};

/**
 * Seed default sizes for a parent size group
 * @param {Object} payload - { size_group_id, company_id }
 */
export const seedDefaultSizes = async (payload) => {
  const response = await api.post(`${BASE_URL}/seed-defaults`, payload);
  return response.data;
};

/**
 * List all sizes for a company
 * @param {number|string} companyId
 * @param {Object} params
 */
export const getSizesByCompanyId = async (companyId, params = {}) => {
  const response = await api.get(`${BASE_URL}/company/${companyId}`, { params });
  return response.data;
};

/**
 * List all sizes for a parent size group
 * @param {number|string} sizeGroupId
 * @param {Object} params
 */
export const getSizesBySizeGroupId = async (sizeGroupId, params = {}) => {
  const response = await api.get(`${BASE_URL}/size-group/${sizeGroupId}`, { params });
  return response.data;
};

/**
 * Get single size by size group ID and size code
 * @param {number|string} sizeGroupId
 * @param {string} sizeCode
 */
export const getSizeByCode = async (sizeGroupId, sizeCode) => {
  const response = await api.get(
    `${BASE_URL}/code/${sizeGroupId}/${encodeURIComponent(sizeCode)}`
  );
  return response.data;
};

/**
 * Get single size by ID
 * @param {number|string} id
 */
export const getSizeById = async (id) => {
  const response = await api.get(`${BASE_URL}/${id}`);
  return response.data;
};

/**
 * Create a new size
 * @param {Object} data - { company_id, size_group_id, size_code, size_name, display_order, is_active }
 */
export const createSize = async (data) => {
  const response = await api.post(BASE_URL, data);
  return response.data;
};

/**
 * Update an existing size
 * @param {number|string} id
 * @param {Object} data - { company_id, size_group_id, size_code, size_name, display_order, is_active }
 */
export const updateSize = async (id, data) => {
  const response = await api.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

/**
 * Update size active status
 * @param {number|string} id
 * @param {boolean} isActive
 */
export const updateSizeStatus = async (id, isActive) => {
  const response = await api.patch(`${BASE_URL}/${id}/status`, {
    is_active: Boolean(isActive),
  });
  return response.data;
};

/**
 * Delete a size
 * @param {number|string} id
 */
export const deleteSize = async (id) => {
  const response = await api.delete(`${BASE_URL}/${id}`);
  return response.data;
};

export default {
  getSizes,
  getAllSizes,
  getSizeStats,
  reorderSizes,
  checkSizeNameExists,
  checkSizeCodeExists,
  seedDefaultSizes,
  getSizesByCompanyId,
  getSizesBySizeGroupId,
  getSizeByCode,
  getSizeById,
  createSize,
  updateSize,
  updateSizeStatus,
  deleteSize,
};

