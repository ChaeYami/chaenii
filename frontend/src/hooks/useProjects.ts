"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjects, getProject } from "@/lib/api/projects";

export function useProjects(category?: string) {
  return useQuery({
    queryKey: ["projects", category],
    queryFn: () => getProjects(category),
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: () => getProject(slug),
    enabled: !!slug,
  });
}
