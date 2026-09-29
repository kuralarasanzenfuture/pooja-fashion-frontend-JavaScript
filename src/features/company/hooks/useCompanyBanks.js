import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../query/queryKeys.js";
import {
  getCompanyBanks,
  getCompanyBankById,
  getBanksByCompanyId,
  getPrimaryBankByCompanyId,
  createCompanyBank,
  updateCompanyBank,
  updateCompanyBankStatus,
  setPrimaryCompanyBank,
  deleteCompanyBank,
} from "../services/companyBankService.js";

/**
 * Hook to fetch paginated & filtered list of company bank accounts
 */
export const useCompanyBanks = (params = {}) => {
  return useQuery({
    queryKey: queryKeys.companyBanks.list(params),
    queryFn: () => getCompanyBanks(params),
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook to fetch single company bank account by ID
 */
export const useCompanyBank = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.companyBanks.detail(id),
    queryFn: () => getCompanyBankById(id),
    enabled: Boolean(id) && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to fetch all bank accounts belonging to a specific company
 */
export const useCompanyBanksByCompany = (companyId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.companyBanks.byCompany(companyId),
    queryFn: () => getBanksByCompanyId(companyId),
    enabled: Boolean(companyId) && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to fetch primary bank account for a specific company
 */
export const useCompanyPrimaryBank = (companyId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.companyBanks.primary(companyId),
    queryFn: () => getPrimaryBankByCompanyId(companyId),
    enabled: Boolean(companyId) && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to create a new company bank account
 */
export const useCreateCompanyBank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createCompanyBank(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companyBanks.all });
      const companyId = variables.companyId || variables.company_id;
      if (companyId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.companyBanks.byCompany(companyId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.companyBanks.primary(companyId) });
      }
    },
  });
};

/**
 * Hook to update an existing company bank account
 */
export const useUpdateCompanyBank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateCompanyBank(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companyBanks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.companyBanks.detail(variables.id) });
      const companyId =
        response?.data?.companyId ||
        response?.data?.company_id ||
        variables?.data?.companyId ||
        variables?.data?.company_id;
      if (companyId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.companyBanks.byCompany(companyId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.companyBanks.primary(companyId) });
      }
    },
  });
};

/**
 * Hook to update company bank account active status
 */
export const useUpdateCompanyBankStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }) => updateCompanyBankStatus(id, isActive),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companyBanks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.companyBanks.detail(variables.id) });
      const companyId = response?.data?.companyId || response?.data?.company_id;
      if (companyId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.companyBanks.byCompany(companyId) });
      }
    },
  });
};

/**
 * Hook to mark company bank account as primary
 */
export const useSetPrimaryCompanyBank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => setPrimaryCompanyBank(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companyBanks.all });
      const companyId = response?.data?.companyId || response?.data?.company_id;
      if (companyId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.companyBanks.byCompany(companyId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.companyBanks.primary(companyId) });
      }
    },
  });
};

/**
 * Hook to delete a company bank account
 */
export const useDeleteCompanyBank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }) => deleteCompanyBank(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companyBanks.all });
      if (variables.companyId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.companyBanks.byCompany(variables.companyId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.companyBanks.primary(variables.companyId) });
      }
    },
  });
};
