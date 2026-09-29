import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../query/queryKeys.js";
import {
  getBanks,
  getBankById,
  getBankByCode,
  createBank,
  updateBank,
  patchBank,
  deleteBank,
} from "../services/bankService.js";

/**
 * Hook to fetch paginated & filtered list of banks from master directory
 */
export const useBanks = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.banks.list(params),
    queryFn: () => getBanks(params),
    placeholderData: (previousData) => previousData,
    ...options,
  });
};

/**
 * Hook to fetch single bank master by ID
 */
export const useBank = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.banks.detail(id),
    queryFn: () => getBankById(id),
    enabled: Boolean(id) && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to fetch bank by bank code
 */
export const useBankByCode = (code, options = {}) => {
  return useQuery({
    queryKey: queryKeys.banks.byCode(code),
    queryFn: () => getBankByCode(code),
    enabled: Boolean(code) && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to create a new bank in master directory
 */
export const useCreateBank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createBank(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.banks.all });
    },
  });
};

/**
 * Hook to update an existing bank master record
 */
export const useUpdateBank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateBank(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.banks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.banks.detail(variables.id) });
    },
  });
};

/**
 * Hook to delete a bank master record
 */
export const useDeleteBank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteBank(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.banks.all });
    },
  });
};
