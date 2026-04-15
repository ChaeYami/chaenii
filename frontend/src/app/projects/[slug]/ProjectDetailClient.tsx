"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import { useProject } from "@/hooks/useProjects";
import { Button, Badge, Skeleton } from "@/components/ui";
import TableOfContents from "./TableOfContents";

export default function ProjectDetailClient() {
  const router = useRouter();
  const pathname = usePathname();
  const slug = pathname.split("/").filter(Boolean).pop() ?? "";
  const { data: project, isLoading } = useProject(slug);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="mt-4 h-6 w-1/3" />
        <Skeleton className="mt-8 h-64 w-full" />
      </main>
    );
  }

  if (!project) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-text-muted">프로젝트를 찾을 수 없습니다.</p>
        <button onClick={() => router.back()} className="mt-4 text-purple hover:underline">
          &larr; 돌아가기
        </button>
      </main>
    );
  }

  const headingId = (text: unknown) =>
    String(text).toLowerCase().replace(/\s+/g, "-").replace(/[^\w가-힣-]/g, "");

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <div className="flex gap-16">
        {/* 본문 */}
        <main className="min-w-0 flex-1">
          <button
            onClick={() => router.back()}
            className="mb-8 text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            &larr; 돌아가기
          </button>

          {project.coverImageUrl && (
            <div className="relative mb-8 h-56 w-full overflow-hidden rounded-xl">
              <Image
                src={project.coverImageUrl}
                alt={project.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          <h1 className="text-4xl font-bold tracking-tight">{project.name}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm text-text-muted">{project.period}</span>
            <Badge>{project.role}</Badge>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.skills.map((skill) => (
              <Badge key={skill} className="text-xs">{skill}</Badge>
            ))}
          </div>

          <article className="prose-invert mt-12 max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                h2: ({ children }) => (
                  <h2 id={headingId(children)} className="mt-10 mb-4 text-2xl font-bold text-text-primary">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 id={headingId(children)} className="mt-8 mb-3 text-xl font-semibold text-text-primary">{children}</h3>
                ),
            p: ({ children }) => (
              <p className="mb-4 leading-relaxed text-text-secondary">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="mb-4 list-disc pl-6 text-text-secondary">{children}</ul>
            ),
            li: ({ children }) => <li className="mb-1">{children}</li>,
            code: ({ className, children, ...props }) => (
              <code
                className={`${className ?? ""} rounded bg-[#222325] px-1.5 py-0.5 font-mono text-sm text-[#c6cedb]`}
                {...props}
              >
                {children}
              </code>
            ),
            pre: ({ children }) => (
              <pre className="mb-4 overflow-x-auto rounded-lg bg-[#222325] p-4 text-[#c6cedb] [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-inherit">
                {children}
              </pre>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple underline underline-offset-2 hover:opacity-80"
              >
                {children}
              </a>
            ),
            hr: () => <hr className="my-8 border-border" />,
            strong: ({ children }) => (
              <strong className="font-semibold">{children}</strong>
            ),
            ol: ({ children }) => (
              <ol className="mb-4 list-decimal pl-6 text-text-secondary">{children}</ol>
            ),
            table: ({ children }) => (
              <div className="mb-6 overflow-x-auto rounded-lg border border-border">
                <table className="w-full border-collapse text-sm">{children}</table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="border-b border-border bg-surface-2">{children}</thead>
            ),
            th: ({ children }) => (
              <th className="border-r border-border px-4 py-2 text-left font-semibold text-text-primary last:border-r-0">{children}</th>
            ),
            td: ({ children }) => (
              <td className="border-b border-r border-border/50 px-4 py-2 text-text-secondary last:border-r-0">{children}</td>
            ),
              }}
            >
              {project.detailContent}
            </ReactMarkdown>
          </article>

          <div className="mt-12 flex flex-wrap gap-3">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="default">GitHub</Button>
              </a>
            )}
            {project.notionUrl && (
              <a href={project.notionUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="default">Notion</Button>
              </a>
            )}
          </div>
        </main>

        {/* 플로팅 목차 */}
        <TableOfContents content={project.detailContent} />
      </div>
    </div>
  );
}
