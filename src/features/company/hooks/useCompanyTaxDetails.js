import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../query/queryKeys.js";
import {
  getCompanyTaxDetails,
  getCompanyTaxDetailById,
  getTaxDetailsByCompanyId,
  getPrimaryTaxDetailByCompanyId,
  createCompanyTaxDetail,
  updateCompanyTaxDetail,
  updateCompanyTaxDetailStatus,
  setPrimaryCompanyTaxDetail,
  deleteCompanyTaxDetail,
} from "../services/companyTaxDetailService.js";

/**
 * Hook to fetch paginated & filtered list of company tax details
 */
export const useCompanyTaxDetails = (params = {}) => {
  return useQuery({
    queryKey: queryKeys.companyTaxDetails.list(params),
    queryFn: () => getCompanyTaxDetails(params),
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook to fetch single tax detail by ID
 */
export const useCompanyTaxDetail = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.companyTaxDetails.detail(id),
    queryFn: () => getCompanyTaxDetailById(id),
    enabled: Boolean(id) && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to fetch all tax details belonging to a specific company
 */
export const useCompanyTaxDetailsByCompany = (companyId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.companyTaxDetails.byCompany(companyId),
    queryFn: () => getTaxDetailsByCompanyId(companyId),
    enabled: Boolean(companyId) && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to fetch primary tax detail for a specific company
 */
export const useCompanyPrimaryTaxDetail = (companyId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.companyTaxDetails.primary(companyId),
    queryFn: () => getPrimaryTaxDetailByCompanyId(companyId),
    enabled: Boolean(companyId) && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to create a new company tax detail
 */
export const useCreateCompanyTaxDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createCompanyTaxDetail(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companyTaxDetails.all });
      const companyId = variables.companyId || variables.company_id;
      if (companyId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.companyTaxDetails.byCompany(companyId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.companyTaxDetails.primary(companyId) });
      }
    },
  });
};

/**
 * Hook to update an existing company tax detail
 */
export const useUpdateCompanyTaxDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateCompanyTaxDetail(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companyTaxDetails.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.companyTaxDetails.detail(variables.id) });
      const companyId = response?.data?.companyId || response?.data?.company_id || variables?.data?.companyId || variables?.data?.company_id;
      if (companyId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.companyTaxDetails.byCompany(companyId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.companyTaxDetails.primary(companyId) });
      }
    },
  });
};

/**
 * Hook to update company tax detail active status
 */
export const useUpdateCompanyTaxDetailStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }) => updateCompanyTaxDetailStatus(id, isActive),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companyTaxDetails.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.companyTaxDetails.detail(variables.id) });
      const companyId = response?.data?.companyId || response?.data?.company_id;
      if (companyId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.companyTaxDetails.byCompany(companyId) });
      }
    },
  });
};

/**
 * Hook to mark tax detail as primary
 */
export const useSetPrimaryCompanyTaxDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => setPrimaryCompanyTaxDetail(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companyTaxDetails.all });
      const companyId = response?.data?.companyId || response?.data?.company_id;
      if (companyId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.companyTaxDetails.byCompany(companyId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.companyTaxDetails.primary(companyId) });
      }
    },
  });
};

/**
 * Hook to delete a company tax detail
 */
export const useDeleteCompanyTaxDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }) => deleteCompanyTaxDetail(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companyTaxDetails.all });
      if (variables.companyId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.companyTaxDetails.byCompany(variables.companyId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.companyTaxDetails.primary(variables.companyId) });
      }
    },
  });
};
