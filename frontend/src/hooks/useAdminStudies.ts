"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { StudyFormData } from "@/types/admin-project";
import * as api from "@/lib/api/admin-studies";

export function useAdminStudies() {
  return useQuery({
    queryKey: ["admin-studies"],
    queryFn: api.getAdminStudies,
  });
}

export function useCreateStudy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: StudyFormData) => api.createStudy(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-studies"] }),
  });
}

export function useUpdateStudy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: StudyFormData }) =>
      api.updateStudy(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-studies"] }),
  });
}

export function useDeleteStudy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteStudy(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-studies"] }),
  });
}

export function useReorderStudies() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: number[]) => api.reorderStudies(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-studies"] }),
  });
}
