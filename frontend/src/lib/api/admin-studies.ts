import type { AdminStudy, StudyFormData } from "@/types/admin-project";
import { request } from "./client";

export async function getAdminStudies(): Promise<AdminStudy[]> {
  return request<AdminStudy[]>("/api/admin/studies");
}

export async function createStudy(data: StudyFormData): Promise<AdminStudy> {
  return request<AdminStudy>("/api/admin/studies", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateStudy(id: number, data: StudyFormData): Promise<AdminStudy> {
  return request<AdminStudy>(`/api/admin/studies/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteStudy(id: number): Promise<void> {
  await request<unknown>(`/api/admin/studies/${id}`, { method: "DELETE" });
}

export async function reorderStudies(ids: number[]): Promise<void> {
  await request<unknown>("/api/admin/studies/reorder", {
    method: "PUT",
    body: JSON.stringify({ ids }),
  });
}
