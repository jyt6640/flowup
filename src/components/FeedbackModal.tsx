import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { STEP_DEFINITIONS } from "../data/mockData";
import type { StepId } from "../types";
import { Button } from "./ui";

type FeedbackModalProps = {
  readonly open: boolean;
  readonly stepId: StepId;
  readonly onClose: () => void;
  readonly onSave: (score: number, comment: string) => void;
};

export const FeedbackModal = ({ open, stepId, onClose, onSave }: FeedbackModalProps) => {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!open) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose, open]);

  if (!open) return null;
  const stepTitle = STEP_DEFINITIONS.find((step) => step.id === stepId)?.title ?? "현재 단계";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-4 backdrop-blur-sm" role="presentation" onMouseDown={onClose}>
      <div
        className="w-full max-w-md rounded-app-lg border border-white/80 bg-elevated p-6 shadow-dialog animate-fade-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">단계 피드백</p>
            <h2 id="feedback-title" className="mt-2 text-xl font-medium text-ink">
              {stepTitle}는 이해하기 쉬웠나요?
            </h2>
          </div>
          <button
            type="button"
            aria-label="피드백 모달 닫기"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-surface-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info/50"
            onClick={onClose}
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-7 flex items-center justify-between gap-2">
          {[1, 2, 3, 4, 5].map((item) => (
            <button
              key={item}
              type="button"
              aria-label={`${item}점`}
              aria-pressed={score === item}
              className={`flex h-12 w-12 items-center justify-center rounded-full border text-sm font-medium transition ${
                score === item ? "border-ink bg-ink text-white" : "border-line bg-surface text-ink-soft hover:border-ink/40"
              }`}
              onClick={() => setScore(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <label className="mt-7 block">
          <span className="text-sm font-medium text-ink">가장 헷갈렸던 부분이 있다면 알려주세요.</span>
          <textarea
            className="mt-2 min-h-28 w-full resize-y rounded-app-sm border border-line bg-surface px-3 py-2.5 text-sm leading-6 text-ink outline-none placeholder:text-muted focus:border-info focus:ring-2 focus:ring-info/15"
            placeholder="예: 의견 공개 전의 단계가 조금 길게 느껴졌어요."
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </label>
        <Button className="mt-5 w-full" disabled={score === 0} onClick={() => onSave(score, comment.trim())}>
          피드백 저장하기
        </Button>
      </div>
    </div>
  );
};
