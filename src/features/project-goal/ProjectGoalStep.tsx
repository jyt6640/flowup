import { Check, Flag, Target } from "lucide-react";
import { GOAL_FIELDS } from "../../data/mockData";
import type { AppState, ProjectGoal } from "../../types";
import { Badge, Button, Surface } from "../../components/ui";

type ProjectGoalStepProps = {
  readonly state: AppState;
  readonly confirmedProblem: string;
  readonly onChange: (field: keyof ProjectGoal, value: string) => void;
  readonly onSave: () => void;
  readonly onComplete: () => void;
};

export const ProjectGoalStep = ({ state, confirmedProblem, onChange, onSave, onComplete }: ProjectGoalStepProps) => {
  const canComplete = Boolean(state.goal.goal.trim() && state.goal.hypothesis.trim() && state.goal.metric.trim() && state.goal.outOfScope.trim());
  return (
    <div className="space-y-6">
      <div>
        <Badge className="bg-goal/30 text-ink">3단계 · 프로젝트 목표</Badge>
        <h1 className="mt-4 text-3xl font-normal tracking-tight text-ink sm:text-4xl">정한 문제를 어떤 변화로 이어갈까요?</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft">성공의 모습과 하지 않을 일을 함께 적으면, 다음 단계에서 기능을 고르기 쉬워집니다.</p>
      </div>

      <Surface tone="muted" className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-problem/20 text-problem">
            <Flag aria-hidden="true" className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">확정된 문제 정의</p>
            <p className="mt-2 break-words text-sm leading-7 text-ink">{confirmedProblem || "아직 확정된 문제 정의가 없습니다."}</p>
          </div>
        </div>
      </Surface>

      <Surface tone="elevated" className="p-5 sm:p-7">
        <div className="grid gap-5 md:grid-cols-2">
          {GOAL_FIELDS.map((field) => (
            <label key={field.key} className={field.key === "outOfScope" ? "md:col-span-2" : ""}>
              <span className="text-sm font-medium text-ink">{field.label}</span>
              <textarea
                className="mt-2 min-h-28 w-full resize-y rounded-app-sm border border-line bg-surface px-3.5 py-3 text-sm leading-6 text-ink outline-none placeholder:text-muted focus:border-goal focus:ring-2 focus:ring-goal/20"
                placeholder={field.placeholder}
                value={state.goal[field.key]}
                onChange={(event) => onChange(field.key, event.target.value)}
              />
            </label>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-5">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Target aria-hidden="true" className="h-4 w-4 text-goal" />
            {state.goal.savedAt ? "저장된 목표가 있습니다." : "아직 저장되지 않은 목표입니다."}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onSave}>목표 저장하기</Button>
            <Button icon={<Check aria-hidden="true" className="h-4 w-4" />} disabled={!canComplete} onClick={onComplete}>
              다음 단계로
            </Button>
          </div>
        </div>
      </Surface>
    </div>
  );
};
