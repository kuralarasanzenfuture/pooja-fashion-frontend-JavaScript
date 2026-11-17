import api from "../../../../config/api.js";

/**
 * Product Type Master API Service
 * Communicates with backend /api/product-master/product-types endpoints.
 */

const BASE_URL = "/product-master/product-types";

/**
 * List product types with pagination, search, status/flag filters, and sorting
 * @param {Object} params - { page, limit, company_id, is_active, is_stock_item, is_saleable, is_purchasable, search, sortBy, sortOrder }
 */
export const getProductTypes = async (params = {}) => {
  const response = await api.get(BASE_URL, { params });
  return response.data;
};

/**
 * List all product types without pagination (for dropdowns / selectors)
 * @param {Object} params - { company_id, is_active, is_stock_item, is_saleable, is_purchasable, search, sortBy, sortOrder }
 */
export const getAllProductTypes = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/all`, { params });
  return response.data;
};

/**
 * Get product type aggregate statistics for company
 * @param {Object} params - { company_id }
 */
export const getProductTypeStats = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/stats`, { params });
  return response.data;
};

/**
 * Check if a product type name already exists in company scope
 * @param {Object} params - { name, company_id, exclude_id }
 */
export const checkProductTypeNameExists = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/check-name`, { params });
  return response.data;
};

/**
 * Check if a product type code already exists in company scope
 * @param {Object} params - { code, company_id, exclude_id }
 */
export const checkProductTypeCodeExists = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/check-code`, { params });
  return response.data;
};

/**
 * Seed default standard retail apparel product types for a company
 * @param {Object} payload - { company_id }
 */
export const seedDefaultProductTypes = async (payload = {}) => {
  const response = await api.post(`${BASE_URL}/seed-defaults`, payload);
  return response.data;
};

/**
 * List all product types for a specific company
 * @param {number|string} companyId
 * @param {Object} params - { is_active }
 */
export const getProductTypesByCompanyId = async (companyId, params = {}) => {
  const response = await api.get(`${BASE_URL}/company/${companyId}`, { params });
  return response.data;
};

/**
 * Get single product type by code
 * @param {string} typeCode
 * @param {number|string} [companyId]
 */
export const getProductTypeByCode = async (typeCode, companyId = null) => {
  const url = companyId
    ? `${BASE_URL}/code/${companyId}/${encodeURIComponent(typeCode)}`
    : `${BASE_URL}/code/${encodeURIComponent(typeCode)}`;
  const response = await api.get(url);
  return response.data;
};

/**
 * Get single product type by ID
 * @param {number|string} id
 */
export const getProductTypeById = async (id) => {
  const response = await api.get(`${BASE_URL}/${id}`);
  return response.data;
};

/**
 * Create a new product type
 * @param {Object} data - { company_id, type_code, type_name, description, is_stock_item, is_saleable, is_purchasable, is_active }
 */
export const createProductType = async (data) => {
  const response = await api.post(BASE_URL, data);
  return response.data;
};

/**
 * Update an existing product type
 * @param {number|string} id
 * @param {Object} data - { company_id, type_code, type_name, description, is_stock_item, is_saleable, is_purchasable, is_active }
 */
export const updateProductType = async (id, data) => {
  const response = await api.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

/**
 * Update product type active status
 * @param {number|string} id
 * @param {boolean} isActive
 */
export const updateProductTypeStatus = async (id, isActive) => {
  const response = await api.patch(`${BASE_URL}/${id}/status`, { is_active: isActive });
  return response.data;
};

/**
 * Delete a product type by ID
 * @param {number|string} id
 */
export const deleteProductType = async (id) => {
  const response = await api.delete(`${BASE_URL}/${id}`);
  return response.data;
};

export default {
  getProductTypes,
  getAllProductTypes,
  getProductTypeStats,
  checkProductTypeNameExists,
  checkProductTypeCodeExists,
  seedDefaultProductTypes,
  getProductTypesByCompanyId,
  getProductTypeByCode,
  getProductTypeById,
  createProductType,
  updateProductType,
  updateProductTypeStatus,
  deleteProductType,
};
