"use client";

import { motion } from "framer-motion";
import { useScrollAnimation, fadeUp, transition } from "@/hooks/useScrollAnimation";
import { Card } from "@/components/ui";

const CARDS = [
  { emoji: "⚾", title: "KBO 야구", desc: "SSG Landers 팬. 야구장은 에너지 충전소." },
  { emoji: "🎮", title: "게임", desc: "여가 시간엔 게임으로 리프레시." },
  { emoji: "🛠️", title: "사이드 프로젝트", desc: "배운 걸 직접 만들어 보면서 익히는 걸 좋아합니다." },
];

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

export default function About() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="about" className="py-24">
      <motion.div
        ref={ref}
        className="mx-auto max-w-5xl px-6"
        variants={container}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.h2
          className="text-3xl font-bold tracking-tight"
          variants={fadeUp}
          transition={transition}
        >
          About
        </motion.h2>

        <motion.p
          className="mt-4 max-w-2xl text-text-secondary leading-relaxed"
          variants={fadeUp}
          transition={transition}
        >
          백엔드부터 모바일까지 다루는 풀스택 개발자 채야미입니다. 새로운 기술을 배우고 직접 사이드 프로젝트로 만들어보는 걸 좋아합니다.
        </motion.p>

        <motion.div
          className="mt-12 grid gap-6 sm:grid-cols-3"
          variants={container}
        >
          {CARDS.map((card) => (
            <motion.div
              key={card.title}
              variants={fadeUp}
              transition={transition}
            >
              <Card className="h-full">
                <span className="text-3xl">{card.emoji}</span>
                <h3 className="mt-3 text-lg font-semibold">{card.title}</h3>
                <p className="mt-1 text-sm text-text-secondary">{card.desc}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
