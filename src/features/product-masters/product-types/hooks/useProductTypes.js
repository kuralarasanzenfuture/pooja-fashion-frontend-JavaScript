import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../../query/queryKeys.js";
import {
  getProductTypes,
  getAllProductTypes,
  getProductTypeStats,
  getProductTypeById,
  createProductType,
  updateProductType,
  updateProductTypeStatus,
  seedDefaultProductTypes,
  deleteProductType,
} from "../services/productTypeService.js";

/**
 * Hook to query paginated product types with filters & search
 */
export const useProductTypes = (params = {}) => {
  return useQuery({
    queryKey: queryKeys.productTypes.list(params),
    queryFn: () => getProductTypes(params),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 2,
  });
};

/**
 * Hook to query all product types without pagination (for dropdowns / selectors)
 */
export const useAllProductTypes = (params = {}) => {
  return useQuery({
    queryKey: queryKeys.productTypes.allList(params),
    queryFn: () => getAllProductTypes(params),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook to query product type aggregate statistics
 */
export const useProductTypeStats = (params = {}) => {
  return useQuery({
    queryKey: queryKeys.productTypes.stats(params),
    queryFn: () => getProductTypeStats(params),
    staleTime: 1000 * 60 * 3,
  });
};

/**
 * Hook to query a single product type by ID
 */
export const useProductType = (id) => {
  return useQuery({
    queryKey: queryKeys.productTypes.detail(id),
    queryFn: () => getProductTypeById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook to create a new product type
 */
export const useCreateProductType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createProductType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productTypes.all });
    },
  });
};

/**
 * Hook to update an existing product type
 */
export const useUpdateProductType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateProductType(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productTypes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.productTypes.detail(id) });
    },
  });
};

/**
 * Hook to toggle product type active status
 */
export const useUpdateProductTypeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, is_active }) => updateProductTypeStatus(id, is_active),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productTypes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.productTypes.detail(id) });
    },
  });
};

/**
 * Hook to seed default standard retail apparel product types
 */
export const useSeedDefaultProductTypes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => seedDefaultProductTypes(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productTypes.all });
    },
  });
};

/**
 * Hook to delete a product type
 */
export const useDeleteProductType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteProductType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productTypes.all });
    },
  });
};

export default {
  useProductTypes,
  useAllProductTypes,
  useProductTypeStats,
  useProductType,
  useCreateProductType,
  useUpdateProductType,
  useUpdateProductTypeStatus,
  useSeedDefaultProductTypes,
  useDeleteProductType,
};
