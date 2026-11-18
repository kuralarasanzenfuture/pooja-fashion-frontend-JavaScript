import api from "../../../../config/api.js";

/**
 * Tax Master API Service
 * Communicates with backend /api/product-master/taxes (and /api/taxes) endpoints.
 * Matches C:\Users\zenfu\Desktop\pb\pooja-fashion-backend-javascript\src\modules\product-master\taxes\tax.routes.js
 */

const BASE_URL = "/product-master/taxes";

/**
 * List taxes with pagination, search, status, and rate range filters
 * GET /api/taxes
 * @param {Object} params - { page, limit, search, company_id, tax_type, is_active, is_inclusive, min_rate, max_rate, sort_by, sort_order }
 */
export const getTaxes = async (params = {}) => {
  const response = await api.get(BASE_URL, { params });
  return response.data;
};

/**
 * List all taxes unpaginated (for billing, POS, and dropdown selection)
 * GET /api/taxes/all
 * @param {Object} params - { company_id, is_active, tax_type, search, sort_by, sort_order }
 */
export const getAllTaxes = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/all`, { params });
  return response.data;
};

/**
 * Get tax statistics and summary counts for company
 * GET /api/taxes/stats
 * @param {Object} params - { company_id }
 */
export const getTaxStats = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/stats`, { params });
  return response.data;
};

/**
 * Check if a tax name already exists in company scope
 * GET /api/taxes/check-name
 * @param {Object} params - { name, tax_name, company_id, exclude_id }
 */
export const checkTaxNameExists = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/check-name`, { params });
  return response.data;
};

/**
 * Check if a tax code already exists in company scope
 * GET /api/taxes/check-code
 * @param {Object} params - { code, tax_code, company_id, exclude_id }
 */
export const checkTaxCodeExists = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/check-code`, { params });
  return response.data;
};

/**
 * Seed standard default Indian GST slabs (0%, 5%, 12%, 18%, 28%)
 * POST /api/taxes/seed-defaults
 * @param {Object} data - { company_id }
 */
export const seedDefaultTaxes = async (data = {}) => {
  const response = await api.post(`${BASE_URL}/seed-defaults`, data);
  return response.data;
};

/**
 * Seed standard default Indian GST slabs for specific company by param
 * POST /api/taxes/seed/:companyId
 * @param {number|string} companyId
 */
export const seedDefaultTaxesByCompany = async (companyId) => {
  const response = await api.post(`${BASE_URL}/seed/${companyId}`);
  return response.data;
};

/**
 * Calculate tax breakdown for an amount (inclusive/exclusive, intra/inter-state)
 * POST /api/taxes/calculate
 * @param {Object} data - { amount, tax_id, rate, is_inter_state, is_inclusive }
 */
export const calculateTax = async (data) => {
  const response = await api.post(`${BASE_URL}/calculate`, data);
  return response.data;
};

/**
 * List all taxes for a specific company
 * GET /api/taxes/company/:companyId
 * @param {number|string} companyId
 */
export const getTaxesByCompanyId = async (companyId) => {
  const response = await api.get(`${BASE_URL}/company/${companyId}`);
  return response.data;
};

/**
 * Get tax by company ID and tax code
 * GET /api/taxes/code/:companyId/:taxCode
 * @param {number|string} companyId
 * @param {string} taxCode
 */
export const getTaxByCode = async (companyId, taxCode) => {
  const response = await api.get(`${BASE_URL}/code/${companyId}/${encodeURIComponent(taxCode)}`);
  return response.data;
};

/**
 * Get single tax details by ID
 * GET /api/taxes/:id
 * @param {number|string} id
 */
export const getTaxById = async (id) => {
  const response = await api.get(`${BASE_URL}/${id}`);
  return response.data;
};

/**
 * Create a new tax record
 * POST /api/taxes
 * @param {Object} data - { company_id, tax_code, tax_name, tax_type, rate, cgst_rate, sgst_rate, igst_rate, cess_rate, is_inclusive, is_active }
 */
export const createTax = async (data) => {
  const response = await api.post(BASE_URL, data);
  return response.data;
};

/**
 * Update an existing tax
 * PUT /api/taxes/:id
 * @param {number|string} id
 * @param {Object} data
 */
export const updateTax = async (id, data) => {
  const response = await api.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

/**
 * Toggle or update tax active status
 * PATCH /api/taxes/:id/status
 * @param {number|string} id
 * @param {boolean} isActive
 */
export const updateTaxStatus = async (id, isActive) => {
  const response = await api.patch(`${BASE_URL}/${id}/status`, { is_active: isActive });
  return response.data;
};

/**
 * Delete a tax record
 * DELETE /api/taxes/:id
 * @param {number|string} id
 */
export const deleteTax = async (id) => {
  const response = await api.delete(`${BASE_URL}/${id}`);
  return response.data;
};

const taxService = {
  getTaxes,
  getAllTaxes,
  getTaxStats,
  checkTaxNameExists,
  checkTaxCodeExists,
  seedDefaultTaxes,
  seedDefaultTaxesByCompany,
  calculateTax,
  getTaxesByCompanyId,
  getTaxByCode,
  getTaxById,
  createTax,
  updateTax,
  updateTaxStatus,
  deleteTax,
};

export default taxService;

