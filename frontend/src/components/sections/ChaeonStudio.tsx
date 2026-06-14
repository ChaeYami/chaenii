"use client";

import Image from "next/image";
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

          <div className="relative flex flex-col items-center gap-8">
            {/* 로고 배너 */}
            <Image
              src="/chaeon-studio.png"
              alt="Chaeon Studio — small apps, warmly made."
              width={3554}
              height={1092}
              priority={false}
              className="w-full max-w-2xl rounded-xl"
            />

            <div className="flex w-full flex-col items-center gap-6 sm:flex-row sm:justify-between">
              <p className="text-center leading-relaxed text-text-secondary sm:text-left">
                직접 기획하고 만들어 운영 중인 1인 앱 스튜디오입니다.
                <br />
                각 앱의 고객센터를 운영중입니다.
              </p>

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
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
