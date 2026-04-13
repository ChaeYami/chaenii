import type { GuestbookPage } from "@/types/guestbook";
import type { GuestbookFormData } from "@/lib/schema/guestbook";
import { request } from "./client";

export async function getGuestbooks(page: number): Promise<GuestbookPage> {
  return request<GuestbookPage>(`/api/guestbook?page=${page}&size=10`);
}

export async function createGuestbook(data: GuestbookFormData) {
  return request<unknown>("/api/guestbook", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteGuestbook(id: number, password: string) {
  return request<unknown>(`/api/guestbook/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ password }),
  });
}

export async function addReply(id: number, content: string) {
  return request<unknown>(`/api/guestbook/${id}/reply`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export async function deleteReply(id: number) {
  return request<unknown>(`/api/guestbook/${id}/reply`, {
    method: "DELETE",
  });
}

export async function hideGuestbook(id: number) {
  return request<unknown>(`/api/guestbook/${id}/hide`, {
    method: "PATCH",
  });
}
