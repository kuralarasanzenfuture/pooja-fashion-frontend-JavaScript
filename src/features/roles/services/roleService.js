import api from "../../../config/api.js";

/**
 * Role API Service
 * Handles communication with backend /api/roles routes.
 */

/**
 * List roles with pagination, filtering, and search
 * @param {Object} params - { page, limit, search, is_active, is_system_role, company_id, include_global, sortBy, sortOrder }
 */
export const getRoles = async (params = {}) => {
  const response = await api.get("/roles", { params });
  return response.data;
};

/**
 * Get role by ID
 * @param {number|string} id
 */
export const getRoleById = async (id) => {
  const response = await api.get(`/roles/${id}`);
  return response.data;
};

/**
 * List all roles for a specific company (includes global system roles)
 * @param {number|string} companyId
 */
export const getRolesByCompany = async (companyId) => {
  const response = await api.get(`/roles/company/${companyId}`);
  return response.data;
};

/**
 * Get role by company ID and role code
 * @param {number|string|'global'} companyId
 * @param {string} roleCode
 */
export const getRoleByCode = async (companyId, roleCode) => {
  const response = await api.get(`/roles/code/${companyId}/${roleCode}`);
  return response.data;
};

/**
 * Create a new role
 * @param {Object} roleData - { role_name, role_code, description, company_id, is_system_role, is_active }
 */
export const createRole = async (roleData) => {
  const response = await api.post("/roles", roleData);
  return response.data;
};

/**
 * Update existing role
 * @param {number|string} id
 * @param {Object} roleData - { role_name, role_code, description, is_active }
 */
export const updateRole = async (id, roleData) => {
  const response = await api.put(`/roles/${id}`, roleData);
  return response.data;
};

/**
 * Update role active status
 * @param {number|string} id
 * @param {boolean} isActive
 */
export const updateRoleStatus = async (id, isActive) => {
  const response = await api.patch(`/roles/${id}/status`, { is_active: Boolean(isActive) });
  return response.data;
};

/**
 * Delete custom role by ID
 * @param {number|string} id
 */
export const deleteRole = async (id) => {
  const response = await api.delete(`/roles/${id}`);
  return response.data;
};

/**
 * Seed default system roles for a company (SuperAdmin only)
 * @param {number|string} companyId
 */
export const seedDefaultRoles = async (companyId) => {
  const response = await api.post(`/roles/company/${companyId}/seed-defaults`);
  return response.data;
};

/**
 * Check if a role name already exists within the target company or globally
 * @param {Object} params - { name, company_id, is_system_role, exclude_id }
 */
export const checkRoleNameExists = async (params = {}) => {
  const response = await api.get("/roles/check-name", { params });
  return response.data;
};

export default {
  getRoles,
  getRoleById,
  getRolesByCompany,
  getRoleByCode,
  checkRoleNameExists,
  createRole,
  updateRole,
  updateRoleStatus,
  deleteRole,
  seedDefaultRoles,
};
