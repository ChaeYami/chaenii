"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { AdminProject, ProjectFormData } from "@/types/admin-project";
import { Button, Input } from "@/components/ui";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const CATEGORIES = ["모바일앱", "백엔드", "팀"];

const emptyForm: ProjectFormData = {
  slug: "",
  name: "",
  description: "",
  period: "",
  role: "",
  skills: [],
  category: "",
  githubUrl: "",
  notionUrl: "",
  status: "completed",
  progress: undefined,
  detailContent: "",
};

interface Props {
  initial?: AdminProject | null;
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
  isPending: boolean;
}

export default function ProjectForm({ initial, onSubmit, onCancel, isPending }: Props) {
  const [form, setForm] = useState<ProjectFormData>(emptyForm);
  const [skillsInput, setSkillsInput] = useState("");

  useEffect(() => {
    if (initial) {
      setForm({
        slug: initial.slug,
        name: initial.name,
        description: initial.description,
        period: initial.period,
        role: initial.role,
        skills: initial.skills,
        category: initial.category,
        githubUrl: initial.githubUrl ?? "",
        notionUrl: initial.notionUrl ?? "",
        status: initial.status,
        progress: initial.progress,
        detailContent: initial.detailContent,
      });
      setSkillsInput(initial.skills.join(", "));
    }
  }, [initial]);

  const update = <K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    onSubmit({ ...form, skills });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-surface p-6">
      <h3 className="text-lg font-semibold">
        {initial ? "프로젝트 수정" : "새 프로젝트"}
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-text-muted">Slug</label>
          <Input value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="my-project" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-muted">제목</label>
          <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="프로젝트명" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-muted">기간</label>
          <Input value={form.period} onChange={(e) => update("period", e.target.value)} placeholder="2024.01 - 2024.06" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-muted">역할</label>
          <Input value={form.role} onChange={(e) => update("role", e.target.value)} placeholder="1인 개발" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-text-muted">설명</label>
        <Input value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="한 줄 설명" />
      </div>

      <div>
        <label className="mb-1 block text-xs text-text-muted">기술 (콤마 구분)</label>
        <Input value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} placeholder="Spring Boot, React Native, PostgreSQL" />
      </div>

      <div>
        <label className="mb-1 block text-xs text-text-muted">카테고리</label>
        <div className="flex gap-3">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-1.5 text-sm text-text-secondary">
              <input
                type="radio"
                name="category"
                checked={form.category === cat}
                onChange={() => update("category", cat)}
                className="accent-purple"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-text-muted">GitHub URL</label>
          <Input value={form.githubUrl ?? ""} onChange={(e) => update("githubUrl", e.target.value || undefined)} placeholder="https://github.com/..." />
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-muted">Notion URL</label>
          <Input value={form.notionUrl ?? ""} onChange={(e) => update("notionUrl", e.target.value || undefined)} placeholder="https://notion.so/..." />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-text-muted">상태</label>
          <select
            value={form.status}
            onChange={(e) => update("status", e.target.value as "completed" | "building")}
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary focus:border-purple focus:outline-none"
          >
            <option value="completed">완료</option>
            <option value="building">진행 중</option>
          </select>
        </div>
        {form.status === "building" && (
          <div>
            <label className="mb-1 block text-xs text-text-muted">진행률 (%)</label>
            <Input
              type="number"
              min={0}
              max={100}
              value={form.progress ?? ""}
              onChange={(e) => update("progress", e.target.value ? Number(e.target.value) : undefined)}
              placeholder="0-100"
            />
          </div>
        )}
      </div>

      <div data-color-mode="dark">
        <label className="mb-1 block text-xs text-text-muted">상세 내용 (Markdown)</label>
        <MDEditor
          value={form.detailContent}
          onChange={(val) => update("detailContent", val ?? "")}
          height={400}
          preview="live"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? "저장 중..." : initial ? "수정" : "등록"}
        </Button>
      </div>
    </form>
  );
}
