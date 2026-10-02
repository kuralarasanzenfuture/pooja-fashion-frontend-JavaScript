import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../query/queryKeys.js";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  changePassword,
  updateUserStatus,
  deleteUser,
} from "../services/userService.js";

/**
 * Hook to fetch paginated & filtered list of users
 */
export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => getUsers(params),
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook to fetch single user by ID
 */
export const useUser = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => getUserById(id),
    enabled: Boolean(id) && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to create a new user
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData) => createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};

/**
 * Hook to update an existing user
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.id) });
    },
  });
};

/**
 * Hook to change / reset user password
 */
export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => changePassword(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.id) });
    },
  });
};

/**
 * Hook to update user account status
 */
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, lockMinutes }) =>
      updateUserStatus(id, status, lockMinutes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.id) });
    },
  });
};

/**
 * Hook to delete user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};
