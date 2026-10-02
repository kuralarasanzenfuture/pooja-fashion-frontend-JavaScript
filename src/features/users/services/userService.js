import api from "../../../config/api.js";

/**
 * User API Service
 * Handles communication with backend /api/users routes.
 */

/**
 * List users with pagination, multi-tenant filtering, and search
 * @param {Object} params - { page, limit, search, status, role_id, branch_id, company_id, sortBy, sortOrder }
 */
export const getUsers = async (params = {}) => {
  const response = await api.get("/users", { params });
  return response.data;
};

/**
 * Get user profile by ID
 * @param {number|string} id
 */
export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

/**
 * Create a new user account (Admin & SuperAdmin don't need to specify company_id)
 * @param {Object} userData
 */
export const createUser = async (userData) => {
  const response = await api.post("/users", userData);
  return response.data;
};

/**
 * Update user account details
 * @param {number|string} id
 * @param {Object} userData
 */
export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

/**
 * Change or reset user password
 * @param {number|string} id
 * @param {Object} passwordData - { current_password, new_password }
 */
export const changePassword = async (id, passwordData) => {
  const response = await api.patch(`/users/${id}/password`, passwordData);
  return response.data;
};

/**
 * Update user status (active, inactive, blocked, locked)
 * @param {number|string} id
 * @param {string} status - 'active' | 'inactive' | 'blocked' | 'locked'
 * @param {number} [lockMinutes]
 */
export const updateUserStatus = async (id, status, lockMinutes = null) => {
  const payload = { status };
  if (lockMinutes) payload.lock_minutes = lockMinutes;
  const response = await api.patch(`/users/${id}/status`, payload);
  return response.data;
};

/**
 * Delete user account
 * @param {number|string} id
 */
export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

/**
 * Check if a username already exists within the target company or globally
 * @param {Object} params - { username, company_id, exclude_id }
 */
export const checkUsernameAvailability = async (params = {}) => {
  const response = await api.get("/users/check-username", { params });
  return response.data;
};

/**
 * Check if an email address is already registered globally
 * @param {Object} params - { email, exclude_id }
 */
export const checkEmailAvailability = async (params = {}) => {
  const response = await api.get("/users/check-email", { params });
  return response.data;
};

/**
 * Combined availability check for username and email
 * @param {Object} params - { username, email, company_id, exclude_id }
 */
export const checkAvailability = async (params = {}) => {
  const response = await api.get("/users/check-availability", { params });
  return response.data;
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  changePassword,
  updateUserStatus,
  deleteUser,
  checkUsernameAvailability,
  checkEmailAvailability,
  checkAvailability,
};

