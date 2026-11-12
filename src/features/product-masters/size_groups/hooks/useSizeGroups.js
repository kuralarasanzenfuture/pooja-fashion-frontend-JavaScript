import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../../query/queryKeys.js";
import {
  getSizeGroups,
  getAllSizeGroups,
  getSizeGroupTree,
  getSizeGroupStats,
  getSizeGroupById,
  getSizeGroupByCode,
  getSizeGroupsByCompanyId,
  createSizeGroup,
  updateSizeGroup,
  updateSizeGroupStatus,
  seedDefaultSizeGroups,
  deleteSizeGroup,
} from "../services/sizeGroupService.js";

/**
 * Hook to fetch paginated & filtered list of size groups
 */
export const useSizeGroups = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.sizeGroups.list(params),
    queryFn: () => getSizeGroups(params),
    placeholderData: (previousData) => previousData,
    ...options,
  });
};

/**
 * Hook to fetch unpaginated list of all size groups (for dropdowns / selection)
 */
export const useAllSizeGroups = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.sizeGroups.allList(params),
    queryFn: () => getAllSizeGroups(params),
    placeholderData: (previousData) => previousData,
    ...options,
  });
};

/**
 * Hook to fetch size groups with nested child sizes tree
 */
export const useSizeGroupTree = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.sizeGroups.tree(params),
    queryFn: () => getSizeGroupTree(params),
    placeholderData: (previousData) => previousData,
    ...options,
  });
};

/**
 * Hook to fetch size group statistics (total, active, inactive, total sizes)
 */
export const useSizeGroupStats = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.sizeGroups.stats(params),
    queryFn: () => getSizeGroupStats(params),
    placeholderData: (previousData) => previousData,
    ...options,
  });
};

/**
 * Hook to fetch single size group by ID
 */
export const useSizeGroup = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.sizeGroups.detail(id),
    queryFn: () => getSizeGroupById(id),
    enabled: Boolean(id) && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to fetch size groups for a specific company
 */
export const useSizeGroupsByCompany = (companyId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.sizeGroups.byCompany(companyId),
    queryFn: () => getSizeGroupsByCompanyId(companyId),
    enabled: Boolean(companyId) && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to create a new size group
 */
export const useCreateSizeGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createSizeGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sizeGroups.all });
    },
  });
};

/**
 * Hook to update an existing size group
 */
export const useUpdateSizeGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateSizeGroup(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sizeGroups.all });
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.sizeGroups.detail(variables.id) });
      }
    },
  });
};

/**
 * Hook to toggle/update size group status (active/inactive)
 */
export const useUpdateSizeGroupStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }) => updateSizeGroupStatus(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sizeGroups.all });
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.sizeGroups.detail(variables.id) });
      }
    },
  });
};

/**
 * Hook to seed default size groups
 */
export const useSeedDefaultSizeGroups = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => seedDefaultSizeGroups(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sizeGroups.all });
    },
  });
};

/**
 * Hook to delete a size group permanently
 */
export const useDeleteSizeGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteSizeGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sizeGroups.all });
    },
  });
};

export default {
  useSizeGroups,
  useAllSizeGroups,
  useSizeGroupTree,
  useSizeGroupStats,
  useSizeGroup,
  useSizeGroupsByCompany,
  useCreateSizeGroup,
  useUpdateSizeGroup,
  useUpdateSizeGroupStatus,
  useSeedDefaultSizeGroups,
  useDeleteSizeGroup,
};

