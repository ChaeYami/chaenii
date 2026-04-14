"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useScrollAnimation, fadeUp, transition } from "@/hooks/useScrollAnimation";
import { useProjects } from "@/hooks/useProjects";
import { Skeleton } from "@/components/ui";
import ProjectCard from "./ProjectCard";

const CATEGORIES = ["전체", "모바일앱", "백엔드", "팀"] as const;

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function Projects() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get("category") ?? undefined;
  const active = category ?? "전체";

  const { data: projects, isLoading } = useProjects(
    active === "전체" ? undefined : active
  );
  const { ref, isInView } = useScrollAnimation();

  const handleFilter = (cat: string) => {
    if (cat === "전체") {
      router.push("/", { scroll: false });
    } else {
      router.push(`/?category=${encodeURIComponent(cat)}`, { scroll: false });
    }
  };

  return (
    <section id="projects" className="py-24">
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
          Projects
        </motion.h2>

        {/* Filter */}
        <motion.div
          className="mt-8 flex gap-2"
          variants={fadeUp}
          transition={transition}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200
                ${active === cat
                  ? "bg-purple/75 text-bg"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface"
                }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))
          ) : projects && projects.length > 0 ? (
            projects.map((project, i) => (
              <motion.div
                key={project.id}
                variants={fadeUp}
                transition={{ ...transition, delay: i * 0.06 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))
          ) : (
            <p className="col-span-2 text-center text-text-muted py-12">
              등록된 프로젝트가 없습니다.
            </p>
          )}
        </div>
      </motion.div>
    </section>
  );
}
