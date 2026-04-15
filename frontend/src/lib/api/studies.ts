import type { Study } from "@/types/study";
import { request } from "./client";

export async function getStudies(): Promise<Study[]> {
  return request<Study[]>("/api/studies");
}
