import { Check, ChevronRight, Lock } from "lucide-react";
import { LOCKED_STEPS, STEP_DEFINITIONS } from "../data/mockData";
import type { StepId } from "../types";

type StepSidebarProps = {
  readonly activeStep: StepId;
  readonly completedSteps: readonly StepId[];
  readonly onSelectStep: (stepId: StepId) => void;
};

const stepTone: Record<StepId, string> = {
  1: "bg-idea",
  2: "bg-problem",
  3: "bg-goal",
  4: "bg-mvp",
  5: "bg-roles",
  6: "bg-issues",
};

export const StepSidebar = ({ activeStep, completedSteps, onSelectStep }: StepSidebarProps) => (
  <aside className="h-full px-4 py-5 lg:px-5">
    <div className="mb-6 px-2">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">프로젝트 진행</p>
      <p className="mt-2 text-sm leading-6 text-ink-soft">질문에 답하고, 합의한 내용을 다음 단계로 넘겨보세요.</p>
    </div>
    <ol className="space-y-1.5">
      {STEP_DEFINITIONS.map((step) => {
        const active = step.id === activeStep;
        const completed = completedSteps.includes(step.id);
        return (
          <li key={step.id}>
            <button
              type="button"
              aria-current={active ? "step" : undefined}
              className={`group flex w-full items-center gap-3 rounded-app-sm px-3 py-3 text-left transition duration-200 ${
                active ? "bg-elevated text-ink shadow-sm" : "text-ink-soft hover:bg-elevated/70 hover:text-ink"
              }`}
              onClick={() => onSelectStep(step.id)}
            >
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium ${active ? stepTone[step.id] : "bg-surface-soft"}`}>
                {completed ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : step.id}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{step.title}</span>
                <span className="mt-0.5 block truncate text-[11px] text-muted">{completed ? "완료됨" : active ? "진행 중" : "다음 단계"}</span>
              </span>
              <ChevronRight aria-hidden="true" className={`h-4 w-4 shrink-0 transition ${active ? "text-ink" : "text-muted group-hover:text-ink-soft"}`} />
            </button>
          </li>
        );
      })}
    </ol>
    <div className="mt-8 border-t border-line-soft pt-5">
      <div className="mb-3 flex items-center justify-between px-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">곧 만나요</p>
        <Lock aria-hidden="true" className="h-3.5 w-3.5 text-muted" />
      </div>
      <div className="space-y-1">
        {LOCKED_STEPS.slice(0, 6).map((label) => (
          <div key={label} className="flex items-center gap-3 rounded-app-sm px-3 py-2 text-xs text-muted/80">
            <span className="h-2 w-2 rounded-full bg-line" />
            <span className="truncate">{label}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 px-2 text-[11px] leading-5 text-muted">이번 프로토타입에서는 핵심 6단계에 집중합니다.</p>
    </div>
  </aside>
);
