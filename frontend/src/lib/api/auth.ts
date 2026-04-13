import { request } from "./client";

export async function login(username: string, password: string) {
  return request<unknown>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function logout() {
  return request<unknown>("/api/auth/logout", {
    method: "POST",
  });
}
