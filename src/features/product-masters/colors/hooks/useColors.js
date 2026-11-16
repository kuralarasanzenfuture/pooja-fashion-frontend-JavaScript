import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../../query/queryKeys.js";
import {
  getColors,
  getAllColors,
  getColorStats,
  reorderColors,
  getColorsByCompanyId,
  getColorByCode,
  getColorById,
  createColor,
  updateColor,
  updateColorStatus,
  seedDefaultColors,
  deleteColor,
} from "../services/colorService.js";

/**
 * Hook to fetch paginated & filtered list of colors
 */
export const useColors = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.colors.list(params),
    queryFn: () => getColors(params),
    placeholderData: (previousData) => previousData,
    ...options,
  });
};

/**
 * Hook to fetch unpaginated list of all colors (for dropdowns / selection)
 */
export const useAllColors = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.colors.allList(params),
    queryFn: () => getAllColors(params),
    placeholderData: (previousData) => previousData,
    ...options,
  });
};

/**
 * Hook to fetch color aggregate statistics
 */
export const useColorStats = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.colors.stats(params),
    queryFn: () => getColorStats(params),
    staleTime: 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch colors by company ID
 */
export const useColorsByCompany = (companyId, params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.colors.byCompany(companyId, params),
    queryFn: () => getColorsByCompanyId(companyId, params),
    enabled: Boolean(companyId),
    ...options,
  });
};

/**
 * Hook to fetch single color by ID
 */
export const useColor = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.colors.detail(id),
    queryFn: () => getColorById(id),
    enabled: Boolean(id),
    ...options,
  });
};

/**
 * Hook to create a new color
 */
export const useCreateColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createColor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.colors.all });
    },
  });
};

/**
 * Hook to update an existing color
 */
export const useUpdateColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateColor(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.colors.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.colors.detail(variables.id),
      });
    },
  });
};

/**
 * Hook to update color active status
 */
export const useUpdateColorStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }) => updateColorStatus(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.colors.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.colors.detail(variables.id),
      });
    },
  });
};

/**
 * Hook to seed default apparel colors
 */
export const useSeedDefaultColors = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => seedDefaultColors(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.colors.all });
    },
  });
};

/**
 * Hook to bulk reorder colors
 */
export const useReorderColors = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => reorderColors(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.colors.all });
    },
  });
};

/**
 * Hook to delete a color
 */
export const useDeleteColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteColor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.colors.all });
    },
  });
};

export default {
  useColors,
  useAllColors,
  useColorStats,
  useColorsByCompany,
  useColor,
  useCreateColor,
  useUpdateColor,
  useUpdateColorStatus,
  useSeedDefaultColors,
  useReorderColors,
  useDeleteColor,
};

