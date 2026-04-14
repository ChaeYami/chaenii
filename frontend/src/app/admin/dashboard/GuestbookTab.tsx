"use client";

import { useState } from "react";
import { useGuestbooks, useAddReply, useDeleteReply, useHideGuestbook } from "@/hooks/useGuestbook";
import { Button, Input, Skeleton, useToast } from "@/components/ui";
import type { GuestbookEntry } from "@/types/guestbook";

function EntryRow({ entry }: { entry: GuestbookEntry }) {
  const [replyText, setReplyText] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const addReply = useAddReply();
  const deleteReply = useDeleteReply();
  const hide = useHideGuestbook();
  const { toast } = useToast();

  const handleAddReply = () => {
    if (!replyText.trim()) return;
    addReply.mutate(
      { id: entry.id, content: replyText },
      {
        onSuccess: () => { setReplyText(""); setShowReplyForm(false); toast("success", "답글이 등록되었습니다."); },
        onError: (err) => { toast("error", err instanceof Error ? err.message : "답글 등록에 실패했습니다."); },
      }
    );
  };

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{entry.nickname}</span>
            <span className="font-mono text-xs text-text-muted">
              {new Date(entry.createdAt).toLocaleDateString("ko-KR")}
            </span>
          </div>
          <p className="mt-1 text-sm text-text-secondary">{entry.content}</p>

          {entry.reply && (
            <div className="mt-2 flex items-center gap-2 rounded bg-surface-2 px-3 py-2">
              <p className="flex-1 text-sm text-lavender">{entry.reply}</p>
              <button
                onClick={() => deleteReply.mutate(entry.id, {
                  onSuccess: () => toast("success", "답글이 삭제되었습니다."),
                  onError: (err) => toast("error", err instanceof Error ? err.message : "답글 삭제에 실패했습니다."),
                })}
                disabled={deleteReply.isPending}
                className="shrink-0 text-xs text-text-muted hover:text-red-400 transition-colors"
              >
                답글 삭제
              </button>
            </div>
          )}
        </div>

        <div className="flex shrink-0 gap-2">
          {!entry.reply && (
            <Button
              variant="ghost"
              className="text-xs !px-2 !py-1"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              답글
            </Button>
          )}
          <Button
            variant="danger"
            className="text-xs !px-2 !py-1"
            onClick={() => hide.mutate(entry.id, {
              onSuccess: () => toast("success", "숨김 처리되었습니다."),
              onError: (err) => toast("error", err instanceof Error ? err.message : "숨김 처리에 실패했습니다."),
            })}
            disabled={hide.isPending}
          >
            숨김
          </Button>
        </div>
      </div>

      {showReplyForm && (
        <div className="mt-3 flex gap-2">
          <Input
            placeholder="답글을 입력하세요"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="!py-1.5 text-sm"
          />
          <Button
            variant="primary"
            onClick={handleAddReply}
            disabled={addReply.isPending}
            className="shrink-0 text-xs"
          >
            등록
          </Button>
        </div>
      )}
    </div>
  );
}

export default function GuestbookTab() {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGuestbooks();

  const entries = data?.pages.flatMap((p) => p.content) ?? [];

  return (
    <div className="space-y-4">
      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))
      ) : entries.length === 0 ? (
        <p className="py-12 text-center text-text-muted">방명록이 없습니다.</p>
      ) : (
        entries.map((entry) => <EntryRow key={entry.id} entry={entry} />)
      )}

      {hasNextPage && (
        <div className="flex justify-center pt-2">
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
  );
}
