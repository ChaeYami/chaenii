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
          className="relative overflow-hidden rounded-2xl border border-[#f0dcd5] px-8 py-6 shadow-[0_8px_40px_-12px_rgba(216,123,168,0.35)] sm:px-10"
          style={{
            background:
              "linear-gradient(165deg, #F8F4F1 0%, #F8F0EE 55%, #FBE2EA 100%)",
          }}
        >
          {/* 하단 핑크 웨이브 (브랜드 사이트 오마주) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
            style={{
              background:
                "radial-gradient(120% 80% at 50% 120%, rgba(248,200,212,0.6) 0%, transparent 70%)",
            }}
          />

          <div className="relative flex flex-col items-start">
            {/* 로고 (투명배경) */}
            <Image
              src="/chaeon-studio-wide-nobg.png"
              alt="Chaeon Studio — small apps, warmly made."
              width={2711}
              height={623}
              priority={false}
              className="w-full max-w-[320px]"
            />

            <div className="mt-4 flex w-full flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-relaxed text-[#7a6258]">
                직접 기획하고 만들어 운영 중인 1인 앱 스튜디오입니다.
                <br />
                각 앱의 고객센터를 운영중입니다.
              </p>

              <a
                href="https://chaeon.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#d97ba8] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#cf6c9c] hover:shadow-md"
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
