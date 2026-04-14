"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useScrollAnimation, fadeUp, transition } from "@/hooks/useScrollAnimation";
import { useGuestbooks, useCreateGuestbook, useDeleteGuestbook } from "@/hooks/useGuestbook";
import { guestbookSchema, type GuestbookFormData } from "@/lib/schema/guestbook";
import { Button, Card, Input, Skeleton, useToast } from "@/components/ui";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

function GuestbookForm() {
  const [form, setForm] = useState<GuestbookFormData>({
    nickname: "",
    content: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const create = useCreateGuestbook();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = guestbookSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    create.mutate(result.data, {
      onSuccess: () => {
        setForm({ nickname: "", content: "", password: "" });
        toast("success", "방명록이 등록되었습니다.");
      },
      onError: (err) => {
        toast("error", err instanceof Error ? err.message : "방명록 등록에 실패했습니다.");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            placeholder="이름"
            value={form.nickname}
            onChange={(e) => setForm({ ...form, nickname: e.target.value })}
          />
          {errors.nickname && (
            <p className="mt-1 text-xs text-red-400">{errors.nickname}</p>
          )}
        </div>
        <div className="w-40">
          <Input
            type="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-400">{errors.password}</p>
          )}
        </div>
      </div>
      <div>
        <Input
          placeholder="메시지를 남겨주세요"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        {errors.content && (
          <p className="mt-1 text-xs text-red-400">{errors.content}</p>
        )}
      </div>
      <div className="flex justify-end">
        <Button type="submit" variant="primary" disabled={create.isPending}>
          {create.isPending ? "등록 중..." : "등록"}
        </Button>
      </div>
    </form>
  );
}

function GuestbookCard({
  entry,
}: {
  entry: { id: number; nickname: string; content: string; reply: string | null; createdAt: string };
}) {
  const [showDelete, setShowDelete] = useState(false);
  const [password, setPassword] = useState("");
  const deleteMutation = useDeleteGuestbook();
  const { toast } = useToast();

  const handleDelete = () => {
    deleteMutation.mutate(
      { id: entry.id, password },
      {
        onSuccess: () => {
          setShowDelete(false);
          toast("success", "방명록이 삭제되었습니다.");
        },
        onError: (err) => {
          toast("error", err instanceof Error ? err.message : "삭제에 실패했습니다.");
        },
      }
    );
  };

  return (
    <Card className="!p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{entry.nickname}</span>
            <span className="font-mono text-xs text-text-muted">
              {new Date(entry.createdAt).toLocaleDateString("ko-KR")}
            </span>
          </div>
          <p className="mt-1 text-sm text-text-secondary">{entry.content}</p>
          {entry.reply && (
            <div className="mt-2 rounded-lg bg-surface-2 px-3 py-2">
              <p className="text-xs text-text-muted">관리자 답글</p>
              <p className="mt-0.5 text-sm text-lavender">{entry.reply}</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowDelete(!showDelete)}
          className="shrink-0 text-xs text-text-muted hover:text-red-400 transition-colors"
        >
          삭제
        </button>
      </div>
      {showDelete && (
        <div className="mt-3 flex items-center gap-2">
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="!py-1.5 text-xs"
          />
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="shrink-0 text-xs !px-3 !py-1.5"
          >
            확인
          </Button>
        </div>
      )}
    </Card>
  );
}

export default function GuestbookSection() {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGuestbooks();
  const { ref, isInView } = useScrollAnimation();

  const entries = data?.pages.flatMap((p) => p.content) ?? [];

  return (
    <section id="guestbook" className="py-24">
      <motion.div
        ref={ref}
        className="mx-auto max-w-3xl border-t border-border px-6 pt-24"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={container}
      >
        <motion.h2
          className="text-3xl font-bold tracking-tight"
          variants={fadeUp}
          transition={transition}
        >
          Guestbook
        </motion.h2>

        <motion.p
          className="mt-2 text-text-secondary"
          variants={fadeUp}
          transition={transition}
        >
          한마디 남겨주세요!
        </motion.p>

        <motion.div className="mt-8" variants={fadeUp} transition={transition}>
          <GuestbookForm />
        </motion.div>

        <div className="mt-10 space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))
          ) : entries.length === 0 ? (
            <motion.div
              className="py-16 text-center"
              variants={fadeUp}
              transition={transition}
            >
              <p className="text-3xl">📝</p>
              <p className="mt-2 text-text-muted">
                아직 방명록이 없습니다. 첫 번째로 작성해보세요!
              </p>
            </motion.div>
          ) : (
            entries.map((entry, i) => (
              <motion.div
                key={entry.id}
                variants={fadeUp}
                transition={{ ...transition, delay: i * 0.04 }}
              >
                <GuestbookCard entry={entry} />
              </motion.div>
            ))
          )}

          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button
                variant="ghost"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "불러오는 중..." : "더 보기"}
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
