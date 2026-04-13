import type { AdminProject, ProjectFormData } from "@/types/admin-project";
import { request } from "./client";

export async function getAdminProjects(): Promise<AdminProject[]> {
  return request<AdminProject[]>("/api/admin/projects");
}

export async function createProject(data: ProjectFormData): Promise<AdminProject> {
  return request<AdminProject>("/api/admin/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProject(id: number, data: ProjectFormData): Promise<AdminProject> {
  return request<AdminProject>(`/api/admin/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProject(id: number): Promise<void> {
  await request<unknown>(`/api/admin/projects/${id}`, {
    method: "DELETE",
  });
}

export async function reorderProjects(ids: number[]): Promise<void> {
  await request<unknown>("/api/admin/projects/reorder", {
    method: "PUT",
    body: JSON.stringify({ ids }),
  });
}
