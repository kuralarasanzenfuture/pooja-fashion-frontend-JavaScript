import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../query/queryKeys.js";
import {
  getCompanyContacts,
  getCompanyContactById,
  getContactsByCompanyId,
  getPrimaryContactByCompanyId,
  createCompanyContact,
  updateCompanyContact,
  updateCompanyContactStatus,
  setPrimaryCompanyContact,
  deleteCompanyContact,
} from "../services/companyContactService.js";

/**
 * Hook to fetch paginated & filtered list of company contacts
 */
export const useCompanyContacts = (params = {}) => {
  return useQuery({
    queryKey: queryKeys.companyContacts.list(params),
    queryFn: () => getCompanyContacts(params),
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook to fetch single contact by ID
 */
export const useCompanyContact = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.companyContacts.detail(id),
    queryFn: () => getCompanyContactById(id),
    enabled: Boolean(id) && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to fetch all contacts belonging to a specific company
 */
export const useCompanyContactsByCompany = (companyId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.companyContacts.byCompany(companyId),
    queryFn: () => getContactsByCompanyId(companyId),
    enabled: Boolean(companyId) && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to fetch primary contact for a specific company
 */
export const useCompanyPrimaryContact = (companyId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.companyContacts.primary(companyId),
    queryFn: () => getPrimaryContactByCompanyId(companyId),
    enabled: Boolean(companyId) && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to create a new company contact
 */
export const useCreateCompanyContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createCompanyContact(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companyContacts.all });
      const companyId = variables.companyId || variables.company_id;
      if (companyId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.companyContacts.byCompany(companyId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.companyContacts.primary(companyId) });
      }
    },
  });
};

/**
 * Hook to update an existing company contact
 */
export const useUpdateCompanyContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateCompanyContact(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companyContacts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.companyContacts.detail(variables.id) });
      const companyId = response?.data?.companyId || response?.data?.company_id || variables?.data?.companyId || variables?.data?.company_id;
      if (companyId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.companyContacts.byCompany(companyId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.companyContacts.primary(companyId) });
      }
    },
  });
};

/**
 * Hook to update company contact active status
 */
export const useUpdateCompanyContactStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }) => updateCompanyContactStatus(id, isActive),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companyContacts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.companyContacts.detail(variables.id) });
      const companyId = response?.data?.companyId || response?.data?.company_id;
      if (companyId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.companyContacts.byCompany(companyId) });
      }
    },
  });
};

/**
 * Hook to mark contact as primary
 */
export const useSetPrimaryCompanyContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => setPrimaryCompanyContact(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companyContacts.all });
      const companyId = response?.data?.companyId || response?.data?.company_id;
      if (companyId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.companyContacts.byCompany(companyId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.companyContacts.primary(companyId) });
      }
    },
  });
};

/**
 * Hook to delete a company contact
 */
export const useDeleteCompanyContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }) => deleteCompanyContact(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companyContacts.all });
      if (variables.companyId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.companyContacts.byCompany(variables.companyId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.companyContacts.primary(variables.companyId) });
      }
    },
  });
};
