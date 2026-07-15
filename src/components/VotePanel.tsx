import { BarChart3, Check, Trophy } from "lucide-react";
import type { Opinion } from "../types";
import { Button, Surface } from "./ui";

type VotePanelProps = {
  readonly opinions: readonly Opinion[];
  readonly selectedOpinionId: string | undefined;
  readonly reason: string;
  readonly onSelect: (opinionId: string) => void;
  readonly onReasonChange: (reason: string) => void;
  readonly onFinalize: () => void;
};

export const VotePanel = ({
  opinions,
  selectedOpinionId,
  reason,
  onSelect,
  onReasonChange,
  onFinalize,
}: VotePanelProps) => {
  const maxVotes = Math.max(1, ...opinions.map((opinion) => opinion.votes));
  return (
    <Surface tone="muted" className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 aria-hidden="true" className="h-4 w-4 text-problem" />
            <p className="text-sm font-medium text-ink">의견 비교와 투표</p>
          </div>
          <p className="mt-1 text-xs leading-5 text-ink-soft">가장 설득력 있다고 느낀 의견을 선택하고, 이유를 남겨주세요.</p>
        </div>
        <Trophy aria-hidden="true" className="h-5 w-5 text-problem" />
      </div>
      <div className="mt-5 space-y-3">
        {opinions.map((opinion) => {
          const selected = selectedOpinionId === opinion.id;
          const width = `${Math.max(12, Math.round((opinion.votes / maxVotes) * 100))}%`;
          return (
            <button
              key={opinion.id}
              type="button"
              className={`w-full rounded-app-sm border p-3 text-left transition ${selected ? "border-problem bg-problem/10" : "border-line-soft bg-elevated hover:border-problem/50"}`}
              aria-pressed={selected}
              onClick={() => onSelect(opinion.id)}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate text-xs font-medium text-ink">{opinion.content}</span>
                <span className="shrink-0 text-[11px] font-medium text-ink-soft">{opinion.votes}표</span>
              </div>
              <div className="mt-2 h-1.5 rounded-pill bg-surface-soft">
                <div className="h-full rounded-pill bg-problem transition-all duration-300" style={{ width }} />
              </div>
            </button>
          );
        })}
      </div>
      <label className="mt-5 block">
        <span className="text-xs font-medium text-ink">선택 이유</span>
        <textarea
          className="mt-2 min-h-24 w-full resize-y rounded-app-sm border border-line bg-elevated px-3 py-2.5 text-sm leading-6 text-ink outline-none placeholder:text-muted focus:border-problem focus:ring-2 focus:ring-problem/20"
          placeholder="왜 이 의견이 지금 우리 팀에 가장 중요한가요?"
          value={reason}
          onChange={(event) => onReasonChange(event.target.value)}
        />
      </label>
      <Button className="mt-4 w-full" icon={<Check aria-hidden="true" className="h-4 w-4" />} disabled={!selectedOpinionId || !reason.trim()} onClick={onFinalize}>
        최종 문제 정의로 확정하기
      </Button>
    </Surface>
  );
};
