import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../query/queryKeys.js";
import {
  getBankIdentifiers,
  getBankIdentifierById,
  getBankIdentifiersByBankId,
  getBankIdentifierByValue,
  createBankIdentifier,
  updateBankIdentifier,
  patchBankIdentifier,
  deleteBankIdentifier,
} from "../services/bankService.js";

/**
 * Hook to fetch paginated & filtered list of bank branch identifiers
 */
export const useBankIdentifiers = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.bankIdentifiers.list(params),
    queryFn: () => getBankIdentifiers(params),
    placeholderData: (previousData) => previousData,
    ...options,
  });
};

/**
 * Hook to fetch identifiers for a specific bank
 */
export const useBankIdentifiersByBank = (bankId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.bankIdentifiers.byBank(bankId),
    queryFn: () => getBankIdentifiersByBankId(bankId),
    enabled: Boolean(bankId) && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to lookup bank branch by identifier code (e.g. IFSC, MICR)
 */
export const useBankIdentifierLookup = (identifierValue, options = {}) => {
  return useQuery({
    queryKey: queryKeys.bankIdentifiers.byValue(identifierValue),
    queryFn: () => getBankIdentifierByValue(identifierValue),
    enabled: Boolean(identifierValue) && options.enabled !== false,
    retry: false,
    ...options,
  });
};

/**
 * Hook to fetch single bank identifier by ID
 */
export const useBankIdentifier = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.bankIdentifiers.detail(id),
    queryFn: () => getBankIdentifierById(id),
    enabled: Boolean(id) && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to create a new bank identifier
 */
export const useCreateBankIdentifier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createBankIdentifier(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankIdentifiers.all });
    },
  });
};

/**
 * Hook to update a bank identifier
 */
export const useUpdateBankIdentifier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateBankIdentifier(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankIdentifiers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.bankIdentifiers.detail(variables.id) });
    },
  });
};

/**
 * Hook to delete a bank identifier
 */
export const useDeleteBankIdentifier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteBankIdentifier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankIdentifiers.all });
    },
  });
};
