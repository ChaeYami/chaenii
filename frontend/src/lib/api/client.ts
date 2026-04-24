const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string | null,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiResponse<T> {
  success: boolean;
  code: string | null;
  message: string | null;
  data: T;
}

export async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (res.status === 503 && typeof window !== "undefined") {
    if (window.location.pathname.startsWith("/admin")) {
      throw new ApiError(503, null, "서비스 점검 중입니다");
    }
    window.location.href = "/maintenance.html";
    return new Promise<T>(() => {});
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(
      res.status,
      body?.code ?? null,
      body?.message ?? res.statusText
    );
  }

  const json: ApiResponse<T> = await res.json();
  return json.data;
}
