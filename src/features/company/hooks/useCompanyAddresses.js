import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../query/queryKeys.js";
import {
  getCompanyAddresses,
  getCompanyAddressById,
  getAddressesByCompanyId,
  getPrimaryAddressByCompanyId,
  createCompanyAddress,
  updateCompanyAddress,
  updateCompanyAddressStatus,
  setPrimaryCompanyAddress,
  deleteCompanyAddress,
} from "../services/companyAddressService.js";

/**
 * Hook to fetch paginated & filtered list of company addresses
 */
export const useCompanyAddresses = (params = {}) => {
  return useQuery({
    queryKey: queryKeys.companyAddresses.list(params),
    queryFn: () => getCompanyAddresses(params),
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook to fetch single address by ID
 */
export const useCompanyAddress = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.companyAddresses.detail(id),
    queryFn: () => getCompanyAddressById(id),
    enabled: Boolean(id) && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to fetch all addresses belonging to a specific company
 */
export const useCompanyAddressesByCompany = (companyId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.companyAddresses.byCompany(companyId),
    queryFn: () => getAddressesByCompanyId(companyId),
    enabled: Boolean(companyId) && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to fetch primary address for a specific company
 */
export const useCompanyPrimaryAddress = (companyId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.companyAddresses.primary(companyId),
    queryFn: () => getPrimaryAddressByCompanyId(companyId),
    enabled: Boolean(companyId) && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to create a new company address
 */
export const useCreateCompanyAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createCompanyAddress(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companyAddresses.all });
      const companyId = variables.companyId || variables.company_id;
      if (companyId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.companyAddresses.byCompany(companyId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.companyAddresses.primary(companyId) });
      }
    },
  });
};

/**
 * Hook to update an existing company address
 */
export const useUpdateCompanyAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateCompanyAddress(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companyAddresses.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.companyAddresses.detail(variables.id) });
      const companyId = response?.data?.companyId || response?.data?.company_id || variables?.data?.companyId || variables?.data?.company_id;
      if (companyId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.companyAddresses.byCompany(companyId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.companyAddresses.primary(companyId) });
      }
    },
  });
};

/**
 * Hook to update company address active status
 */
export const useUpdateCompanyAddressStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }) => updateCompanyAddressStatus(id, isActive),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companyAddresses.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.companyAddresses.detail(variables.id) });
      const companyId = response?.data?.companyId || response?.data?.company_id;
      if (companyId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.companyAddresses.byCompany(companyId) });
      }
    },
  });
};

/**
 * Hook to mark address as primary
 */
export const useSetPrimaryCompanyAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => setPrimaryCompanyAddress(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companyAddresses.all });
      const companyId = response?.data?.companyId || response?.data?.company_id;
      if (companyId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.companyAddresses.byCompany(companyId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.companyAddresses.primary(companyId) });
      }
    },
  });
};

/**
 * Hook to delete a company address
 */
export const useDeleteCompanyAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }) => deleteCompanyAddress(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companyAddresses.all });
      if (variables.companyId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.companyAddresses.byCompany(variables.companyId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.companyAddresses.primary(variables.companyId) });
      }
    },
  });
};
