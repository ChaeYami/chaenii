"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useScrollAnimation, fadeUp, transition } from "@/hooks/useScrollAnimation";
import { Badge } from "@/components/ui";

const TABS = ["Backend", "Frontend", "Infra", "Tool"] as const;
type Tab = (typeof TABS)[number];

const SKILLS: Record<Tab, string[]> = {
  Backend: ["Java 17", "Spring Boot", "Spring Security", "JWT", "JPA", "QueryDSL", "MapStruct", "Flyway", "PostgreSQL", "MySQL", "Redis", "Python", "Django"],
  Frontend: ["React Native", "Expo", "Expo Router", "TypeScript", "JavaScript", "Next.js", "Tailwind", "React Query", "Zustand", "Axios"],
  Infra: ["AWS ECS Fargate", "AWS EC2", "S3", "CloudFront", "Route 53", "RDS", "Secrets Manager", "Docker", "GitHub Actions", "NginX", "Firebase FCM", "EAS Build"],
  Tool: ["Git", "Notion", "Figma"],
};

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

export default function Skills() {
  const [active, setActive] = useState<Tab>("Backend");
  const { ref, isInView } = useScrollAnimation();

  return (
    <section className="py-24">
      <motion.div
        ref={ref}
        className="mx-auto max-w-5xl border-t border-border px-6 pt-24"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={container}
      >
        <motion.h2
          className="text-3xl font-bold tracking-tight"
          variants={fadeUp}
          transition={transition}
        >
          Skills
        </motion.h2>

        {/* Tabs */}
        <motion.div
          className="mt-8 flex gap-2"
          variants={fadeUp}
          transition={transition}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200
                ${active === tab
                  ? "bg-purple/30 text-purple"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface"
                }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Skills grid */}
        <div className="mt-8 min-h-[120px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {SKILLS[active].map((skill, i) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...transition, delay: i * 0.04 }}
                >
                  <Badge className="px-3 py-1.5 text-sm">{skill}</Badge>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
