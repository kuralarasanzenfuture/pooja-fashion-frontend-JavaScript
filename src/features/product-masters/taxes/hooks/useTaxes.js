import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../../query/queryKeys.js";
import taxService from "../services/taxService.js";

/**
 * Hook to fetch paginated & filtered taxes list
 */
export const useTaxes = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.taxes.list(params),
    queryFn: () => taxService.getTaxes(params),
    placeholderData: (previousData) => previousData,
    ...options,
  });
};

/**
 * Hook to fetch unpaginated taxes list (for dropdowns / billing / POS)
 */
export const useAllTaxes = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.taxes.allList(params),
    queryFn: () => taxService.getAllTaxes(params),
    ...options,
  });
};

/**
 * Hook to fetch tax summary statistics
 */
export const useTaxStats = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.taxes.stats(params),
    queryFn: () => taxService.getTaxStats(params),
    ...options,
  });
};

/**
 * Hook to fetch single tax details by ID
 */
export const useTax = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.taxes.detail(id),
    queryFn: () => taxService.getTaxById(id),
    enabled: Boolean(id),
    ...options,
  });
};

/**
 * Hook to fetch all taxes for a specific company
 */
export const useTaxesByCompany = (companyId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.taxes.byCompany(companyId),
    queryFn: () => taxService.getTaxesByCompanyId(companyId),
    enabled: Boolean(companyId),
    ...options,
  });
};

/**
 * Hook to fetch tax by company and code
 */
export const useTaxByCode = (companyId, taxCode, options = {}) => {
  return useQuery({
    queryKey: queryKeys.taxes.byCode(companyId, taxCode),
    queryFn: () => taxService.getTaxByCode(companyId, taxCode),
    enabled: Boolean(companyId && taxCode),
    ...options,
  });
};

/**
 * Mutation: Create a new tax record
 */
export const useCreateTax = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => taxService.createTax(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taxes.all });
      if (options.onSuccess) options.onSuccess(data, variables);
    },
    ...options,
  });
};

/**
 * Mutation: Update existing tax
 */
export const useUpdateTax = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => taxService.updateTax(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taxes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.taxes.detail(variables.id) });
      if (options.onSuccess) options.onSuccess(data, variables);
    },
    ...options,
  });
};

/**
 * Mutation: Toggle or update tax status
 */
export const useUpdateTaxStatus = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_active }) => taxService.updateTaxStatus(id, is_active),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taxes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.taxes.detail(variables.id) });
      if (options.onSuccess) options.onSuccess(data, variables);
    },
    ...options,
  });
};

/**
 * Mutation: Delete a tax record
 */
export const useDeleteTax = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => taxService.deleteTax(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taxes.all });
      if (options.onSuccess) options.onSuccess(data, variables);
    },
    ...options,
  });
};

/**
 * Mutation: Seed standard default Indian GST slabs
 */
export const useSeedDefaultTaxes = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => taxService.seedDefaultTaxes(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taxes.all });
      if (options.onSuccess) options.onSuccess(data, variables);
    },
    ...options,
  });
};

/**
 * Mutation: Calculate tax breakdown
 */
export const useCalculateTax = (options = {}) => {
  return useMutation({
    mutationFn: (data) => taxService.calculateTax(data),
    ...options,
  });
};

/**
 * Mutation: Check tax name uniqueness
 */
export const useCheckTaxName = () => {
  return useMutation({
    mutationFn: (params) => taxService.checkTaxNameExists(params),
  });
};

/**
 * Mutation: Check tax code uniqueness
 */
export const useCheckTaxCode = () => {
  return useMutation({
    mutationFn: (params) => taxService.checkTaxCodeExists(params),
  });
};

