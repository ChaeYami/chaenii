"use client";

import Image from "next/image";
import type { Study } from "@/types/study";
import { Card, Badge } from "@/components/ui";

export default function StudyCard({ study }: { study: Study }) {
  const handleClick = () => {
    if (study.notionUrl) window.open(study.notionUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Card
      onClick={handleClick}
      className={`group h-full overflow-hidden !p-0 ${study.notionUrl ? "cursor-pointer" : ""}`}
    >
      {study.imageUrl && (
        <div className="relative h-36 w-full overflow-hidden">
          <Image
            src={study.imageUrl}
            alt={study.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <div className="p-5">
        <h3 className="text-base font-semibold group-hover:text-purple transition-colors">
          {study.title}
        </h3>

        {study.period && (
          <p className="mt-1 font-mono text-xs text-text-muted">{study.period}</p>
        )}

        {study.description && (
          <p className="mt-1.5 text-sm text-text-secondary line-clamp-2">
            {study.description}
          </p>
        )}

        {study.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {study.tags.map((tag) => (
              <Badge key={tag} className="text-xs">{tag}</Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
