import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../../query/queryKeys.js";
import {
  getUnits,
  getAllUnits,
  getUnitStats,
  getUnitById,
  createUnit,
  updateUnit,
  updateUnitStatus,
  seedDefaultUnits,
  deleteUnit,
} from "../services/unitService.js";

/**
 * Hook to query paginated units with filters & search
 */
export const useUnits = (params = {}) => {
  return useQuery({
    queryKey: queryKeys.units.list(params),
    queryFn: () => getUnits(params),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 2,
  });
};

/**
 * Hook to query all units without pagination (for dropdowns)
 */
export const useAllUnits = (params = {}) => {
  return useQuery({
    queryKey: queryKeys.units.allList(params),
    queryFn: () => getAllUnits(params),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook to query unit aggregate statistics
 */
export const useUnitStats = (params = {}) => {
  return useQuery({
    queryKey: queryKeys.units.stats(params),
    queryFn: () => getUnitStats(params),
    staleTime: 1000 * 60 * 3,
  });
};

/**
 * Hook to query a single unit by ID
 */
export const useUnit = (id) => {
  return useQuery({
    queryKey: queryKeys.units.detail(id),
    queryFn: () => getUnitById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook to create a new unit
 */
export const useCreateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createUnit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.units.all });
    },
  });
};

/**
 * Hook to update an existing unit
 */
export const useUpdateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateUnit(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.units.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.units.detail(id) });
    },
  });
};

/**
 * Hook to toggle unit active status
 */
export const useUpdateUnitStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, is_active }) => updateUnitStatus(id, is_active),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.units.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.units.detail(id) });
    },
  });
};

/**
 * Hook to seed default standard units
 */
export const useSeedDefaultUnits = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => seedDefaultUnits(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.units.all });
    },
  });
};

/**
 * Hook to delete a unit
 */
export const useDeleteUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteUnit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.units.all });
    },
  });
};

export default {
  useUnits,
  useAllUnits,
  useUnitStats,
  useUnit,
  useCreateUnit,
  useUpdateUnit,
  useUpdateUnitStatus,
  useSeedDefaultUnits,
  useDeleteUnit,
};
