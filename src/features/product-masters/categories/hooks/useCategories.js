import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../../query/queryKeys.js";
import {
  getCategories,
  getCategoryById,
  getCategoryByCode,
  getCategoriesByCompanyId,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
  deleteCategoryImage,
} from "../services/categoryService.js";

/**
 * Hook to fetch paginated & filtered list of categories
 */
export const useCategories = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.categories.list(params),
    queryFn: () => getCategories(params),
    placeholderData: (previousData) => previousData,
    ...options,
  });
};

/**
 * Hook to fetch single category by ID
 */
export const useCategory = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => getCategoryById(id),
    enabled: Boolean(id) && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to fetch categories for a company
 */
export const useCategoriesByCompany = (companyId, params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.categories.byCompany(companyId),
    queryFn: () => getCategoriesByCompanyId(companyId, params),
    enabled: Boolean(companyId) && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to create a category
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, imageFile }) => createCategory(data, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
};

/**
 * Hook to update a category
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, imageFile }) => updateCategory(id, data, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
};

/**
 * Hook to update category status
 */
export const useUpdateCategoryStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }) => updateCategoryStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
};

/**
 * Hook to delete category
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
};

/**
 * Hook to delete category image
 */
export const useDeleteCategoryImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteCategoryImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
};
