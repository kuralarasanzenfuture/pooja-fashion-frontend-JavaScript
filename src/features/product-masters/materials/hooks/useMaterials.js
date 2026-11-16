import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../../query/queryKeys.js";
import {
  getMaterials,
  getAllMaterials,
  getMaterialStats,
  getMaterialById,
  createMaterial,
  updateMaterial,
  updateMaterialStatus,
  seedDefaultMaterials,
  deleteMaterial,
} from "../services/materialService.js";

/**
 * Hook to query paginated materials with filters & search
 */
export const useMaterials = (params = {}) => {
  return useQuery({
    queryKey: queryKeys.materials.list(params),
    queryFn: () => getMaterials(params),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 2,
  });
};

/**
 * Hook to query all materials without pagination (for dropdowns)
 */
export const useAllMaterials = (params = {}) => {
  return useQuery({
    queryKey: queryKeys.materials.allList(params),
    queryFn: () => getAllMaterials(params),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook to query material aggregate statistics
 */
export const useMaterialStats = (params = {}) => {
  return useQuery({
    queryKey: queryKeys.materials.stats(params),
    queryFn: () => getMaterialStats(params),
    staleTime: 1000 * 60 * 3,
  });
};

/**
 * Hook to query a single material by ID
 */
export const useMaterial = (id) => {
  return useQuery({
    queryKey: queryKeys.materials.detail(id),
    queryFn: () => getMaterialById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook to create a new material
 */
export const useCreateMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createMaterial(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.materials.all });
    },
  });
};

/**
 * Hook to update an existing material
 */
export const useUpdateMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateMaterial(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.materials.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.materials.detail(id) });
    },
  });
};

/**
 * Hook to toggle material active status
 */
export const useUpdateMaterialStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, is_active }) => updateMaterialStatus(id, is_active),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.materials.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.materials.detail(id) });
    },
  });
};

/**
 * Hook to seed default standard materials
 */
export const useSeedDefaultMaterials = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => seedDefaultMaterials(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.materials.all });
    },
  });
};

/**
 * Hook to delete a material
 */
export const useDeleteMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.materials.all });
    },
  });
};

export default {
  useMaterials,
  useAllMaterials,
  useMaterialStats,
  useMaterial,
  useCreateMaterial,
  useUpdateMaterial,
  useUpdateMaterialStatus,
  useSeedDefaultMaterials,
  useDeleteMaterial,
};
