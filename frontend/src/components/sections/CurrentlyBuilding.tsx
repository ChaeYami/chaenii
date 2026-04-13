"use client";

import { motion } from "framer-motion";
import { useScrollAnimation, fadeUp, transition } from "@/hooks/useScrollAnimation";
import { useProjects } from "@/hooks/useProjects";
import { Badge, Skeleton } from "@/components/ui";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function CurrentlyBuilding() {
  const { data: allProjects, isLoading } = useProjects();
  const building = allProjects?.filter((p) => p.status === "building");
  const { ref, isInView } = useScrollAnimation();

  if (!isLoading && (!building || building.length === 0)) return null;

  return (
    <section className="border-t border-border py-24">
      <motion.div
        ref={ref}
        className="mx-auto max-w-5xl px-6"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={container}
      >
        <motion.h2
          className="text-3xl font-bold tracking-tight"
          variants={fadeUp}
          transition={transition}
        >
          Currently Building
        </motion.h2>

        <div className="mt-8 space-y-6">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))
          ) : (
            building!.map((project) => (
              <motion.div
                key={project.id}
                className="rounded-xl border border-border bg-surface p-6"
                variants={fadeUp}
                transition={transition}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    <p className="mt-1 text-sm text-text-secondary">
                      {project.description}
                    </p>
                  </div>
                  <Badge>{project.role}</Badge>
                </div>

                {/* Progress bar */}
                {project.progress != null && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-text-muted mb-1.5">
                      <span>Progress</span>
                      <span className="font-mono">{project.progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple to-pink"
                        style={{
                          width: `${project.progress}%`,
                          transition: "width 1s ease-out",
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.skills.map((skill) => (
                    <Badge key={skill} className="text-xs">{skill}</Badge>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </section>
  );
}
