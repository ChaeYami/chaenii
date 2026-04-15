"use client";

import { useQuery } from "@tanstack/react-query";
import { getStudies } from "@/lib/api/studies";

export function useStudies() {
  return useQuery({
    queryKey: ["studies"],
    queryFn: getStudies,
  });
}
