import api from "../../../../config/api.js";

/**
 * Brand Master API Service
 * Communicates with backend /api/product-master/brands endpoints.
 */

const BASE_URL = "/product-master/brands";

/**
 * Helper to build payload or FormData for brand creation and update.
 * Accepts either a File object (for logo upload) or a plain data object.
 * The backend accepts multipart fields: 'logo', 'logo_url', or 'image'.
 */
const buildBrandPayload = (data, logoFile) => {
  if (logoFile instanceof File) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    // Append under 'logo' (and 'image' for broad compatibility)
    formData.append("logo", logoFile);
    return { payload: formData, isMultipart: true };
  }
  return { payload: data, isMultipart: false };
};

/**
 * List brands with pagination, search, status filter, and sorting
 * @param {Object} params - { page, limit, company_id, is_active, has_logo, search, sortBy, sortOrder }
 */
export const getBrands = async (params = {}) => {
  const response = await api.get(BASE_URL, { params });
  return response.data;
};

/**
 * List all brands without pagination (for dropdowns / selectors)
 * @param {Object} params - { company_id, is_active, has_logo, search, sortBy, sortOrder }
 */
export const getAllBrands = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/all`, { params });
  return response.data;
};

/**
 * Get brand aggregate statistics for company
 * @param {Object} params - { company_id }
 */
export const getBrandStats = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/stats`, { params });
  return response.data;
};

/**
 * Get single brand by ID
 * @param {number|string} id
 */
export const getBrandById = async (id) => {
  const response = await api.get(`${BASE_URL}/${id}`);
  return response.data;
};

/**
 * Get brand by company ID and brand code
 * @param {number|string} companyId
 * @param {string} brandCode
 */
export const getBrandByCode = async (companyId, brandCode) => {
  const response = await api.get(`${BASE_URL}/code/${companyId}/${brandCode}`);
  return response.data;
};

/**
 * Get all brands for a specific company
 * @param {number|string} companyId
 * @param {Object} params - { is_active }
 */
export const getBrandsByCompanyId = async (companyId, params = {}) => {
  const response = await api.get(`${BASE_URL}/company/${companyId}`, { params });
  return response.data;
};

/**
 * Create a new brand
 * @param {Object} data - { company_id, brand_code, brand_name, description, website_url, display_order, is_active }
 * @param {File|null} logoFile
 */
export const createBrand = async (data, logoFile = null) => {
  const { payload, isMultipart } = buildBrandPayload(data, logoFile);
  const response = await api.post(BASE_URL, payload, {
    headers: isMultipart ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return response.data;
};

/**
 * Update an existing brand
 * @param {number|string} id
 * @param {Object} data - fields to update
 * @param {File|null} logoFile
 */
export const updateBrand = async (id, data, logoFile = null) => {
  const { payload, isMultipart } = buildBrandPayload(data, logoFile);
  const response = await api.put(`${BASE_URL}/${id}`, payload, {
    headers: isMultipart ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return response.data;
};

/**
 * Update brand active status
 * @param {number|string} id
 * @param {boolean} isActive
 */
export const updateBrandStatus = async (id, isActive) => {
  const response = await api.patch(`${BASE_URL}/${id}/status`, {
    is_active: Boolean(isActive),
  });
  return response.data;
};

/**
 * Upload or replace brand logo
 * @param {number|string} id
 * @param {File} logoFile
 */
export const uploadBrandLogo = async (id, logoFile) => {
  const formData = new FormData();
  formData.append("logo", logoFile);
  const response = await api.post(`${BASE_URL}/${id}/logo`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * Delete brand logo
 * @param {number|string} id
 */
export const deleteBrandLogo = async (id) => {
  const response = await api.delete(`${BASE_URL}/${id}/logo`);
  return response.data;
};

/**
 * Bulk reorder brand display sequence
 * @param {Array<{ id: number, display_order: number }>} items
 */
export const reorderBrands = async (items) => {
  const response = await api.patch(`${BASE_URL}/reorder`, { items });
  return response.data;
};

/**
 * Check if a brand name already exists in the company
 * @param {Object} params - { name, company_id, excludeId }
 */
export const checkBrandName = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/check-name`, { params });
  return response.data;
};

/**
 * Check if a brand code already exists in the company
 * @param {Object} params - { code, company_id, excludeId }
 */
export const checkBrandCode = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/check-code`, { params });
  return response.data;
};

/**
 * Permanently delete brand by ID
 * @param {number|string} id
 */
export const deleteBrand = async (id) => {
  const response = await api.delete(`${BASE_URL}/${id}`);
  return response.data;
};

export default {
  getBrands,
  getAllBrands,
  getBrandStats,
  getBrandById,
  getBrandByCode,
  getBrandsByCompanyId,
  createBrand,
  updateBrand,
  updateBrandStatus,
  uploadBrandLogo,
  deleteBrandLogo,
  reorderBrands,
  checkBrandName,
  checkBrandCode,
  deleteBrand,
};

