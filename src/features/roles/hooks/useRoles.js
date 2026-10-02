import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../query/queryKeys.js";
import {
  getRoles,
  getRoleById,
  getRolesByCompany,
  createRole,
  updateRole,
  updateRoleStatus,
  deleteRole,
  seedDefaultRoles,
} from "../services/roleService.js";

/**
 * Hook to fetch paginated & filtered list of roles
 */
export const useRoles = (params = {}) => {
  return useQuery({
    queryKey: queryKeys.roles.list(params),
    queryFn: () => getRoles(params),
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook to fetch a single role by ID
 */
export const useRole = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.roles.detail(id),
    queryFn: () => getRoleById(id),
    enabled: Boolean(id) && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to fetch all roles for a company
 */
export const useRolesByCompany = (companyId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.roles.byCompany(companyId),
    queryFn: () => getRolesByCompany(companyId),
    enabled: Boolean(companyId) && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to create a new role
 */
export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleData) => createRole(roleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.all });
    },
  });
};

/**
 * Hook to update an existing role
 */
export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateRole(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.detail(variables.id) });
    },
  });
};

/**
 * Hook to toggle role active status
 */
export const useUpdateRoleStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }) => updateRoleStatus(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users?.all || ["users"] });
    },
  });
};

/**
 * Hook to delete a role
 */
export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.all });
    },
  });
};

/**
 * Hook to seed default roles for a company
 */
export const useSeedDefaultRoles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (companyId) => seedDefaultRoles(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.all });
    },
  });
};
