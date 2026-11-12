import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../../query/queryKeys.js";
import {
  getSizes,
  getAllSizes,
  getSizeStats,
  reorderSizes,
  getSizesBySizeGroupId,
  getSizesByCompanyId,
  getSizeByCode,
  getSizeById,
  createSize,
  updateSize,
  updateSizeStatus,
  seedDefaultSizes,
  deleteSize,
} from "../services/sizeService.js";

/**
 * Hook to fetch paginated & filtered list of sizes
 */
export const useSizes = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.sizes.list(params),
    queryFn: () => getSizes(params),
    placeholderData: (previousData) => previousData,
    ...options,
  });
};

/**
 * Hook to fetch unpaginated list of all sizes (for dropdowns / selection)
 */
export const useAllSizes = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.sizes.allList(params),
    queryFn: () => getAllSizes(params),
    placeholderData: (previousData) => previousData,
    ...options,
  });
};

/**
 * Hook to fetch size aggregate statistics
 */
export const useSizeStats = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.sizes.stats(params),
    queryFn: () => getSizeStats(params),
    staleTime: 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch sizes by size group ID
 */
export const useSizesBySizeGroup = (sizeGroupId, params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.sizes.bySizeGroup(sizeGroupId, params),
    queryFn: () => getSizesBySizeGroupId(sizeGroupId, params),
    enabled: Boolean(sizeGroupId),
    ...options,
  });
};

/**
 * Hook to fetch single size by ID
 */
export const useSize = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.sizes.detail(id),
    queryFn: () => getSizeById(id),
    enabled: Boolean(id),
    ...options,
  });
};

/**
 * Hook to create a new size
 */
export const useCreateSize = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createSize(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sizes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.sizeGroups.all });
    },
  });
};

/**
 * Hook to update an existing size
 */
export const useUpdateSize = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateSize(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sizes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.sizeGroups.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.sizes.detail(variables.id),
      });
    },
  });
};

/**
 * Hook to update size active status with optimistic response
 */
export const useUpdateSizeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }) => updateSizeStatus(id, isActive),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sizes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.sizeGroups.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.sizes.detail(variables.id),
      });
    },
  });
};

/**
 * Hook to bulk reorder sizes
 */
export const useReorderSizes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => reorderSizes(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sizes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.sizeGroups.all });
    },
  });
};

/**
 * Hook to seed standard default sizes for a size group
 */
export const useSeedDefaultSizes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => seedDefaultSizes(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sizes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.sizeGroups.all });
    },
  });
};

/**
 * Hook to delete a size
 */
export const useDeleteSize = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteSize(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sizes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.sizeGroups.all });
    },
  });
};

export default {
  useSizes,
  useAllSizes,
  useSizeStats,
  useSizesBySizeGroup,
  useSize,
  useCreateSize,
  useUpdateSize,
  useUpdateSizeStatus,
  useReorderSizes,
  useSeedDefaultSizes,
  deleteSize,
};

