"use client";

import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";
import { useProject } from "@/hooks/useProjects";
import { Button, Badge, Skeleton } from "@/components/ui";

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
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

  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="mb-8 text-sm text-text-muted hover:text-text-primary transition-colors"
      >
        &larr; 돌아가기
      </button>

      {/* Header */}
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

      {/* Content */}
      <article className="prose-invert mt-12 max-w-none">
        <ReactMarkdown
          rehypePlugins={[rehypeHighlight, rehypeSanitize]}
          components={{
            h2: ({ children }) => (
              <h2 className="mt-10 mb-4 text-2xl font-bold text-text-primary">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="mt-8 mb-3 text-xl font-semibold text-text-primary">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="mb-4 leading-relaxed text-text-secondary">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="mb-4 list-disc pl-6 text-text-secondary">{children}</ul>
            ),
            li: ({ children }) => <li className="mb-1">{children}</li>,
            code: ({ className, children, ...props }) => {
              const isBlock = className?.includes("language-");
              return isBlock ? (
                <code className={`${className} block overflow-x-auto rounded-lg bg-surface-2 p-4 font-mono text-sm`} {...props}>
                  {children}
                </code>
              ) : (
                <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-sm text-lavender" {...props}>
                  {children}
                </code>
              );
            },
            pre: ({ children }) => <pre className="mb-4">{children}</pre>,
          }}
        >
          {project.detailContent}
        </ReactMarkdown>
      </article>

      {/* Links */}
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
  );
}
