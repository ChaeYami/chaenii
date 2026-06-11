"use client";

import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types/project";
import { Card, Badge } from "@/components/ui";

interface ProjectCardProps {
  project: Project;
}

// 카드 하단에 노출할 외부 링크 (우선순위 = 표시 순서)
function externalLinks(p: Project): { label: string; href: string }[] {
  const links: { label: string; href: string }[] = [];
  if (p.serviceUrl) links.push({ label: "서비스", href: p.serviceUrl });
  if (p.appStoreUrl) links.push({ label: "App Store", href: p.appStoreUrl });
  if (p.playStoreUrl) links.push({ label: "Play Store", href: p.playStoreUrl });
  if (p.githubUrl) links.push({ label: "GitHub", href: p.githubUrl });
  if (p.notionUrl) links.push({ label: "Notion", href: p.notionUrl });
  return links;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const hasDetail = !!project.detailContent?.trim();
  const detailHref = `/projects/${project.slug}`;
  const links = externalLinks(project);
  // 본문 클릭 = 스토어/서비스 링크 우선. 없으면 상세 페이지로 (GitHub·Notion은 본문 대상에서 제외)
  // 빈 값이 null이 아니라 "" 로 내려오는 프로젝트가 있어 ?? 가 아닌 truthy(find)로 첫 유효 링크를 고른다
  const primary = [project.serviceUrl, project.appStoreUrl, project.playStoreUrl].find(Boolean);
  const bodyHref = primary ?? (hasDetail ? detailHref : null);
  const bodyExternal = primary != null;
  // 본문이 이미 상세로 가는 경우(스토어/서비스 링크 없음)엔 하단 상세보기 버튼은 생략
  const showDetailButton = hasDetail && primary != null;

  const body = (
    <>
      {project.coverImageUrl && (
        <div className="relative h-40 w-full overflow-hidden">
          <Image
            src={project.coverImageUrl}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <div className="p-5">
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
      </div>
    </>
  );

  return (
    <Card className="group flex h-full flex-col overflow-hidden !p-0">
      {bodyHref ? (
        bodyExternal ? (
          <a
            href={bodyHref}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            {body}
          </a>
        ) : (
          <Link href={bodyHref} className="cursor-pointer">
            {body}
          </Link>
        )
      ) : (
        <div>{body}</div>
      )}

      {(links.length > 0 || showDetailButton) && (
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border px-5 py-3 text-xs">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary transition-colors hover:text-purple"
            >
              {l.label} ↗
            </a>
          ))}
          {showDetailButton && (
            <Link
              href={detailHref}
              className="text-text-secondary transition-colors hover:text-purple"
            >
              상세보기
            </Link>
          )}
        </div>
      )}
    </Card>
  );
}
