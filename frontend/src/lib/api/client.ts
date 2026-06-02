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
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    // 백엔드에 연결할 수 없음 (점검으로 서버를 내린 경우 503이 아니라
    // 네트워크 에러로 reject되므로, 503과 동일하게 점검 페이지로 보낸다)
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/admin")) {
      window.location.href = "/maintenance.html";
      return new Promise<T>(() => {});
    }
    throw new ApiError(0, null, "서버에 연결할 수 없습니다");
  }

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
