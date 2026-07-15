import { Clock3, MessageSquare, NotebookPen, Radio, RotateCcw, Users } from "lucide-react";
import { formatRelativeTime } from "../lib/analytics";
import type { AppState, Project, StepId } from "../types";
import { Avatar, Badge, Button, Surface } from "./ui";

type TeamPanelProps = {
  readonly state: AppState;
  readonly project: Project;
  readonly activeStep: StepId;
  readonly interviewMode: boolean;
  readonly onObserverNoteChange: (note: string) => void;
  readonly onRequestFeedback: () => void;
  readonly onOpenResults: () => void;
};

const avatarTones = ["bg-problem", "bg-goal", "bg-mvp", "bg-roles"] as const;

export const TeamPanel = ({
  state,
  project,
  activeStep,
  interviewMode,
  onObserverNoteChange,
  onRequestFeedback,
  onOpenResults,
}: TeamPanelProps) => {
  const recentActivities = state.activities.slice(0, 4);
  return (
    <aside className="space-y-4 px-4 py-5 lg:px-5">
      <Surface tone="glass" className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">현재 접속 팀원</p>
            <p className="mt-1 text-sm text-ink-soft">{project.members.filter((member) => member.online).length}명이 함께 보고 있어요.</p>
          </div>
          <Users aria-hidden="true" className="h-4 w-4 text-muted" />
        </div>
        <div className="mt-4 space-y-3">
          {project.members.map((member, index) => (
            <div key={member.id} className="flex items-center gap-3">
              <Avatar name={member.nickname} size="sm" tone={avatarTones[index % avatarTones.length] ?? "bg-surface-soft"} online={member.online} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-ink">{member.nickname}</p>
                  <span className="text-[10px] text-muted">{member.currentStep === activeStep ? "여기" : `${member.currentStep}단계`}</span>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-muted">
                  {member.online ? (member.currentStep === activeStep ? "작성 중" : "참여 중") : "잠시 자리 비움"}
                </p>
              </div>
              {member.currentStep === activeStep && member.online && <Radio aria-hidden="true" className="h-3.5 w-3.5 animate-pulse text-success" />}
            </div>
          ))}
        </div>
      </Surface>

      <Surface className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">단계 완료 조건</p>
            <p className="mt-1 text-sm text-ink">현재 단계의 핵심 결과를 남겨주세요.</p>
          </div>
          <Clock3 aria-hidden="true" className="h-4 w-4 text-muted" />
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-app-sm bg-surface-soft px-3 py-2.5 text-xs text-ink-soft">
          <span className="h-2 w-2 rounded-full bg-success" />
          <span>{state.completedSteps.includes(activeStep) ? "완료된 단계입니다." : "완료되면 다음 단계로 넘어갈 수 있어요."}</span>
        </div>
      </Surface>

      {interviewMode && (
        <Surface tone="muted" className="p-4">
          <div className="flex items-center gap-2">
            <NotebookPen aria-hidden="true" className="h-4 w-4 text-info" />
            <p className="text-sm font-medium text-ink">인터뷰 모드</p>
          </div>
          <dl className="mt-4 space-y-3 text-xs">
            <div className="flex items-start justify-between gap-3">
              <dt className="text-muted">멈춘 단계</dt>
              <dd className="text-right font-medium text-ink">{project.currentStep}단계</dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="text-muted">주요 클릭 수</dt>
              <dd className="text-right font-medium text-ink">{state.analytics.filter((event) => event.type === "button_click").length}회</dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="text-muted">최근 클릭</dt>
              <dd className="max-w-[150px] text-right font-medium text-ink">
                {state.analytics.filter((event) => event.type === "button_click").at(-1)?.label ?? "아직 없음"}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="text-muted">최근 기록</dt>
              <dd className="text-right font-medium text-ink">{state.analytics.at(-1) ? formatRelativeTime(state.analytics.at(-1)?.createdAt ?? "") : "없음"}</dd>
            </div>
          </dl>
          <label className="mt-4 block">
            <span className="text-xs font-medium text-ink">관찰자 메모</span>
            <textarea
              className="mt-2 min-h-24 w-full resize-y rounded-app-sm border border-line bg-elevated px-3 py-2.5 text-xs leading-5 text-ink outline-none placeholder:text-muted focus:border-info focus:ring-2 focus:ring-info/15"
              placeholder="사용자가 멈춘 지점과 표정을 적어보세요."
              value={state.observerNote}
              onChange={(event) => onObserverNoteChange(event.target.value)}
            />
          </label>
        </Surface>
      )}

      <Surface className="p-4">
        <div className="flex items-center gap-2">
          <MessageSquare aria-hidden="true" className="h-4 w-4 text-muted" />
          <p className="text-sm font-medium text-ink">최근 활동</p>
        </div>
        <div className="mt-4 space-y-3">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-line" />
                <div className="min-w-0">
                  <p className="text-xs leading-5 text-ink-soft">{activity.message}</p>
                  <p className="mt-0.5 text-[10px] text-muted">{formatRelativeTime(activity.createdAt)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs leading-5 text-muted">아직 기록된 활동이 없습니다.</p>
          )}
        </div>
      </Surface>

      <div className="flex flex-col gap-2">
        <Button variant="secondary" icon={<NotebookPen aria-hidden="true" className="h-4 w-4" />} onClick={onRequestFeedback}>
          이 단계 피드백 남기기
        </Button>
        <Button variant="ghost" icon={<RotateCcw aria-hidden="true" className="h-4 w-4" />} onClick={onOpenResults}>
          인터뷰 결과 보기
        </Button>
      </div>
    </aside>
  );
};
