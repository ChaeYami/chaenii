"use client";

import { motion } from "framer-motion";
import { useScrollAnimation, fadeUp, transition } from "@/hooks/useScrollAnimation";
import { Card } from "@/components/ui";

const CARDS = [
  { emoji: "⚾", title: "SSG Landers", desc: "스트레스 원인이자 스트레스 해소제." },
  { emoji: "🎮", title: "게임", desc: "두 번재 스트레스 해소제. \n언젠간 내 게임을 만들 거야." },
  { emoji: "🛠️", title: "개발", desc: "일이자 취미. \n좋아하는 걸 직업으로 갖는 행복." },
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

          웹 애플리케이션 개발을 중심으로  
          <br />
프론트엔드와 백엔드를 함께 다루고 있는 개발자입니다.  
<br /> 
<br />
업무 시스템 개발과 운영 경험을 바탕으로,  
<br />
모바일 앱 개발까지 확장하며 다양한 서비스를 구현하고 있습니다.

   
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
                <h3 className="mt-3 text-lg font-semibold text-[#c0c5cd]">{card.title}</h3>
                <p className="mt-1 whitespace-pre-line text-sm text-text-secondary">{card.desc}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
