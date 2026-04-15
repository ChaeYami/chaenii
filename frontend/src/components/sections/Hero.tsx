"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { fadeUp, transition } from "@/hooks/useScrollAnimation";
import { Button, Badge } from "@/components/ui";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

export default function Hero() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* Background gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 80% 20%, rgba(139,92,246,0.10) 0%, rgba(244,114,182,0.05) 40%, transparent 70%)",
        }}
      />

      <motion.div
        className="relative mx-auto flex max-w-5xl flex-col items-center gap-12 px-6 pt-32 pb-20 md:flex-row md:items-center md:gap-16"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <motion.h1
            className="typing-cursor text-5xl font-bold tracking-tight md:text-6xl"
            variants={fadeUp}
            transition={transition}
          >
            Chaeyeon Seo
          </motion.h1>

          <motion.p
            className="mt-4 text-xl text-text-secondary"
            variants={fadeUp}
            transition={transition}
          >
            풀스택 개발자
          </motion.p>

          <motion.p
            className="mt-2 text-lg text-text-muted"
            variants={fadeUp}
            transition={transition}
          >
            기획, 설계부터 개발, 배포, 유지보수까지
          </motion.p>

          <motion.div
            className="mt-6"
            variants={fadeUp}
            transition={transition}
          >
            <Badge>🔨 Building: BallCap · DearMI</Badge>
          </motion.div>

          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start"
            variants={fadeUp}
            transition={transition}
          >
            <a href="https://github.com/ChaeYami" target="_blank" rel="noopener noreferrer">
              <Button variant="default">GitHub</Button>
            </a>
            <a href="https://chaeyami.tistory.com/" target="_blank" rel="noopener noreferrer">
              <Button variant="default">Blog</Button>
            </a>
            <a href="mailto:ssallyseo@gmail.com">
              <Button variant="default">Email</Button>
            </a>
          </motion.div>
        </div>

      </motion.div>

      {/* 스크롤 힌트 */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-secondary"
      >
        <span className="text-sm">스크롤해서 프로젝트를 확인해보세요</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="text-xs"
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  );
}
