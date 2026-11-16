import api from "../../../../config/api.js";

/**
 * Unit Master API Service
 * Communicates with backend /api/product-master/units endpoints.
 */

const BASE_URL = "/product-master/units";

/**
 * List units with pagination, search, status filter, and sorting
 * @param {Object} params - { page, limit, company_id, is_active, search, sortBy, sortOrder }
 */
export const getUnits = async (params = {}) => {
  const response = await api.get(BASE_URL, { params });
  return response.data;
};

/**
 * List all units without pagination (for dropdowns / selectors)
 * @param {Object} params - { company_id, is_active, search, sortBy, sortOrder }
 */
export const getAllUnits = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/all`, { params });
  return response.data;
};

/**
 * Get unit aggregate statistics for company
 * @param {Object} params - { company_id }
 */
export const getUnitStats = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/stats`, { params });
  return response.data;
};

/**
 * Check if a unit name already exists in company scope
 * @param {Object} params - { name, company_id, exclude_id }
 */
export const checkUnitNameExists = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/check-name`, { params });
  return response.data;
};

/**
 * Check if a unit code already exists in company scope
 * @param {Object} params - { code, company_id, exclude_id }
 */
export const checkUnitCodeExists = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/check-code`, { params });
  return response.data;
};

/**
 * Seed default standard units for a company
 * @param {Object} payload - { company_id }
 */
export const seedDefaultUnits = async (payload = {}) => {
  const response = await api.post(`${BASE_URL}/seed-defaults`, payload);
  return response.data;
};

/**
 * List all units for a specific company
 * @param {number|string} companyId
 * @param {Object} params
 */
export const getUnitsByCompanyId = async (companyId, params = {}) => {
  const response = await api.get(`${BASE_URL}/company/${companyId}`, { params });
  return response.data;
};

/**
 * Get single unit by code
 * @param {string} unitCode
 * @param {number|string} [companyId]
 */
export const getUnitByCode = async (unitCode, companyId = null) => {
  const url = companyId
    ? `${BASE_URL}/code/${companyId}/${encodeURIComponent(unitCode)}`
    : `${BASE_URL}/code/${encodeURIComponent(unitCode)}`;
  const response = await api.get(url);
  return response.data;
};

/**
 * Get single unit by ID
 * @param {number|string} id
 */
export const getUnitById = async (id) => {
  const response = await api.get(`${BASE_URL}/${id}`);
  return response.data;
};

/**
 * Create a new unit
 * @param {Object} data - { company_id, unit_code, unit_name, decimal_places, is_active }
 */
export const createUnit = async (data) => {
  const response = await api.post(BASE_URL, data);
  return response.data;
};

/**
 * Update an existing unit
 * @param {number|string} id
 * @param {Object} data - { company_id, unit_code, unit_name, decimal_places, is_active }
 */
export const updateUnit = async (id, data) => {
  const response = await api.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

/**
 * Update unit active status
 * @param {number|string} id
 * @param {boolean} isActive
 */
export const updateUnitStatus = async (id, isActive) => {
  const response = await api.patch(`${BASE_URL}/${id}/status`, { is_active: isActive });
  return response.data;
};

/**
 * Delete a unit by ID
 * @param {number|string} id
 */
export const deleteUnit = async (id) => {
  const response = await api.delete(`${BASE_URL}/${id}`);
  return response.data;
};

export default {
  getUnits,
  getAllUnits,
  getUnitStats,
  checkUnitNameExists,
  checkUnitCodeExists,
  seedDefaultUnits,
  getUnitsByCompanyId,
  getUnitByCode,
  getUnitById,
  createUnit,
  updateUnit,
  updateUnitStatus,
  deleteUnit,
};
