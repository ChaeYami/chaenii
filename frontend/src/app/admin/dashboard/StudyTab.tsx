"use client";

import { useState } from "react";
import type { AdminStudy, StudyFormData } from "@/types/admin-project";
import {
  useAdminStudies,
  useCreateStudy,
  useUpdateStudy,
  useDeleteStudy,
} from "@/hooks/useAdminStudies";
import { Button, Skeleton, useToast } from "@/components/ui";
import StudyForm from "./StudyForm";

export default function StudyTab() {
  const { data: studies, isLoading } = useAdminStudies();
  const createStudy = useCreateStudy();
  const updateStudy = useUpdateStudy();
  const deleteStudy = useDeleteStudy();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminStudy | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCreate = (data: StudyFormData) => {
    setFormError(null);
    createStudy.mutate(data, {
      onSuccess: () => {
        setShowForm(false);
        toast("success", "Study가 등록되었습니다.");
      },
      onError: (err) => {
        setFormError(err instanceof Error ? err.message : "저장에 실패했습니다.");
      },
    });
  };

  const handleUpdate = (data: StudyFormData) => {
    if (!editing) return;
    setFormError(null);
    updateStudy.mutate(
      { id: editing.id, data },
      {
        onSuccess: () => {
          setEditing(null);
          toast("success", "Study가 수정되었습니다.");
        },
        onError: (err) => {
          setFormError(err instanceof Error ? err.message : "저장에 실패했습니다.");
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    deleteStudy.mutate(id, {
      onSuccess: () => toast("success", "Study가 삭제되었습니다."),
      onError: (err) => toast("error", err instanceof Error ? err.message : "삭제에 실패했습니다."),
    });
  };

  if (showForm || editing) {
    return (
      <StudyForm
        initial={editing}
        onSubmit={editing ? handleUpdate : handleCreate}
        onCancel={() => {
          setShowForm(false);
          setEditing(null);
          setFormError(null);
        }}
        isPending={createStudy.isPending || updateStudy.isPending}
        error={formError}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="primary" onClick={() => setShowForm(true)}>
          + 새 Study
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      ) : !studies?.length ? (
        <p className="py-12 text-center text-text-muted">등록된 Study가 없습니다.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-surface-2">
                <th className="px-4 py-3 text-xs font-medium text-text-muted">제목</th>
                <th className="px-4 py-3 text-xs font-medium text-text-muted">태그</th>
                <th className="px-4 py-3 text-xs font-medium text-text-muted">Notion</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-text-muted">액션</th>
              </tr>
            </thead>
            <tbody>
              {studies.map((study) => (
                <tr key={study.id} className="border-b border-border hover:bg-surface/50">
                  <td className="px-4 py-3 text-sm font-medium">{study.title}</td>
                  <td className="px-4 py-3 text-xs text-text-muted">{study.tags.join(", ") || "-"}</td>
                  <td className="px-4 py-3 text-xs text-text-muted">
                    {study.notionUrl ? (
                      <a href={study.notionUrl} target="_blank" rel="noopener noreferrer" className="text-purple hover:underline">링크</a>
                    ) : "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" className="text-xs !px-2 !py-1" onClick={() => setEditing(study)}>수정</Button>
                      <Button variant="danger" className="text-xs !px-2 !py-1" onClick={() => handleDelete(study.id)}>삭제</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
