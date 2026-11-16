import api from "../../../../config/api.js";

/**
 * Color Master API Service
 * Communicates with backend /api/product-master/colors endpoints.
 */

const BASE_URL = "/product-master/colors";

/**
 * List colors with pagination, search, status filter, and sorting
 * @param {Object} params - { page, limit, company_id, is_active, search, sortBy, sortOrder }
 */
export const getColors = async (params = {}) => {
  const response = await api.get(BASE_URL, { params });
  return response.data;
};

/**
 * List all colors without pagination (for dropdowns / selectors)
 * @param {Object} params - { company_id, is_active, search, sortBy, sortOrder }
 */
export const getAllColors = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/all`, { params });
  return response.data;
};

/**
 * Get color aggregate statistics for user company
 * @param {Object} params - { company_id }
 */
export const getColorStats = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/stats`, { params });
  return response.data;
};

/**
 * Bulk reorder display sequence of colors
 * @param {Object} payload - { items: [{ id, display_order }], company_id }
 */
export const reorderColors = async (payload) => {
  const response = await api.patch(`${BASE_URL}/reorder`, payload);
  return response.data;
};

/**
 * Check if a color name already exists in company scope
 * @param {Object} params - { name, company_id, exclude_id }
 */
export const checkColorNameExists = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/check-name`, { params });
  return response.data;
};

/**
 * Check if a color code already exists in company scope
 * @param {Object} params - { code, company_id, exclude_id }
 */
export const checkColorCodeExists = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/check-code`, { params });
  return response.data;
};

/**
 * Seed default standard colors for a company
 * @param {Object} payload - { company_id }
 */
export const seedDefaultColors = async (payload = {}) => {
  const response = await api.post(`${BASE_URL}/seed-defaults`, payload);
  return response.data;
};

/**
 * List all colors for a company
 * @param {number|string} companyId
 * @param {Object} params
 */
export const getColorsByCompanyId = async (companyId, params = {}) => {
  const response = await api.get(`${BASE_URL}/company/${companyId}`, { params });
  return response.data;
};

/**
 * Get single color by color code in scope or company
 * @param {string} colorCode
 * @param {number|string} [companyId]
 */
export const getColorByCode = async (colorCode, companyId = null) => {
  const url = companyId
    ? `${BASE_URL}/code/${companyId}/${encodeURIComponent(colorCode)}`
    : `${BASE_URL}/code/${encodeURIComponent(colorCode)}`;
  const response = await api.get(url);
  return response.data;
};

/**
 * Get single color by ID
 * @param {number|string} id
 */
export const getColorById = async (id) => {
  const response = await api.get(`${BASE_URL}/${id}`);
  return response.data;
};

/**
 * Create a new color
 * @param {Object} data - { company_id, color_code, color_name, hex_code, description, display_order, is_active }
 */
export const createColor = async (data) => {
  const response = await api.post(BASE_URL, data);
  return response.data;
};

/**
 * Update an existing color
 * @param {number|string} id
 * @param {Object} data - { company_id, color_code, color_name, hex_code, description, display_order, is_active }
 */
export const updateColor = async (id, data) => {
  const response = await api.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

/**
 * Update color active status
 * @param {number|string} id
 * @param {boolean} isActive
 */
export const updateColorStatus = async (id, isActive) => {
  const response = await api.patch(`${BASE_URL}/${id}/status`, {
    is_active: Boolean(isActive),
  });
  return response.data;
};

/**
 * Delete a color
 * @param {number|string} id
 */
export const deleteColor = async (id) => {
  const response = await api.delete(`${BASE_URL}/${id}`);
  return response.data;
};

export default {
  getColors,
  getAllColors,
  getColorStats,
  reorderColors,
  checkColorNameExists,
  checkColorCodeExists,
  seedDefaultColors,
  getColorsByCompanyId,
  getColorByCode,
  getColorById,
  createColor,
  updateColor,
  updateColorStatus,
  deleteColor,
};
