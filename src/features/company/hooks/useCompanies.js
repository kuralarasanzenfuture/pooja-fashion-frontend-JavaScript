import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../query/queryKeys.js";
import {
  getCompanies,
  getCompanyById,
  getCompanyByCode,
  createCompany,
  updateCompany,
  updateCompanyStatus,
  deleteCompany,
} from "../services/companyService.js";

/**
 * Hook to fetch paginated & filtered list of companies
 */
export const useCompanies = (params = {}) => {
  return useQuery({
    queryKey: queryKeys.companies.list(params),
    queryFn: () => getCompanies(params),
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook to fetch single company by ID
 */
export const useCompany = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.companies.detail(id),
    queryFn: () => getCompanyById(id),
    enabled: Boolean(id) && (options.enabled !== false),
    ...options,
  });
};

/**
 * Hook to fetch single company by companyCode
 */
export const useCompanyByCode = (companyCode, options = {}) => {
  return useQuery({
    queryKey: queryKeys.companies.byCode(companyCode),
    queryFn: () => getCompanyByCode(companyCode),
    enabled: Boolean(companyCode) && (options.enabled !== false),
    ...options,
  });
};

/**
 * Hook to create a new company
 */
export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
    },
  });
};

/**
 * Hook to update existing company
 */
export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateCompany(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.detail(variables.id) });
    },
  });
};

/**
 * Hook to update company status
 */
export const useUpdateCompanyStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateCompanyStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.detail(variables.id) });
    },
  });
};

/**
 * Hook to delete company
 */
export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
    },
  });
};
