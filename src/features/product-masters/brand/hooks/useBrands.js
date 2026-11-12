import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../../query/queryKeys.js";
import {
  getBrands,
  getAllBrands,
  getBrandStats,
  getBrandById,
  getBrandByCode,
  getBrandsByCompanyId,
  createBrand,
  updateBrand,
  updateBrandStatus,
  uploadBrandLogo,
  deleteBrandLogo,
  reorderBrands,
  deleteBrand,
} from "../services/brandService.js";

/**
 * Hook to fetch paginated & filtered list of brands
 */
export const useBrands = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.brands.list(params),
    queryFn: () => getBrands(params),
    placeholderData: (previousData) => previousData,
    ...options,
  });
};

/**
 * Hook to fetch unpaginated list of all brands (for dropdowns / selection)
 */
export const useAllBrands = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.brands.allList(params),
    queryFn: () => getAllBrands(params),
    placeholderData: (previousData) => previousData,
    ...options,
  });
};

/**
 * Hook to fetch brand statistics (total, active, inactive, with logos)
 */
export const useBrandStats = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.brands.stats(params),
    queryFn: () => getBrandStats(params),
    placeholderData: (previousData) => previousData,
    ...options,
  });
};

/**
 * Hook to fetch single brand by ID
 */
export const useBrand = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.brands.detail(id),
    queryFn: () => getBrandById(id),
    enabled: Boolean(id) && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to fetch brands for a specific company
 */
export const useBrandsByCompany = (companyId, params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.brands.byCompany(companyId, params),
    queryFn: () => getBrandsByCompanyId(companyId, params),
    enabled: Boolean(companyId) && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to create a new brand
 */
export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, logoFile }) => createBrand(data, logoFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.all });
    },
  });
};

/**
 * Hook to update an existing brand
 */
export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, logoFile }) => updateBrand(id, data, logoFile),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.all });
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.brands.detail(variables.id) });
      }
    },
  });
};

/**
 * Hook to toggle/update brand status (active/inactive)
 */
export const useUpdateBrandStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }) => updateBrandStatus(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.all });
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.brands.detail(variables.id) });
      }
    },
  });
};

/**
 * Hook to upload or replace brand logo
 */
export const useUploadBrandLogo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, logoFile }) => uploadBrandLogo(id, logoFile),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.all });
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.brands.detail(variables.id) });
      }
    },
  });
};

/**
 * Hook to delete brand logo
 */
export const useDeleteBrandLogo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteBrandLogo(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.all });
      if (id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.brands.detail(id) });
      }
    },
  });
};

/**
 * Hook to reorder brands
 */
export const useReorderBrands = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items) => reorderBrands(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.all });
    },
  });
};

/**
 * Hook to delete a brand permanently
 */
export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.all });
    },
  });
};

export default {
  useBrands,
  useAllBrands,
  useBrandStats,
  useBrand,
  useBrandsByCompany,
  useCreateBrand,
  useUpdateBrand,
  useUpdateBrandStatus,
  useUploadBrandLogo,
  useDeleteBrandLogo,
  useReorderBrands,
  useDeleteBrand,
};

