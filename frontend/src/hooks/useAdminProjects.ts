"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProjectFormData } from "@/types/admin-project";
import * as api from "@/lib/api/admin-projects";

export function useAdminProjects() {
  return useQuery({
    queryKey: ["admin-projects"],
    queryFn: api.getAdminProjects,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ProjectFormData) => api.createProject(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-projects"] }),
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProjectFormData }) =>
      api.updateProject(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-projects"] }),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteProject(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-projects"] }),
  });
}

export function useReorderProjects() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: number[]) => api.reorderProjects(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-projects"] }),
  });
}
