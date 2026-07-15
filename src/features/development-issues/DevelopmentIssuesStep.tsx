import { ArrowRight, Check, Circle, ListTodo, Plus } from "lucide-react";
import type { AppState, IssueStatus, Project } from "../../types";
import { ISSUE_STATUSES } from "../../types";
import { Badge, Button, EmptyState, Surface } from "../../components/ui";

type DevelopmentIssuesStepProps = {
  readonly state: AppState;
  readonly project: Project;
  readonly onCreateIssues: () => void;
  readonly onStatusChange: (issueId: string, status: IssueStatus) => void;
  readonly onComplete: () => void;
};

const statusLabels: Record<IssueStatus, string> = {
  TODO: "할 일",
  IN_PROGRESS: "진행 중",
  DONE: "완료",
};

const statusTone: Record<IssueStatus, string> = {
  TODO: "bg-surface-soft text-ink-soft",
  IN_PROGRESS: "bg-info/10 text-info",
  DONE: "bg-success/12 text-success",
};

export const DevelopmentIssuesStep = ({ state, project, onCreateIssues, onStatusChange, onComplete }: DevelopmentIssuesStepProps) => {
  const includedFeatures = state.features.filter((feature) => feature.includedInMvp);
  const doneCount = state.issues.filter((issue) => issue.status === "DONE").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge className="bg-issues/35 text-ink">6단계 · 개발 이슈</Badge>
          <h1 className="mt-4 text-3xl font-normal tracking-tight text-ink sm:text-4xl">이제 바로 움직일 작업으로 바꿔볼게요.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft">선정된 MVP 기능을 완료 조건과 테스트 조건이 있는 개발 이슈로 변환합니다.</p>
        </div>
        <div className="rounded-app-md bg-issues/25 px-4 py-3 text-right">
          <p className="text-[11px] text-ink-soft">완료된 이슈</p>
          <p className="mt-1 text-2xl font-medium text-ink">{doneCount}/{state.issues.length}</p>
        </div>
      </div>

      {state.issues.length === 0 ? (
        <Surface tone="elevated" className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-issues/30 text-ink">
                <ListTodo aria-hidden="true" className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base font-medium text-ink">선정된 기능에서 이슈를 만들어보세요.</p>
                <p className="mt-1 text-sm leading-6 text-ink-soft">현재 {includedFeatures.length}개의 MVP 기능이 준비되어 있습니다.</p>
              </div>
            </div>
            <Button icon={<Plus aria-hidden="true" className="h-4 w-4" />} disabled={includedFeatures.length === 0} onClick={onCreateIssues}>
              선정된 기능으로 이슈 만들기
            </Button>
          </div>
        </Surface>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {ISSUE_STATUSES.map((status) => {
              const issues = state.issues.filter((issue) => issue.status === status);
              return (
                <div key={status} className="min-h-56 rounded-app-md border border-line-soft bg-surface-soft/60 p-3">
                  <div className="flex items-center justify-between px-2 py-1">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${status === "DONE" ? "bg-success" : status === "IN_PROGRESS" ? "bg-info" : "bg-line"}`} />
                      <p className="text-sm font-medium text-ink">{statusLabels[status]}</p>
                    </div>
                    <span className="text-xs text-muted">{issues.length}</span>
                  </div>
                  <div className="mt-3 space-y-3">
                    {issues.map((issue) => {
                      const nextStatus = status === "TODO" ? "IN_PROGRESS" : status === "IN_PROGRESS" ? "DONE" : "TODO";
                      return (
                        <button
                          key={issue.id}
                          type="button"
                          className="w-full rounded-app-sm border border-line bg-elevated p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info/50"
                          onClick={() => onStatusChange(issue.id, nextStatus)}
                          title={`클릭하면 ${statusLabels[nextStatus]} 상태로 변경`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="break-words text-sm font-medium text-ink">{issue.title}</p>
                            <Circle aria-hidden="true" className={`mt-0.5 h-4 w-4 shrink-0 ${status === "DONE" ? "fill-success text-success" : "text-line"}`} />
                          </div>
                          <p className="mt-2 break-words text-xs leading-5 text-ink-soft">{issue.description}</p>
                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <Badge className={statusTone[status]}>{statusLabels[status]}</Badge>
                            <Badge>{issue.priority}</Badge>
                          </div>
                          <div className="mt-4 flex items-center justify-between border-t border-line-soft pt-3 text-[11px] text-muted">
                            <span>{project.members.find((member) => member.id === issue.assigneeId)?.nickname ?? "담당자 미정"}</span>
                            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                          </div>
                        </button>
                      );
                    })}
                    {issues.length === 0 && <p className="px-2 py-8 text-center text-xs text-muted">이 상태의 이슈가 없습니다.</p>}
                  </div>
                </div>
              );
            })}
          </div>
          <Surface className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-ink">이슈 상태는 카드를 클릭해 바꿀 수 있어요.</p>
                <p className="mt-1 text-xs leading-5 text-ink-soft">이번 프로토타입은 실행 흐름 검증에 필요한 세 가지 상태만 제공합니다.</p>
              </div>
              <Button variant="secondary" icon={<Plus aria-hidden="true" className="h-4 w-4" />} onClick={onCreateIssues}>
                새 이슈 다시 만들기
              </Button>
            </div>
          </Surface>
        </>
      )}

      {state.issues.length > 0 && (
        <div className="flex justify-end">
          <Button icon={<Check aria-hidden="true" className="h-4 w-4" />} onClick={onComplete}>개발 준비 완료하기</Button>
        </div>
      )}
      {state.issues.length === 0 && (
        <EmptyState title="기능 목록이 이슈로 변환되면 여기에 나타납니다." description="MVP 기능을 실행 가능한 작업으로 바꾸면서 완료 조건을 확인해보세요." />
      )}
    </div>
  );
};
