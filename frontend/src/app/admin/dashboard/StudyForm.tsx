"use client";

import { useState, useEffect, useRef } from "react";
import type { AdminStudy, StudyFormData } from "@/types/admin-project";
import { Button, Input } from "@/components/ui";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API}/api/admin/images/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  const json = await res.json();
  return json.data.url;
}

const emptyForm: StudyFormData = {
  title: "",
  description: "",
  imageUrl: undefined,
  notionUrl: "",
  tags: [],
  period: "",
};

interface Props {
  initial?: AdminStudy | null;
  onSubmit: (data: StudyFormData) => void;
  onCancel: () => void;
  isPending: boolean;
  error?: string | null;
}

export default function StudyForm({ initial, onSubmit, onCancel, isPending, error }: Props) {
  const [form, setForm] = useState<StudyFormData>(emptyForm);
  const [tagsInput, setTagsInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title,
        description: initial.description ?? "",
        imageUrl: initial.imageUrl,
        notionUrl: initial.notionUrl ?? "",
        tags: initial.tags,
        period: initial.period ?? "",
      });
      setTagsInput(initial.tags.join(", "));
    }
  }, [initial]);

  const update = <K extends keyof StudyFormData>(key: K, value: StudyFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      update("imageUrl", url);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    onSubmit({ ...form, tags });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-surface p-6">
      <h3 className="text-lg font-semibold">
        {initial ? "Study 수정" : "새 Study"}
      </h3>

      {/* 이미지 */}
      <div>
        <label className="mb-1 block text-xs text-text-muted">이미지</label>
        <div className="flex items-center gap-3">
          {form.imageUrl && (
            <img src={form.imageUrl} alt="study" className="h-20 w-36 rounded-lg object-cover border border-border" />
          )}
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            disabled={uploading}
            className="text-sm text-text-muted hover:text-text-primary transition-colors disabled:opacity-50"
          >
            {uploading ? "업로드 중..." : form.imageUrl ? "🖼 이미지 변경" : "🖼 이미지 업로드"}
          </button>
          {form.imageUrl && (
            <button
              type="button"
              onClick={() => update("imageUrl", undefined)}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              삭제
            </button>
          )}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-text-muted">제목</label>
        <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Clean Architecture" required />
      </div>

      <div>
        <label className="mb-1 block text-xs text-text-muted">설명</label>
        <Input value={form.description ?? ""} onChange={(e) => update("description", e.target.value)} placeholder="한 줄 설명" />
      </div>

      <div>
        <label className="mb-1 block text-xs text-text-muted">Notion URL</label>
        <Input value={form.notionUrl ?? ""} onChange={(e) => update("notionUrl", e.target.value || undefined)} placeholder="https://notion.so/..." />
      </div>

      <div>
        <label className="mb-1 block text-xs text-text-muted">기간</label>
        <Input value={form.period ?? ""} onChange={(e) => update("period", e.target.value || undefined)} placeholder="2024.01 - 2024.06" />
      </div>

      <div>
        <label className="mb-1 block text-xs text-text-muted">태그 (콤마 구분)</label>
        <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="Spring Boot, Architecture" />
      </div>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">{error}</p>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>취소</Button>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? "저장 중..." : initial ? "수정" : "등록"}
        </Button>
      </div>
    </form>
  );
}
