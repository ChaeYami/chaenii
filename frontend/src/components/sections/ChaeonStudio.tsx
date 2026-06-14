"use client";

import { motion } from "framer-motion";
import { useScrollAnimation, fadeUp, transition } from "@/hooks/useScrollAnimation";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function ChaeonStudio() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="studio" className="py-12">
      <motion.div
        ref={ref}
        className="mx-auto max-w-5xl px-6"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={container}
      >
        <motion.div
          variants={fadeUp}
          transition={transition}
          className="relative overflow-hidden rounded-2xl border border-border bg-surface-2 px-8 py-10 sm:px-12 sm:py-12"
        >
          {/* 배경 글로우 */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-pink/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-purple/10 blur-3xl"
          />

          <div className="relative flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <div className="flex items-center gap-3">
                {/* 파워 아이콘 모티프 (로고 오마주) */}
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-pink/40 bg-pink/10">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-pink"
                    aria-hidden
                  >
                    <path d="M12 4v8" />
                    <path d="M7.5 7a7 7 0 1 0 9 0" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Chaeon Studio</h2>
                  <p className="font-mono text-xs text-text-muted">
                    small apps, warmly made.
                  </p>
                </div>
              </div>

              <p className="mt-5 leading-relaxed text-text-secondary">
                직접 기획하고 만들어 운영 중인 1인 앱 스튜디오입니다.
                <br />
                오늘한장 · 발자국 · DearMI 모두 이곳에서 시작됐어요.
              </p>
            </div>

            <a
              href="https://chaeon.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex shrink-0 items-center gap-2 rounded-xl border border-pink/40 bg-pink/10 px-5 py-3 text-sm font-medium text-pink transition-colors duration-200 hover:bg-pink/20"
            >
              chaeon.studio 방문
              <span className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
