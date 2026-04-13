import type { Project, ProjectDetail } from "@/types/project";
import { request } from "./client";

export async function getProjects(category?: string): Promise<Project[]> {
  const params = category ? `?category=${encodeURIComponent(category)}` : "";
  return request<Project[]>(`/api/projects${params}`);
}

export async function getProject(slug: string): Promise<ProjectDetail> {
  return request<ProjectDetail>(`/api/projects/${encodeURIComponent(slug)}`);
}
