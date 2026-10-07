import api from "../../../../config/api.js";

/**
 * SubCategory Master API Service
 * Communicates with backend /api/product-master/subcategories endpoints.
 */

const BASE_URL = "/product-master/subcategories";

/**
 * List subcategories with pagination, search, status filter, and sorting
 * @param {Object} params - { page, limit, company_id, category_id, is_active, search, has_image, sortBy, sortOrder }
 */
export const getSubcategories = async (params = {}) => {
  const response = await api.get(BASE_URL, { params });
  return response.data;
};

/**
 * Get subcategory by ID
 * @param {number|string} id
 */
export const getSubcategoryById = async (id) => {
  const response = await api.get(`${BASE_URL}/${id}`);
  return response.data;
};

/**
 * Get all subcategories belonging to a category
 * @param {number|string} categoryId
 * @param {Object} params - { is_active }
 */
export const getSubcategoriesByCategoryId = async (categoryId, params = {}) => {
  const response = await api.get(`${BASE_URL}/category/${categoryId}`, { params });
  return response.data;
};

/**
 * Get all subcategories belonging to a company
 * @param {number|string} companyId
 * @param {Object} params - { is_active }
 */
export const getSubcategoriesByCompanyId = async (companyId, params = {}) => {
  const response = await api.get(`${BASE_URL}/company/${companyId}`, { params });
  return response.data;
};

/**
 * Get subcategory by company ID and subcategory code
 * @param {number|string} companyId
 * @param {string} subcategoryCode
 */
export const getSubcategoryByCode = async (companyId, subcategoryCode) => {
  const response = await api.get(`${BASE_URL}/code/${companyId}/${subcategoryCode}`);
  return response.data;
};

/**
 * Helper to build payload or FormData for subcategory creation/update
 */
const buildSubcategoryPayload = (data, imageFile) => {
  if (data instanceof FormData) {
    if (imageFile instanceof File || imageFile instanceof Blob) {
      data.append("image", imageFile);
    }
    return { payload: data, isMultipart: true };
  }

  if (imageFile instanceof File || imageFile instanceof Blob) {
    const formData = new FormData();
    Object.entries(data || {}).forEach(([key, value]) => {
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
 * Create a new subcategory
 * Note: company_id is optional as it is automatically derived from the parent category on the backend.
 * @param {Object|FormData} data - { category_id, subcategory_name, company_id, subcategory_code, description, display_order, is_active }
 * @param {File|Blob|null} imageFile
 */
export const createSubcategory = async (data, imageFile = null) => {
  const { payload, isMultipart } = buildSubcategoryPayload(data, imageFile);
  const response = await api.post(BASE_URL, payload, {
    headers: isMultipart ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return response.data;
};

/**
 * Update an existing subcategory
 * @param {number|string} id
 * @param {Object|FormData} data - fields to update
 * @param {File|Blob|null} imageFile
 */
export const updateSubcategory = async (id, data, imageFile = null) => {
  const { payload, isMultipart } = buildSubcategoryPayload(data, imageFile);
  const response = await api.put(`${BASE_URL}/${id}`, payload, {
    headers: isMultipart ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return response.data;
};

/**
 * Update subcategory active status
 * @param {number|string} id
 * @param {boolean} isActive
 */
export const updateSubcategoryStatus = async (id, isActive) => {
  const response = await api.patch(`${BASE_URL}/${id}/status`, {
    is_active: Boolean(isActive),
  });
  return response.data;
};

/**
 * Upload or replace subcategory image
 * @param {number|string} id
 * @param {File|Blob} imageFile
 */
export const uploadSubcategoryImage = async (id, imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  const response = await api.post(`${BASE_URL}/${id}/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * Delete subcategory image
 * @param {number|string} id
 */
export const deleteSubcategoryImage = async (id) => {
  const response = await api.delete(`${BASE_URL}/${id}/image`);
  return response.data;
};

/**
 * Delete subcategory by ID
 * @param {number|string} id
 */
export const deleteSubcategory = async (id) => {
  const response = await api.delete(`${BASE_URL}/${id}`);
  return response.data;
};

export default {
  getSubcategories,
  getSubcategoryById,
  getSubcategoriesByCategoryId,
  getSubcategoriesByCompanyId,
  getSubcategoryByCode,
  createSubcategory,
  updateSubcategory,
  updateSubcategoryStatus,
  uploadSubcategoryImage,
  deleteSubcategoryImage,
  deleteSubcategory,
};
