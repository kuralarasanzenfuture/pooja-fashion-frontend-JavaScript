import api from "../../../../config/api.js";

/**
 * Category Master API Service
 * Communicates with backend /api/product-master/categories endpoints.
 */

const BASE_URL = "/product-master/categories";

/**
 * List categories with pagination, search, status filter, and sorting
 * @param {Object} params - { page, limit, company_id, is_active, search, sortBy, sortOrder }
 */
export const getCategories = async (params = {}) => {
  const response = await api.get(BASE_URL, { params });
  return response.data;
};

/**
 * Get category by ID
 * @param {number|string} id
 */
export const getCategoryById = async (id) => {
  const response = await api.get(`${BASE_URL}/${id}`);
  return response.data;
};

/**
 * Get category by company ID and category code
 * @param {number|string} companyId
 * @param {string} categoryCode
 */
export const getCategoryByCode = async (companyId, categoryCode) => {
  const response = await api.get(`${BASE_URL}/code/${companyId}/${categoryCode}`);
  return response.data;
};

/**
 * Get all categories belonging to a company
 * @param {number|string} companyId
 * @param {Object} params - { is_active }
 */
export const getCategoriesByCompanyId = async (companyId, params = {}) => {
  const response = await api.get(`${BASE_URL}/company/${companyId}`, { params });
  return response.data;
};

/**
 * Helper to build payload or FormData for category creation/update
 */
const buildCategoryPayload = (data, imageFile) => {
  if (imageFile instanceof File) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    formData.append("image", imageFile);
    return { payload: formData, isMultipart: true };
  }
  return { payload: data, isMultipart: false };
};

/**
 * Create a new category
 * @param {Object} data - { company_id, category_code, category_name, description, display_order, is_active }
 * @param {File|null} imageFile
 */
export const createCategory = async (data, imageFile = null) => {
  const { payload, isMultipart } = buildCategoryPayload(data, imageFile);
  const response = await api.post(BASE_URL, payload, {
    headers: isMultipart ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return response.data;
};

/**
 * Update an existing category
 * @param {number|string} id
 * @param {Object} data - fields to update
 * @param {File|null} imageFile
 */
export const updateCategory = async (id, data, imageFile = null) => {
  const { payload, isMultipart } = buildCategoryPayload(data, imageFile);
  const response = await api.put(`${BASE_URL}/${id}`, payload, {
    headers: isMultipart ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return response.data;
};

/**
 * Update category active status
 * @param {number|string} id
 * @param {boolean} isActive
 */
export const updateCategoryStatus = async (id, isActive) => {
  const response = await api.patch(`${BASE_URL}/${id}/status`, {
    is_active: Boolean(isActive),
  });
  return response.data;
};

/**
 * Upload or replace category image
 * @param {number|string} id
 * @param {File} imageFile
 */
export const uploadCategoryImage = async (id, imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  const response = await api.post(`${BASE_URL}/${id}/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * Delete category image
 * @param {number|string} id
 */
export const deleteCategoryImage = async (id) => {
  const response = await api.delete(`${BASE_URL}/${id}/image`);
  return response.data;
};

/**
 * Delete category by ID
 * @param {number|string} id
 */
export const deleteCategory = async (id) => {
  const response = await api.delete(`${BASE_URL}/${id}`);
  return response.data;
};

export default {
  getCategories,
  getCategoryById,
  getCategoryByCode,
  getCategoriesByCompanyId,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  uploadCategoryImage,
  deleteCategoryImage,
  deleteCategory,
};
