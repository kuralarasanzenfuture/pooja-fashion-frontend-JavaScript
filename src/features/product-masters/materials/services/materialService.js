import api from "../../../../config/api.js";

/**
 * Material Master API Service
 * Communicates with backend /api/product-master/materials endpoints.
 */

const BASE_URL = "/product-master/materials";

/**
 * List materials with pagination, search, status filter, and sorting
 * @param {Object} params - { page, limit, company_id, is_active, search, sortBy, sortOrder }
 */
export const getMaterials = async (params = {}) => {
  const response = await api.get(BASE_URL, { params });
  return response.data;
};

/**
 * List all materials without pagination (for dropdowns / selectors)
 * @param {Object} params - { company_id, is_active, search, sortBy, sortOrder }
 */
export const getAllMaterials = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/all`, { params });
  return response.data;
};

/**
 * Get material aggregate statistics for company
 * @param {Object} params - { company_id }
 */
export const getMaterialStats = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/stats`, { params });
  return response.data;
};

/**
 * Check if a material name already exists in company scope
 * @param {Object} params - { name, company_id, exclude_id }
 */
export const checkMaterialNameExists = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/check-name`, { params });
  return response.data;
};

/**
 * Check if a material code already exists in company scope
 * @param {Object} params - { code, company_id, exclude_id }
 */
export const checkMaterialCodeExists = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/check-code`, { params });
  return response.data;
};

/**
 * Seed default standard materials for a company
 * @param {Object} payload - { company_id }
 */
export const seedDefaultMaterials = async (payload = {}) => {
  const response = await api.post(`${BASE_URL}/seed-defaults`, payload);
  return response.data;
};

/**
 * List all materials for a specific company
 * @param {number|string} companyId
 * @param {Object} params
 */
export const getMaterialsByCompanyId = async (companyId, params = {}) => {
  const response = await api.get(`${BASE_URL}/company/${companyId}`, { params });
  return response.data;
};

/**
 * Get single material by code
 * @param {string} materialCode
 * @param {number|string} [companyId]
 */
export const getMaterialByCode = async (materialCode, companyId = null) => {
  const url = companyId
    ? `${BASE_URL}/code/${companyId}/${encodeURIComponent(materialCode)}`
    : `${BASE_URL}/code/${encodeURIComponent(materialCode)}`;
  const response = await api.get(url);
  return response.data;
};

/**
 * Get single material by ID
 * @param {number|string} id
 */
export const getMaterialById = async (id) => {
  const response = await api.get(`${BASE_URL}/${id}`);
  return response.data;
};

/**
 * Create a new material
 * @param {Object} data - { company_id, material_code, material_name, description, is_active }
 */
export const createMaterial = async (data) => {
  const response = await api.post(BASE_URL, data);
  return response.data;
};

/**
 * Update an existing material
 * @param {number|string} id
 * @param {Object} data - { company_id, material_code, material_name, description, is_active }
 */
export const updateMaterial = async (id, data) => {
  const response = await api.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

/**
 * Update material active status
 * @param {number|string} id
 * @param {boolean} isActive
 */
export const updateMaterialStatus = async (id, isActive) => {
  const response = await api.patch(`${BASE_URL}/${id}/status`, { is_active: isActive });
  return response.data;
};

/**
 * Delete a material by ID
 * @param {number|string} id
 */
export const deleteMaterial = async (id) => {
  const response = await api.delete(`${BASE_URL}/${id}`);
  return response.data;
};

export default {
  getMaterials,
  getAllMaterials,
  getMaterialStats,
  checkMaterialNameExists,
  checkMaterialCodeExists,
  seedDefaultMaterials,
  getMaterialsByCompanyId,
  getMaterialByCode,
  getMaterialById,
  createMaterial,
  updateMaterial,
  updateMaterialStatus,
  deleteMaterial,
};
