"use client";

import { useEffect, useState } from "react";

type Reason = "maintenance" | "network" | "error";

interface Props {
  reason: Reason;
}

const MAINT_START_HOUR = 3;
const MAINT_END_HOUR = 7;

function getKstParts() {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60_000;
  const kst = new Date(utcMs + 9 * 60 * 60_000);
  return {
    h: kst.getUTCHours(),
    m: kst.getUTCMinutes(),
    s: kst.getUTCSeconds(),
  };
}

function isInMaintenanceWindow() {
  const { h } = getKstParts();
  return h >= MAINT_START_HOUR && h < MAINT_END_HOUR;
}

function computeRemainingSec() {
  const { h, m, s } = getKstParts();
  const now = h * 3600 + m * 60 + s;
  const end = MAINT_END_HOUR * 3600;
  return Math.max(0, end - now);
}

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export default function MaintenanceView({ reason }: Props) {
  const [inWindow, setInWindow] = useState(() => isInMaintenanceWindow());
  const [remaining, setRemaining] = useState(() => computeRemainingSec());

  useEffect(() => {
    const id = setInterval(() => {
      setInWindow(isInMaintenanceWindow());
      setRemaining(computeRemainingSec());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "서비스 점검 중 · chaenii.me";

    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);

    return () => {
      document.title = prevTitle;
      meta.parentNode?.removeChild(meta);
    };
  }, []);

  const mm = Math.floor(remaining / 60);
  const ss = remaining % 60;

  const fallbackMessage =
    reason === "network"
      ? "네트워크 연결을 확인해 주세요."
      : reason === "error"
      ? "잠시 후 다시 시도해 주세요."
      : "잠시 후 다시 방문해 주세요.";

  return (
    <main
      role="main"
      className="flex min-h-screen items-center justify-center bg-bg px-5 py-8"
    >
      <section
        aria-labelledby="maintenance-title"
        className="w-full max-w-[520px] rounded-lg border border-border bg-surface px-6 py-12 text-center md:px-8"
      >
        <span className="mb-5 inline-block text-4xl leading-none" aria-hidden>
          ⏰
        </span>
        <h1
          id="maintenance-title"
          className="mb-3 text-2xl font-bold tracking-tight text-text-primary md:text-3xl"
        >
          서비스 점검 중
        </h1>
        <p className="text-text-secondary">
          매일{" "}
          <strong className="text-text-primary">
            03:00 ~ 07:00 (KST, UTC+9)
          </strong>{" "}
          사이에
          <br />
          서버 최적화를 위한 정기 점검이 진행됩니다.
        </p>

        <div
          role="status"
          aria-live="polite"
          aria-label="서비스 재개까지 남은 시간"
          className="mx-auto mt-8 inline-block min-w-[13rem] rounded-lg border border-purple/40 bg-purple/15 px-5 py-3 font-mono text-base text-purple tabular-nums"
        >
          {inWindow
            ? `약 ${pad(mm)}분 ${pad(ss)}초 후 재개`
            : "예상치 못한 오류가 발생했습니다"}
        </div>

        <p className="mt-3 text-sm text-text-muted">{fallbackMessage}</p>

        <footer className="mt-8 border-t border-border pt-6 font-mono text-xs text-text-muted">
          운영자 · Chaeyeon
          {/* TODO: GitHub, Email 링크 추가 */}
        </footer>
      </section>
    </main>
  );
}
