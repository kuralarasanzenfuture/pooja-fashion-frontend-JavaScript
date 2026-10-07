import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../../query/queryKeys.js";
import {
  getSubcategories,
  getSubcategoryById,
  getSubcategoriesByCategoryId,
  getSubcategoriesByCompanyId,
  getSubcategoryByCode,
  createSubcategory,
  updateSubcategory,
  updateSubcategoryStatus,
  uploadSubcategoryImage,
  deleteSubcategoryImage,
  deleteSubcategory,
} from "../services/subCategoryService.js";

/**
 * Hook to fetch paginated & filtered list of subcategories
 * @param {Object} params - Query params (page, limit, category_id, company_id, search, is_active, has_image, sortBy, sortOrder)
 * @param {Object} options - React Query options
 */
export const useSubcategories = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.subcategories.list(params),
    queryFn: () => getSubcategories(params),
    placeholderData: (previousData) => previousData,
    ...options,
  });
};

/**
 * Hook to fetch single subcategory by ID
 * @param {number|string} id - Subcategory ID
 * @param {Object} options - React Query options
 */
export const useSubcategory = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.subcategories.detail(id),
    queryFn: () => getSubcategoryById(id),
    enabled: Boolean(id) && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to fetch subcategories belonging to a category
 * @param {number|string} categoryId - Category ID
 * @param {Object} params - Optional filters (is_active)
 * @param {Object} options - React Query options
 */
export const useSubcategoriesByCategory = (categoryId, params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.subcategories.byCategory(categoryId, params),
    queryFn: () => getSubcategoriesByCategoryId(categoryId, params),
    enabled: Boolean(categoryId) && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to fetch subcategories belonging to a company
 * @param {number|string} companyId - Company ID
 * @param {Object} params - Optional filters (is_active)
 * @param {Object} options - React Query options
 */
export const useSubcategoriesByCompany = (companyId, params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.subcategories.byCompany(companyId, params),
    queryFn: () => getSubcategoriesByCompanyId(companyId, params),
    enabled: Boolean(companyId) && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to fetch a subcategory by company ID and subcategory code
 * @param {number|string} companyId - Company ID
 * @param {string} subcategoryCode - Subcategory Code
 * @param {Object} options - React Query options
 */
export const useSubcategoryByCode = (companyId, subcategoryCode, options = {}) => {
  return useQuery({
    queryKey: queryKeys.subcategories.byCode(companyId, subcategoryCode),
    queryFn: () => getSubcategoryByCode(companyId, subcategoryCode),
    enabled: Boolean(companyId) && Boolean(subcategoryCode) && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to create a subcategory
 * Accepts { data, imageFile } or direct payload object/FormData
 */
export const useCreateSubcategory = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables) => {
      if (
        variables &&
        typeof variables === "object" &&
        ("data" in variables || "imageFile" in variables)
      ) {
        return createSubcategory(variables.data, variables.imageFile);
      }
      return createSubcategory(variables);
    },
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcategories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
  });
};

/**
 * Hook to update a subcategory
 * Accepts { id, data, imageFile }
 */
export const useUpdateSubcategory = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, imageFile }) => updateSubcategory(id, data, imageFile),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcategories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
  });
};

/**
 * Hook to update subcategory active status
 * Accepts { id, isActive }
 */
export const useUpdateSubcategoryStatus = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }) => updateSubcategoryStatus(id, isActive),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcategories.all });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
  });
};

/**
 * Hook to upload or replace subcategory image
 * Accepts { id, imageFile }
 */
export const useUploadSubcategoryImage = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, imageFile }) => uploadSubcategoryImage(id, imageFile),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcategories.all });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
  });
};

/**
 * Hook to delete subcategory image
 * Accepts id
 */
export const useDeleteSubcategoryImage = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteSubcategoryImage(id),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcategories.all });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
  });
};

/**
 * Hook to delete subcategory
 * Accepts id
 */
export const useDeleteSubcategory = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteSubcategory(id),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcategories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
  });
};
