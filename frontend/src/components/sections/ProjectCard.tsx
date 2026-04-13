"use client";

import Link from "next/link";
import type { Project } from "@/types/project";
import { Card, Badge } from "@/components/ui";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`}>
      <Card className="group h-full cursor-pointer">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold group-hover:text-purple transition-colors">
            {project.name}
          </h3>
          <Badge>{project.role}</Badge>
        </div>

        <p className="mt-1 font-mono text-xs text-text-muted">{project.period}</p>

        <p className="mt-3 text-sm text-text-secondary line-clamp-2">
          {project.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.skills.map((skill) => (
            <Badge key={skill} className="text-xs">{skill}</Badge>
          ))}
        </div>
      </Card>
    </Link>
  );
}
