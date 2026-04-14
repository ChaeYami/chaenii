"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { AdminProject, ProjectFormData } from "@/types/admin-project";
import {
  useAdminProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useReorderProjects,
} from "@/hooks/useAdminProjects";
import { Button, Badge, Skeleton, useToast } from "@/components/ui";
import ProjectForm from "./ProjectForm";

function SortableRow({
  project,
  onEdit,
  onDelete,
}: {
  project: AdminProject;
  onEdit: (p: AdminProject) => void;
  onDelete: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="border-b border-border hover:bg-surface/50"
    >
      <td className="px-4 py-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab text-text-muted hover:text-text-secondary"
          aria-label="Drag to reorder"
        >
          ⠿
        </button>
      </td>
      <td className="px-4 py-3 text-sm font-medium">{project.name}</td>
      <td className="px-4 py-3">
        <Badge className="text-xs">
          {project.status === "building" ? "진행 중" : "완료"}
        </Badge>
      </td>
      <td className="px-4 py-3 font-mono text-xs text-text-muted">
        {project.category}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            className="text-xs !px-2 !py-1"
            onClick={() => onEdit(project)}
          >
            수정
          </Button>
          <Button
            variant="danger"
            className="text-xs !px-2 !py-1"
            onClick={() => onDelete(project.id)}
          >
            삭제
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default function ProjectsTab() {
  const { data: projects, isLoading } = useAdminProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const reorder = useReorderProjects();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminProject | null>(null);
  const [items, setItems] = useState<AdminProject[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const { toast } = useToast();

  // Sync items with fetched data
  const displayItems = items.length > 0 ? items : projects ?? [];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !projects) return;

    const oldIndex = displayItems.findIndex((p) => p.id === active.id);
    const newIndex = displayItems.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(displayItems, oldIndex, newIndex);
    setItems(reordered);
    reorder.mutate(reordered.map((p) => p.id), {
      onError: (err) => {
        toast("error", err instanceof Error ? err.message : "순서 변경에 실패했습니다.");
        setItems([]);
      },
    });
  };

  const handleCreate = (data: ProjectFormData) => {
    setFormError(null);
    createProject.mutate(data, {
      onSuccess: () => {
        setShowForm(false);
        setItems([]);
        toast("success", "프로젝트가 등록되었습니다.");
      },
      onError: (err) => {
        setFormError(err instanceof Error ? err.message : "저장에 실패했습니다.");
      },
    });
  };

  const handleUpdate = (data: ProjectFormData) => {
    if (!editing) return;
    setFormError(null);
    updateProject.mutate(
      { id: editing.id, data },
      {
        onSuccess: () => {
          setEditing(null);
          setItems([]);
          toast("success", "프로젝트가 수정되었습니다.");
        },
        onError: (err) => {
          setFormError(err instanceof Error ? err.message : "저장에 실패했습니다.");
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    deleteProject.mutate(id, {
      onSuccess: () => {
        setItems([]);
        toast("success", "프로젝트가 삭제되었습니다.");
      },
      onError: (err) => {
        toast("error", err instanceof Error ? err.message : "삭제에 실패했습니다.");
      },
    });
  };

  if (showForm || editing) {
    return (
      <ProjectForm
        initial={editing}
        onSubmit={editing ? handleUpdate : handleCreate}
        onCancel={() => {
          setShowForm(false);
          setEditing(null);
          setFormError(null);
        }}
        isPending={createProject.isPending || updateProject.isPending}
        error={formError}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="primary" onClick={() => setShowForm(true)}>
          + 새 프로젝트
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      ) : !displayItems.length ? (
        <p className="py-12 text-center text-text-muted">등록된 프로젝트가 없습니다.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-surface-2">
                  <th className="w-10 px-4 py-3" />
                  <th className="px-4 py-3 text-xs font-medium text-text-muted">제목</th>
                  <th className="px-4 py-3 text-xs font-medium text-text-muted">상태</th>
                  <th className="px-4 py-3 text-xs font-medium text-text-muted">카테고리</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-text-muted">
                    액션
                  </th>
                </tr>
              </thead>
              <SortableContext
                items={displayItems.map((p) => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <tbody>
                  {displayItems.map((project) => (
                    <SortableRow
                      key={project.id}
                      project={project}
                      onEdit={setEditing}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </SortableContext>
            </table>
          </DndContext>
        </div>
      )}
    </div>
  );
}
