"use client";

import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(markdown: string): Heading[] {
  return (markdown.match(/^#{2,3} .+/gm) ?? []).map((line) => {
    const level = line.match(/^#+/)?.[0].length ?? 2;
    const text = line.replace(/^#+\s/, "");
    const id = text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w가-힣-]/g, "");
    return { id, text, level };
  });
}

export default function TableOfContents({ content }: { content: string }) {
  const headings = extractHeadings(content);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden xl:block sticky top-24 w-8 shrink-0 self-start">
      <div className="group relative">
        {/* 기본 상태: 대시 라인들 */}
        <ul className="flex flex-col gap-2 py-1">
          {headings.map(({ id, level }) => (
            <li
              key={id}
              onClick={() =>
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
              }
              className="cursor-pointer"
            >
              <div
                className={`h-px rounded-full transition-all duration-150
                  ${level === 3 ? "ml-2 w-3" : "w-5"}
                  ${activeId === id ? "bg-purple" : "bg-border hover:bg-text-muted"}
                `}
              />
            </li>
          ))}
        </ul>

        {/* hover 시 펼쳐지는 패널 */}
        <div
          className="absolute right-0 top-0 w-52 rounded-lg border border-border bg-surface/95 backdrop-blur-sm p-3 shadow-xl
                     opacity-0 pointer-events-none
                     group-hover:opacity-100 group-hover:pointer-events-auto
                     transition-opacity duration-200"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
            목차
          </p>
          <ul className="space-y-1 border-l border-border">
            {headings.map(({ id, text, level }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`block truncate py-0.5 text-sm transition-colors duration-150
                    ${level === 3 ? "pl-6" : "pl-3"}
                    ${
                      activeId === id
                        ? "border-l-2 -ml-px border-purple text-purple"
                        : "text-text-muted hover:text-text-secondary"
                    }`}
                >
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
