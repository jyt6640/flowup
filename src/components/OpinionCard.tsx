import { Eye, EyeOff, MessageCircle, Send, ThumbsUp } from "lucide-react";
import { useState } from "react";
import type { Comment, Member, Opinion } from "../types";
import { Avatar, Button } from "./ui";

type OpinionCardProps = {
  readonly opinion: Opinion;
  readonly author: Member | undefined;
  readonly currentMemberId: string;
  readonly onVote: () => void;
  readonly onComment: (content: string) => void;
};

export const OpinionCard = ({ opinion, author, currentMemberId, onVote, onComment }: OpinionCardProps) => {
  const [comment, setComment] = useState("");
  const isOwn = opinion.authorId === currentMemberId;
  const visible = opinion.revealed || isOwn;

  const submitComment = () => {
    const nextComment = comment.trim();
    if (!nextComment) return;
    onComment(nextComment);
    setComment("");
  };

  return (
    <article className={`rounded-app-md border p-5 transition duration-300 ${visible ? "border-line bg-elevated shadow-sm" : "border-line-soft bg-surface-soft/80"}`}>
      <div className="flex items-start gap-3">
        <Avatar name={author?.nickname ?? "팀원"} size="md" tone={isOwn ? "bg-problem" : "bg-surface-soft"} online={author?.online ?? false} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-ink">{isOwn ? "나" : author?.nickname ?? "팀원"}</p>
            {isOwn && <span className="rounded-pill bg-problem/30 px-2 py-0.5 text-[10px] font-medium text-ink-soft">내 의견</span>}
            {!visible && <span className="rounded-pill bg-surface-soft px-2 py-0.5 text-[10px] text-muted">공개 대기</span>}
          </div>
          <p className="mt-1 text-[11px] text-muted">{opinion.submitted ? "제출 완료" : "작성 중"}</p>
        </div>
      </div>
      <div className="mt-5 min-h-28">
        {visible ? (
          <p className="whitespace-pre-wrap break-words text-sm leading-7 text-ink">{opinion.content}</p>
        ) : (
          <div className="flex h-28 flex-col items-center justify-center rounded-app-sm border border-dashed border-line bg-surface-soft/70 text-center">
            <EyeOff aria-hidden="true" className="h-5 w-5 text-muted" />
            <p className="mt-2 text-xs font-medium text-ink-soft">모두 제출하면 동시에 공개됩니다.</p>
            <p className="mt-1 text-[11px] text-muted">다른 팀원의 답변은 아직 보이지 않아요.</p>
          </div>
        )}
      </div>
      {visible && (
        <>
          <div className="mt-5 flex items-center gap-2 border-t border-line-soft pt-4">
            <Button
              variant="ghost"
              className="min-h-9 px-2.5 text-xs"
              aria-pressed={false}
              icon={<ThumbsUp aria-hidden="true" className="h-3.5 w-3.5" />}
              onClick={onVote}
            >
              공감 {opinion.votes}
            </Button>
            <span className="text-line">|</span>
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              <MessageCircle aria-hidden="true" className="h-3.5 w-3.5" />
              {opinion.comments.length}
            </span>
            {opinion.revealed && <Eye aria-hidden="true" className="ml-auto h-3.5 w-3.5 text-success" />}
          </div>
          {opinion.comments.length > 0 && (
            <div className="mt-4 space-y-2">
              {opinion.comments.map((item: Comment) => (
                <div key={item.id} className="rounded-app-sm bg-surface-soft px-3 py-2">
                  <p className="text-xs leading-5 text-ink-soft">{item.content}</p>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex items-center gap-2">
            <input
              aria-label="의견에 댓글 남기기"
              className="min-w-0 flex-1 rounded-pill border border-line bg-surface px-3 py-2 text-xs text-ink outline-none placeholder:text-muted focus:border-info focus:ring-2 focus:ring-info/15"
              placeholder="짧게 의견을 남겨보세요."
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") submitComment();
              }}
            />
            <button
              type="button"
              aria-label="댓글 보내기"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-white transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info/50"
              onClick={submitComment}
            >
              <Send aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          </div>
        </>
      )}
    </article>
  );
};
