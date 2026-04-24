"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import MaintenanceView from "./MaintenanceView";

type HealthStatus = "pending" | "ok" | "maintenance" | "network" | "error";
type ResolvedStatus = Exclude<HealthStatus, "pending">;

const CACHE_KEY = "health_check_cache";
const CACHE_TTL_MS = 30_000;
const TIMEOUT_MS = 3_000;

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

interface CachedEntry {
  status: ResolvedStatus;
  timestamp: number;
}

function readCache(): ResolvedStatus | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CachedEntry;
    if (Date.now() - entry.timestamp < CACHE_TTL_MS) {
      return entry.status;
    }
  } catch {
    // sessionStorage 접근 불가 / JSON 파싱 실패 → 캐시 무시
  }
  return null;
}

function writeCache(status: ResolvedStatus) {
  try {
    const entry: CachedEntry = { status, timestamp: Date.now() };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // quota 초과 / private 모드 → 캐싱 스킵
  }
}

async function performHealthCheck(): Promise<ResolvedStatus> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${API_URL}/actuator/health`, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    });
    if (res.ok) return "ok";
    if (res.status === 503) return "maintenance";
    return "error";
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return "maintenance";
    }
    return "network";
  } finally {
    clearTimeout(timer);
  }
}

export default function HealthCheckProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin") ?? false;

  const [status, setStatus] = useState<HealthStatus>("pending");

  useEffect(() => {
    if (isAdminRoute) return;

    const cached = readCache();
    if (cached) {
      setStatus(cached);
      return;
    }

    let cancelled = false;
    performHealthCheck().then((resolved) => {
      if (cancelled) return;
      setStatus(resolved);
      writeCache(resolved);
    });

    return () => {
      cancelled = true;
    };
  }, [isAdminRoute]);

  if (isAdminRoute) return <>{children}</>;

  if (process.env.NEXT_PUBLIC_FORCE_MAINTENANCE === "true") {
    return <MaintenanceView reason="maintenance" />;
  }

  if (status === "pending" || status === "ok") return <>{children}</>;

  return <MaintenanceView reason={status} />;
}
