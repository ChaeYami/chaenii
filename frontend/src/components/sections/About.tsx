"use client";

import { motion } from "framer-motion";
import { useScrollAnimation, fadeUp, transition } from "@/hooks/useScrollAnimation";
import { Card } from "@/components/ui";

const CARDS = [
  { emoji: "⚾", title: "KBO 야구", desc: "SSG Landers 팬. 야구장은 에너지 충전소." },
  { emoji: "🐶", title: "강아지", desc: "세상에서 제일 귀여운 존재. 반려견 바보." },
  { emoji: "💻", title: "1인개발", desc: "아이디어를 직접 만들고, 직접 운영합니다." },
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
          {/* TODO: 자기소개 텍스트 */}
          안녕하세요. 기획부터 배포까지 직접 하는 1인 풀스택 개발자 채야미입니다.
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
