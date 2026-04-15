"use client";

import { motion } from "framer-motion";
import { useScrollAnimation, fadeUp, transition } from "@/hooks/useScrollAnimation";
import { useStudies } from "@/hooks/useStudies";
import { Skeleton } from "@/components/ui";
import StudyCard from "./StudyCard";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function StudySection() {
  const { data: studies, isLoading } = useStudies();
  const { ref, isInView } = useScrollAnimation();

  if (!isLoading && (!studies || studies.length === 0)) return null;

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
          Study
        </motion.h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))
            : studies!.map((study) => (
                <motion.div key={study.id} variants={fadeUp} transition={transition}>
                  <StudyCard study={study} />
                </motion.div>
              ))}
        </div>
      </motion.div>
    </section>
  );
}
