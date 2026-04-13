"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { GuestbookPage } from "@/types/guestbook";
import type { GuestbookFormData } from "@/lib/schema/guestbook";
import * as api from "@/lib/api/guestbook";

export function useGuestbooks() {
  return useInfiniteQuery<GuestbookPage>({
    queryKey: ["guestbooks"],
    queryFn: ({ pageParam }) => api.getGuestbooks(pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.number + 1,
  });
}

export function useCreateGuestbook() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: GuestbookFormData) => api.createGuestbook(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["guestbooks"] });
    },
  });
}

export function useDeleteGuestbook() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, password }: { id: number; password: string }) =>
      api.deleteGuestbook(id, password),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["guestbooks"] });
    },
  });
}

export function useAddReply() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, content }: { id: number; content: string }) =>
      api.addReply(id, content),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["guestbooks"] });
    },
  });
}

export function useDeleteReply() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.deleteReply(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["guestbooks"] });
    },
  });
}

export function useHideGuestbook() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.hideGuestbook(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["guestbooks"] });
    },
  });
}
